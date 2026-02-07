# GitHub Copilot instructions

Use `AGENTS.md` as the canonical source of repository instructions (setup, scripts, architecture, and conventions).

Key constraints to follow:
- **Node.js 22+** required.
- Prefer `pnpm run ...`, `./setup.sh`, and `make ...` over ad-hoc commands.
- Use the `but` skill (GitButler) for all git actions instead of raw `git` commands.
- **Never use `any`**, and don’t suppress lint/TypeScript errors without a strong justification.
- Commit messages must match: `[DR-XX] type: subject` (enforced by `commitlint.config.js`).
