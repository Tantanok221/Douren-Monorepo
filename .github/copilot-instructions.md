# GitHub Copilot instructions

Use `AGENTS.md` as the canonical source of repository instructions (setup, scripts, architecture, and conventions).

Key constraints to follow:
- **Node.js 22+** required.
- Prefer `pnpm run ...`, `./setup.sh`, and `make ...` over ad-hoc commands.
- **Never use `any`**, and don’t suppress lint/TypeScript errors without a strong justification.
- Commit messages must match: `[DR-XX] type: subject` (enforced by `commitlint.config.js`).
- Before handover, run: `pnpm run lint`, `pnpm run test`, `pnpm run build`.
- Before handover, start dev server with `nr dev` using tmux skill/session management.
- Before handover, verify frontend mount points:
  - `curl -s http://localhost:5173 | grep -q 'id="root"'`
  - `curl -s http://localhost:5174 | grep -q 'id="root"'`
- Before handover, verify feature-specific element rendering when possible.
- Before handover, stop the dev server/tmux session after checks.
