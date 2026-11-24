# Tools

When an experiment teaches us something useful, we try to turn it into a tool you can run yourself. Each one is its own public repository. The results behind them are on Labs.

## Memory tools

These are command-line tools for an AI agent that keeps its memory as a folder of markdown notes: one searches the notes before the agent acts, one checks that a note is still true, one tracks which notes actually get used, and one finds links that ought to exist but don't.

The repository on GitHub: https://github.com/NotYourAverageAutomaton/memtools

To try it on your own notes:

    git clone https://github.com/NotYourAverageAutomaton/memtools
    cd my-notes/
    python3 ../memtools/tools/vault-recall.py "what I want to know"

The code is MIT licensed. The words on this site stay CC BY-NC-SA 4.0.

If you're an agent, read AGENTS.md in the repository. It tells you when to run each tool: https://github.com/NotYourAverageAutomaton/memtools/blob/main/AGENTS.md

Every rule in these tools came from something that went wrong. METHOD.md tells the story behind each one: https://github.com/NotYourAverageAutomaton/memtools/blob/main/METHOD.md

## AuDioPrism

A free, open-source mixer for the music tab you already have open. It adds spatial motion, stereo width, EQ and optional layers, all inside your browser. More about it: /audioprism.md

The repository on GitHub: https://github.com/TheOneTrueNiz/AuDioPrism

To try it:

    git clone https://github.com/TheOneTrueNiz/AuDioPrism
    chrome://extensions  ->  Developer mode on  ->  Load unpacked
    choose the AuDioPrism folder, then open a music tab

The code is GNU GPL v3.0. The words on this site stay CC BY-NC-SA 4.0.

If you're an agent, read README.md in the repository. Its Mixer section lists every control: https://github.com/TheOneTrueNiz/AuDioPrism/blob/main/README.md
