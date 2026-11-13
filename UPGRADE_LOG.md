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

## Phase 3, step 1 – Node 26

Chosen version: Node 26 (Lithium, Active LTS; v26.13.1 at the time of
writing, bundled with npm 11.20.0). It satisfies the final requirement
`^20.19 || ^22.13 || >=24`.

Changes:

- `.nvmrc` (new): `26`.
- `package.json`: `"engines": { "node": ">=26" }`.
- `README.md`: prerequisite changed from "Node.js (>=16.x)" to Node.js 26.
- `package-lock.json`: root `engines` added; npm 11.20 also pruned an orphaned
  `@types/node` 20.14.5 / `undici-types` entry (only referenced as an
  optional peer of Vite, never installed by any dependency).

No CI or hosting configuration exists, so there was nothing else to update.

Verification ran on a portable, SHA256-verified Node v26.13.1 (no version
manager is installed locally; the system Node is still 22.15.0): `npm ci` ok,
lint 0/0, build ok (sizes unchanged), Prettier clean, `dev` and `preview`
HTTP 200. `npm audit`: 6 moderate (unchanged).

New warning with npm 11.20: `esbuild@0.25.12` has a postinstall script that
is "not yet covered by allowScripts". Not approved, because that is a
configuration change. esbuild works without it (the binary comes from the
optional `@esbuild/win32-x64` package). Revisit in step 5, because Vite 8 may
no longer need esbuild.

## Phase 3, step 2 – ESLint 9 with flat config

Sources checked: ESLint `migrate-to-9.0.0.md` (v9.39.5), changelogs of
`eslint-plugin-simple-import-sort` (13, 14), `eslint-plugin-react-refresh`
(0.5.x), `eslint-config-prettier` (10.x) and the `eslint-plugin-react-hooks`
README. The exports of the installed plugins were checked before writing the
config.

Packages:

| Package                          | Before | After         |
| -------------------------------- | ------ | ------------- |
| eslint                           | 8.57.1 | 9.39.5        |
| @eslint/js                       | –      | 9.39.5 (new)  |
| globals                          | –      | 17.14.0 (new) |
| typescript-eslint                | –      | 8.72.2 (new)  |
| @typescript-eslint/eslint-plugin | 7.18.0 | removed       |
| @typescript-eslint/parser        | 7.18.0 | removed       |
| eslint-plugin-import             | 2.32.0 | removed       |
| eslint-plugin-react-hooks        | 4.6.2  | 7.1.1         |
| eslint-plugin-react-refresh      | 0.4.26 | 0.5.7         |
| eslint-plugin-simple-import-sort | 12.1.1 | 14.0.0        |
| eslint-config-prettier           | 9.1.2  | 10.1.8        |
| eslint-plugin-prettier           | 5.5.7  | 5.5.7         |
| eslint-plugin-react              | 7.37.5 | 7.37.5        |
| eslint-plugin-jsx-a11y           | 6.10.2 | 6.10.2        |

Replaced packages:

- `@typescript-eslint/parser` + `@typescript-eslint/eslint-plugin` →
  `typescript-eslint` (v8 meta package).
- `eslint-plugin-import` removed: none of its rules was enabled (decision
  from phase 0).

Config:

- `.eslintrc.cjs` and `.eslintignore` → `eslint.config.js` (`defineConfig`,
  `globalIgnores`, no `FlatCompat`). Ignores: `dist`, `dist-ssr`,
  `**/*.local`; `node_modules` is ignored by default.
- `lint` script: `eslint "**/*.{js,jsx,ts,tsx}"` → `eslint .`. It now also
  lints `postcss.config.cjs` and `eslint.config.js`.
- Browser globals only for `src/**`; Node globals only for the root config
  files (previously `env.node` applied to all files).
- Prettier: `eslint-plugin-prettier/recommended` (includes
  `eslint-config-prettier`), placed last.

Rule set compared with the baseline using `eslint --print-config` (65 → 135
enabled rules for `src` files; no rule weakened from error to warn):

- Newly enabled (approved in phase 0): recommended presets of
  `eslint-plugin-react` (+ `jsx-runtime`), `eslint-plugin-jsx-a11y` and
  `simple-import-sort/imports` + `exports`.
- `react-hooks` 7 `flat.recommended`: adds the 14 React Compiler rules. They
  reported nothing in this code base.
- `react-refresh/only-export-components`: `warn` → `error` (via
  `reactRefresh.configs.vite()`), which also sets
  `allowCompoundComponents: true`, a pattern Vite's fast refresh supports.
- Replaced by successor rules: `@typescript-eslint/ban-types` →
  `no-empty-object-type`, `no-unsafe-function-type`,
  `no-wrapper-object-types`; `@typescript-eslint/no-var-requires` →
  `no-require-imports`; `@typescript-eslint/no-loss-of-precision` → core
  `no-loss-of-precision`; `no-new-symbol` → `no-new-native-nonconstructor`.
- Off for TS files because `tsc` reports them (typescript-eslint
  `eslint-recommended`): `no-class-assign` (ts2629), `no-with` (ts1101).
- Upstream changes in `eslint:recommended` 9: `no-inner-declarations`
  removed; `no-constant-condition` now defaults to
  `checkLoops: "allExceptWhileTrue"`. Not re-enabled.
- `react-hooks/*` and `react-refresh/*` are scoped to `src/**`; they no
  longer run on the tooling config files, which contain no React code.
- Other "option changes" in the comparison are only defaults that ESLint 9
  now prints explicitly.

Code changes (all from new lint findings, no suppressions):

- Import order in 11 files and `vite.config.ts` (autofix of
  `simple-import-sort`). In `src/main.tsx` the side-effect import
  `./index.css` moved above the other imports, so it now loads before
  `App.css`; `App.css` is empty, so the cascade does not change.
- `src/components/MapSection.tsx`: marker `<img>` got `alt='Location marker'`
  (`jsx-a11y/alt-text`).
- `src/components/SearchForn.tsx`: `catch (error)` → `catch` (unused binding;
  ESLint 9 defaults `caughtErrors` to `"all"`).

Verification (Node 26): `npm ci` ok without peer warnings, lint 0/0, build ok
(JS 256.77 kB, gzip 86.24 kB), Prettier clean, `dev` and `preview` HTTP 200.
All ESLint 8 deprecation warnings are gone.

`npm audit`: 7 moderate, all `minimatch` <11.0.1 (GHSA-g3hv-75wg-m249) via
`@typescript-eslint/typescript-estree`, which requires `minimatch@^10.2.2`,
even in the latest 8.72.2. The `npm audit` "fix" is a downgrade to
`typescript-eslint` 8.36.0, which is also affected. A real fix needs an
`overrides` entry or an upstream release; not done without approval.
Dev-only tooling, so the risk is low.

## Open items

- Local system Node is 22.15.0; install Node 26 (e.g. via nvm-windows or
  the official installer) so `npm` matches `engines`. On Node 22, npm prints
  an `EBADENGINE` warning but still installs.
- npm 11.20 `allowScripts` warning for `esbuild` (deferred to step 5).
- `eslint@9.39.5` is flagged as "no longer supported" on install (ESLint 10
  is current); resolved by step 3.
- `minimatch` advisory via `typescript-eslint` (see step 2).
- Pre-existing, out of scope: searching by domain is not implemented (input
  validation only accepts IPv4, and the regex has no `$` anchor).
- Pre-existing, out of scope: `h-160` and `hover:bg-veryDarkGray` are not
  valid Tailwind 3 classes (relevant for the Tailwind 4 step).
- Security, report only: `.env` with real API keys is committed to git.
