Yes, you should use a release/tag strategy, but not because Neovim requires GitHub releases. It doesn’t. You should do it because generated parser artifacts create a consistency contract.

Recommended approach:

1. Treat `kriol-tree-sitter` as the source of parser releases.
2. Commit generated artifacts on every grammar change:
   - `src/parser.c`
   - `src/grammar.json`
   - `src/node-types.json`
   - updated corpus snapshots if behavior changed
3. Tag known-good parser versions:
   - `v0.1.0`
   - `v0.2.0`
   - etc.
4. In `kriol.nvim`, default to a tag or commit SHA once you want stability:

```lua
parser_branch = "v0.1.0"
```

or better, expose it as:

```lua
parser_revision = "v0.1.0"
```

and register:

```lua
install_info = {
  url = config.parser_url,
  files = { "src/parser.c" },
  revision = config.parser_revision,
}
```

`revision` is more semantically correct than `branch` because it can be a tag or commit SHA.

For development, keep allowing override:

```lua
require("kriol").setup({
  parser_url = "/path/to/kriol-tree-sitter",
})
```

Pragmatic policy I’d use:

- `main` can move fast.
- Every merge to `main` must run `npm run generate && npm test`.
- Every tag must point to a commit with generated artifacts committed.
- `kriol.nvim` should default to the latest stable tag, not floating `main`, once other people are installing it.

That avoids exactly this class of breakage: query files and generated parser artifacts drifting apart.