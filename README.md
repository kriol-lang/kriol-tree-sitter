# tree-sitter-kriol

Tree-sitter grammar for KriolLang.

## Development

```sh
npm install
npm run generate
npm test
```

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
