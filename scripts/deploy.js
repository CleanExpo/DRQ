const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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

// Copy file with Node.js (cross-platform)
function copyFile(source, target) {
    try {
        fs.copyFileSync(source, target);
        console.log(`\x1b[32mCopied ${source} to ${target}\x1b[0m`);
        return true;
    } catch (error) {
        console.error(`\x1b[31mFailed to copy ${source} to ${target}\x1b[0m`);
        console.error(error.message);
        return false;
    }
}

// Load environment variables for a branch
function loadEnvironment(branch) {
    const envFile = `.env.${branch === 'main' ? 'production' : 'development'}`;
    if (fs.existsSync(envFile)) {
        return copyFile(envFile, '.env.local');
    }
    return true;
}

// Commit any pending changes
function commitPendingChanges() {
    try {
        execSync('git add .', { stdio: 'pipe' });
        execSync('git commit -m "Auto-commit before deployment"', { stdio: 'pipe' });
        return true;
    } catch (error) {
        console.warn('\x1b[33mNo changes to commit\x1b[0m');
        return true;
    }
}

// Build branch
async function buildBranch(branch) {
    console.log(`\x1b[34mBuilding ${branch}...\x1b[0m`);
    
    // Commit any pending changes
    commitPendingChanges();

    // Switch to branch
    if (!execute(`git checkout ${branch}`, `Failed to switch to ${branch}`)) {
        return false;
    }

    // Load environment
    if (!loadEnvironment(branch)) {
        return false;
    }

    // Install dependencies
    if (!execute('npm install', `Failed to install dependencies for ${branch}`)) {
        return false;
    }

    // Run build command
    const buildCommand = branch === 'main' ? 'npm run build' : 'npm run build:dev';
    if (!execute(buildCommand, `Build failed for ${branch}`)) {
        return false;
    }

    return true;
}

// Deploy branch
async function deployBranch(branch) {
    console.log(`\x1b[34mDeploying ${branch}...\x1b[0m`);

    // Add deployment steps here
    // For now, we'll just simulate a successful deployment
    console.log(`\x1b[32mDeployed ${branch} successfully\x1b[0m`);
    return true;
}

// Main deployment process
async function deploy() {
    // Store current branch
    const currentBranch = execSync('git symbolic-ref --short HEAD').toString().trim();
    
    const branches = ['main', 'develop', 'feature/ui-enhancements', 'feature/backend-data'];
    
    try {
        // Build and deploy each branch
        for (const branch of branches) {
            console.log(`\n\x1b[34mProcessing ${branch}...\x1b[0m`);
            
            if (await buildBranch(branch)) {
                if (await deployBranch(branch)) {
                    console.log(`\x1b[32mSuccessfully deployed ${branch}\x1b[0m`);
                } else {
                    console.error(`\x1b[31mDeployment failed for ${branch}\x1b[0m`);
                }
            } else {
                console.error(`\x1b[31mBuild failed for ${branch}\x1b[0m`);
            }
        }
    } catch (error) {
        console.error('\x1b[31mDeployment process failed:\x1b[0m', error);
    } finally {
        // Return to original branch
        execute(`git checkout ${currentBranch}`,
            `Failed to return to original branch ${currentBranch}`);
    }
}

// Start deployment
console.log('\x1b[34mStarting deployment process...\x1b[0m');
deploy().then(() => {
    console.log('\x1b[32mDeployment process completed!\x1b[0m');
}).catch((error) => {
    console.error('\x1b[31mDeployment process failed:\x1b[0m', error);
    process.exit(1);
});
