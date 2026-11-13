# Upgrade log

Branch: `chore/dependency-upgrades`. Package manager: npm (`package-lock.json`).

Verification = `npm ci`, `npm run lint`, `npm run build` (incl. `tsc`),
`npx prettier --check .`, plus a manual smoke test in `npm run dev` and
`npm run preview`.

## Phase 0 – Baseline (2026-11-13)

- Node: v22.15.0 locally, npm 11.4.2. Not pinned anywhere (no `.nvmrc`,
  `engines`, CI or hosting config). README states "Node.js (>=16.x)".
  Current LTS: v26 (Lithium).
- Build: JS 234.68 kB (gzip 78.62 kB), CSS 8.21 kB (gzip 2.50 kB).
- Lint: 0 errors, 0 warnings once line endings are ignored (see below).
- Prettier: only `README.md` failed once line endings are ignored.
- `npm audit`: 19 vulnerabilities (10 moderate, 9 high).
- Line endings: the repository stores LF, but `core.autocrlf=true` produced
  CRLF working copies. Prettier (`endOfLine: lf`) then flagged every line
  (420 lint errors, 26 files in `prettier --check`).

### Findings

- ESLint (`.eslintrc.cjs`): rules come from `eslint:recommended`,
  `@typescript-eslint/recommended`, `react-hooks/recommended` and `prettier`,
  plus `prettier/prettier` and `react-refresh/only-export-components`.
  `eslint-plugin-react` is loaded without any enabled rule;
  `eslint-plugin-jsx-a11y`, `eslint-plugin-import` and
  `eslint-plugin-simple-import-sort` are installed but not configured.
- No `eslint-disable`, `@ts-ignore`, `@ts-expect-error` or `any` in the code.
- `dotenv` is only used as `dotenv.config()` in `vite.config.ts`; nothing
  reads `process.env`, so it is redundant.
- `vite.config.ts` passes PostCSS config inline, so `postcss.config.cjs` (and
  thus `autoprefixer`) is ignored.
- `axios`: one `axios.get` plus `axios.isAxiosError`; no interceptors or
  `CancelToken`.
- `@vis.gl/react-google-maps`: `APIProvider`, `Map`, `AdvancedMarker` with
  `mapId`.
- No React 19 breaking APIs (`forwardRef`, `defaultProps`, `propTypes`,
  `useRef()` without an argument, `ReactDOM.render`, global `JSX`).

### Decisions (approved)

1. Add `.gitattributes` to enforce LF (separate commit).
2. Phase 3: enable the recommended configs of `eslint-plugin-react`,
   `eslint-plugin-jsx-a11y` and `eslint-plugin-simple-import-sort`; remove
   the unused `eslint-plugin-import`.
3. Target Node 26 (Active LTS).
4. Format `README.md` in a separate commit.

## Phase 1 – Patch

Preparation commits:

- `chore: enforce LF line endings via .gitattributes` (no content changes;
  working copy re-checked out as LF).
- `style: format README.md with Prettier` (trailing newline only).

`npx npm-check-updates --target patch -u`:

| Package                     | Range before | Range after | Installed        |
| --------------------------- | ------------ | ----------- | ---------------- |
| @types/react                | ^18.3.0      | ^18.3.31    | 18.3.3 → 18.3.31 |
| @types/react-dom            | ^18.3.0      | ^18.3.7     | 18.3.0 → 18.3.7  |
| @vis.gl/react-google-maps   | ^1.8.0       | ^1.8.3      | 1.8.3            |
| @vitejs/plugin-react        | ^5.0.0       | ^5.0.4      | 5.2.0            |
| autoprefixer                | ^10.4.21     | ^10.4.27    | 10.5.1           |
| axios                       | ^1.18.0      | ^1.18.1     | 1.18.1           |
| eslint-config-prettier      | ^9.1.0       | ^9.1.2      | 9.1.0 → 9.1.2    |
| eslint-plugin-prettier      | ^5.4.0       | ^5.4.1      | 5.5.6            |
| eslint-plugin-react-refresh | ^0.4.20      | ^0.4.26     | 0.4.26           |
| postcss                     | ^8.5.4       | ^8.5.32     | 8.5.15 → 8.5.32  |
| prettier-plugin-tailwindcss | ^0.6.12      | ^0.6.14     | 0.6.14           |
| tailwindcss                 | ^3.4.17      | ^3.4.19     | 3.4.19           |
| vite                        | ^6.0.0       | ^6.0.15     | 6.4.3            |

Most entries only raise the range floor; the lockfile already held newer
versions within the same minor.

Verification: `npm ci` ok, lint 0/0, build ok (sizes unchanged), Prettier
clean, `dev` and `preview` respond with HTTP 200. `npm audit`: 16
vulnerabilities (10 moderate, 6 high), down from 19.

Code changes: none.

## Phase 2 – Minor

`npx npm-check-updates --target minor --reject eslint-plugin-react-refresh,prettier-plugin-tailwindcss -u`
(both are 0.x "minors" and are treated as majors in phase 3):

| Package                   | Range before | Range after | Installed       |
| ------------------------- | ------------ | ----------- | --------------- |
| @vis.gl/react-google-maps | ^1.8.3       | ^1.10.2     | 1.8.3 → 1.10.2  |
| @vitejs/plugin-react      | ^5.0.4       | ^5.2.0      | 5.2.0           |
| autoprefixer              | ^10.4.27     | ^10.6.2     | 10.5.1 → 10.6.2 |
| axios                     | ^1.18.1      | ^1.21.1     | 1.18.1 → 1.21.1 |
| dotenv                    | ^16.5.0      | ^16.6.1     | 16.6.1          |
| eslint-plugin-import      | ^2.31.0      | ^2.32.0     | 2.32.0          |
| eslint-plugin-prettier    | ^5.4.1       | ^5.5.7      | 5.5.6 → 5.5.7   |
| prettier                  | ^3.5.3       | ^3.10.1     | 3.8.4 → 3.10.1  |
| typescript                | ^5.8.3       | ^5.9.3      | 5.9.3           |
| vite                      | ^6.0.15      | ^6.4.6      | 6.4.3 → 6.4.6   |

Verification: `npm ci` ok without peer warnings, lint 0/0, build ok,
Prettier clean (Prettier 3.10 produced no reformatting), `dev` and `preview`
respond with HTTP 200. `npm audit`: 11 vulnerabilities (9 moderate, 2 high).

Code changes: none. No new deprecation warnings.

Deviation – bundle size: JS 234.68 kB → 256.75 kB (gzip 78.62 → 86.12 kB).
Sourcemap comparison of unminified source per package: `axios` 145.8 →
191.7 kB, `@vis.gl/react-google-maps` 146.3 → 181.6 kB; everything else is
unchanged. This is upstream growth, not a configuration issue.

### `npm audit fix` (separate commit, lockfile only, no `--force`)

Transitive updates within existing ranges: `brace-expansion` 1.1.15 →
1.1.22 / 2.1.1 → 2.1.8, `js-yaml` 4.2.0 → 4.3.2, `postcss-selector-parser`
6.1.4 → 6.1.6, `sucrase` 3.35.0 → 3.35.1. `sucrase` 3.35.1 no longer depends
on `glob`, so the `glob@10` tree (31 lockfile entries) was pruned, and its
deprecation warning is gone.

Verification: `npm ci` ok, lint 0/0, build ok (sizes as above), Prettier
clean, `dev` and `preview` HTTP 200. `npm audit`: 6 moderate, all
`minimatch` via `@typescript-eslint` 7 (fix requires the major in phase 3,
step 2).

## Open items

- Deprecation warnings during install: `inflight`, `rimraf@3`, `glob@7`,
  `@humanwhocodes/*` and `eslint@8`, all from the ESLint 8 tree (phase 3,
  step 2).
- Remaining audit findings: 6 moderate, `minimatch` via
  `@typescript-eslint` 7 (phase 3, step 2).
- Pre-existing, out of scope: searching by domain is not implemented (input
  validation only accepts IPv4, and the regex has no `$` anchor).
- Pre-existing, out of scope: `h-160` and `hover:bg-veryDarkGray` are not
  valid Tailwind 3 classes (relevant for the Tailwind 4 step).
- Security, report only: `.env` with real API keys is committed to git.
