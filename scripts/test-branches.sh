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

# Create or clear error log
echo "Starting branch testing process..." > error-log.txt
date >> error-log.txt
echo "------------------------" >> error-log.txt

# Save current branch
current_branch=$(git branch --show-current)
echo "Current branch: $current_branch" >> error-log.txt
echo "------------------------" >> error-log.txt

for branch in "${branches[@]}"
do
    echo "Testing branch: $branch"
    echo "Testing branch: $branch" >> error-log.txt
    
    # Checkout the branch
    git checkout $branch || {
        echo "Error: Failed to checkout $branch" >> error-log.txt
        continue
    }
    
    # Install dependencies
    echo "Installing dependencies..."
    npm install || {
        echo "Error: npm install failed in $branch" >> error-log.txt
        continue
    }
    
    # Run type checking
    echo "Running type check..."
    npm run type-check || {
        echo "Error: Type check failed in $branch" >> error-log.txt
    }
    
    # Run tests
    echo "Running tests..."
    npm test || {
        echo "Error: Tests failed in $branch" >> error-log.txt
    }
    
    # Run build
    echo "Running build..."
    npm run build || {
        echo "Error: Build failed in $branch" >> error-log.txt
    }
    
    echo "------------------------" >> error-log.txt
done

# Return to original branch
echo "Returning to original branch: $current_branch"
git checkout $current_branch

echo "Branch testing completed! Check error-log.txt for results."
echo "------------------------" >> error-log.txt
echo "Testing process completed at:" >> error-log.txt
date >> error-log.txt

# Display results
cat error-log.txt
