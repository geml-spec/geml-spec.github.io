---
title: Get Started
outline: [2, 3]
---

# Get Started

## Install

```sh
npm i -g @geml/geml        # Node 22+
geml --version
```

No install: prefix any command with `npx -y @geml/geml`.

## Start on the Markdown you have

Every heading in a `.md` file is already an address. Nothing is converted and no new file appears (until you save a history revision).

```sh
geml list  README.md                    # every section: address, kind, line range
geml find  'a phrase you remember' README.md   # which section holds it — an address, not a line number
geml get   README.md '#installation'    # one section, nothing else
geml set   README.md '#installation' --in new.md   # replace that section; every other byte stays
geml replace README.md 'old text' 'new text'       # swap a string, told which section held it
geml check README.md                    # a link to a section that does not exist is an error, exit 1
```

Every write re-checks the document first. If the new content would break it — a reference to nothing, a duplicate id — nothing is written and the exit code says so:

```console
$ geml set plan.md '#risks' --in bad.md
error: replacement would break the document: unresolved reference `#checksum-job` (line 30); not written
```

Keep a history and roll one section back, leaving the edits made elsewhere alone:

```sh
geml history save plan.md -m "before the agent run"
geml revert plan.md '#summary' --rev changed
```

## Go finer with `.geml`

When a section is too coarse — a table, a single cell, a chart that must agree with its table — write the document in GEML. One block shape carries everything:

```
=== table {#fy25 format=csv header=1}
Segment,  Q1, Q2, Q3, Q4
Cloud,     8, 10, 12, 14
Platform,  5,  6,  7,  9
===

=== view {#fy25-total src=#fy25 compute="FY = Q1 + Q2 + Q3 + Q4"}
===

=== diagram {#rev format=geml-chart data=#fy25-total type=bar x=Segment y=FY}
===
```

```console
$ geml get fy.geml '#fy25[1]["Q3"]'
12
$ printf '11' | geml set fy.geml '#fy25[2]["Q4"]' --in -
wrote fy.geml
$ geml fy.geml --to md          # project it back to Markdown, totals filled in
```

The [cheat sheet](/cheat-sheet) lists every construct; the [specification](/reference/spec) is normative and short enough to read in a sitting.

## Set up an agent

**Claude Code — one command.** Installs the authoring skill, the CLI and the MCP server, user-global; edits no settings, installs no hooks.

```sh
npx -y @geml/geml skill install
```

**Any MCP client.** The server exposes eleven tools named after the CLI verbs (`geml_list`, `geml_find`, `geml_get`, `geml_set`, …). A refused write comes back as structured diagnostics with the file unchanged; every write first records a `.gemlhistory` revision.

```sh
claude mcp add --scope user geml -- npx -y @geml/geml mcp --root .
```

```json
{
  "mcpServers": {
    "geml": { "command": "npx", "args": ["-y", "@geml/geml", "mcp", "--root", "."] }
  }
}
```

Plugins are packaged for Claude Code (`claude plugin marketplace add geml-spec/geml`), Codex and DeepSeek Harness. Details: [Claude Code & MCP](/guide/mcp).

## See it rendered

- **Browser:** the [Chrome extension](https://chromewebstore.google.com/detail/opmhfphgoidpnipphfgkhhjhmnmaenie) renders any raw `.geml` link in place — computed tables, charts, Mermaid, math, diagnostics as a banner. Try it on [the specification itself](https://raw.githubusercontent.com/geml-spec/geml/main/spec/in_geml_format/GEML-spec.geml).
- **Playground:** [edit on the left, rendered on the right](/playground/), and watch the verdict go red the moment a reference breaks.
- **Editors and tools:** VS Code, Obsidian, Logseq and IntelliJ integrations live under [`integrations/`](https://github.com/geml-spec/geml/tree/main/integrations).

## Your codebase as documents

```sh
geml codemap build      # detect languages → index → one merged call graph, as GEML documents
geml codemap serve      # open the graph in your browser
```

Every method is a block with an id; `#calls` and `#called-by` edges run both ways, so "who calls this" and "what does this call" are one `geml get` away — for a person in the shell or an agent over MCP. TypeScript and JavaScript need no setup; other languages take one Joern download.
