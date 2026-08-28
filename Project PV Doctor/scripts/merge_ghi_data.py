"""Merge all GHI CSV files into a single consolidated CSV."""

from __future__ import annotations

import argparse
import csv
from pathlib import Path


def discover_csv_files(source_dir: Path) -> list[Path]:
    return sorted(source_dir.rglob("*.csv"))


def load_and_concat(source_dir: Path) -> list[dict[str, str]]:
    csv_files = discover_csv_files(source_dir)
    if not csv_files:
        raise FileNotFoundError(f"No CSV files found under {source_dir}")

    by_date: dict[str, str] = {}
    for csv_path in csv_files:
        with csv_path.open(newline="", encoding="utf-8") as handle:
            reader = csv.DictReader(handle)
            if not reader.fieldnames or "Date" not in reader.fieldnames:
                raise ValueError(f"Missing Date column in {csv_path}")
            for row in reader:
                by_date[row["Date"].strip()] = row["GHI"]

    return [{"Date": date, "GHI": by_date[date]} for date in sorted(by_date)]


def write_csv(rows: list[dict[str, str]], output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=["Date", "GHI"])
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    parser = argparse.ArgumentParser(description="Merge GHI CSV files into one file.")
    parser.add_argument(
        "--source",
        type=Path,
        default=Path(r"C:\Users\hp\OneDrive\Desktop\GHI"),
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path(__file__).resolve().parents[1] / "output" / "ghi_combined.csv",
    )
    args = parser.parse_args()
    if not args.source.exists():
        raise FileNotFoundError(f"Source directory does not exist: {args.source}")
    merged = load_and_concat(args.source)
    write_csv(merged, args.output)
    print(f"Merged {len(merged)} rows -> {args.output}")


if __name__ == "__main__":
    main()
