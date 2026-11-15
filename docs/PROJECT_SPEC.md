# Project specification

- **Problem:** Explore changing CTA bus and rail ridership to support planning analysis.
- **Data:** Public CTA daily bus route boardings and rail station entries.
- **Input:** A known bus route or rail station ID and a historical date.
- **Output:** Normal or High relative to that location's training-period threshold.
- **System:** Separate classification models, historical baselines, FastAPI endpoints and a React dashboard.
- **Scope:** Historical simulation only. It does not predict live crowding, vehicle capacity, schedules or automatic allocation. Practical decisions require more operational information.
