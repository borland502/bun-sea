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

Arguments after `--` are forwarded to the built binary (defaults to `hello` when omitted):

```shell
task run                            # runs: helloc hello
task run -- hello to "Bob"          # runs: helloc hello to Bob
task run -- hello to "Bob" --loud   # runs: helloc hello to Bob --loud
task run -- install task            # runs: helloc install task
```

### From XDG_BIN_HOME

```shell
    bun-sea hello
```

## Configuration

Configuration is loaded directly from [config/default.toml](config/default.toml) using Bun's built-in `Bun.TOML.parse()` and typed by [src/types/config.d.ts](src/types/config.d.ts). No third-party TOML library is needed.

The config file path is resolved in this order:

1. Explicit `configPath` argument passed to `loadConfig()`
2. `CONFIG_PATH` environment variable (absolute or relative to CWD)
3. `config/default.toml` relative to CWD

All types are modeled after Commander's own typings (`Command`, `Argument`, `Option`) so the config file maps naturally to the CLI framework.

### Schema

| Path                                  | Type                 | Description                                |
| ------------------------------------- | -------------------- | ------------------------------------------ |
| `app.name`                            | `string`             | CLI name used by Commander                 |
| `app.description`                     | `string`             | Description shown in help output           |
| `app.version`                         | `string`             | CLI version string                         |
| `commands[]`                          | `CommandDefinition`  | Ordered command definitions (recursive)    |
| `commands[].name`                     | `string`             | Command name                               |
| `commands[].description`              | `string`             | Command description                        |
| `commands[].arguments[]`              | `ArgumentDefinition` | Positional arguments (any level)           |
| `commands[].arguments[].name`         | `string`             | Argument name                              |
| `commands[].arguments[].description`  | `string`             | Help text                                  |
| `commands[].arguments[].required`     | `boolean`            | Required (default `true`)                  |
| `commands[].arguments[].variadic`     | `boolean`            | Accepts multiple values                    |
| `commands[].arguments[].defaultValue` | `string`             | Fallback value                             |
| `commands[].options[]`                | `OptionDefinition`   | Flags / options (any level)                |
| `commands[].options[].flags`          | `string`             | Commander flag syntax, e.g. `"-l, --loud"` |
| `commands[].options[].description`    | `string`             | Help text                                  |
| `commands[].options[].defaultValue`   | `string \| boolean`  | Fallback value                             |
| `commands[].options[].required`       | `boolean`            | Whether Commander enforces the option      |
| `commands[].commands[]`               | `CommandDefinition`  | Nested subcommands (recursive, any depth)  |

### Command Registration

Commands are registered **recursively** from the config tree. An action handler is attached only when the command's fully-qualified slash-delimited path (e.g. `"install/task"`) is present in the action registry in [src/main.ts](src/main.ts).
Commands without a registered action still appear in the help output and can serve as parents for subcommands.

### Example

```toml
[app]
name = "helloc"
description = "A CLI template for bootstrapping Bun applications"
version = "0.2.4"

# Simple parent command
[[commands]]
name = "hello"
description = "Hello world command"

# Subcommand with a positional argument and an option flag
[[commands.commands]]
name = "to"
description = "Say hello to someone"

[[commands.commands.arguments]]
name = "name"
description = "The person to greet"
required = true

[[commands.commands.options]]
flags = "-l, --loud"
description = "Greet in uppercase"
defaultValue = false

# Another top-level command with its own subcommand
[[commands]]
name = "install"
description = "Install tools"

[[commands.commands]]
name = "task"
description = "Download and install Task"
```

The example above produces the following CLI surface:

```
helloc hello              # run the hello action
helloc hello to <name>    # greet someone (--loud for uppercase)
helloc install task       # download & install Task
```

## Libraries

1. [Bun](https://bun.sh/docs/bundler/executables) — runtime, bundler, `Bun.TOML` for config parsing
2. [Commander](https://github.com/tj/commander.js/tree/master)
3. [Direnv](https://direnv.net)
4. [Task](https://taskfile.dev)

> If Task is not already installed it will be downloaded and placed in the $proj/bin folder

## References

- [Bunmagic](https://github.com/bunmagic/bunmagic/tree/main)
- [Commander-template](https://github.com/Qw4z1/commander-template/tree/main)
