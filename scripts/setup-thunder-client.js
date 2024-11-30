#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

async function setupThunderClient() {
  try {
    // Get current branch name
    const branchName = execSync('git rev-parse --abbrev-ref HEAD')
      .toString()
      .trim()
      .replace(/^(feature|fix|hotfix)\//, '');

    log.title('Setting up Thunder Client for branch: ' + branchName);

    // Create Thunder Client directory if it doesn't exist
    const thunderDir = path.join(process.cwd(), '.thunder-client');
    if (!fs.existsSync(thunderDir)) {
      fs.mkdirSync(thunderDir);
      log.info('Created Thunder Client directory');
    }

    // Read template
    const templatePath = path.join(thunderDir, 'branch-collection-template.json');
    const template = fs.readFileSync(templatePath, 'utf8');

    // Replace placeholders
    const collectionContent = template.replace(/\${BRANCH_NAME}/g, branchName);

    // Create collection file
    const collectionPath = path.join(thunderDir, `${branchName}-collection.json`);
    fs.writeFileSync(collectionPath, collectionContent);
    log.success('Created Thunder Client collection');

    // Create environment file
    const envConfig = {
      "name": `${branchName}-environment`,
      "data": {
        "baseUrl": `http://localhost:3002`,
        "branchName": branchName,
        "apiVersion": "v1",
        "timestamp": new Date().toISOString()
      }
    };

    const envPath = path.join(thunderDir, `${branchName}-environment.json`);
    fs.writeFileSync(envPath, JSON.stringify(envConfig, null, 2));
    log.success('Created Thunder Client environment');

    // Create test data file
    const testData = {
      "serviceAreas": [
        { "postcode": "4000", "name": "Brisbane" },
        { "postcode": "4217", "name": "Gold Coast" }
      ],
      "mockResponses": {
        "success": { "status": 200, "message": "Success" },
        "error": { "status": 400, "message": "Bad Request" }
      }
    };

    const testDataPath = path.join(thunderDir, `${branchName}-test-data.json`);
    fs.writeFileSync(testDataPath, JSON.stringify(testData, null, 2));
    log.success('Created test data file');

    // Create Thunder Client README
    const readmeContent = `# Thunder Client Setup for ${branchName}

## Collections
- Main Collection: ${branchName}-collection.json
- Environment: ${branchName}-environment.json
- Test Data: ${branchName}-test-data.json

## Usage
1. Open Thunder Client extension in VSCode
2. Import the collection file
3. Set the environment
4. Run API tests

## Available Tests
- Service Areas API
- Cache Management
- Sitemap Generation
- Health Checks

## Environment Variables
- baseUrl: http://localhost:3002
- branchName: ${branchName}
- apiVersion: v1

## Test Data
Test data is available in ${branchName}-test-data.json

## Running Tests
1. Select the collection
2. Click "Run All"
3. View test results in Thunder Client

## Adding New Tests
1. Create a new request in the collection
2. Add test scripts
3. Update this documentation
`;

    const readmePath = path.join(thunderDir, `${branchName}-README.md`);
    fs.writeFileSync(readmePath, readmeContent);
    log.success('Created Thunder Client README');

    log.title('Thunder Client Setup Complete!');
    log.info(`
Files Created:
- Collection: ${collectionPath}
- Environment: ${envPath}
- Test Data: ${testDataPath}
- README: ${readmePath}

Next Steps:
1. Open Thunder Client in VSCode
2. Import the collection
3. Set the environment
4. Start testing APIs
`);

  } catch (error) {
    log.error('Setup failed:');
    console.error(error);
    process.exit(1);
  }
}

// Run setup
setupThunderClient().catch(console.error);
