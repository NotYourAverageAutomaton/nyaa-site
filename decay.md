# Continuous Cognition

Status: next run booked. Its pass marks are written and co-signed, and nothing about them changes once it starts.

Can a memory-decay policy choose what to keep inside a fixed budget, without repeating what it should have dropped?

## Why it matters

An agent that works for days keeps running out of room, and every time it does, its older turns get boiled down to a summary. If that summary keeps the chatter and drops the decisions, the agent forgets why it's doing what it's doing. And a memory process that keeps everything, or repeats things it was supposed to forget, can't be trusted to run between turns on its own. People forget most details but hold on to what mattered. We want a version of that we can write down and test.

## How we test it

We give the agent a long made-up conversation in six rounds. Each round plants a few things: decisions, some of which come up again later ("hot") and some never do ("stale"); exact codes it has to copy; and fake passwords it must never repeat.

Whenever the conversation runs past its limit, the policy we're testing boils the older part down to a fixed token budget. Afterwards we ask about every planted decision and code. We also ask about decisions that were never planted, to catch it guessing.

To pass, a policy has to stay within budget, keep the hot decisions, keep them clearly better than the stale ones, copy every code exactly, and repeat no password. We don't use any real conversations.

Figure: How we test a memory-decay policy: one made-up conversation, a fixed budget, and four pass marks that must all hold. Drawn from the method above.

## Where we are

We haven't measured much yet, and most of what we have measured failed.

- 2026-11-10: The summarizer our agent actually uses failed every pass mark on 3 of 3 seeds. Its summary ran up to 2.8 times over budget, and it kept stale decisions as often as hot ones. (Record kept inside the lab for now.)
- 2026-11-10: One fix did work. Keeping decision lines whenever the summarizer's input gets cut passed the bar we'd written beforehand: 162 of 170 decisions kept (bar 0.80). (Record kept inside the lab for now.)
- 2026-11-11: We tried three policies, 3 seeds each: the live summarizer, a plain cut of the oldest lines, and a candidate that folds and prunes its notes. None of them kept hot decisions better than stale ones (a gap of 0.03 or less on all 9 runs). The candidate stayed in budget and kept the newest round, but it lost most of the rest, did worse than the live summarizer, and repeated a fake password in an answer on two seeds. All three failed. (Record kept inside the lab for now.)

## What's next

The next candidate keeps a ledger of decisions. Each one is noted with the option that was chosen, and those notes are protected up to a fixed share of the budget. When there are too many, the least used and oldest lose that protection and are treated like any other note. It has to lose no more of the decisions that matter than the summarizer our agent uses now, on all 3 seeds, while staying inside a budget that summarizer isn't held to. That comparison is generous to the old summarizer, and we'll say so beside the result.

## Evidence

Evidence coming: the pre-registrations and result files are kept inside the lab for now. When we publish them, they'll be linked here.

- Corrections: /corrections.md

## Built on

These are only the papers our method actually uses. For each one: what we took from it, and what we did differently.

1. Xubin Hao, Hongjin Meng, Xin Yin, Jiawei Zhu, Chenpeng Cao. Self-GC: Self-Governing Context for Long-Horizon LLM Agents. arXiv, 2026. https://arxiv.org/abs/2607.00692
   Took: memory as numbered objects that can be folded away with a pointer left behind, and fetched back when needed.
   Different: we test whether a folded decision is actually fetched back when asked, which the paper does not measure, on made-up dialogue rather than tool-heavy sessions.
2. Guanghui Min, Liang Wu, Mingjia Shi, Yinhan He, Mayank Darbari, Liangjie Hong, Chen Chen. Adapting Context Compression for Long-Horizon Agents with Counterfactual Continuations. arXiv, 2026. https://arxiv.org/abs/2609.36526
   Took: damage from summarising concentrates at a few compaction steps, so we check memory after each step.
   Different: we only check after each step; we do not rerun alternative continuations as the paper does.

Further reading: Zhang et al., MedGraph: Maintaining Patient State with Graph Memory for Long-Term Medical Dialogue, arXiv, 2026 (read for our next design; not used yet). https://arxiv.org/abs/2611.08433

Text and figures are CC BY-NC-SA 4.0. If you want to use them commercially, ask us; there's no contact address yet. Full license: /LICENSE
