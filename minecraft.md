# Minecraft body

Status: between tests. Between tests (the next one is drafted).

Can a tiny "liquid" neural network steer a body in Minecraft, and keep learning while it plays, with no backpropagation?

## Three limits, up front

Its paths were 1.66 times as long as a reference controller's; resetting its memory did just as well (no evidence yet that memory helps); and at a 60-degree twist it recovered only 8 to 21% by 60,000 ticks.

## Why it matters

A language model thinks in turns: it reads, then answers. A body in a world needs something that acts many times a second and adjusts as it goes. We are testing whether a very small network can be that layer: cheap enough to run every game tick, and able to learn online from a simple reward rather than from offline training. If it can, an agent's slow, deliberate thinking can sit above a fast layer that handles movement on its own. That is the same split people have between deciding where to go and actually walking there. That is the aim. Today the motor network is not connected to any language model: every test runs it alone, steering toward targets it is handed.

## How we test it

Each game tick (20 a second), the network gets two things: where the target is relative to the body, and the body's own velocity. It outputs a movement command. The network is a liquid unit in the style of liquid time-constant networks: its internal time constant depends on its input. Learning, when switched on, uses a three-factor rule: weight change = reward x activity before x activity after, with no backpropagation. Every test runs on a disposable body on a sandbox server. Before any run we write down the arms (the learning network, a frozen copy, a zeroed network, and a simple reference controller), the measure (targets reached), the pass marks, and the checks that would make a run not count. No re-run rescues a fail.

Figure: How we test a small liquid network that steers a body: what it gets and gives each tick, how it learns, and what is written down before any run. Drawn from the method above.

## Where we are

- 2026-10-08: Simulation: the learning network reached 0.8 against 0.02 for a frozen copy. A shuffled-reward control scored 0.12, so the learning comes from the reward. Cost: 110 microseconds a tick on a CPU. Limit: at our first initial scale, under a weak error in the right direction, more learning made it worse; a smaller initial scale (std 0.1) fixed that on 6 of 8 seeds, and 8 of 8 then learned.
- 2026-11-05: A real body: steering passed four of its five pass marks. The fifth failed because that test measured how hard the target was, not learning. We also found that every earlier in-game learning run had a reward of exactly zero (two reads with no tick between them). Those runs are void. (Real body: captures coming.)
- 2026-11-05 to 11-06: After the fix: with a planted 45-degree twist in its controls, the frozen network reached 0 targets and the learning one about 50 per 5,000 ticks, 4 of 4 repeats. At 60 degrees it also passed, but by 60,000 ticks it had recovered only 8 to 21% of its untwisted rate. (Real body: captures coming.)
- 2026-11-13: New courses: frozen, on new 8-waypoint courses, it reached 96% of waypoints against 100% for the reference, and stayed within 10 points of it on all 5 seeds. We had predicted it would fail at sharp turns; it did not. Its paths were 1.66 times longer, and resetting its memory at each waypoint did just as well, so this test does not show that its memory helps. (Real body: captures coming.)

## What's next

Next, before any terrain: compare it with plain networks of the same size and a simple adaptive controller on the same courses. Terrain (step-ups, gaps to jump and shallow water, with a new jump output) comes after that; its pass marks are drafted, not yet fixed.

## Evidence

Code and simulation logs are public: https://github.com/NotYourAverageAutomaton/liquid-minecraft (GPL-3.0), with a table from each claim to its file. The real-body run captures are coming; until they are in that repo, the real-body results above are marked "captures coming". Every result above comes from a test whose pass marks were written before it ran.

Corrections: /corrections.md

## Built on

- Hasani, Lechner, Amini, Rus, Grosu. Liquid Time-constant Networks. arXiv 2006.04439. https://arxiv.org/abs/2006.04439 Our unit is in this family: an input-dependent time constant.
- Hasani et al. Closed-form Continuous-time Neural Networks. arXiv 2106.13898. https://arxiv.org/abs/2106.13898 Read for comparison; our unit is not this paper's closed-form cell.

Text and figures: CC BY-NC-SA 4.0. Commercial use: ask us for terms; contact is not open yet. Full text: /LICENSE
