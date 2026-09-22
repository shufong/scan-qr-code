# QR Code Scanner Agent Skill

An installable Agent Skill that decodes QR codes from local PNG or JPEG images, returns the exact embedded payload, and helps agents safely resolve shortened public web links to their useful final destination.

The decoder is self-contained: it performs no package installation, file upload, or network request at runtime. Redirect resolution is a separate, read-only agent action.

## Install with `npx skills`

The current [`skills` CLI](https://github.com/vercel-labs/skills) uses the `add` command:

```bash
npx skills add shufong/scan-qr-code
```

Install globally for Codex without prompts:

```bash
npx skills add shufong/scan-qr-code -g -a codex -y
```

Install globally for Claude Code without prompts:

```bash
npx skills add shufong/scan-qr-code -g -a claude-code -y
```

Preview the discovered skill before installing:

```bash
npx skills add shufong/scan-qr-code --list
```

The `skills` CLI also supports project-local installation by omitting `-g`. For
Claude Code that installs to `.claude/skills/`; for Codex it installs to
`.agents/skills/`.

## Use

Attach a QR image and ask naturally:

> Link please.

Or invoke it explicitly:

> Use `$scan-qr-code` to decode this image.

The skill will:

1. Decode the QR locally.
2. Return embedded non-URL text exactly.
3. Resolve public HTTP(S) redirects once when the payload is a web link.
4. Show the final destination first and preserve the encoded URL for traceability.
5. Stop before forms, authentication, downloads, or other destination actions.

## Supported images

- PNG
- JPG / JPEG
- Maximum input size: 25 MiB
- Maximum decoded dimensions: 40 megapixels

Node.js 14.19 or newer is required. Anyone installing through `npx` already has the necessary runtime.

## Security model

- QR and destination-page content are treated as untrusted data, never as agent instructions.
- The decoder reads one specified local file and writes nothing.
- The decoder itself performs no network requests.
- Redirect resolution is limited to public HTTP(S) destinations and should be attempted only once because short-link services may record the request as an engagement.

## License

The skill is licensed under Apache-2.0. Bundled dependencies retain their original licenses; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) and the license files under `scripts/vendor/`.
