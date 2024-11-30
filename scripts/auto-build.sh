#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Store current branch
original_branch=$(git symbolic-ref --short HEAD)

echo -e "${BLUE}Starting automated build process...${NC}"

# Function to build and test a branch
build_branch() {
    local branch=$1
    local env=$2

    echo -e "\n${BLUE}Processing ${branch} branch for ${env} environment...${NC}"

    # Switch to branch
    if ! git checkout $branch; then
        echo -e "${RED}Failed to switch to ${branch} branch${NC}"
        return 1
    fi

    # Install dependencies
    echo -e "${BLUE}Installing dependencies...${NC}"
    if ! npm install; then
        echo -e "${RED}Failed to install dependencies${NC}"
        return 1
    fi

    # Copy appropriate .env file
    if [ -f ".env.${env}" ]; then
        cp ".env.${env}" .env.local
        echo -e "${GREEN}Copied .env.${env} to .env.local${NC}"
    fi

    # Build the application
    echo -e "${BLUE}Building application...${NC}"
    if ! npm run build; then
        echo -e "${RED}Build failed${NC}"
        return 1
    fi

    # Run tests if they exist
    if grep -q "\"test\":" package.json; then
        echo -e "${BLUE}Running tests...${NC}"
        if ! npm test; then
            echo -e "${RED}Tests failed${NC}"
            return 1
        fi
    fi

    echo -e "${GREEN}Successfully built ${branch} branch for ${env} environment${NC}"
    return 0
}

# Function to create and build feature branch
create_feature_branch() {
    local branch=$1
    local base=$2
    
    git checkout $base
    if ! git checkout -b $branch 2>/dev/null; then
        git checkout $branch
    fi
    
    build_branch $branch "development"
    return $?
}

# Main build process
if ! build_branch "develop" "development"; then
    echo -e "${RED}Failed to build develop branch${NC}"
    git checkout $original_branch
    exit 1
fi

if ! build_branch "main" "production"; then
    echo -e "${RED}Failed to build main branch${NC}"
    git checkout $original_branch
    exit 1
fi

# Create and build feature branches
if ! create_feature_branch "feature/ui-enhancements" "develop"; then
    echo -e "${RED}Failed to build UI enhancements feature${NC}"
    git checkout $original_branch
    exit 1
fi

if ! create_feature_branch "feature/backend-data" "develop"; then
    echo -e "${RED}Failed to build backend data feature${NC}"
    git checkout $original_branch
    exit 1
fi

# Return to original branch
echo -e "${BLUE}Returning to original branch: ${original_branch}${NC}"
git checkout $original_branch

echo -e "\n${GREEN}Build process completed!${NC}"
