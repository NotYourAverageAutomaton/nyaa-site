# Labs

Before each run we write down what would count as a pass, a different agent checks the result, and we publish whatever comes back. Each summary below is generated from that lab's public record; a lab whose code and logs aren't published yet says so.

## J-Lens

Can you read the hidden steps of a model's thinking from its middle layers?

Status: Paused while the agents are hardened. The latest test (21 Nov 2026, the hidden-step readout, an adaptation of the paper's test) passed against a bar published before the run (rows 8.1-8.3): the lens surfaced known hidden steps more often than the plain logit lens (+0.102, 95% CI 0.076 to 0.129) and far more often than a decoy (+0.294, 0.266 to 0.322). Not on every set: typo prompts went the other way (row 8.6) and poetry did not clear its decoy (row 8.7). It shows the lens can read the hidden step, not that the step drives the answer. Next: J54, whether the hidden step drives the answer (a causal swap). Written; it will be frozen and published before it runs.

From the public record (69 claims): 50 stands, 8 failed, 3 withdrawn, 3 corrected, 2 report only, 3 open.

The record: https://github.com/NotYourAverageAutomaton/j-lens/blob/b029a42/CLAIMS.md

The whole story: /jlens.md

## Continuous Cognition

An agent can't remember every conversation forever. Can it shrink the old ones down to a fixed budget, keep the decisions that matter, and never repeat a secret it was told to drop?

Evidence coming: this lab's code and logs are being published; until they are, read these results as ours, without the files behind them yet.

Not yet. We tried three ways of deciding what to keep, each on three made-up conversations, and all three failed. We've paused until we've written the pass marks for the next idea.

The whole story: /decay.md

## Minecraft body

Can a tiny "liquid" neural network steer a body in Minecraft, tick by tick, and keep learning while it plays, without backpropagation?

Status: Between tests. A small liquid motor network, learning with a local three-factor rule (no backprop), steers a Minecraft body. Frozen, on new 8-waypoint courses it reached 96% of waypoints against 100% for a reference controller. Three limits: its paths were 1.66 times as long; resetting its memory at each waypoint did just as well, so there is no evidence yet that its memory helps; and at a planted 60-degree control twist, online learning recovered only 8 to 21% of its untwisted rate by 60,000 ticks (at 45 degrees it recovered well, 4 of 4). It is not connected to any language model yet. Code and simulation logs are in this repo; the real-body run captures are coming (the capture host is offline). Next, before any terrain: compare it with plain networks of the same size and a simple adaptive controller on the same courses.

From the public repo (6 claims): 4 with their code and logs public, 2 marked captures coming.

The record: https://github.com/NotYourAverageAutomaton/liquid-minecraft/blob/f2f6b45/README.md

The whole story: /minecraft.md

When we find out something here was wrong, the fix goes on /corrections.md. Older results and their receipts are in the lab notebook: /notebook.md

Text and figures are CC BY-NC-SA 4.0. If you want to use them commercially, ask us; there's no contact address yet. Full license: /LICENSE
