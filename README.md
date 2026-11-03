# tree-sitter-kriol

Tree-sitter grammar for KriolLang.

## Development

```sh
npm install
npm run generate
npm test
```

The keywords, builtin types, booleans and builtin functions follow
[kriol-syntax](https://github.com/kriol-lang/kriol-syntax), the single source
of the language syntax. `npm test` fails when `grammar.js` or
`queries/highlights.scm` disagree with it (`npm run test:syntax` runs only that
check). After the language changes, update the `kriol-syntax` version in
`package.json` and then the grammar and the queries.

Build an optional browser/WASM parser:

```sh
npm run build:wasm
```

This writes `tree-sitter-kriol.wasm` in the repository root. The command
requires Emscripten, Docker, or Podman, as described by the tree-sitter CLI.

## Generated artifacts

Regenerate parser artifacts after changing `grammar.js`:

```sh
npm run generate
```

The generated `src/parser.c`, `src/grammar.json`, and `src/node-types.json`
should be committed with grammar changes. The repository does not maintain a
TextMate grammar; downstream editors and sites should keep any non-tree-sitter
highlighters in their own repositories.
