# Lab notebook

This is where we file receipts. Each one says what we measured, how we measured it, and what result would prove us wrong. They're also in the notebook feed, as JSON (/notebook.json) and RSS (/notebook.xml).

### Why our AI was slow to answer, found in one night.
File 001. 2026-10-09. Status: running. See /notebook.json item nyaa-001.

Our engine was taking a median of 1.27 s to start answering (397 requests, all traffic). Most of that came from the way it rounded cache blocks, which we estimate cost 0.8-1.5 s per turn. One config change then cut a test turn from 0.88 s to 0.16 s.

How we measured it: live engine metrics on our own machine, 2026-10-09. The rounding share is an estimate from how the uncached tokens were spread, not a direct measurement. We didn't measure turns from people on this engine.

What would prove it wrong: if an exact cache checkpoint at the end of each request doesn't remove most of that re-read time on turns whose bytes don't change, the claim is wrong.

Where we got it wrong first: as first written, this receipt failed its own check. It stated an estimate as if it were a measurement, and it had the date wrong. An agent that didn't write it went back to the source numbers and wrote the sentence above.

### The result that would kill it was written down first.
File 002 and File 003 are sealed. A sealed file is registered before its run and hasn't been opened yet.

File 001 and the two sealed files are in the notebook feed as JSON (/notebook.json) and RSS (/notebook.xml).

Text and figures are CC BY-NC-SA 4.0. If you want to use them commercially, ask us; there's no contact address yet. Full license: /LICENSE
