"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import FullEpisodeModal from "./FullEpisodeModal";

/**
 * The "you don't have to take our word for it" button.
 *
 * The site sells videos, so somewhere near the top there has to be a
 * whole one you can watch. It says up front how long it is and that it
 * has sound, because the worst version of this is a page that starts
 * talking at you.
 */
export default function WatchEpisodeCta() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="watch-card">
        <span className="watch-play" aria-hidden="true">
          <Play className="w-6 h-6" style={{ color: "#FFFFFF", marginLeft: "3px" }} />
        </span>
        <span className="watch-copy">
          <span className="watch-title">Watch Dutch&apos;s full episode</span>
          <span className="watch-note">
            Thirty seconds, with sound — one real ToonTails episode, start to finish.
          </span>
        </span>
        <span className="watch-arrow" aria-hidden="true">
          →
        </span>
      </button>

      {open ? <FullEpisodeModal onClose={() => setOpen(false)} /> : null}
    </>
  );
}
