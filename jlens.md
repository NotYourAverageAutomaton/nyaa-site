# J-Lens

Status: running.

Can you read a model's next words from its middle layers?

## Why it matters

A 2026 paper, 'Verbalizable Representations Form a Global Workspace in Language Models' (Gurnee et al., arXiv 2607.15495), introduced the Jacobian lens: a way to read a model's middle layers as words. A finding like that is only as strong as its replications on other models. We tried it on a different model, Swift 1.5 27B, a fine-tune of Qwen 3.8 27B, and wrote the pass marks down before each run, so that either outcome would count.

## How we test it

We build the lens, a map from each middle layer of the model to its final answer, from a set of documents.

We score it on six documents it has never seen: how often its top guess is among the model's own next tokens, compared with a plain word-frequency guess and with the logit lens, and how far it lands from the model's final answer.

Every pass mark is written down before the run, and a different agent, one that did not run the test, grades it. When a number turns out wrong, the correction stays in the repo beside the claim.

## Where we are

- 2026-11-03: Built the measuring instrument. Its first two tests were later withdrawn as proof, when we found a bug in our own checker. (CLAIMS.md rows 1.1 to 1.7, 4.2)
- 2026-11-04: First map, from 6 documents. The first pre-registered test failed its bar: in layers 20 to 44 the lens found well under 1 of the next 10 tokens. (CLAIMS.md rows 2.1, 2.2, 2.7)
- 2026-11-05: A random-probe shortcut for building the map failed its bar: its top guess matched the exact map 70%, 60% and 37% of the time at three layers, against a pass mark of 90%. (CLAIMS.md rows 3.1)
- 2026-11-06: Found a bug in our own checker: its answer-key copy of the model had no causal mask, so it could read ahead. The two tests that ran on it were withdrawn as proof. (CLAIMS.md rows 4.1, 4.2)
- 2026-11-07: Map rebuilt from 22 documents. It cleared its pre-written bar against the 6-document map (the score it used was later judged too easy), but in the middle layers it is still worse than the logit lens. (CLAIMS.md rows 5.2 to 5.4)
- 2026-11-10: A blend that is mostly the logit lens with a small dose of the map lands about 8% closer to the model's own final answer on fresh text (reported only; no pass mark was set for it in advance). Reading past the very next token worked for no method. (CLAIMS.md rows 6.1, 6.4, 6.6)
- Running: A bigger map: 54 documents instead of 22, planned over seven nights, with its pass mark signed before the run. Nobody looks at the result until it is finished. It tests whether more data improves the Jacobian lens against the logit lens; it does not re-test reading past the next token. (CLAIMS.md row 6.10)

## What's next

A bigger map: 54 documents instead of 22, planned over seven nights, with its pass mark signed before the run. Nobody looks at the result until it is finished. It tests whether more data improves the Jacobian lens against the logit lens; it does not re-test reading past the next token.

## What we found so far

### Results so far, run by run.
J-Lens. Status: results so far. Not filed in the notebook yet.

At mid-depth, neither the Jacobian nor the logit lens predicts upcoming tokens better than word frequency; only the trained lens beats frequency, and only for the next token.

Next token, top-1, middle layers, 306 held-out positions: word frequency 0.075; logit lens 0.070; Jacobian lens 0.054; shrunk Jacobian lens 0.097 (not distinguishable from frequency); trained lens 0.219. One token further ahead: word frequency 0.073; every lens 0.019 or lower.

The sentence and the row were checked against the result file by a different agent, one that didn't run it. The code, the result files and one row per public claim are in CLAIMS.md: https://github.com/NotYourAverageAutomaton/j-lens/blob/main/CLAIMS.md

## Evidence

- CLAIMS.md: https://github.com/NotYourAverageAutomaton/j-lens/blob/main/CLAIMS.md
- prereg/: https://github.com/NotYourAverageAutomaton/j-lens/tree/main/prereg
- j-lens repo: https://github.com/NotYourAverageAutomaton/j-lens
- Corrections: /corrections.md

Text and figures: CC BY-NC-SA 4.0. Commercial use: ask us for terms; contact is not open yet. Full text: /LICENSE
