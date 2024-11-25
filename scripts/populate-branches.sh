#!/bin/bash

# List of branches to populate
branches=("ui-header-footer" "ui-homepage" "ui-service-pages" "data-service-areas" "perf-optimization")

for branch in "${branches[@]}"
do
  echo "Switching to branch $branch..."
  git checkout $branch
  
  echo "Merging content from main into $branch..."
  git merge main --no-commit
  
  echo "Committing the merged content in $branch..."
  git commit -m "Merged main branch content into $branch"
  
  echo "Pushing $branch to remote repository..."
  git push origin $branch
done

# Switch back to main branch
git checkout main
echo "All branches have been populated with main branch content!"
