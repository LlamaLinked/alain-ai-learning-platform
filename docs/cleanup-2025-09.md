Cleanup: Rebase Artifacts and Repo Hygiene (2025-09)

Summary
- Removed accidental rebase artifacts and OS noise files.
- Restored repository to a clean state and rebased on latest `origin/main`.

What Changed
- Dropped tracked `.DS_Store` files and added `.DS_Store` to `.gitignore`.
- Removed duplicate files introduced during a bad rebase (files with the suffix " 2", e.g. `frontend/App 2.tsx`).
- Rebased the working branch on top of `origin/main` to finish the interrupted rebase.

Relevant Commit
- chore(repo): cleanup — drop tracked .DS_Store, remove duplicate ' 2' files, add .DS_Store to .gitignore

Rationale
- `.DS_Store` and similar OS files should never be versioned; they create noisy diffs and merge conflicts.
- Duplicate files with suffixes like " 2" are artifacts of manual merges or editor conflict handling and should be removed to avoid confusion and incorrect imports/builds.

How To Avoid Recurrence
- Keep `.DS_Store` in `.gitignore` (present now).
- Prefer `git rebase --abort` if a rebase goes sideways; then re-run rebase from a clean state.
- Use `git status -sb` to spot unexpected mass deletions before committing.

Command Notes
```
# Remove stale index locks if a prior rebase/editor crashed
rm -f .git/index.lock

# Ensure .DS_Store is ignored (now tracked in repo)
echo ".DS_Store" >> .gitignore
git rm -f --cached .DS_Store

# Remove duplicate files with " 2." suffix
git ls-files -z | xargs -0 -I{} bash -lc '[[ "{}" =~ 2\.[^/]+$ ]] && echo {}' | xargs -r git rm -f

# Stage and commit cleanup
git add -A
git commit -m "chore(repo): cleanup — drop tracked .DS_Store, remove duplicate ' 2' files, add .DS_Store to .gitignore"

# Rebase on latest main
git fetch origin --prune
git rebase origin/main
```

Follow-ups
- If any local changes were intended but lost due to the bad rebase, re-apply them as focused commits and open a new PR.
- Consider enabling a pre-commit hook to prevent committing OS files.

