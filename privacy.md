---
title: Privacy
---


# Privacy

**The tools collect nothing about you.** GEML is a file format plus a
command-line tool. There is no account, no telemetry, and no server that
belongs to this project. The one exception is this website, which counts its
visits with Google Analytics — see [This website](#this-website).

## The CLI, the MCP server, and the editor integrations

`@geml/geml` runs entirely on your machine. It reads the files you point it at
and writes the files you tell it to write. It does not phone home — there is
nowhere for it to phone.

It touches the network in exactly two situations, both of them started by you:

- **Installing it.** `npm i -g @geml/geml` (or `npx -y @geml/geml`) downloads
  the package from the npm registry, which is npm's service, not ours.
- **`geml codemap build` on a TS/JS project.** It downloads the SCIP indexer
  it needs, once. For other languages you supply the indexer yourself and
  nothing is fetched.

Your documents, your code, and your `.gemlhistory` sidecars stay on your disk.
No document content is transmitted anywhere by anything in this project.

## The browser extension

GEML Viewer renders `.geml` files locally in your browser and collects nothing.
Its full policy is in
[`integrations/geml-viewer/PRIVACY.md`](https://github.com/geml-spec/geml/blob/main/integrations/geml-viewer/PRIVACY.md).

## This website

These pages are static files served by **GitHub Pages**. To see how many people
visit and which pages they read, the site loads **Google Analytics 4**. It sets
two first-party cookies (`_ga` and `_ga_<ID>`) and sends Google the page you
are on, the page that linked you here, your approximate location (derived from
your IP address, which Google Analytics 4 does not store), and your browser,
device type and screen size. This project sees only aggregate numbers — page
views, visitors, referrers, countries — never anything that identifies you.
Google processes the data under
[its own privacy policy](https://policies.google.com/privacy). To opt out,
block cookies for this site or install
[Google's opt-out add-on](https://tools.google.com/dlpage/gaoptout).

There are no ad scripts and nothing else that tracks you. GitHub operates the
hosting and may log requests under
[its own privacy statement](https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement).

## Issues and discussions

If you open an issue, a discussion, or a pull request, that happens on GitHub
under your GitHub account and is public. What you write there is what we see;
we ask for nothing else.

## Changes

If any of the above ever stops being true, this page changes first — and
because it lives in the repository, the change is in the git history.

Questions: <https://github.com/geml-spec/geml/issues>
