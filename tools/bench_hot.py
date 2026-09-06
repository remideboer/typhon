"""Hot in-process compile_typhon medians for a fixed file set."""
from __future__ import annotations

import argparse
import statistics
import time
from pathlib import Path

from transpiler.pipeline import compile_typhon


DEFAULT_FILES = [
    "examples/main.typhon",
    "examples/interfaces.typhon",
    "examples/gui/pokemontcg/main.typhon",
    "examples/gui/pokemontcg/ui.typhon",
    "examples/gui/PyQt/main.typhon",
]


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--label", default="")
    ap.add_argument("--repeat", type=int, default=8)
    ap.add_argument("files", nargs="*")
    args = ap.parse_args()
    files = [Path(p) for p in (args.files or DEFAULT_FILES)]
    label = f"[{args.label}] " if args.label else ""
    print(f"{label}hot compile_typhon, median of {args.repeat}")
    total = 0.0
    for path in files:
        text = path.read_text(encoding="utf-8")
        compile_typhon(text, source_path=path)  # warmup
        times: list[float] = []
        for _ in range(args.repeat):
            start = time.perf_counter()
            compile_typhon(text, source_path=path)
            times.append(time.perf_counter() - start)
        med = statistics.median(times)
        total += med
        print(f"{med * 1000:8.1f} ms  {path.as_posix()}")
    print(f"\n{label}total median: {total * 1000:.1f} ms")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
