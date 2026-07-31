#!/usr/bin/env python3
"""PupTV pipeline test — dog photos -> cartoon stills -> animated clips -> looping video.

Stack (all on Replicate, one token):
  1. google/nano-banana-pro       identity-preserving cartoon stills (3 scenes)
  2. kwaivgi/kling-v2.5-turbo-pro image-to-video, 5s per scene
  3. ffmpeg                        concat into one looping MP4

Usage:
  REPLICATE_API_TOKEN=r8_xxx python3 puptv_pipeline_test.py photo1.jpg [photo2.jpg ...] \
      --name Biscuit --theme park --outdir ./puptv_test_output

Stdlib only. No pip installs needed.
"""
import argparse, base64, json, mimetypes, os, shutil, subprocess, sys, tempfile, time, urllib.request

API = "https://api.replicate.com/v1"
TOKEN = os.environ.get("REPLICATE_API_TOKEN", "")

THEMES = {
    "park":     ["joyfully chasing a colorful butterfly across a sunny green meadow with wildflowers",
                 "happily running through a park carrying a big stick, tail wagging, golden afternoon light",
                 "peacefully napping under a large oak tree, soft dappled sunlight, a ladybug on a leaf nearby"],
    "beach":    ["bounding through gentle surf on a sunny beach, splashing sparkling water",
                 "digging an enormous hole in golden sand next to a sandcastle, seagulls overhead",
                 "relaxing on a beach towel under an umbrella wearing sunglasses, calm turquoise waves"],
    "space":    ["floating happily in a colorful spaceship cockpit wearing a tiny astronaut helmet",
                 "bouncing in low gravity on a purple alien planet chasing a glowing space ball",
                 "gazing out a spaceship window at Earth and twinkling stars, cozy and calm"],
    "mountain": ["hiking up a scenic mountain trail with a tiny backpack, snowcapped peaks behind",
                 "playing in fresh snow, catching snowflakes on its tongue, pine trees around",
                 "sitting at a summit at sunset overlooking a golden valley, wind in its fur"],
    "city":     ["trotting proudly down a colorful city sidewalk past cafes and flower stands",
                 "catching a frisbee in a lively city park with a skyline in the background",
                 "riding in a little red wagon through a farmers market, sniffing the air happily"],
}

def die(msg):
    print(f"ERROR: {msg}", file=sys.stderr); sys.exit(1)

def api(path, payload=None, prefer_wait=False):
    req = urllib.request.Request(API + path)
    req.add_header("Authorization", f"Bearer {TOKEN}")
    req.add_header("Content-Type", "application/json")
    if prefer_wait:
        req.add_header("Prefer", "wait=60")
    data = json.dumps(payload).encode() if payload is not None else None
    with urllib.request.urlopen(req, data=data, timeout=120) as r:
        return json.loads(r.read())

def poll(pred, label, timeout_s=900):
    t0 = time.time()
    while pred["status"] not in ("succeeded", "failed", "canceled"):
        if time.time() - t0 > timeout_s:
            die(f"{label}: timed out after {timeout_s}s (id {pred['id']})")
        time.sleep(5)
        pred = api(f"/predictions/{pred['id']}")
        print(f"  [{label}] {pred['status']} ({int(time.time()-t0)}s)")
    if pred["status"] != "succeeded":
        die(f"{label}: {pred['status']} — {pred.get('error')}")
    return pred

def run_model(model, inputs, label, timeout_s=900):
    print(f"-> {label} ({model})")
    pred = api(f"/models/{model}/predictions", {"input": inputs}, prefer_wait=True)
    pred = poll(pred, label, timeout_s)
    out = pred["output"]
    if isinstance(out, list):
        out = out[0]
    print(f"  [{label}] done: {out}")
    return out

def to_data_uri(path):
    """Downscale to <=1024px JPEG if needed, return data URI."""
    size = os.path.getsize(path)
    use = path
    if size > 250_000:
        tmp = os.path.join(tempfile.mkdtemp(), "small.jpg")
        for cmd in (["sips", "-Z", "1024", "-s", "format", "jpeg", "-s", "formatOptions", "70", path, "--out", tmp],
                    ["ffmpeg", "-y", "-i", path, "-vf", "scale='min(1024,iw)':-2", "-q:v", "5", tmp],
                    ["magick", path, "-resize", "1024x1024>", "-quality", "70", tmp]):
            if shutil.which(cmd[0]):
                try:
                    subprocess.run(cmd, check=True, capture_output=True)
                    use = tmp
                    break
                except subprocess.CalledProcessError:
                    continue
        if use == path:
            print(f"  (warn) couldn't downscale {path}; sending as-is ({size//1024}KB)")
    mime = mimetypes.guess_type(use)[0] or "image/jpeg"
    with open(use, "rb") as f:
        return f"data:{mime};base64,{base64.b64encode(f.read()).decode()}"

def download(url, dest):
    req = urllib.request.Request(url, headers={"User-Agent": "puptv-test"})
    with urllib.request.urlopen(req, timeout=300) as r, open(dest, "wb") as f:
        shutil.copyfileobj(r, f)
    print(f"  saved {dest}")

def main():
    p = argparse.ArgumentParser()
    p.add_argument("photos", nargs="+")
    p.add_argument("--name", default="Buddy")
    p.add_argument("--details", default="",
                   help="Breed/appearance corrections, e.g. 'French Bulldog: bat ears, VERY SHORT stubby screw tail (no long tail)'")
    p.add_argument("--theme", default="park", choices=sorted(THEMES))
    p.add_argument("--outdir", default="./puptv_test_output")
    p.add_argument("--duration", type=int, default=5, choices=[5, 10])
    args = p.parse_args()
    if not TOKEN:
        die("Set REPLICATE_API_TOKEN")
    for ph in args.photos:
        if not os.path.exists(ph):
            die(f"photo not found: {ph}")
    os.makedirs(args.outdir, exist_ok=True)
    scenes = THEMES[args.theme]
    refs = [to_data_uri(ph) for ph in args.photos]
    print(f"Prepared {len(refs)} reference photo(s). Theme: {args.theme}. Dog: {args.name}\n")

    # ---- Stage 1: cartoon stills (chain scene 1 output as reference for 2-3) ----
    identity = ("Using the attached reference photos of this exact real dog, create a Pixar-style 3D "
                "animated cartoon version of the SAME dog — keep its exact fur colors, markings, ear shape, "
                "face structure, eye color, and body proportions so its owner instantly recognizes it. ")
    if args.details:
        identity += f"IMPORTANT breed/appearance details the owner specified — follow them exactly: {args.details}. "
    style = (" Bright cheerful colors, soft lighting, high-quality 3D animation film still, "
             "16:9 wide shot, no text, no watermark.")
    stills = []
    cartoon_ref = None
    for i, scene in enumerate(scenes, 1):
        img_in = list(refs) + ([cartoon_ref] if cartoon_ref else [])
        prompt = (identity if not cartoon_ref else
                  "Using the attached reference photos AND the attached cartoon still of the same dog, "
                  "render the IDENTICAL cartoon character (same design, same proportions, same colors) ") \
                 + f"The cartoon dog named {args.name} is {scene}." + style
        url = run_model("google/nano-banana-pro",
                        {"prompt": prompt, "image_input": img_in, "aspect_ratio": "16:9",
                         "resolution": "2K", "output_format": "jpg"},
                        f"still {i}/3", timeout_s=300)
        dest = os.path.join(args.outdir, f"still_{i}.jpg")
        download(url, dest)
        stills.append(url)
        if cartoon_ref is None:
            cartoon_ref = url
    print()

    # ---- Stage 2: animate each still ----
    clips = []
    for i, (scene, still) in enumerate(zip(scenes, stills), 1):
        vprompt = (f"The Pixar-style cartoon dog {args.name} {scene}. Smooth, gentle, natural animation. "
                   "Calm cheerful mood, subtle camera movement, seamless motion, consistent character design.")
        url = run_model("kwaivgi/kling-v2.5-turbo-pro",
                        {"prompt": vprompt, "start_image": still, "duration": args.duration,
                         "negative_prompt": "distortion, morphing, extra limbs, extra tails, text, watermark, "
                                            "flickering, jump cuts, scary, dark"},
                        f"clip {i}/3", timeout_s=1200)
        dest = os.path.join(args.outdir, f"clip_{i}.mp4")
        download(url, dest)
        clips.append(dest)
    print()

    # ---- Stage 3: stitch + loop ----
    final = os.path.join(args.outdir, f"{args.name.lower()}_{args.theme}_loop.mp4")
    if shutil.which("ffmpeg"):
        lst = os.path.join(args.outdir, "concat.txt")
        with open(lst, "w") as f:
            for _ in range(2):  # play the sequence twice per file; player loop does the rest
                for c in clips:
                    f.write(f"file '{os.path.abspath(c)}'\n")
        subprocess.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", lst,
                        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-movflags", "+faststart", final],
                       check=True, capture_output=True)
        os.remove(lst)
        print(f"FINAL VIDEO: {final}")
    else:
        print("ffmpeg not found — skipping stitch. Individual clips:", clips)
    print("\nDone. Stills + clips are in", os.path.abspath(args.outdir))

if __name__ == "__main__":
    main()
