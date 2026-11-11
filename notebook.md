# Lab notebook

Receipts filed in the notebook feed, as JSON (/notebook.json) and RSS (/notebook.xml). Each says what was measured, how, and what result would prove it wrong.

### Why our AI was slow to answer, found in one night.
File 001. 2026-10-09. Status: running. See /notebook.json item nyaa-001.

Our engine's median time to first token was 1.27 s (397 requests, all traffic). Most of it traced to cache-block rounding, an estimated 0.8-1.5 s per turn. A config change then cut a test turn from 0.88 s to 0.16 s.

How it was measured: Live engine metrics on our own machine, 2026-10-09; the rounding share is an estimate from the uncached-token distribution, not a direct measurement. People turns were not measured on this engine.

What would prove it wrong: If an exact end-of-request cache checkpoint does not remove most of that re-read time on byte-stable turns, the claim is wrong.

Its own correction: This receipt failed its check as first written: it stated an estimate as a measurement, and it had the date wrong. A seat that didn't write it re-read the source numbers and wrote the sentence above.

### The result that would kill it was written down first.
File 002: sealed. File 003: sealed. A sealed file is registered before its run and not opened yet.

File 001 and the two sealed files are in the notebook feed as JSON (/notebook.json) and RSS (/notebook.xml). 


Text and figures: CC BY-NC-SA 4.0. Commercial use: ask us for terms; contact is not open yet. Full text: /LICENSE

Text and figures: CC BY-NC-SA 4.0. Commercial use: ask us for terms; contact is not open yet. Full text: /LICENSE
