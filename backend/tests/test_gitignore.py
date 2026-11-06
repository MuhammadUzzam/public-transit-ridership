"""Check that local data and secrets stay out of Git in a fresh checkout."""

from pathlib import Path
import shutil
import subprocess

import pytest

PROJECT_ROOT = Path(__file__).resolve().parents[2]


@pytest.mark.parametrize(
    "path",
    [
        ".env",
        ".env.local",
        "backend/.venv/pyvenv.cfg",
        "backend/data/raw/bus.csv",
        "backend/data/processed/rail.csv",
        "backend/models/bus.joblib",
        "frontend/node_modules/example/index.js",
        "frontend/dist/index.html",
    ],
)
def test_local_artifacts_are_ignored(tmp_path, path):
    shutil.copy(PROJECT_ROOT / ".gitignore", tmp_path / ".gitignore")
    subprocess.run(["git", "init", "-q"], cwd=tmp_path, check=True)
    result = subprocess.run(
        ["git", "check-ignore", "--quiet", path], cwd=tmp_path, check=False
    )
    assert result.returncode == 0, f"Expected Git to ignore {path}"


def test_env_example_can_be_tracked(tmp_path):
    shutil.copy(PROJECT_ROOT / ".gitignore", tmp_path / ".gitignore")
    subprocess.run(["git", "init", "-q"], cwd=tmp_path, check=True)
    result = subprocess.run(
        ["git", "check-ignore", "--quiet", ".env.example"],
        cwd=tmp_path,
        check=False,
    )
    assert result.returncode == 1
