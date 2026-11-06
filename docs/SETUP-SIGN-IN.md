# Setting up free email sign-in

This connects Steady to free accounts. **Never add a payment card or upgrade a plan.**
If a screen asks for a card, stop. Button names may differ slightly from these steps.

## 1. Create the database (Supabase)
1. Create a free account at supabase.com, ideally with a shared team email.
2. Create a new project on the Free plan. Save the database password somewhere safe.
3. Open **SQL Editor**, paste all of `supabase/schema.sql`, and run it once.

## 2. Create the email sender (Brevo)
1. Create a free account at brevo.com with the email address that will send the codes.
2. Under **Senders**, add and verify that address.
3. Under **SMTP & API**, note the SMTP server, port, login and SMTP key.
   Treat the key like a password: don't paste it into the code or share it in chat.

## 3. Connect them
In Supabase, under **Authentication**:
1. **SMTP settings**: turn on custom SMTP and enter the Brevo details and your sender address.
2. **Email templates**: paste `supabase/email-template.html` into both **Magic Link** and
   **Confirm signup**. The subject can be `Your Steady code`.
3. **Sign-in providers > Email**: keep Email on, and set the email code length to 6 digits.

## 4. Connect the website
In Supabase's API settings, copy the **Project URL** and the **publishable** (or `anon`) key.
Put them in `steady-config.js`. Never use a `secret` or `service_role` key.

## 5. Test before anyone else uses it
- Sign in with Gmail, Outlook and Yahoo addresses. Note whether codes land in spam.
- Enter a wrong code, then ask for a new one.
- Post, comment, report, and delete a test account.

## 6. Add a moderator
1. Sign in on the site and create a profile.
2. In Supabase's **Authentication > Users**, copy that person's user ID.
3. In **Table Editor > moderators**, add a row with that ID.

Moderators see a **Reports** panel on the Community page, where they can hide or restore posts.

## Keeping it free
- Free projects pause after about a week of low activity. Data is kept, and you can restore
  the project from the Supabase dashboard. Check it during the pilot.
- The Brevo free plan's daily limit applies to all sign-in emails.

## Testing without any accounts
Run `python3 dev-server.py`, open `http://localhost:4173`, and sign in with any email and the
code `123456`. Use `mod@example.com` to test moderator tools. It uses fake data and sends no email.

## Profile characters (Janiel-Mii branch only)

This branch stores a character code in `profiles.avatar`, and `supabase/schema.sql` here allows those codes.
Give this site its own free Supabase project. The other two versions can't draw characters, so sharing a project
would show them the raw code. If this project already ran an older copy of the schema, run:

```sql
alter table public.profiles drop constraint profiles_avatar_check;
alter table public.profiles add constraint profiles_avatar_check
  check (avatar in ('✳', '🌿', '☀', '🌻', '🌊', '🪴') or avatar ~ '^c1\.[0-9a-z]{25}$');
```
