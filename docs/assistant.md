# Covenant Assistant — setup

The assistant is Claude with Covenant's rules, reading and writing the real
CRM. It lives on the website at a private address:

```
https://covenantbuilders.org/assistant/<ASSISTANT_SECRET>
```

Same lock as the attribution page: the key in the address IS the lock. Wrong
key → 404. Nothing links to it, robots are told to stay away.

## What it can do

| Tool | What it does | Writes? |
|---|---|---|
| `search_buildings` | reads the `buildings` table (your milestone list) | no |
| `get_knowledge` | reads the playbook (`assistant_knowledge`) | no |
| `propose_lead` | shows you an approve / skip card | **no** — only your click writes |
| `list_leads` | reads `assistant_leads` | no |
| `storm_check` | the storm-check quiz, same scoring as the site | no |
| `find_programs` | the money map: 48 programs in `homeowner_programs` | no |
| `design_brief` | the project designer, same branches as the site | no |
| `list_models` | the tools + the visual models, with links | no |

When you click **add it** on a proposal, the server calls the same
`submit_website_lead` function the website forms use (a contact + a job at
the Lead milestone), then records the lead in `assistant_leads` with the CRM
job id. If the CRM write fails, the lead is still recorded with the error —
a database problem never costs a lead.

Claude's key never reaches the browser. The browser only ever sends the
secret and the conversation to `/api/assistant`.

## Setup — five steps, in order

### 1. Get a Claude API key (about 5 minutes)

1. Go to https://console.anthropic.com and sign in (or create an account).
2. Add a payment method under **Billing**. Put $10 on it. The assistant costs
   cents per job; $10 lasts a long time.
3. Open **API Keys** in the left menu → **Create Key**. Name it
   `covenant-website`.
4. Copy the key. It starts with `sk-ant-`. You see it once. Paste it straight
   into Vercel (step 4). Never paste it into a chat, an email or a file in git.
5. Optional but smart: under **Limits**, set a monthly spend cap.

### 2. Run the SQL in Supabase (about 3 minutes)

Supabase dashboard → your CRM project → **SQL Editor** → **New query**.
Run these three files, in this order, one at a time:

1. `supabase/assistant/001_assistant.sql` — tables + the key-checked functions
2. `supabase/assistant/002_seed_programs.sql` — the 48 homeowner programs
3. `supabase/assistant/003_seed_knowledge.sql` — the playbook

Then set the secret. Make up a long random string (24+ characters; a password
manager can generate one) and run:

```sql
insert into public.assistant_config (secret) values ('PASTE-YOUR-LONG-RANDOM-SECRET')
  on conflict (id) do update set secret = excluded.secret, updated_at = now();
```

### 3. Load the real buildings

Two ways:

- **On the page**: open the assistant, press **load**, paste rows from your
  milestone list in Excel (with the header row), click **load**. Columns are
  matched by name: building / name, city, stories, year built, deadline,
  status, contact, phone, called, notes.
- **In SQL**: `insert into public.buildings (id, name, city, stories, year_built, deadline, status, contact, phone) values (...)`.

Status values: `past_due`, `due_this_year`, `upcoming`, `not_required`,
`unknown`. Leave a deadline blank rather than guessing — the assistant says
"needs manual lookup" for blanks and never invents one.

### 4. Set the environment variables in Vercel

Vercel → the `covenant-builders` project → **Settings → Environment
Variables**. Add (Production and Preview):

| Name | Value |
|---|---|
| `SUPABASE_URL` | your project URL (already set if the forms write to the CRM) |
| `SUPABASE_PUBLISHABLE_KEY` | the publishable / anon key (never the service-role key) |
| `ANTHROPIC_API_KEY` | the `sk-ant-…` key from step 1 |
| `ASSISTANT_SECRET` | the exact same string you inserted in step 2 |
| `ASSISTANT_MODEL` | optional, default `claude-sonnet-5` |

Redeploy after saving (Deployments → ⋯ → Redeploy).

### 5. Open it

```
https://covenantbuilders.org/assistant/<your secret>
```

The first line it says tells you what it can see: how many buildings, how
many programs. If it says "not configured", it names the missing variable.
If it says it can't reach the database, step 2 was skipped or the secret in
Vercel does not match the one in `assistant_config`.

## Costs and limits

- Claude: billed to your Anthropic account per job. A typical job (search,
  a few proposals, a report) is a few cents. Set a monthly cap in the console.
- The API route allows 30 calls per minute per IP and 8 tool rounds per job.
- Every job is logged in `assistant_runs` (goal, report, tools used).

## Compliance

The assistant carries the same Florida rules as the site (see the comment
blocks in `content/storm-check.ts` and `content/design-your-project.ts`):
never encourages a claim, never states a price, only the approved insurance
sentence, and every storm result and brief ends with its disclaimer. The
rules live in `lib/assistant/rules.ts`.

## Files

```
app/assistant/[key]/page.tsx            the private page (404 on a wrong key)
app/assistant/[key]/assistant-client.tsx chat, cards, checkpoint, drawers, paste loader
app/assistant/[key]/loop-viz.tsx        the 3D agent loop (three.js)
app/assistant/[key]/styles.ts           scoped styles
app/api/assistant/route.ts              the agent loop (Claude + tools, streamed)
app/api/assistant/approve/route.ts      the human checkpoint → CRM
app/api/assistant/state/route.ts        counts, leads, paste-from-Excel loader
lib/assistant/db.ts                     the key-checked Supabase doors
lib/assistant/rules.ts                  the system prompt
lib/assistant/tools.ts                  the eight tools
lib/programs-match.ts                   program matching, shared with /homeowner-programs
supabase/assistant/*.sql                tables, functions, seeds
```
