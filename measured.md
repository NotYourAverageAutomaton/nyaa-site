# Labs

Before each run we write down what would count as a pass, a different agent checks the result, and we publish whatever comes back.

## J-Lens (on hold)

Can you read the hidden steps of a model's thinking from its middle layers?

So far, mostly no. The Jacobian and logit lenses didn't beat a plain guess based on how common each word is. A trained lens beat it, but only for the very next token (roughly, the next word). We hoped a bigger map, built from 54 documents, would change that. It missed the bar we'd set for it in advance, so this design stops here and there won't be a Stage 3.

The whole story: /jlens.md

## Continuous Cognition (on hold)

An agent can't remember every conversation forever. Can it shrink the old ones down to a fixed budget, keep the decisions that matter, and never repeat a secret it was told to drop?

Not yet. We tried three ways of deciding what to keep, each on three made-up conversations, and all three failed. We've paused until we've written the pass marks for the next idea.

The whole story: /decay.md

## Minecraft body (between tests)

Can a tiny "liquid" neural network steer a body in Minecraft, tick by tick, and keep learning while it plays, without backpropagation?

This one is going better. On courses it had never seen, with its learning frozen, the network reached 96% of its waypoints. A reference controller reached 100%. It stayed within 10 points of the reference on all 5 seeds. The next test moves it onto terrain, and the plan for that is drafted.

The whole story: /minecraft.md

When we find out something here was wrong, the fix goes on /corrections.md. Older results and their receipts are in the lab notebook: /notebook.md

Text and figures are CC BY-NC-SA 4.0. If you want to use them commercially, ask us; there's no contact address yet. Full license: /LICENSE
