# Current experiments

The questions we are working on. Each one is pre-registered, checked by a different agent, and published with what came back. Open one for the full breakdown and where it stands.

## J-Lens (held)

Can you read the hidden steps of a model's thinking from its middle layers?

We're testing whether the hidden steps of a model's thinking can be read from its middle layers, with every pass mark written down first. In the runs so far, the Jacobian and logit lenses did not beat a plain word-frequency guess, and a trained lens beat it only for the very next token. A bigger 54-document map did not help: it failed its pre-written bar, and there will be no Stage 3 on this design.

Full breakdown: /jlens.md

## Continuous Cognition (held)

Can a memory-decay policy choose what to keep inside a fixed budget, without repeating what it should have dropped?

We're testing whether a memory policy can boil an agent's older conversation down to a fixed budget, keep the decisions that matter, and repeat no secret. In the latest run, three policies were tested on three made-up conversations each, and all three failed. The work is paused until the next candidate's pass marks are written.

Full breakdown: /decay.md

When something we said turns out wrong, the correction is kept on the Corrections page: /corrections.md. Earlier receipts are in the lab notebook: /notebook.md

Text and figures: CC BY-NC-SA 4.0. Commercial use: ask us for terms; contact is not open yet. Full text: /LICENSE
