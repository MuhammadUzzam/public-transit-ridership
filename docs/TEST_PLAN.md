# Test plan

- M01: verify representative secrets, environments, generated files and data are ignored; keep `.env.example` trackable.
- Data modules: schema, duplicates, date gaps, missing/zero values and entity separation.
- ML modules: target boundaries, past-only features, availability cutoffs, chronological splits and metric correctness.
- API/frontend: validation, missing history, integration, UI states and honest simulation labeling.
- Run relevant existing regression tests after each module. Record actual results in PROGRESS.md.
