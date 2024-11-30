const { execSync } = require('child_process');
const config = require('../deployment.config.js');

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

// Load environment variables for a branch
function loadEnvironment(branch) {
    const branchConfig = config.branches[branch];
    const envConfig = config.environments[branchConfig.env];
    
    if (envConfig.envFile) {
        execute(`cp ${envConfig.envFile} .env.local`,
            `Failed to load environment for ${branch}`);
    }
}

// Run pre-build hooks
async function runPreBuildHooks() {
    console.log('\x1b[34mRunning pre-build hooks...\x1b[0m');
    for (const hook of config.hooks.preBuild) {
        if (!execute(hook, `Pre-build hook failed: ${hook}`)) {
            return false;
        }
    }
    return true;
}

// Build branch
async function buildBranch(branch) {
    console.log(`\x1b[34mBuilding ${branch}...\x1b[0m`);
    
    // Switch to branch
    if (!execute(`git checkout ${branch}`, `Failed to switch to ${branch}`)) {
        return false;
    }

    // Load environment
    loadEnvironment(branch);

    // Run pre-build hooks
    if (!await runPreBuildHooks()) {
        return false;
    }

    // Run build command
    const buildCommand = config.branches[branch].buildCommand;
    if (!execute(buildCommand, `Build failed for ${branch}`)) {
        return false;
    }

    // Run post-build hooks
    for (const hook of config.hooks.postBuild) {
        if (!execute(hook, `Post-build hook failed: ${hook}`)) {
            return false;
        }
    }

    return true;
}

// Deploy branch
async function deployBranch(branch) {
    console.log(`\x1b[34mDeploying ${branch}...\x1b[0m`);

    // Run pre-deployment hooks
    for (const hook of config.hooks.preDeployment) {
        if (!execute(hook, `Pre-deployment hook failed: ${hook}`)) {
            return false;
        }
    }

    // Run post-deployment hooks
    for (const hook of config.hooks.postDeployment) {
        if (!execute(hook, `Post-deployment hook failed: ${hook}`)) {
            return false;
        }
    }

    return true;
}

// Main deployment process
async function deploy() {
    // Store current branch
    const currentBranch = execSync('git symbolic-ref --short HEAD').toString().trim();
    
    try {
        // Build and deploy each branch
        for (const branch of Object.keys(config.branches)) {
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
