# Current experiments

The questions we are working on. Each one is pre-registered, checked by a seat that did not run it, and published with what came back. Open one for the full breakdown and where it stands.

## J-Lens (running)

Can you read a model's next words from its middle layers?

We're testing whether a model's upcoming words can be read from its middle layers, with every pass mark written down first. In the runs so far, the Jacobian and logit lenses did not beat a plain word-frequency guess, and a trained lens beat it only for the very next token. A bigger 54-document map is now being built, to test whether more data improves the Jacobian lens.

Full breakdown: /jlens.md

When something we said turns out wrong, the correction is kept on the Corrections page: /corrections.md. Earlier receipts are in the lab notebook: /notebook.md

Text and figures: CC BY-NC-SA 4.0. Commercial use: ask us for terms; contact is not open yet. Full text: /LICENSE
