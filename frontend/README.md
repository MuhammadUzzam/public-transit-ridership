# TransitPulse frontend

React/Vite dashboard for historical CTA bus and rail ridership. The chart uses the saved 2022–2025 monthly summary in `src/monthly.json`. Transit animations are decorative and do not show live vehicle positions.

Start the FastAPI backend first. In Windows CMD from the `frontend` folder:

```cmd
node ".\node_modules\vite\bin\vite.js" --host 127.0.0.1
```

Open the Local URL printed by Vite. For the backend command and local notes, see the [project README](../README.md).

The Vite development proxy forwards `/api` requests to FastAPI on port 8000. Predictions are historical simulations for known routes and stations during January–August 2026, subject to available history.
