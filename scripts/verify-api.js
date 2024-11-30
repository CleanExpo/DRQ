const fetch = require('node-fetch')
const { CONTACT } = require('../src/constants/contact')

const API_ENDPOINTS = [
  {
    path: '/api/sitemap',
    method: 'GET',
    expectedStatus: 200,
    contentType: 'application/xml',
    validate: (content) => content.includes('<?xml') && content.includes('urlset')
  },
  {
    path: '/api/robots',
    method: 'GET',
    expectedStatus: 200,
    contentType: 'text/plain',
    validate: (content) => content.includes('User-agent') && content.includes('Sitemap')
  },
  {
    path: '/api/health',
    method: 'GET',
    expectedStatus: 200,
    contentType: 'application/json',
    validate: (content) => content.status === 'ok'
  },
  {
    path: '/api/areas',
    method: 'GET',
    expectedStatus: 200,
    contentType: 'application/json',
    validate: (content) => Array.isArray(content)
  },
  {
    path: '/api/services',
    method: 'GET',
    expectedStatus: 200,
    contentType: 'application/json',
    validate: (content) => Array.isArray(content)
  },
  {
    path: '/api/emergency',
    method: 'POST',
    expectedStatus: 200,
    contentType: 'application/json',
    body: {
      name: 'Test User',
      phone: '0400000000',
      email: 'test@example.com',
      message: 'Test emergency message',
      service: 'Water Damage',
      postcode: '4000'
    },
    validate: (content) => content.success
  },
  {
    path: '/api/contact',
    method: 'POST',
    expectedStatus: 200,
    contentType: 'application/json',
    body: {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test contact message'
    },
    validate: (content) => content.success
  }
]

async function verifyAPI() {
  console.log('API Endpoint Verification Report')
  console.log('==============================\n')

  const baseUrl = `http://localhost:3000`
  const issues = []
  let totalChecks = 0
  let passedChecks = 0

  for (const endpoint of API_ENDPOINTS) {
    console.log(`Testing ${endpoint.method} ${endpoint.path}...`)
    totalChecks++

    try {
      const options = {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json'
        }
      }

      if (endpoint.body) {
        options.body = JSON.stringify(endpoint.body)
      }

      const response = await fetch(`${baseUrl}${endpoint.path}`, options)
      const contentType = response.headers.get('content-type')

      // Check status code
      if (response.status !== endpoint.expectedStatus) {
        issues.push(`${endpoint.path}: Expected status ${endpoint.expectedStatus}, got ${response.status}`)
        continue
      }

      // Check content type
      if (!contentType.includes(endpoint.contentType)) {
        issues.push(`${endpoint.path}: Expected content type ${endpoint.contentType}, got ${contentType}`)
        continue
      }

      // Parse and validate response
      let content
      if (contentType.includes('application/json')) {
        content = await response.json()
      } else {
        content = await response.text()
      }

      if (!endpoint.validate(content)) {
        issues.push(`${endpoint.path}: Response validation failed`)
        continue
      }

      passedChecks++
      console.log(`✅ ${endpoint.path} passed all checks`)

    } catch (error) {
      issues.push(`${endpoint.path}: ${error.message}`)
    }
  }

  // Print results
  console.log('\nResults:')
  console.log('--------')
  console.log(`Total Endpoints: ${totalChecks}`)
  console.log(`Passed: ${passedChecks}`)
  console.log(`Failed: ${totalChecks - passedChecks}\n`)

  if (issues.length > 0) {
    console.log('Issues Found:')
    issues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue}`)
    })
  } else {
    console.log('✅ All API endpoints are working correctly')
  }

  // Print API documentation
  console.log('\nAPI Documentation:')
  console.log('-----------------')
  API_ENDPOINTS.forEach(endpoint => {
    console.log(`\n${endpoint.method} ${endpoint.path}`)
    console.log(`Content-Type: ${endpoint.contentType}`)
    console.log(`Expected Status: ${endpoint.expectedStatus}`)
    if (endpoint.body) {
      console.log('Request Body:')
      console.log(JSON.stringify(endpoint.body, null, 2))
    }
  })

  return issues.length === 0
}

// Run verification
const success = verifyAPI()
process.exit(success ? 0 : 1)
