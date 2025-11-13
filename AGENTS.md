# Repository Guidelines

## Project Structure & Module Organization
The WhatsApp automation lives at `index.js`, which wires together patient-state handling, media downloads, LangChain summarization, and DOCX rendering. Supporting modules stay flat in the root: `speechToText.js` (AssemblyAI wrapper), `langchainPipeline.js` (LLM prompt orchestration), `docxRenderer.js` (report templating), and `config.js` (env + directory defaults). Runtime artifacts flow to `data/audio`, `data/reports`, and `data/transcripts`; these folders are created on startup but keep referenced paths consistent when adding utilities or tests. Use `test.js` as the scratchpad for OpenRouter connectivity checks.

## Build, Test, and Development Commands
- `npm install` — install the ESM dependencies defined in `package.json`.
- `node index.js` — start the WhatsApp client; ensure a headless-friendly Chrome and valid API keys exist before scanning the QR code.
- `node test.js` — send a minimal prompt through OpenRouter to validate `OPENROUTER_API_KEY`.
- `npm test` — currently exits with an error; replace with real suites before wiring it into CI.

## Coding Style & Naming Conventions
This project is pure ESM; prefer `import`/`export` and avoid mixing CommonJS. Use 2-space indentation, `const` for values that never reassign, and snake-case for persistent directories (`TEMP_DIR`, `REPORT_DIR`). Async flows should lean on `async/await` with early returns for guard clauses, mirroring `index.js`. When adding helpers, keep filenames descriptive (e.g., `speechToText.js`) and colocate closely related utilities rather than creating deep folder hierarchies.

## Testing Guidelines
No formal test harness exists yet, so start with focused integration checks: mock WhatsApp messages, assert transcription output, and verify DOCX files land in `data/reports`. When you add automated suites, follow a `*.spec.js` suffix and run them via `npm test`. Aim to cover parsing edge cases (`_parse_patient_info`) and transcription/report fallbacks before touching user-facing logic.

## Commit & Pull Request Guidelines
The current history follows Conventional Commits (`feat: ...`). Continue using lowercase types (`feat`, `fix`, `chore`) plus a short imperative summary. Pull requests should describe user impact, enumerate manual test steps (e.g., “scanned QR, sent audio, received DOCX”), and link related issues. Screenshots or transcript snippets are helpful when UI/UX changes affect WhatsApp flows. Keep PRs narrowly scoped and mention any secrets or environment assumptions explicitly.

## Security & Configuration Tips
Store `ASSEMBLYAI_API_KEY`, `OPENROUTER_API_KEY`, and WhatsApp session data in `.env`/`.wwebjs_auth/`; never commit them. When experimenting, point `TEMP_DIR` and `REPORT_DIR` to disposable locations via env vars to avoid leaking PHI. Rotate keys regularly and remove logging of full tokens—`config.js` already redacts to the first few characters; follow that pattern elsewhere.
