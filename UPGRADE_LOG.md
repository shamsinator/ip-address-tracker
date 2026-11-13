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
Dev-only tooling, so the risk is low. Decision: wait for upstream.

## Phase 3, step 3 – ESLint 10

Source checked: ESLint `migrate-to-10.0.0.md` (v10.14.0). ESLint 9 has been
EOL since 2026-08-06 (eslint.org/version-support).

Peer support for ESLint 10 (checked per plugin):

| Plugin                              | `peerDependencies.eslint` | ESLint 10 |
| ----------------------------------- | ------------------------- | --------- |
| typescript-eslint 8.72.2            | `… \|\| ^10.0.0`          | yes       |
| eslint-plugin-react-hooks 7.1.1     | `… \|\| ^10.0.0`          | yes       |
| eslint-plugin-react-refresh 0.5.7   | `^9 \|\| ^10`             | yes       |
| eslint-plugin-simple-import-sort 14 | `>=5.0.0`                 | yes       |
| eslint-config-prettier 10.1.8       | `>=7.0.0`                 | yes       |
| eslint-plugin-prettier 5.5.7        | `>=8.0.0`                 | yes       |
| eslint-plugin-react 7.37.5          | `… \|\| ^9.7`             | **no**    |
| eslint-plugin-jsx-a11y 6.10.2       | `… \|\| ^9`               | **no**    |

Decisions (approved):

- `eslint-plugin-react`: temporary `overrides` entry
  (`"eslint-plugin-react": { "eslint": "$eslint" }`). Upstream is working on
  it (open PRs #4022 and #3979, not released).
- `eslint-plugin-jsx-a11y` → `eslint-plugin-jsx-a11y-x` 0.2.0 (fork, now under
  the eslint-community organisation, peer `^9 || ^10`). Upstream has had no
  commits since 2026-01-04, and its ESLint 10 PRs are open since February.

Deviation: with the override, `eslint-plugin-react` crashed on ESLint 10
(`contextOrFilename.getFilename is not a function` in `lib/util/version.js`)
because `settings.react.version: 'detect'` calls an API that ESLint 10
removed. An initial scan had missed this call site. A broader scan found no
other unguarded calls of removed APIs in the enabled rules
(`getJSDocComment` in component detection is wrapped in `try/catch`; it only
affects components marked via JSDoc, of which there are none). Workaround
(approved): `settings.react.version` is pinned to `'18.3'` with a comment in
`eslint.config.js`. It must be updated with React in step 7.

Packages: `eslint` 9.39.5 → 10.14.0, `@eslint/js` 9.39.5 → 10.0.1,
`eslint-plugin-jsx-a11y` 6.10.2 removed, `eslint-plugin-jsx-a11y-x` 0.2.0
added.

Config: import of `eslint-plugin-jsx-a11y-x`, `jsxA11y.configs.recommended`
instead of `flatConfigs.recommended`; rule namespace is now `jsx-a11y-x/`.

Rule set compared with ESLint 9 (`--print-config`): nothing removed, no
severity changes. Added by `eslint:recommended` 10: `no-unassigned-vars`,
`no-useless-assignment`, `preserve-caught-error`.
`no-shadow-restricted-names` now also reports `globalThis`. The jsx-a11y-x
rules match the jsx-a11y recommended set; only default options are now
printed explicitly. Sanity check with a temporary file confirmed that
`react/jsx-key` and `jsx-a11y-x/alt-text` still report.

Code changes: none. The new rules and JSX reference tracking reported
nothing.

Verification (Node 26): `npm ci` ok without peer warnings, lint 0/0, build ok
(sizes unchanged), Prettier clean, `dev` and `preview` HTTP 200.
`npm audit`: 13 moderate packages, still the single advisory
GHSA-g3hv-75wg-m249 (`minimatch` <11.0.1); ESLint 10 and jsx-a11y-x also
depend on `minimatch@^10`.

## Phase 3, step 4 – Prettier toolchain

Source checked: `prettier-plugin-tailwindcss` CHANGELOG 0.7.0–0.8.1.
Relevant changes: 0.8.0 requires Prettier ≥ 3.7 (installed: 3.10.1); 0.7.0
falls back to Tailwind v4 only when no Tailwind installation is found and
loads Tailwind relative to the input file.

Packages: `prettier-plugin-tailwindcss` 0.6.14 → 0.8.1. `prettier` stays at
3.10.1 (already latest).

Checks:

- `npx prettier --check .` and `npm run format`: no changes (no mass
  reformatting, so no separate formatting commit needed).
- Class sorting still uses the Tailwind 3 config: with a probe input,
  the custom color `text-very-dark-gray` from `tailwind.config.js` was
  sorted as a utility and an unknown class was moved to the front.
- The `format` script (single-quoted glob) works on Windows.

Config: unchanged for now. Finalised after the Tailwind 4 step
(`tailwindStylesheet` instead of the v3 config).

Code changes: none.

Verification (Node 26): `npm ci` ok without peer warnings, lint 0/0, build ok
(sizes unchanged), Prettier clean, `dev` and `preview` HTTP 200.
`npm audit`: unchanged (13 moderate, single `minimatch` advisory).

## Phase 3, step 5a – Vite 7

Source checked: Vite "Migration from v6" guide (v7.3.1 docs).

Packages: `vite` 6.4.6 → 7.3.8 (`esbuild` 0.25.12 → 0.28.2 as a Vite
dependency). `@vitejs/plugin-react` 5.2.0 already supports `^7.0.0`.

Relevant changes: Node 20.19+ / 22.12+ required (Node 26 is pinned). The
default `build.target` is now `'baseline-widely-available'`: Chrome/Edge
107, Firefox 104, Safari 16.0 (previously Chrome 87, Edge 88, Firefox 78,
Safari 14). Older browsers are no longer covered by the default build. None
of the removed features (Sass legacy API, `splitVendorChunkPlugin`,
`transformIndexHtml` `enforce`/`transform`) are used.

Config and code changes: none.

Verification (Node 26): `npm ci` ok without peer warnings, lint 0/0, build ok
(JS 255.34 kB, gzip 85.99 kB; CSS unchanged), Prettier clean, `dev` and
`preview` HTTP 200. `npm audit`: unchanged.

## Phase 3, step 5b – Vite 8 and `@vitejs/plugin-react` 6

Sources checked: Vite "Migration from v7" guide and the
`@vitejs/plugin-react` CHANGELOG (6.0.0–6.3.0).

Packages: `vite` 7.3.8 → 8.3.8 (bundles `rolldown` 1.2.19 and `lightningcss`
1.33.0), `@vitejs/plugin-react` 5.2.0 → 6.3.0. `esbuild` is now only an
optional peer of Vite and is no longer installed. That resolves the npm
11.20 `allowScripts` warning from step 1 without approving any script.
plugin-react 6 peers (`@rolldown/plugin-babel`, `oxc-transform-react`,
`babel-plugin-react-compiler`) are optional and not needed.

Relevant changes:

- Default `build.target` moves again: Chrome/Edge 111, Firefox 114,
  Safari 16.4.
- Rolldown + Oxc replace Rollup + esbuild for bundling, transforms and JS
  minification; Lightning CSS minifies CSS.
- plugin-react 6 no longer uses Babel. The config used plain `react()`
  without `babel` options, so `@rolldown/plugin-babel` is not needed.
- `build.rollupOptions` is not used, so nothing to rename.

Config and code changes: none.

Bundle size compared with Vite 7: JS 255.34 → 250.08 kB (gzip 85.99 →
83.72 kB); CSS 8.21 → 7.03 kB (gzip 2.50 → 2.47 kB). The CSS difference was
checked rule by rule: same selectors and declarations, only rewritten by
Lightning CSS (`transparent` → `#0000`, longhand → shorthand `border`,
merged `::backdrop` rule, `91.666667%` → `91.6667%`). Prefix changes match
the new target: `-moz-tab-size` dropped (Firefox 114 supports `tab-size`),
`-webkit-backdrop-filter` added to `.transition` for Safari.

Dev server check: the React Refresh preamble and `$RefreshReg$` are
injected (now via Oxc), Tailwind output is served, and `import.meta.env`
works.

Verification (Node 26): `npm ci` ok without peer warnings and without the
`allowScripts` warning, lint 0/0, build ok (542 ms), Prettier clean, `dev`
and `preview` HTTP 200. `npm audit`: unchanged.

## Phase 3, step 6 – `dotenv` removed

`dotenv` was only used as `dotenv.config()` in `vite.config.ts`; nothing
reads `process.env`. Vite loads `.env` files itself for `import.meta.env`.

Finding: `dotenv` was not just redundant but harmful. The tracked `.env` is a
template with empty values. `dotenv.config()` ran while Vite loaded the
config and put those empty `VITE_*` values into `process.env`. Vite gives
existing `process.env` variables priority over `.env` files, so values in
`.env.local` / `.env.[mode].local` were silently overridden by empty strings.

Proof with a temporary, gitignored `.env.envprobe.local` containing dummy
values (`vite build --mode envprobe`, file deleted afterwards):

- with `dotenv`: 0 of 3 dummy values in the bundle;
- without `dotenv`: 3 of 3 dummy values in the bundle.

Variables provided by the environment itself (e.g. a hosting dashboard) were
not affected, because `dotenv` does not overwrite existing variables.

Changes:

- `vite.config.ts`: removed the `dotenv` import and `dotenv.config()`.
- `package.json` / `package-lock.json`: `dotenv` 16.6.1 removed.
- `README.md`: removed `dotenv` from the dependency list.

Verification (Node 26): `npm ci` ok without peer warnings, lint 0/0, build ok
(sizes unchanged), Prettier clean, `dev` and `preview` HTTP 200.
`npm audit`: unchanged.

## Phase 3, step 7 – React 19

Sources checked: the official React 19 upgrade guide (react.dev) and the
React CHANGELOG up to 19.3.0 (no breaking changes after 19.0 that affect
this project).

Packages (upgraded together): `react` and `react-dom` 18.3.1 → 19.3.1,
`@types/react` 18.3.31 → 19.3.0, `@types/react-dom` 18.3.7 → 19.3.0.
`@vis.gl/react-google-maps` 1.10.2 has `react`/`react-dom`
`>=16.8.0 || ^19.0` in its peer range.

Codemods (official, run on `src`):

- `npx codemod@latest react/19/migration-recipe` (codemod CLI 1.18.7; runs
  `replace-reactdom-render`, `replace-string-ref`, `replace-act-import`,
  `replace-use-form-state`, `prop-types-typescript`): 0 files modified.
- `types-react-codemod@3.5.3 preset-19` (all transforms of the preset):
  0 of 13 files modified. Run with the system Node 22, because the tool only
  supports Node 18/20/22. Its CLI fails on paths with spaces (the npm cache
  under `C:\Users\Amir Shamsi`), so the exact `jscodeshift` command it prints
  was run with quoted paths.

Config: `settings.react.version` in `eslint.config.js` `'18.3'` → `'19.3'`
(pinned since step 3).

Code changes: none. `tsc` and lint passed against React 19 before the
codemods ran.

Install note: the incremental `npm install` printed a transient `ERESOLVE
overriding peer dependency` warning (React 19 next to the old
`react-dom` 18 during the install). The clean `npm ci` afterwards has no
peer warnings.

Deviation – bundle size: JS 250.08 → 329.11 kB (gzip 83.72 → 106.54 kB). The
sourcemap comparison with the same Vite 8 build shows that `axios`,
`@vis.gl/react-google-maps` and the app code are identical; the growth comes
entirely from `react-dom` 19. (React 18 shipped pre-minified production
files, React 19 ships unminified ones that Vite minifies, so per-package
source sizes are not comparable; the build output is.) CSS unchanged.

Verification (Node 26): `npm ci` ok without peer warnings, lint 0/0, build ok,
Prettier clean, `dev` and `preview` HTTP 200. `npm audit`: unchanged.

## Phase 3, step 8 – `axios` and `@vis.gl/react-google-maps`

No new major exists (checked with `npm view … dist-tags` and
`npm-check-updates --target latest`): `axios` 1.21.1 and
`@vis.gl/react-google-maps` 1.10.2 are the latest releases, and their minors
were already applied in phase 2. Nothing to do, no commit.

## Phase 3, step 9 – Tailwind CSS 4

Source checked: the official Tailwind CSS v4 upgrade guide.

Tool: `npx @tailwindcss/upgrade@4.3.5` on a clean tree. Its changes, reviewed:

- `tailwind.config.js` → `@theme` in `src/index.css` (custom colors
  `very-dark-gray`/`dark-gray`, font `rubik`, unused font size `input`).
  Default breakpoints are unchanged (`sm` 640px, `md` 768px).
- `@tailwind base/components/utilities` → `@import 'tailwindcss'`.
- Added a compatibility block that keeps the v3 default border color.
- Renames: `rounded` → `rounded-sm`, `focus:outline-none` →
  `focus:outline-hidden` (same output as v3).
- Reverted: the tool rewrote `hover:bg-veryDarkGray` to
  `hover:bg-very-dark-gray`. The v3 build contained no hover rule for this
  button, so that would have added a new hover effect. Kept the original
  (still non-functional) class; see open items.
- PostCSS config: the tool could not migrate it (dynamic JS); done manually.

Manual changes:

- `vite.config.ts`: `@tailwindcss/vite` plugin instead of the inline PostCSS
  `tailwindcss()` plugin.
- Removed `postcss.config.cjs` (it was already ignored by Vite since the
  inline PostCSS config took precedence), `autoprefixer` and the direct
  `postcss` devDependency. `postcss` remains only as a dependency of Vite.
- `src/index.css`: `@import 'tailwindcss' source('.')`, so only `src` is
  scanned, as with the v3 `content` setting. Without it, v4's automatic
  detection also picked up words from `README.md`/`UPGRADE_LOG.md` and
  generated `contents`, `h-160`, `transform` and `border`.
- `src/index.css`: compatibility styles from the upgrade guide for the
  placeholder color (`gray-400`) and `cursor: pointer` on buttons, both
  changed defaults in the v4 Preflight.
- `src/components/MapSection.tsx`: removed `h-160`. It produced nothing in
  v3 but would become `height: 40rem` in v4.
- `src/components/SearchForn.tsx`: added `bg-white` to the input. The v4
  Preflight sets `background-color: transparent` on inputs (v3 only did that
  for buttons), which would have made the search field show the header
  pattern.
- `.prettierrc`: `"tailwindStylesheet": "./src/index.css"` (finalises step 4).
  With the v4 sort order one class list changed
  (`src/components/DataItem.tsx`, `uppercase` after the color). Kept in the
  same commit, contrary to the plan of a separate formatting commit, because
  without it this commit itself would fail lint (`prettier/prettier`) and
  `prettier --check`.

Visual comparison with the v3 build: both builds served side by side and
rendered in headless Chrome 157 (all non-localhost requests blocked, so
both show the same loading state with fallback font) at 375×812 and
1440×900. For all 30 elements outside the map container, position, size
and 26 visual properties were compared, with colors normalised to RGB.

- Position and size: identical for every element at both widths.
- Remaining differences: placeholder color 156,163,175 → 153,161,175 and
  divider color 209,213,219 → 209,213,220 (v4's oklch palette), and extra
  transparent layers in the `shadow-lg` value (same rendering).
- Screenshots: visually identical.
- The utility set is identical to v3 apart from the two renames.

Browser support: Tailwind 4 requires Safari 16.4, Chrome 111 and Firefox
128, which is stricter than the Vite 8 default target for Firefox (114).

Bundle size: CSS 7.03 → 11.74 kB (gzip 2.47 → 3.35 kB), due to the theme
variables, `@property` rules and cascade layers that v4 always emits. JS
unchanged.

Verification (Node 26): `npm ci` ok without peer warnings, lint 0/0, build ok,
Prettier clean (`npm run format` gives no further changes), `dev` and
`preview` HTTP 200. `npm audit`: unchanged.

## Phase 3, step 10 – TypeScript 6 (staying on 6, not 7)

Source checked: the official TypeScript 6.0 release notes, including
"Breaking Changes and Deprecations" and "Preparing for TypeScript 7.0".

Package: `typescript` 5.9.3 → 6.0.3, range `~6.0.3`. A caret range would
also accept a future 6.1, which falls outside the `typescript-eslint` peer
range (`>=4.8.4 <6.1.0`).

Relevant changes checked against this project:

- New defaults: `strict: true` (already set), `module: esnext`, floating
  `target` (both set explicitly), `noUncheckedSideEffectImports: true` (the
  CSS side-effect imports are declared by `vite/client`), `types: []` (no
  global `@types` packages are needed; `vite/client` is referenced via
  `src/vite-env.d.ts`), `rootDir` defaults to `.` (irrelevant with
  `noEmit`).
- Deprecated options (`target: es5`, `baseUrl`, `moduleResolution
node/classic`, `esModuleInterop false`, `allowSyntheticDefaultImports
false`, `outFile`, AMD/UMD/SystemJS): none are used. No
  `ignoreDeprecations` needed.

tsconfig change: `lib` `["ES2020", "DOM", "DOM.Iterable"]` →
`["ES2020", "DOM"]`, because `DOM.Iterable` is now included in `DOM`.
`tsconfig.node.json` is unchanged (`allowSyntheticDefaultImports: true` is
still valid).

Code changes: none. `tsc` passes for both `tsconfig.json` and
`tsconfig.node.json` without errors or deprecation warnings.

TypeScript 7: not adopted. `typescript` 7.0.2 is available, but the
installed `typescript-eslint` 8.72.2 only supports `>=4.8.4 <6.1.0`
(re-checked at the end of this step). No side-by-side alias was added.
To upgrade later: wait for a `typescript-eslint` release whose
`peerDependencies.typescript` includes 7.x, then update both together.

Verification (Node 26): `npm ci` ok without peer warnings, `tsc` ok for both
configs, lint 0/0 (no unsupported-version warning from typescript-eslint),
build ok (sizes unchanged), Prettier clean, `dev` and `preview` HTTP 200.
`npm audit`: unchanged.

## Open items

- Local system Node is 22.15.0; install Node 26 (e.g. via nvm-windows or
  the official installer) so `npm` matches `engines`. On Node 22, npm prints
  an `EBADENGINE` warning but still installs.
- TypeScript stays on 6.0 until `typescript-eslint` supports 7.x.
- Search button hover effect (`hover:bg-veryDarkGray`): to be handled
  separately, after the upgrade (decision after step 9).
- Temporary: `overrides` for `eslint-plugin-react` and the pinned
  `settings.react.version`. Remove both once `eslint-plugin-react` releases
  ESLint 10 support (PR #4022), and switch back to `'detect'`.
- `minimatch` advisory GHSA-g3hv-75wg-m249 (waiting for upstream).
- Pre-existing, out of scope: searching by domain is not implemented (input
  validation only accepts IPv4, and the regex has no `$` anchor).
- Pre-existing, out of scope: the search button's `hover:bg-veryDarkGray`
  never worked (no such color). The intended class is probably
  `hover:bg-very-dark-gray`, which would add a visible hover effect.
  (`h-160` was removed in step 9.)
- Correction to phase 0: the tracked `.env` does **not** contain real API
  keys. All three values are empty in every commit that touched the file
  (checked in step 6). The phase 0 redaction hid that the values were empty.
  Real keys belong in `.env.local` (gitignored via `*.local`), which works
  correctly since step 6.
