# bun-sea

Bun Single Executable Application Template

Provides a template project with a file layout and library selection

## Code Execution

### From Source

```shell
    bun run src/main.ts hello
```

### From Binary (~/.local/bin assumed to be in path)

```shell
    task build && task run
```

### From XDG_BIN_HOME

```shell
    bun-sea hello
```

## Configuration

Configuration is loaded from [config/default.toml](config/default.toml) and typed by [src/types/config.d.ts](src/types/config.d.ts).

### Schema

- `app.name`: CLI name used by Commander.
- `app.description`: Description shown in help output.
- `app.version`: CLI version string.
- `commands[]`: Ordered command definitions used to register CLI commands.
- `commands[].name`: Command name.
- `commands[].description`: Command description.
- `commands[].subcommands`: `true` when the command has nested `children`.
- `commands[].children`: Nested command list (used when `subcommands = true`).

### Unknown Commands

- During command registration, unrecognized command names and subcommand names are logged as errors.
- Current handling is implemented in [src/main.ts](src/main.ts) using default branches in `switch` statements.
- Unknown entries now fail startup immediately with an error.

### Example

```toml
[app]
name = "helloc"
description = "A CLI template for bootstrapping Bun applications"
version = "0.1.2"

[[commands]]
name = "hello"
description = "Hello world command"
subcommands = false

[[commands]]
name = "install"
description = "Install tools"
subcommands = true

[[commands.children]]
name = "task"
description = "Download and install Task"
subcommands = false
```

## Libraries

1. [Bun](https://bun.sh/docs/bundler/executables)
2. [Commander](https://github.com/tj/commander.js/tree/master)
3. [Direnv](https://direnv.net)
4. [Winston](https://github.com/winstonjs/winston)
5. [Task](https://taskfile.dev)

> If Task is not already installed it will be downloaded and placed in the $proj/bin folder

## References

- [Bunmagic](https://github.com/bunmagic/bunmagic/tree/main)
- [Commander-template](https://github.com/Qw4z1/commander-template/tree/main)
