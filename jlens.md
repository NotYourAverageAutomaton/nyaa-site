# J-Lens

Status: running.

Can you read a model's next words from its middle layers?

![A beam of white light crossing a dark hall through a long row of hanging glass drops, each tinted a different colour.](/img/jlens-hero-1664.jpg)
AI-generated image (Qwen-Image-2512).

## Why it matters

A 2026 paper, 'Verbalizable Representations Form a Global Workspace in Language Models' (Gurnee et al., arXiv 2607.15495), introduced the Jacobian lens: a way to read a model's middle layers as words. A finding like that is only as strong as its replications on other models. We tried it on a different model, Swift 1.5 27B, a fine-tune of Qwen 3.8 27B, and wrote the pass marks down before each run, so that either outcome would count.

## How we test it

We build the lens, a map from each middle layer of the model to its final answer, from a set of documents.

We score it on six documents it has never seen: how often its top guess is among the text's next tokens, compared with a plain word-frequency guess and with the logit lens, and how far it lands from the model's final answer.

Every pass mark is written down before the run, and a different agent, one that did not run the test, grades it. When a number turns out wrong, the correction stays in the repo beside the claim.

Figure: How we test the J-lens: three readers of the model's middle layers, each scored against the model's own answer. Drawn from the method above.

## Where we are

- 2026-11-03: Built the measuring instrument. Its first two tests were later withdrawn as proof, when we found a bug in our own checker. (CLAIMS.md rows 1.1 to 1.7, 4.2)
- 2026-11-04: First map, from 6 documents. The first pre-registered test failed its bar: in layers 20 to 44 the lens found well under 1 of the next 10 tokens. (CLAIMS.md rows 2.1, 2.2, 2.7)
- 2026-11-05: A random-probe shortcut for building the map failed its bar: its top guess matched the exact map 70%, 60% and 37% of the time at three layers, against a pass mark of 90%. (CLAIMS.md rows 3.1)
- 2026-11-06: Found a bug in our own checker: its answer-key copy of the model had no causal mask, so it could read ahead. The two tests that ran on it were withdrawn as proof. (CLAIMS.md rows 4.1, 4.2)
- 2026-11-07: Map rebuilt from 22 documents. It cleared its pre-written bar against the 6-document map (the score it used was later judged too easy), but in the middle layers it is still worse than the logit lens. (CLAIMS.md rows 5.2 to 5.4)
- 2026-11-10: A blend that is mostly the logit lens with a small dose of the map lands about 8% closer to the model's own final answer on fresh text (reported only; no pass mark was set for it in advance). Reading past the very next token worked for no method. (CLAIMS.md rows 6.1, 6.4, 6.6)
- Running: A bigger map: 54 documents instead of 22, planned over seven nights, with its pass mark signed before the run. Nobody looks at the result until it is finished. It tests whether more data improves the Jacobian lens against the logit lens; it does not re-test reading past the next token. Stage 2 is running. As of the morning of 12 November 2026, 15 of the 32 new documents are fitted, about five a night. The pass mark was signed before the run, and nobody looks at the result until all 32 are in. (CLAIMS.md row 6.10)

## What's next

A bigger map: 54 documents instead of 22, planned over seven nights, with its pass mark signed before the run. Nobody looks at the result until it is finished. It tests whether more data improves the Jacobian lens against the logit lens; it does not re-test reading past the next token.

## What we found so far

### Results so far, run by run.
J-Lens. Status: results so far. Not filed in the notebook yet.

At mid-depth, neither the Jacobian nor the logit lens predicts upcoming tokens better than word frequency; only the trained lens beats frequency, and only for the next token.

Next token, top-1, middle layers, 306 held-out positions: word frequency 0.075; logit lens 0.070; Jacobian lens 0.054; shrunk Jacobian lens 0.097 (not distinguishable from frequency); trained lens 0.219. One token further ahead: word frequency 0.073; every lens 0.019 or lower.

The sentence and the row were checked against the result file by a different agent, one that didn't run it. The code, the result files and one row per public claim are in CLAIMS.md: https://github.com/NotYourAverageAutomaton/j-lens/blob/main/CLAIMS.md

Figure: Does our map get better with more documents? Distance from the model's own answer in its middle layers, mean KL over layers 20 to 44 on six check passages, by the number of documents the map is built from. Lower is better. Bars: 1 SD across document subsets (none at 6 and 22). Blend strength was chosen on these same six passages; its never-seen result is on fresh text (not shown). The dotted curves are fits, not data. Source: dose_kl.json 6be964a0; every point is in the data file. Data file: /data/jlens-dose-points.csv

## Evidence

- CLAIMS.md: https://github.com/NotYourAverageAutomaton/j-lens/blob/main/CLAIMS.md
- prereg/: https://github.com/NotYourAverageAutomaton/j-lens/tree/main/prereg
- j-lens repo: https://github.com/NotYourAverageAutomaton/j-lens
- Corrections: /corrections.md

## Built on

Only the papers our method uses. For each: what we took, and what we did differently.

1. Wes Gurnee, Nicholas Sofroniew, Adam Pearce, Mateusz Piotrowski, Isaac Kauvar, Runjin Chen, Anna Soligo, Paul Bogdan, Euan Ong, Rowan Wang, T. Ben Thompson, David Abrahams, Subhash Kantamneni, Emmanuel Ameisen, Joshua Batson, Jack Lindsey. Verbalizable Representations Form a Global Workspace in Language Models. Anthropic, Transformer Circuits, 2026. https://transformer-circuits.pub/2026/workspace
   Took: the Jacobian lens (the average derivative of the final state with respect to a middle layer) and its layer-by-layer signature.
   Different: we built our own implementation from the paper, using the authors' code only as a check. We ran it on a different, larger model and scored it against a plain word-frequency guess.
2. Nora Belrose, Igor Ostrovsky, Lev McKinney, Zach Furman, Logan Smith, Danny Halawi, Stella Biderman, Jacob Steinhardt. Eliciting Latent Predictions from Transformers with the Tuned Lens. arXiv, 2023. https://arxiv.org/abs/2303.08112
   Took: the trained lens, as the strong comparison: the best a lens can do when it is trained for the job.
   Different: trained on our own text and scored on held-out positions against word frequency.
3. Koyena Pal, Jiuding Sun, Andrew Yuan, Byron C. Wallace, David Bau. Future Lens: Anticipating Subsequent Tokens from a Single Hidden State. CoNLL, 2023. https://arxiv.org/abs/2311.04897
   Took: reading tokens further ahead than the next one, and its top-k measure.
   Different: all positions of real text, not only the ones the model gets right, with frequency and shuffled baselines.
4. nostalgebraist. The logit lens. Blog post, 2020.
   Took: reading a middle layer straight through the model's own final output layer, with nothing learned in between.
   Different: we use it only as the simplest baseline; every other lens has to beat it.

Further reading: Hernandez et al., Linearity of Relation Decoding in Transformer Language Models, arXiv, 2023. https://arxiv.org/abs/2308.09124

Text and figures: CC BY-NC-SA 4.0. Commercial use: ask us for terms; contact is not open yet. Full text: /LICENSE
