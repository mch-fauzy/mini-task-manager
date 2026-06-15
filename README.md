# Mini Task Manager

A small full stack app for an internal team to create tasks, move them through a fixed
set of statuses, and see a clear, per task history of who changed what and when.

The history (the audit log) is the heart of the app. Once a status change is recorded it
can never be edited or deleted, and it always stays in sync with the task it describes.

## Table of contents

- [What it does](#what-it-does)
- [Getting started](#getting-started)
- [Architecture](#architecture)
- [API](#api)
- [Assumptions](#assumptions)
- [Trade-offs](#trade-offs)
- [If I had more time](#if-i-had-more-time)
- [Design answers](#design-answers)
- [AI usage](#ai-usage)

## What it does

- Create a task. A new task starts in the **To Do** status.
- Move a task forward one step at a time. The order is To Do, Pending, In Progress, Done.
  You cannot skip a step or move backward.
- Delete a task. It leaves the list, but its history is kept.
- See all tasks in a paginated list with the current status shown as a colored tag.
- Open the full change history for any task, shown oldest to newest, with no way to edit it.

Every status change records who made it. The person is picked from a small fixed list
(John Doe, Jane Roe, Alex Kim). There is no login, which matches the brief.

## Getting started

You need Node.js 20.19 or newer (Node 22 works well) and npm. Run every command from the
project root. You do not need to change into the `backend` or `frontend` folder.

**1. Install both apps:**

```bash
npm --prefix backend install
npm --prefix frontend install
```

**2. Create the database and start the backend** (in one terminal):

```bash
npm --prefix backend run migration:run
npm --prefix backend run start:dev
```

The API runs at `http://localhost:3000/api/v1`. Configuration has sensible defaults, so a
`.env` file is optional. To override anything, copy `backend/.env.example` to `backend/.env`.

**3. Start the frontend** (in a second terminal):

```bash
npm --prefix frontend run dev
```

The app runs at `http://localhost:5173` and talks to the backend above. The frontend base
URL is set by `VITE_API_BASE_URL` and already defaults to the backend address.

**Running the tests:**

```bash
npm --prefix backend test
npm --prefix frontend test
```

## Architecture

Two independent apps. The backend is the source of truth and decides what is allowed. The
frontend only renders, caches, and validates form input. They share one agreement: the
backend speaks `snake_case`, and the frontend converts to `camelCase` in a single place (its
API client), so the rest of the app works in `camelCase` only.

```
mini-task-manager/
├── backend/    Express + TypeScript + TypeORM + SQLite
└── frontend/   React + Vite + TypeScript + Ant Design + TanStack Query
```

**Backend.** Grouped by feature, each feature split into layers so every file has one job:
`modules/` (the features: `task`, `audit-log`, `actor`, `health`), `infrastructures/` (the
database, entities, and middleware), and `shared/` (errors, the response wrapper, helpers).
A request flows one direction, and the business rules live only in the service:

```
route -> validate -> controller -> service (rules + transaction) -> repository (database)
```

**Frontend.** Same idea, grouped by feature: `shared/` (API client, cache setup, shared
types), `features/task/` (`types`, `constants`, `utils`, `services`, `hooks`, `components`),
and `app/` (providers and layout). Data flows one direction, and a component never calls a
service directly, only through a hook:

```
utils -> services -> hooks -> components
```

## API

All routes are under `/api/v1`.

| Method and path | What it does |
| --- | --- |
| `GET /tasks` | List tasks, paginated. Deleted tasks are not shown. |
| `POST /tasks` | Create a task. Body: `title`. It starts in To Do. |
| `PUT /tasks/:id/status` | Change a task's status. Body: `to_status`, `actor_id`. |
| `DELETE /tasks/:id` | Delete a task. Its history is kept. |
| `GET /tasks/:id/audit-logs` | The task's history, oldest to newest. |
| `GET /actors` | The fixed list of people for the dropdown. |

Every response uses the same envelope: `{ data, message }`, with a `meta` block added for
paginated lists. Errors return a clear `message`.

## Assumptions

- **The status order is strict.** A change is allowed only to the very next status. Skipping
  ahead or going back is rejected. I read "must follow the order" as one step at a time. If
  the reviewer expects forward skips to be allowed, it is a one line change in the rule plus
  its tests.
- **Delete is a soft delete.** The task is hidden from the list but the row stays, so its
  history is still valid and viewable. The history is never touched by a delete.
- **People are a fixed list.** There is no login. The selected person is required only when
  changing a status, and their name is saved into the history at that moment.
- **A status is stored as plain text** and checked by the rules in code, so adding a new
  status later does not need a database change.

## Trade-offs

- A fixed list of people and SQLite keep the app simple and easy to run with no setup. The
  cost is that it is not built for real multi user accounts yet.
- The history saves the person's name at the time of the change, not just an id. This means
  the history reads correctly even if the fixed list changes later, at the small cost of
  storing the name on each row.

## If I had more time

- **Automatic cache refresh.** Each change currently refreshes the cache by hand. I would set
  this up once so any successful change refreshes the affected data automatically, so a new
  feature cannot forget to.
- **A stronger database.** Move from SQLite to Postgres and protect a task while it updates,
  so two people cannot advance it at the same time (more on this below).
- **Real accounts.** Replace the fixed list of people with user accounts and login, and record
  changes against the logged in user.
- **Better lists.** Add filtering, sorting, and faster search for large numbers of tasks.

## Design answers

**How is the audit log kept unmodifiable?**

Two layers. In the app there is no code path to change a row: no update or delete method, no
endpoint, and no "edited at" column or soft delete. Each entry is written inside the same
transaction as the status change, so the two are saved together or not at all. In the
database, triggers reject any update or delete on the table, so even direct SQL cannot alter
a row.

**Which part is riskiest if many people use it at once?**

Two people advancing the same task at the same moment: both read it as "To Do" and both move
it to "Pending", recording two changes for one step. Today the task is re-read inside the
transaction before the change is written, and the database allows one writer at a time, so
this is safe at the current scale. On a larger database I would lock the task row while it
updates, or give it a version number and reject a change if the version moved since it was read.

**If this grew into a large system, what would you refactor first?**

The data layer. Move to a stronger database and add the task lock or version check above,
since that protects correctness under load. Then replace the fixed list of people with real
accounts and login, and add indexed search to the list.

## AI usage

AI helped with scaffolding, writing the tests first, and drafting this README. I reviewed and
understand all of it. The core guarantees are covered by passing tests (`npm --prefix backend test`
and `npm --prefix frontend test`): the strict status order, the no-op update that writes no
history, the append-only history, and an atomicity test that forces a mid-change failure and
confirms the task is left unchanged.
