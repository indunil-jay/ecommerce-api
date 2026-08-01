---
name: git-commit-convention
description: Industry-standard Conventional Commits keywords and rules (feat, fix, chore, docs, refactor, test, style, perf, ci, build, revert) to follow when writing or recommending git commit messages.
---

# Industry-Standard Git Commit Conventions

When creating or recommending git commit messages, follow the **Conventional Commits** specification.

## Commit Format

```
<type>[optional scope]: <short description in imperative mood>

[optional body]

[optional footer(s)]
```

## Commit Keywords (Types)

| Keyword | Description | Example |
| :--- | :--- | :--- |
| `feat` | Adding a new feature or functionality | `feat(auth): add JWT authentication endpoint` |
| `fix` | Fixing a bug or unexpected behavior | `fix(cart): prevent negative item quantity` |
| `docs` | Documentation changes only | `docs(readme): add setup and installation steps` |
| `style` | Code formatting, spacing, missing semicolons (no code logic changes) | `style(user): format files using prettier` |
| `refactor` | Code restructuring without fixing a bug or adding a feature | `refactor(order): extract pricing logic into strategy pattern` |
| `perf` | Changes that improve runtime or memory performance | `perf(db): add index on product search fields` |
| `test` | Adding or updating unit, integration, or e2e tests | `test(auth): add tests for token expiration` |
| `build` | Build system, build configs, or dependency changes | `build(deps): upgrade NestJS to v10` |
| `ci` | CI/CD configuration files and scripts | `ci(github): add PR build and test workflow` |
| `chore` | Maintenance tasks, repository configs, build tools setup | `chore(gitignore): add agent directories to gitignore` |
| `revert` | Reverting a previous commit | `revert: undo commit 025ef1e due to broken build` |

## Rules & Best Practices

1. **Imperative Mood**: Use imperative present tense in the description (e.g., `add` not `added` or `adds`, `fix` not `fixed`).
2. **Lowercase**: Always use lowercase for the commit type and optional scope (e.g., `feat(auth): ...` instead of `Feat(Auth): ...`).
3. **No Trailing Period**: Do not end the commit title with a period (`.`).
4. **Scope**: Optionally specify the module or component affected in parentheses (e.g., `feat(product): ...`).
5. **Breaking Changes**: Indicate breaking changes with `!` before the colon (e.g., `feat(api)!: change user response schema`) or in the commit footer (`BREAKING CHANGE: ...`).
