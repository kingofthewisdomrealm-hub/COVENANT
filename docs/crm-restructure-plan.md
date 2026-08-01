# CRM restructure — Helpful Contacts, real Leads, AccuLynx flow

**Status:** plan only. No migration run.
**Date:** 2026-08-01

**Confirmed by founder:**

- **Two tables, one nav section.** Suppliers and partners stay separate; one
  "Helpful Contacts" screen with tabs.
- **One record through the pipeline.** A lead *is* a job sitting at the Lead
  milestone — the AccuLynx model. No separate leads table, no conversion step.

Three changes, in dependency order:

1. Move the current `leads` + `suppliers` under **Helpful Contacts**
2. Free the word **Leads** for real inbound website enquiries
3. Model the job flow on **AccuLynx**

---

## What's actually in the database today

| Table | Rows | What it really is |
|---|---|---|
| `leads` | 26 | **Not leads.** A B2B outreach directory — GCs, property managers, associations, vendor networks, sub-recruiters |
| `suppliers` | 63 | Materials and tool rental, by region and tier |
| `contacts` | 6 | People |
| `projects` | 6 | Jobs |
| `milestones` | 2 | Timeline entries |
| `budget_lines` | 0 | Never used |
| `project_photos` | 0 | Never used |

The `leads` table gives the game away. Its columns are `why_reach_out`,
`value_proposition`, `services_recruited`, `insurance_requirements`,
`application_url`, `license_number`, `employee_count`. **Those are notes for
approaching a business partner, not fields describing a homeowner who wants a
roof.** All 26 sit at status "new" because the table was never a pipeline — it's
a research list.

That's why the rename matters. Calling it Leads made everyone expect a sales
pipeline and then wonder why nothing moved.

---

## Change 1 — Helpful Contacts

**Nav becomes:**

```
Helpful Contacts
├── Suppliers        (63) — materials, tool rental
└── Partners         (26) — GCs, property managers, associations,
                            vendor networks, sub-recruiters
```

**Recommendation: keep two tables, one nav section with tabs.**

Merging them into a single table sounds tidier but costs more than it saves —
suppliers carry region/tier/category, partners carry outreach fields, and a
merged table means half the columns are null on every row. Two tables, one
screen.

`leads` table renames to `partners`. `lead_kind` → `partner_kind`,
`lead_status` → `partner_status`, `lead_priority` → `partner_priority`,
`lead_events` → `partner_events`. Data untouched — it's a rename, not a move.

**Add a mitigation partner category** while we're in there. The storm
restoration process depends on referrals from mitigation companies, and there's
nowhere to record who they are.

---

## Change 2 — Leads means leads

**No new leads table.** Confirmed: a lead is a job at the Lead milestone, the way
AccuLynx does it. A website enquiry creates a `contact` and a `project` at
`status = 'lead'`, and that same record walks the pipeline to Closed.

The gain is that there's exactly one pipeline, one record, no copying data
between tables and no moment where a lead has been "converted" but the history
lives somewhere else.

**Columns to add to `projects`:**

```sql
alter table public.projects
  add column source              text,        -- 'website', 'referral', 'canvass'
  add column referred_by         uuid references public.partners(id),
  add column lead_rank           smallint check (lead_rank between 1 and 4),
  add column priority            job_priority not null default 'normal',
  add column assigned_to         uuid references auth.users(id),
  add column trade               text,
  add column work_type           text,
  add column job_category        text,
  add column initial_appointment timestamptz,
  add column message             text,        -- what they typed in the form
  add column last_touched        timestamptz not null default now();
```

New enum `job_priority`: `low, normal, high, urgent`

**`referred_by` is the piece worth noticing.** It links a job back to the partner
or supplier who sent it. Do that for six months and you can answer "which
mitigation company actually sends us work" with data instead of a feeling —
exactly the question the storm restoration plan raised and couldn't answer.

**The website pipe** becomes, in `app/actions/lead.ts`, after validation and
before the Resend send:

1. Upsert a `contact` on email or phone — a repeat enquirer shouldn't become a
   second person
2. Insert a `project` at `status='lead'`, `source='website'`, with the message,
   project type, and address from the form
3. Send the email **regardless of whether either write succeeded**

That last point matters. A database hiccup must never cost a lead. Write first,
catch errors, email always — and if the write failed, mark the email subject so
you know to add it by hand.

**Junk filtering:** the tradeoff of one-record-one-pipeline is that spam lands in
the jobs list. Handled by defaulting the Leads & Jobs view to a saved filter that
hides `cancelled`, and treating "mark cancelled" as the delete action.

---

## Change 3 — AccuLynx job flow

Your current `project_status` is `lead, quoted, in_progress, complete, lost`.
AccuLynx uses six milestones plus cancelled, and it's the better model — each
milestone is a real handoff with money or paperwork attached.

```
Lead → Prospect → Approved → Completed → Invoiced → Closed
                                                      Cancelled
```

**Migration mapping:**

| Today | Becomes |
|---|---|
| `lead` | `lead` |
| `quoted` | `prospect` |
| `in_progress` | `approved` |
| `complete` | `completed` |
| `lost` | `cancelled` |

Six projects to migrate. Low risk.

### What this unlocks

**The process templates we just wrote map straight onto these milestones.** New
home builds stage 1 (contract and deposit) *is* the Lead → Prospect → Approved
run. Stages 4–6 are Approved → Completed. Stage 7 is Completed → Invoiced →
Closed. So "new project from template" can seed both the milestone the job sits
in *and* the stage checklist inside it — the thing that was going to fix 2
milestones across 6 projects.

### Screens to build, in AccuLynx's shape

**Dashboard** — milestone counts with dollar value per stage, an Action Items
grid, and an activity feed. The action items are the useful part: "unassigned
leads", "jobs awaiting approval", "invoices not recorded" turn a database into a
to-do list.

**Leads & Jobs list** — filter rail (milestone, priority, rank, trade, work
type, city, assigned to, source), results column, detail pane. This is the
screen you'd actually live in.

**Job overview** — milestone bar with dates and an Advance Job button, activity
counters (messages, estimates, invoices, orders, photos, documents), primary
contact, location info. Most of this data already exists; it isn't surfaced.

**Scheduler** — crews down the side, days across the top, an unscheduled queue
underneath. Genuinely useful, and the largest single build here. **Do it last.**

### Age in status

AccuLynx sorts by "age in status" and "last touched", and that's what stops jobs
going quiet. `last_touched` is added in Change 2; age in status is derived from
the milestone transition log rather than stored — one row per transition in
`activities`, which already exists.

---

## Order of work

| # | Step | Effort | Why here |
|---|---|---|---|
| 1 | Rename `leads` → `partners` (+ enums, `lead_events`), update UI refs | Small | Frees the name. Must be one atomic change — DB and code together, or the app breaks |
| 2 | Helpful Contacts nav, Suppliers / Partners tabs | Small | Pure UI over existing data |
| 3 | Migrate `project_status` to six milestones | Small | 6 rows. Do before adding columns so the new UI targets the final shape |
| 4 | Add lead-origin columns to `projects` | Small | |
| 5 | **Website form creates contact + project at Lead** | Medium | The automation win. Stops the retyping |
| 6 | Leads & Jobs screen — filter rail, results, detail | Medium | Where the pipeline gets worked |
| 7 | Job overview in AccuLynx shape | Medium | |
| 8 | Dashboard: milestone counts, action items, activity feed | Medium | |
| 9 | Milestone templates from the process docs | Medium | The real payoff |
| 10 | Scheduler | Large | Last. Useful but not blocking |

**Steps 1–5 are the ones that change your day.** Everything after is
presentation on top of a pipe that already works.

**Steps 1–2 must ship together.** Renaming a table in the database while
Lovable's code still references `leads` breaks the app. One Lovable prompt does
both.

---

## Still open

1. **Who gets assigned?** Just Josias Sr for now, or Sr and Jr? Determines
   whether `assigned_to` needs a picker or a default.
2. **Keep `estimates` and `change_orders`?** Both exist, both unused. Keeping
   them costs nothing; the argument for dropping is that unused tables in a
   schema make the next person wonder what they were for.
3. **Spam volume.** If the form starts attracting junk, revisit whether website
   enquiries should land in a holding state before joining the jobs list.
4. **Mitigation partners.** Add `mitigation` to `partner_kind` and record the
   companies you refer to — the storm restoration process depends on them and
   they're recorded nowhere.
