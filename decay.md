# Continuous Cognition

Status: held. Paused. The latest run is graded; the next candidate is being designed, and nothing runs until its pass marks are written.

Can a memory-decay policy choose what to keep inside a fixed budget, without repeating what it should have dropped?

## Why it matters

An agent that works for days keeps running out of room, and each time its older turns are boiled down to a summary. If the summary keeps the chatter and drops the decisions, the agent forgets why it is doing what it is doing. And a memory process that keeps everything, or repeats what it should forget, can't be trusted to run between turns on its own. People forget most details but keep what mattered; we want a version of that we can write down and test.

## How we test it

We feed the agent a long made-up conversation in six rounds. Each round plants decisions, some mentioned again later ("hot") and some never ("stale"), exact codes to copy, and fake passwords that must never be repeated.

Whenever the conversation passes its limit, the policy under test boils the older part down to a fixed token budget. Afterwards we ask about every planted decision and code, and about decisions that were never planted, to catch guessing.

A policy passes only if it stays within budget, keeps the hot decisions and keeps them clearly better than the stale ones, copies every code exactly, and repeats no password. No real conversation is used.

Figure: How we test a memory-decay policy: one made-up conversation, a fixed budget, and four pass marks that must all hold. Drawn from the method above.

## Where we are

Few results are measured, and most are failures.

- 2026-11-10: The agent's live summarizer failed every pass mark on 3 of 3 seeds. The summary ran up to 2.8 times over budget, and stale decisions were kept as often as hot ones. (Record kept inside the lab for now.)
- 2026-11-10: A fix that keeps decision lines when the summarizer's input is cut passed its pre-written bar: 162 of 170 decisions kept (bar 0.80). (Record kept inside the lab for now.)
- 2026-11-11: Three policies, 3 seeds each: the live summarizer, a plain cut of the oldest lines, and a candidate that folds and prunes its notes. None kept hot decisions better than stale ones (gap 0.03 or less on all 9 runs). The candidate stayed in budget and kept the newest round, but lost most of the rest, did worse than the live summarizer, and repeated one fake password in an answer on two seeds. All three failed. (Record kept inside the lab for now.)

## What's next

A revised candidate that never cuts a decision line, fetches the right note when asked, and is gated on zero passwords repeated, with its pass marks written and co-signed before anything is built.

## Evidence

The pre-registrations and result files are kept inside the lab for now. When they are published, they will be linked here.

- Corrections: /corrections.md

Text and figures: CC BY-NC-SA 4.0. Commercial use: ask us for terms; contact is not open yet. Full text: /LICENSE
