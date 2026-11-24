# Cadê? — front-end demo

This version adds client-side behavior to the existing university lost-and-found prototype. The visual structure and original numbered pages are kept, while the main forms and actions now work as a browser-only simulation.

## Run it

1. Extract the ZIP.
2. Open the project folder in VS Code.
3. Start **Live Server** (recommended) from `index.html`.
4. Use the menu to browse, search, create lost-item alerts, register found items, manage your own records, and open notifications.

The project has no backend, API, database, or server-side account system. The browser stores the demo data in `localStorage`, so it survives page navigation and browser refreshes on the same browser profile. Different browsers/devices will not share data.

## Demo accounts

| Role | Login | Password |
|---|---|---|
| Student | `aluno@cade.local` | `123456` |
| ADM | Select **ADM**, then `admin@cade.local` | `admin123` |

You can also create a new student account through **Não tenho cadastro**.

## What works

- Student account registration, login, profile editing, and logout.
- Demo administrator login.
- Create, search, view, edit, change status, and delete lost/found item records.
- Optional image upload and preview (JPG, PNG, WEBP; up to 1.5 MB per image).
- Personal lost-item alerts and found-item lists.
- Simulated contact messages and notifications.
- Simple title-based matching between lost and found records, which creates a notification when a possible match is detected.
- Recent items, item history, unread notification count, and home-page statistics.

## Reset the demo

Open the browser developer console on any project page and run:

```js
cadeDemo.reset()
```

This restores the original sample users, items, and notifications in this browser.

## Important limitation

This is for demonstration/classroom use only. Passwords and records are stored locally in the browser and are **not secure**. Do not use real passwords, personal documents, or sensitive contact information. A production version needs a backend, proper authentication, access control, and secure file storage.
