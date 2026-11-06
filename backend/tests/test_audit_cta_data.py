"""Test the M03 notebook's own audit logic without a duplicate Python module."""
import json
from pathlib import Path

import pytest

NOTEBOOK = Path(__file__).resolve().parents[1] / "notebooks" / "M03_CTA_Data_Quality_Audit.ipynb"
notebook = json.loads(NOTEBOOK.read_text(encoding="utf-8"))
logic_cells = [cell for cell in notebook["cells"] if "audit-logic" in cell.get("metadata", {}).get("tags", [])]
if len(logic_cells) != 1:
    raise ValueError("Expected exactly one audit-logic cell in M03 notebook")
namespace = {}
exec(compile("".join(logic_cells[0]["source"]), str(NOTEBOOK), "exec"), namespace)
audit_file = namespace["audit_file"]
save_report = namespace["save_report"]
BUS_COLUMNS = {"route", "date", "daytype", "rides"}


def test_quality_counts_and_source_is_unchanged(tmp_path):
    source = tmp_path / "bus.csv"
    text = ("route,date,daytype,rides\n"
            "X9,2022-01-01,U,0\n"
            "X9,2022-01-01,U,0\n"
            "X9,2026-01-01,Z,-1\n"
            ",bad,W,nope\n"
            "12,,W,\n"
            "12,2023-01-01,W,1.5\n")
    source.write_text(text, encoding="utf-8")
    result = audit_file(source, "route", BUS_COLUMNS)
    assert result["rows"] == 6
    assert result["zero_rides"] == 2
    assert result["negative_rides"] == result["non_integer_rides"] == 1
    assert result["invalid_nonblank_rides"] == 1
    assert result["missing_or_blank_by_column"]["rides"] == 1
    assert result["missing_or_blank_by_column"]["date"] == 1
    assert result["invalid_nonblank_dates"] == 1
    assert result["valid_dates_outside_2022_2025"] == 1
    assert result["unexpected_nonblank_daytypes"] == 1
    assert result["duplicate_entity_date_extra_rows"] == result["exact_duplicate_extra_rows"] == 1
    assert result["entity_date_rows_excluded_from_duplicate_check"] == 2
    assert source.read_text(encoding="utf-8") == text


def test_missing_required_column_is_clear(tmp_path):
    source = tmp_path / "bus.csv"
    source.write_text("route,date\nX9,2022-01-01\n", encoding="utf-8")
    with pytest.raises(ValueError, match="missing required columns"):
        audit_file(source, "route", BUS_COLUMNS)


def test_header_only_is_empty(tmp_path):
    source = tmp_path / "bus.csv"
    source.write_text("route,date,daytype,rides\n", encoding="utf-8")
    assert audit_file(source, "route", BUS_COLUMNS)["empty_dataset"] is True


def test_mixed_dates_detect_duplicate_entity_day(tmp_path):
    source = tmp_path / "bus.csv"
    source.write_text("route,date,daytype,rides\nX9,01/02/2022,U,10\nX9,2022-01-02T00:00:00,U,11\n", encoding="utf-8")
    result = audit_file(source, "route", BUS_COLUMNS)
    assert result["duplicate_entity_date_extra_rows"] == 1
    assert result["first_valid_date"] == result["last_valid_date"] == "2022-01-02"


def test_calendar_gap_is_counted(tmp_path):
    source = tmp_path / "bus.csv"
    source.write_text("route,date,daytype,rides\nX9,2022-01-01,U,10\nX9,2022-01-03,W,11\n", encoding="utf-8")
    result = audit_file(source, "route", BUS_COLUMNS)
    assert result["calendar_days_without_row_within_entity_spans"] == 1
    assert result["entities_with_calendar_gaps"] == 1


def test_report_creates_json(tmp_path):
    output = tmp_path / "reports" / "report.json"
    save_report({"bus": {"rows": 5}}, output)
    assert json.loads(output.read_text(encoding="utf-8"))["datasets"]["bus"]["rows"] == 5


def test_report_is_never_overwritten(tmp_path):
    output = tmp_path / "report.json"
    output.write_text("keep existing", encoding="utf-8")
    with pytest.raises(FileExistsError):
        save_report({"bus": {}}, output)
    assert output.read_text(encoding="utf-8") == "keep existing"


def test_duplicate_header_is_rejected(tmp_path):
    source = tmp_path / "bus.csv"
    source.write_text("route,date,daytype,rides,rides\nX9,2022-01-01,U,1,1\n", encoding="utf-8")
    with pytest.raises(ValueError, match="duplicate column names"):
        audit_file(source, "route", BUS_COLUMNS)
