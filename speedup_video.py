#!/usr/bin/env python3
"""
speedup_video_batch.py

Speed up a video (default 4x), strip audio, and write a browser-playable MP4.

Usage:
    python speedup_video_batch.py input.mov
    python speedup_video_batch.py /path/to/directory
    python speedup_video_batch.py input.mov -s 2 -q 20
"""

import argparse
import shlex
import shutil
import subprocess
from pathlib import Path
import sys

def check_tool(name):
    if shutil.which(name) is None:
        print(f"ERROR: '{name}' not found on PATH. Please install ffmpeg.")
        sys.exit(2)

def build_ffmpeg_command(input_path: Path, output_path: Path, speed: float, crf: int):
    vf = f"setpts=PTS/{speed}"
    return [
        "ffmpeg",
        "-hide_banner",
        "-y",
        "-i", str(input_path),
        "-filter:v", vf,
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", str(crf),
        "-pix_fmt", "yuv420p",
        "-an",  # strip audio
        "-movflags", "+faststart",
        str(output_path)
    ]

def process_file(input_path: Path, output_path: Path, speed: float, crf: int):
    cmd = build_ffmpeg_command(input_path, output_path, speed, crf)
    print("Running ffmpeg command:")
    print(" ".join(shlex.quote(c) for c in cmd))
    try:
        subprocess.check_call(cmd)
    except subprocess.CalledProcessError as e:
        print(f"ERROR: ffmpeg failed on {input_path} with exit code {e.returncode}")
        return False
    print("✅ Wrote", output_path)
    return True

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("input", help="Input video file or directory")
    parser.add_argument("-s", "--speed", type=float, default=4.0, help="Speedup factor (default 4.0)")
    parser.add_argument("-q", "--crf", type=int, default=23, help="CRF quality for x264 (lower = higher quality)")
    args = parser.parse_args()

    check_tool("ffmpeg")

    input_path = Path(args.input)
    if not input_path.exists():
        print(f"ERROR: {input_path} does not exist.")
        sys.exit(2)

    if args.speed <= 0:
        print("ERROR: speed must be > 0")
        sys.exit(2)

    if input_path.is_file():
        # Single file mode
        output_path = input_path.with_suffix(".mp4")
        process_file(input_path, output_path, args.speed, args.crf)

    elif input_path.is_dir():
        # Directory mode: process all files in directory
        files = sorted([p for p in input_path.iterdir() if p.is_file()])
        print(f"found files: {files}")
        if not files:
            print("No files found in directory.")
            sys.exit(0)

        for i, f in enumerate(files, start=1):
            output_path = input_path / f"{i}.mp4"
            process_file(f, output_path, args.speed, args.crf)

    else:
        print("ERROR: Input must be a file or directory.")
        sys.exit(2)

if __name__ == "__main__":
    main()
