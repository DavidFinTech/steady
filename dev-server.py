#!/usr/bin/env python3
"""Local test server for Steady. Never deploy this.

The real sign-in and community API are provided by the site's host and are not in
this repo. This file imitates them with fake data held in memory, so the whole
sign-in and community flow can be tried on your own computer:

    python3 dev-server.py
    then open http://localhost:4173
"""
import json, re, time, uuid
from http.cookies import SimpleCookie
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse, quote

PORT = 4173
NOW = int(time.time() * 1000)
profiles = {"maya_rides": {"handle": "maya_rides", "bio": "Sample profile for testing.", "avatar": "🌻", "created": NOW}}
owners = {}  # session id -> handle
posts = [
    {"id": "sample-1", "title": "Sample: how much do you set aside for taxes each week?", "body": "This is fake local test data.", "topic": "taxes", "created": NOW - 86400000, "handle": "maya_rides", "votes": {}},
    {"id": "sample-2", "title": "Sample: finding a clinic without insurance", "body": "This is fake local test data.", "topic": "health", "created": NOW - 3600000, "handle": "maya_rides", "votes": {}},
]
comments = []


def safe_return(value):
    return value if re.match(r"^/(?![/\\])", value or "") else "/community.html"


class Handler(SimpleHTTPRequestHandler):
    def session(self):
        cookie = SimpleCookie(self.headers.get("Cookie", ""))
        return cookie["steady_dev"].value if "steady_dev" in cookie else None

    def send_json(self, body, status=200):
        raw = json.dumps(body).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    def redirect(self, location, cookie=None):
        self.send_response(302)
        self.send_header("Location", location)
        if cookie:
            self.send_header("Set-Cookie", cookie)
        self.end_headers()

    def view(self, post, me):
        return {k: v for k, v in post.items() if k != "votes"} | {
            "avatar": profiles[post["handle"]]["avatar"],
            "mine": int(bool(me) and me == post["handle"]),
            "score": sum(post["votes"].values()),
            "myVote": post["votes"].get(me, 0),
            "comments": sum(c["post"] == post["id"] for c in comments),
        }

    def do_GET(self):
        url = urlparse(self.path)
        q = {k: v[0] for k, v in parse_qs(url.query).items()}
        if url.path == "/signin-with-chatgpt":
            target = quote(safe_return(q.get("return_to")), safe="")
            page = f'<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><body style="font:18px system-ui;text-align:center;padding:15vh 20px"><h1>Local test sign-in</h1><p>This is not a real login. No account or password is used.</p><p><a id="dev-login" href="/dev-login?return_to={target}">Continue as a test user</a></p>'.encode()
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(page)
            return
        if url.path == "/dev-login":
            return self.redirect(safe_return(q.get("return_to")), f"steady_dev={uuid.uuid4().hex}; Path=/; HttpOnly; SameSite=Lax")
        if url.path == "/signout-with-chatgpt":
            return self.redirect(safe_return(q.get("return_to")), "steady_dev=; Path=/; Max-Age=0")
        if url.path == "/api/community":
            session = self.session()
            me = owners.get(session)
            found = list(posts)
            if q.get("topic"):
                found = [p for p in found if p["topic"] == q["topic"]]
            if q.get("post"):
                found = [p for p in found if p["id"] == q["post"]]
            if q.get("profile"):
                found = [p for p in found if p["handle"] == q["profile"]]
            key = (lambda p: sum(p["votes"].values())) if q.get("sort") == "top" else (lambda p: p["created"])
            found.sort(key=key, reverse=True)
            shown = [c for c in comments if c["post"] == q.get("post")]
            return self.send_json({
                "signedIn": bool(session), "me": profiles.get(me), "posts": [self.view(p, me) for p in found],
                "comments": [{**c, "avatar": profiles[c["handle"]]["avatar"], "mine": int(c["handle"] == me)} for c in shown],
                "profile": profiles.get(q.get("profile")),
            })
        super().do_GET()

    def do_POST(self):
        if urlparse(self.path).path != "/api/community":
            return self.send_error(404)
        session = self.session()
        if not session:
            return self.send_json({"error": "signin"}, 401)
        body = json.loads(self.rfile.read(int(self.headers.get("Content-Length", 0))) or "{}")
        action, me = body.get("action"), owners.get(session)
        if action == "profile":
            name = str(body.get("handle", "")).lower()
            if not re.fullmatch(r"[a-z0-9_]{3,24}", name):
                return self.send_json({"error": "handle"}, 400)
            if name in profiles and name != me:
                return self.send_json({"error": "taken"}, 409)
            if me and me != name:
                return self.send_json({"error": "invalid"}, 400)
            created = profiles.get(name, {}).get("created", int(time.time() * 1000))
            profiles[name] = {"handle": name, "bio": body.get("bio", ""), "avatar": body.get("avatar", "✳"), "created": created}
            owners[session] = name
            return self.send_json({"ok": True})
        if not me:
            return self.send_json({"error": "profile"}, 403)
        target = next((p for p in posts if p["id"] == body.get("id")), None)
        if action == "post":
            new = {"id": uuid.uuid4().hex, "title": body["title"], "body": body["body"], "topic": body["topic"], "created": int(time.time() * 1000), "handle": me, "votes": {}}
            posts.append(new)
            return self.send_json({"id": new["id"]})
        if action == "vote" and target:
            target["votes"][me] = int(body["value"])
        elif action == "comment" and target:
            comments.append({"id": uuid.uuid4().hex, "post": target["id"], "body": body["body"], "created": int(time.time() * 1000), "handle": me})
        elif action == "edit" and target and target["handle"] == me:
            target.update(title=body["title"], body=body["body"])
        elif action == "delete" and target and target["handle"] == me:
            posts.remove(target)
        elif action in ("editComment", "deleteComment"):
            comment = next((c for c in comments if c["id"] == body.get("id") and c["handle"] == me), None)
            if not comment:
                return self.send_json({"error": "forbidden"}, 403)
            if action == "editComment":
                comment["body"] = body["body"]
            else:
                comments.remove(comment)
        elif action != "report":
            return self.send_json({"error": "forbidden"}, 403)
        return self.send_json({"ok": True})


if __name__ == "__main__":
    print(f"Steady test server: http://localhost:{PORT} (fake data, not a real login)")
    ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
