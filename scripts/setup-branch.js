#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Branch types
const BRANCH_TYPES = ['feature', 'fix', 'hotfix'];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Helper function to log with colors
const log = {
  info: (msg) => console.log(`${colors.cyan}${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}${msg}${colors.reset}`),
  title: (msg) => console.log(`\n${colors.bright}${msg}${colors.reset}\n`)
};

// Validate branch name
function validateBranchName(name) {
  return /^[a-z0-9-]+$/.test(name);
}

// Create branch-specific workspace
async function createWorkspace(branchType, branchName) {
  const fullBranchName = `${branchType}/${branchName}`;
  const workspaceFile = path.join(process.cwd(), `${branchName}.code-workspace`);
  
  const workspaceConfig = {
    folders: [{ path: '.', name: `DRQ Website (${fullBranchName})` }],
    settings: {
      'window.title': `${fullBranchName} - DRQ Website`,
      'workbench.colorCustomizations': {
        'titleBar.activeBackground': branchType === 'feature' ? '#2E7D32' : 
                                   branchType === 'fix' ? '#C62828' : '#F9A825',
      }
    }
  };

  fs.writeFileSync(workspaceFile, JSON.stringify(workspaceConfig, null, 2));
  return workspaceFile;
}

// Setup branch environment
async function setupBranchEnv(branchType, branchName) {
  const envTemplate = fs.readFileSync('.env.branch-template', 'utf8');
  const envContent = envTemplate
    .replace(/\${BRANCH_NAME}/g, branchName)
    .replace(/\${BRANCH_TYPE}/g, branchType);

  fs.writeFileSync(`.env.${branchName}`, envContent);
}

// Create branch documentation
function createBranchDocs(branchType, branchName) {
  const docsDir = path.join('docs', 'branches', branchType, branchName);
  fs.mkdirSync(docsDir, { recursive: true });

  const readmeContent = `# ${branchType}/${branchName}

## Overview
Branch created: ${new Date().toISOString()}
Type: ${branchType}

## Purpose
[Describe the purpose of this branch]

## Tasks
- [ ] Task 1
- [ ] Task 2

## Dependencies
- List any dependencies here

## Testing
\`\`\`bash
npm run test:branch
\`\`\`

## Notes
Add any additional notes here
`;

  fs.writeFileSync(path.join(docsDir, 'README.md'), readmeContent);
}

// Main setup function
async function setupBranch() {
  log.title('Branch Setup Wizard');

  // Get branch type
  const branchType = await new Promise(resolve => {
    rl.question(`Select branch type (${BRANCH_TYPES.join('/')}): `, answer => {
      if (!BRANCH_TYPES.includes(answer)) {
        log.error('Invalid branch type');
        process.exit(1);
      }
      resolve(answer);
    });
  });

  // Get branch name
  const branchName = await new Promise(resolve => {
    rl.question('Enter branch name (lowercase, numbers, hyphens only): ', answer => {
      if (!validateBranchName(answer)) {
        log.error('Invalid branch name format');
        process.exit(1);
      }
      resolve(answer);
    });
  });

  rl.close();

  try {
    log.info('Setting up branch environment...');
    
    // Create and checkout new branch
    execSync(`git checkout -b ${branchType}/${branchName}`);
    log.success('Created and checked out new branch');

    // Setup environment
    await setupBranchEnv(branchType, branchName);
    log.success('Created branch-specific environment configuration');

    // Create workspace
    const workspaceFile = await createWorkspace(branchType, branchName);
    log.success('Created branch-specific workspace configuration');

    // Create documentation
    createBranchDocs(branchType, branchName);
    log.success('Created branch documentation');

    // Install dependencies if needed
    execSync('npm install', { stdio: 'inherit' });
    log.success('Verified dependencies');

    // Final setup
    log.title('Branch Setup Complete!');
    log.info(`
Branch Details:
- Name: ${branchType}/${branchName}
- Environment: .env.${branchName}
- Workspace: ${workspaceFile}
- Documentation: docs/branches/${branchType}/${branchName}

Next Steps:
1. Open the workspace: code ${workspaceFile}
2. Review the environment configuration
3. Start development with: npm run dev
`);

  } catch (error) {
    log.error('Setup failed:');
    console.error(error);
    process.exit(1);
  }
}

// Run setup
setupBranch().catch(console.error);
