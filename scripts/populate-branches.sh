#!/bin/bash

# List of all feature branches
branches=(
    "init-setup"
    "seo-metadata"
    "i18n-setup"
    "ui-header-footer"
    "ui-homepage"
    "ui-service-pages"
    "ui-emergency-components"
    "data-service-areas"
    "data-dynamic-pages"
    "cms-integration"
    "perf-optimization"
    "analytics-monitoring"
    "testing"
    "deployment-setup"
)

# Save current branch
current_branch=$(git branch --show-current)

echo "Starting branch population process..."
echo "Current branch: $current_branch"

for branch in "${branches[@]}"
do
    echo "Processing branch: $branch"
    
    # Checkout the branch
    git checkout $branch || {
        echo "Error: Failed to checkout $branch"
        continue
    }
    
    # Merge main branch content
    echo "Merging main into $branch..."
    git merge main --no-commit || {
        echo "Error: Merge conflict in $branch. Aborting merge..."
        git merge --abort
        continue
    }
    
    # Add specific commit message
    git commit -m "feat: merge main content into $branch for feature development" || {
        echo "Error: Failed to commit changes in $branch"
        continue
    }
    
    # Push changes to remote
    echo "Pushing $branch to remote..."
    git push origin $branch || {
        echo "Error: Failed to push $branch"
        continue
    }
    
    echo "Successfully processed $branch"
    echo "------------------------"
done

# Return to original branch
echo "Returning to original branch: $current_branch"
git checkout $current_branch

echo "Branch population process completed!"
