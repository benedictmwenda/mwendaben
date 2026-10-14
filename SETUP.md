# Portfolio dashboard setup (Supabase)

Your portfolio items now live in a database. You add them from `admin.html`, and the site shows them grouped by category (Web Development, Web Design, Logo & Branding, Graphic Design, plus any you add).

Until you finish these steps the site simply shows the old demo items, so nothing breaks.

## 1. Create the project (free)
1. Sign up at https://supabase.com and create a new project. Save the database password somewhere safe.
2. Wait until the project finishes starting.

## 2. Create the tables and storage
1. Open **SQL Editor -> New query**.
2. Paste the whole of `supabase/schema.sql` and press **Run**.
   - It uses `beneditc64@gmail.com` as the only allowed admin. If you will log in with another email, change it in the `is_portfolio_admin()` function at the top first.

## 3. Create your admin login (and lock out everyone else)
1. **Authentication -> Users -> Add user -> Create new user**. Use your admin email and a strong password. Tick *Auto Confirm User*.
2. **Authentication -> Sign In / Providers** (or *Settings*): turn **off** "Allow new users to sign up".

## 4. Connect the site
1. **Project Settings -> API**. Copy the **Project URL** and the **anon public** key.
2. Paste them into `assets/js/config.js`.
   - Use only the anon key. Never paste the `service_role` key anywhere in the site.

## 5. (Already ran schema.sql before the CV feature was added?)
Run `supabase/add_cv_settings.sql` once in the SQL Editor. It is safe to run again. New projects don't need it, because `schema.sql` already includes it.

## 6. Use it
1. Upload the site to your host as usual and open `/admin.html`.
2. Sign in, then **Add item**: title, category, how it should open, cover image, order and visibility.
3. Visitors see published items on the home page, with filter buttons for every category that has at least one published item.

### How each item type opens
| Type | What visitors get |
|------|-------------------|
| Image | the cover image full size |
| Details | popup with description, extra images and an optional "View project" link (good for websites) |
| YouTube / Vimeo | video popup |
| SoundCloud | audio player popup |

### Updating your CV
Open the **CV** tab in the dashboard, choose a PDF (up to 10 MB) and press **Upload & replace**. The "Download CV" button on the site switches to the new file straight away. **Remove uploaded CV** puts the site back on the CV file bundled in the code (`assets/img/about/Benedict-Mwenda-CV.pdf`).

### Notes
- Images are shrunk automatically in the browser before upload.
- "Hide" keeps an item in the database but removes it from the site.
- Categories can be added, renamed, reordered and deleted in the dashboard. A category with items in it cannot be deleted.
- Safety: the database rules only allow the public to read published items. Only the logged-in admin email can add, change or delete anything.
