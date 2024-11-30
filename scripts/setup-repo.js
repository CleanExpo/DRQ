const { execSync } = require('child_process');

// Utility to execute commands and handle errors
function execute(command, errorMessage) {
    try {
        execSync(command, { stdio: 'inherit' });
        return true;
    } catch (error) {
        console.error(`\x1b[31m${errorMessage}\x1b[0m`);
        console.error(error.message);
        return false;
    }
}

// Initialize repository
async function initRepo() {
    console.log('\x1b[34mInitializing repository...\x1b[0m');

    // Save current changes
    execute('git add .', 'Failed to stage changes');
    execute('git commit -m "Save current changes"', 'Failed to commit changes');

    // Create main branch if it doesn't exist
    if (!execute('git show-ref --verify --quiet refs/heads/main', '')) {
        execute('git checkout -b main', 'Failed to create main branch');
    }

    // Create develop branch
    execute('git checkout -b develop', 'Failed to create develop branch');

    // Create feature branches
    execute('git checkout -b feature/ui-enhancements', 'Failed to create UI feature branch');
    execute('git checkout develop', 'Failed to switch to develop');
    
    execute('git checkout -b feature/backend-data', 'Failed to create backend feature branch');
    execute('git checkout develop', 'Failed to switch to develop');

    // Create hotfix branch
    execute('git checkout main', 'Failed to switch to main');
    execute('git checkout -b hotfix/current', 'Failed to create hotfix branch');

    // Return to develop branch
    execute('git checkout develop', 'Failed to return to develop branch');

    console.log('\x1b[32mRepository initialized successfully!\x1b[0m');
    console.log('\nBranch structure created:');
    console.log('- main');
    console.log('- develop');
    console.log('  |- feature/ui-enhancements');
    console.log('  |- feature/backend-data');
    console.log('- hotfix/current');
}

// Start initialization
console.log('\x1b[34mStarting repository setup...\x1b[0m');
initRepo().catch((error) => {
    console.error('\x1b[31mSetup failed:\x1b[0m', error);
    process.exit(1);
});
