#!/usr/bin/env python3
"""Local test server for Steady. Never deploy this.

Imitates email sign-in and the Community database with fake data held in memory,
so the whole flow can be tried on your own computer without any accounts:

    python3 dev-server.py
    then open http://localhost:4173

Sign in with any email and the code 123456. No email is sent.
Use mod@example.com to test the moderator tools.
"""
import json, re, time, uuid
from http.cookies import SimpleCookie
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

PORT = 4173
NOW = int(time.time() * 1000)
profiles = {"maya_rides": {"handle": "maya_rides", "bio": "Sample profile for testing.", "avatar": "🌻", "created": NOW}}
owners = {}  # session id -> handle
emails = {}  # session id -> email
moderator_handles = set()
reports = []
posts = [
    {"id": "sample-1", "title": "Sample: how much do you set aside for taxes each week?", "body": "This is fake local test data.", "topic": "taxes", "created": NOW - 86400000, "handle": "maya_rides", "votes": {}},
    {"id": "sample-2", "title": "Sample: finding a clinic without insurance", "body": "This is fake local test data.", "topic": "health", "created": NOW - 3600000, "handle": "maya_rides", "votes": {}},
]
comments = []


class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

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

    def view(self, post, me):
        return {k: v for k, v in post.items() if k != "votes"} | {
            "avatar": profiles[post["handle"]]["avatar"],
            "mine": int(bool(me) and me == post["handle"]),
            "score": sum(post["votes"].values()),
            "myVote": post["votes"].get(me, 0),
            "comments": sum(c["post"] == post["id"] for c in comments),
        }

    def is_mod(self):
        return emails.get(self.session()) == "mod@example.com"

    def do_GET(self):
        url = urlparse(self.path)
        q = {k: v[0] for k, v in parse_qs(url.query).items()}
        if url.path == "/steady-config.js":
            raw = b"window.STEADY_CONFIG = { dev: true };"
            self.send_response(200)
            self.send_header("Content-Type", "text/javascript")
            self.end_headers()
            self.wfile.write(raw)
            return
        if url.path == "/api/dev/queue":
            if not self.is_mod():
                return self.send_json({"error": "forbidden"}, 403)
            shown = [r for r in reports if not r["resolved"]]
            by_id = {p["id"]: p for p in posts}
            return self.send_json([{"id": r["id"], "reason": r["reason"], "postId": r["post"], "title": by_id[r["post"]]["title"], "hidden": by_id[r["post"]].get("hidden", False), "created": r["created"]} for r in shown if r["post"] in by_id])
        if url.path == "/api/community":
            session = self.session()
            me = owners.get(session)
            mod = self.is_mod()
            found = [p for p in posts if not p.get("hidden") or p["handle"] == me or mod]
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
                "signedIn": bool(session and session in emails), "isModerator": mod, "me": profiles.get(me), "posts": [self.view(p, me) for p in found],
                "comments": [{**c, "avatar": profiles[c["handle"]]["avatar"], "mine": int(c["handle"] == me)} for c in shown],
                "profile": profiles.get(q.get("profile")),
            })
        super().do_GET()

    def do_POST(self):
        path = urlparse(self.path).path
        body = json.loads(self.rfile.read(int(self.headers.get("Content-Length", 0))) or "{}")
        session = self.session()
        if path == "/api/dev/send":
            if body.get("email", "").startswith("fail"):
                return self.send_json({"error": "sendfail"}, 500)
            return self.send_json({"ok": True})
        if path == "/api/dev/verify":
            if body.get("code") != "123456":
                return self.send_json({"error": "badcode"}, 400)
            new = uuid.uuid4().hex
            emails[new] = body.get("email", "")
            for old, address in list(emails.items()):
                if address == emails[new] and old != new and old in owners:
                    owners[new] = owners[old]
            self.send_response(200)
            self.send_header("Set-Cookie", f"steady_dev={new}; Path=/; HttpOnly; SameSite=Lax")
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(b"{}")
            return
        if path == "/api/dev/signout":
            self.send_response(200)
            self.send_header("Set-Cookie", "steady_dev=; Path=/; Max-Age=0")
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(b"{}")
            return
        if path == "/api/dev/delete":
            me = owners.pop(session, None)
            emails.pop(session, None)
            if me:
                profiles.pop(me, None)
                posts[:] = [p for p in posts if p["handle"] != me]
                comments[:] = [c for c in comments if c["handle"] != me]
            self.send_response(200)
            self.send_header("Set-Cookie", "steady_dev=; Path=/; Max-Age=0")
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(b"{}")
            return
        if path in ("/api/dev/moderate", "/api/dev/resolve"):
            if not self.is_mod():
                return self.send_json({"error": "forbidden"}, 403)
            if path.endswith("moderate"):
                for p in posts:
                    if p["id"] == body["post"]:
                        p["hidden"] = bool(body["hidden"])
            else:
                for r in reports:
                    if r["id"] == body["report"]:
                        r["resolved"] = True
            return self.send_json({"ok": True})
        if path != "/api/community":
            return self.send_error(404)
        if not session or session not in emails:
            return self.send_json({"error": "signin"}, 401)
        action, me = body.get("action"), owners.get(session)
        if action == "profile":
            if body.get("isNew"):
                name = str(body.get("handle", "")).lower()
                if not re.fullmatch(r"[a-z0-9_]{3,24}", name):
                    return self.send_json({"error": "handle"}, 400)
                if name in profiles:
                    return self.send_json({"error": "taken"}, 409)
                profiles[name] = {"handle": name, "bio": body.get("bio", ""), "avatar": body.get("avatar", "✳"), "created": int(time.time() * 1000)}
                owners[session] = name
            elif me:
                profiles[me].update(bio=body.get("bio", ""), avatar=body.get("avatar", "✳"))
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
        elif action == "report" and target:
            if not any(r["post"] == target["id"] and r["by"] == me for r in reports):
                reports.append({"id": uuid.uuid4().hex, "post": target["id"], "by": me, "reason": body.get("reason", ""), "resolved": False, "created": int(time.time() * 1000)})
        else:
            return self.send_json({"error": "forbidden"}, 403)
        return self.send_json({"ok": True})


if __name__ == "__main__":
    print(f"Steady test server: http://localhost:{PORT} (fake data; sign in with any email and code 123456)")
    ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
