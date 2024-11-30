#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to check if branch exists
branch_exists() {
    git show-ref --verify --quiet refs/heads/$1
    return $?
}

# Function to create branch if it doesn't exist
create_branch_if_missing() {
    local branch=$1
    local base=$2
    
    if ! branch_exists $branch; then
        echo -e "${BLUE}Creating $branch branch from $base...${NC}"
        git checkout $base
        git checkout -b $branch
        git push -u origin $branch
        echo -e "${GREEN}Created $branch branch${NC}"
    else
        echo -e "${BLUE}Branch $branch already exists${NC}"
    fi
}

# Ensure we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}Error: Not a git repository${NC}"
    exit 1
fi

# Store current branch
current_branch=$(git symbolic-ref --short HEAD)

# Create main branches if they don't exist
create_branch_if_missing "main" "main"
create_branch_if_missing "develop" "main"

# Create standard branches
create_branch_if_missing "feature/ui-enhancements" "develop"
create_branch_if_missing "feature/backend-data" "develop"
create_branch_if_missing "hotfix/current" "main"

# Return to original branch
git checkout $current_branch

echo -e "\n${GREEN}Branch structure setup complete!${NC}"
echo -e "\nBranch structure:"
echo -e "${BLUE}main${NC} - Production branch"
echo -e "${BLUE}develop${NC} - Development branch"
echo -e "${BLUE}feature/ui-enhancements${NC} - UI/UX improvements"
echo -e "${BLUE}feature/backend-data${NC} - Backend data management"
echo -e "${BLUE}hotfix/current${NC} - Current hotfixes"

# Create .gitflow file to document branching strategy
cat > .gitflow << EOL
# DRQ Website Git Branching Strategy

## Main Branches
- main: Production-ready code
- develop: Development integration branch

## Feature Branches
- feature/*: New features and improvements
  - feature/ui-enhancements: UI/UX improvements
  - feature/backend-data: Backend data management

## Hotfix Branches
- hotfix/*: Urgent fixes for production

## Branch Usage Guidelines
1. All new features should branch from 'develop'
2. Hotfixes should branch from 'main'
3. Always merge back into both 'main' and 'develop'
4. Delete feature branches after merging
EOL

echo -e "\n${GREEN}Created .gitflow documentation file${NC}"
