# Project Explanation: use-multiple-gits

## What is this project?

`use-multiple-gits` is a CLI tool that helps developers manage multiple Git identities (user.name, user.email, SSH keys) and easily switch between them. This is especially useful for developers who:

- Work for multiple companies/organizations
- Have separate work and personal Git accounts
- Need to use different SSH keys for different repositories
- Want to avoid accidentally committing with the wrong identity

## How it works

### Architecture

```
┌─────────────────┐
│   User Input    │  (multiGit commands)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  CLI Commands   │  (init, add, list, remove)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Core Utils     │  (configStorage, scriptGenerator, zshrc)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  File System    │  (~/.bin/, ~/.zshrc, ~/.multi-git/)
└─────────────────┘
```

### Data Flow

1. **User runs command**: `multiGit add work`
2. **Interactive prompts**: Asks for name, email, SSH key
3. **Validation**: Checks if SSH key exists, validates email format
4. **Script generation**: Creates `~/.bin/use-work.sh` script
5. **Config storage**: Saves config to `~/.multi-git/config.json`
6. **Shell integration**: Adds alias to `~/.zshrc`
7. **Ready to use**: User can run `use-work` to switch

### Key Components

#### 1. **Commands** (`src/commands/`)

- `init.ts` - Initializes the system
- `add.ts` - Adds new git configuration
- `list.ts` - Lists all configurations
- `remove.ts` - Removes a configuration

#### 2. **Utils** (`src/utils/`)

- `configStorage.ts` - Manages config file (`~/.multi-git/config.json`)
- `scriptGenerator.ts` - Generates shell scripts for switching
- `zshrc.ts` - Manages aliases in `.zshrc`
- `fs.ts` - File system operations
- `paths.ts` - Path constants
- `errors.ts` - Custom error classes

#### 3. **Types** (`src/types/`)

- TypeScript interfaces for type safety

## Current Features

✅ Interactive CLI setup
✅ Multiple git identity management
✅ SSH key switching
✅ Shell alias integration
✅ Configuration persistence
✅ Error handling
✅ TypeScript for reliability

## Technical Stack

- **Language**: TypeScript
- **CLI Framework**: Commander.js
- **Interactive Prompts**: Inquirer.js
- **Styling**: Chalk (colors)
- **Build**: TypeScript Compiler (tsc)

## File Structure

```
~/.bin/use-<name>.sh    # Generated switch scripts
~/.zshrc                # Shell aliases added here
~/.multi-git/config.json # Configuration storage
~/.ssh/id_ed25519_*     # SSH keys (user-provided)
```

## Usage Example

```bash
# 1. Initialize
multiGit init

# 2. Add work identity
multiGit add work
# Prompts: "John Doe", "john@company.com", "id_ed25519_work"

# 3. Add personal identity
multiGit add personal
# Prompts: "John Doe", "john@gmail.com", "id_ed25519_personal"

# 4. Use it
use-work      # Switches to work identity
use-personal  # Switches to personal identity
```

## Why TypeScript?

- **Type Safety**: Catches errors at compile time
- **Better IDE Support**: Autocomplete, refactoring
- **Maintainability**: Easier to understand and modify
- **Professional**: Industry standard for Node.js tools
