"""Run GHI dashboard without npm — serves API + static React (CDN + Babel)."""

from __future__ import annotations

import csv
import json
import mimetypes
import urllib.parse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CSV_PATH = ROOT.parent / "output" / "ghi_combined.csv"
PORT = 5173


def load_rows() -> list[dict]:
    rows: list[dict] = []
    with CSV_PATH.open(encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            rows.append({"date": row["Date"], "ghi": float(row["GHI"])})
    return rows


def stats(values: list[float]) -> dict:
    if not values:
        return {"min": 0, "max": 0, "avg": 0}
    return {
        "min": min(values),
        "max": max(values),
        "avg": sum(values) / len(values),
    }


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt: str, *args) -> None:
        print(f"[{self.log_date_time_string()}] {fmt % args}")

    def _send_json(self, payload: dict, status: int = 200) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def _send_file(self, path: Path) -> None:
        if not path.is_file():
            self.send_error(404, "Not found")
            return
        content = path.read_bytes()
        mime, _ = mimetypes.guess_type(str(path))
        self.send_response(200)
        self.send_header("Content-Type", mime or "application/octet-stream")
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)

    def do_GET(self) -> None:
        parsed = urllib.parse.urlparse(self.path)
        route = parsed.path

        if route == "/api/ghi":
            query = urllib.parse.parse_qs(parsed.query)
            days = int(query.get("days", ["7"])[0])
            all_rows = load_rows()
            filtered = all_rows[-days:] if days > 0 else all_rows
            values = [row["ghi"] for row in filtered]
            from datetime import datetime, timezone

            self._send_json(
                {
                    "range": days,
                    "stats": stats(values),
                    "data": filtered,
                    "lastUpdated": datetime.now(timezone.utc).isoformat(),
                }
            )
            return

        if route in ("/", "/index.html"):
            self._send_file(ROOT / "standalone.html")
            return

        file_path = ROOT / route.lstrip("/")
        if file_path.is_file():
            self._send_file(file_path)
            return

        self.send_error(404, "Not found")


def main() -> None:
    if not CSV_PATH.is_file():
        raise FileNotFoundError(f"Missing merged CSV: {CSV_PATH}. Run scripts/merge_ghi_data.py first.")
    server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    print(f"GHI Dashboard running at http://127.0.0.1:{PORT}")
    print(f"API: http://127.0.0.1:{PORT}/api/ghi?days=7")
    server.serve_forever()


if __name__ == "__main__":
    main()
