# Development guidelines

- Keep code understandable; preserve unrelated work and verify changes.
- Keep bus and rail models separate and use the Normal/High target.
- Treat predictions as historical simulations and the 91-day delay as an assumption.
- Do not describe results as live tracking, overcrowding, capacity or automatic vehicle allocation.
- Do not commit raw data, model files, secrets, virtual environments or installed dependencies by accident. Check already-tracked files separately from `.gitignore` rules.
