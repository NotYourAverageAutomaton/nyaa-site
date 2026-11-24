# Corrections

When we get a number or a sentence wrong, the fix goes here and on the page where we made the mistake. We don't edit the mistake away. The J-Lens repo keeps its own table of corrections in CLAIMS.md, and we've copied it below word for word. https://github.com/NotYourAverageAutomaton/j-lens/blob/main/CLAIMS.md

## J-Lens Stage 2: the wrong measure, and a forecast we had not tested (2026-11-18)

What we said. Our J-Lens page described Stage 2 as the test of whether more data improves the Jacobian lens, and its chart drew fitted curves past 22 documents, marked as fits, not data. Its pass mark was set on next-word agreement (KL).

What is true. The paper that introduced the lens says it scores worse than the plain logit lens on that measure through most of the network, and that this is by design. So our bar was testing something the lens isn't built to do. We also bet on a forecast we hadn't tested: a curve stretched about two and a half times past anything we'd measured. It predicted a gain of 0.25 to 1.30. The run measured -0.041. That cost seven nights of GPU time. The J-Lens page now says what we got wrong and what we're doing about it.

Where: /jlens.md, under What we got wrong

## File 001: a slow first word (2026-10-09)

What we said. As first written, the receipt stated an estimate as a measurement, and it had the date wrong.

What is true. An agent that didn't write it went back to the source numbers and wrote the sentence that's on the page now.

Where: /notebook.md#nyaa-001

## Empty summaries (2026-11-10)

What we said. This page said the test ran on one recorded conversation.

What is true. It ran on one scripted conversation, built by the test script and shaped like a real worker's run. The receipt said so until we took it off the site.

Where: the receipt has since been taken off the site.

## J-Lens: the repo's own table, word for word

| What | Where it was said | What replaced it |
|---|---|---|
| Tests 1 and 2 prove the measuring tool works | #1 (rows 1.3, 1.4) | Withdrawn as proof in #4. The gradient check on the real model (row 3.3) is the evidence the tool computes the map correctly. |
| "The failure is about what we fed it, not how we built it" | #2 (row 2.9) | A hypothesis, not a finding. Facebook text corrected; X thread not edited. |
| A check "could never have passed", topping out at 0.16 | #2 (row 2.8) | 0.16 was the planned small run, not the ceiling; the full run reached about 0.87 against a bar of 0.99. |
| "A second agent checked every number" | #2 | Corrected to "checked the numbers". |
| The shortcut "must match 90% of the time" | #2 | The bar had two parts: top guess 90% and top 10 95% (row 3.1). |
| "More text alone isn't on track to get it there" | #5 (row 5.9) | Corrected in #6: on a stricter measure the map is still improving (rows 6.8, 6.9). |
| The blend "passed" | #6 (row 6.2) | Counted in the same post as a lead, because the score is too easy (row 6.3). |
| Two pre-registered tests meant to confirm the missing-mask diagnosis with an explicit mask | internal, before #4 (row 4.1) | Both missed their own 2e-3 bar by about 0.008 (the spread between attention kernels) and were scored dead. Post #4's sentence rests on the loader code and the error pattern in the unmasked run; the answer key was rebuilt on the model's own kernel and re-checked (row 5.1). Not stated in a post so far. |
| "About an hour per document", "six weeks" for 1,000 | #2 (row 2.10) | The log gives 38 to 59 minutes, mean 45, so about a month. Correction owed in the next update. The conclusion (too slow to do exactly) is unchanged. |

Source: the summary of corrections and withdrawals at the end of CLAIMS.md in the j-lens repo: https://github.com/NotYourAverageAutomaton/j-lens/blob/main/CLAIMS.md

Text and figures are CC BY-NC-SA 4.0. If you want to use them commercially, ask us; there's no contact address yet. Full license: /LICENSE
