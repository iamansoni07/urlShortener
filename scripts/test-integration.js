// Integration test script
const http = require("http")

const BACKEND_URL = "http://localhost:4000"
const FRONTEND_URL = "http://localhost:3000"

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let data = ""
      res.on("data", (chunk) => (data += chunk))
      res.on("end", () => {
        try {
          const parsed = res.headers["content-type"]?.includes("application/json") ? JSON.parse(data) : data
          resolve({ status: res.statusCode, data: parsed, headers: res.headers })
        } catch (error) {
          resolve({ status: res.statusCode, data, headers: res.headers })
        }
      })
    })

    req.on("error", reject)

    if (options.body) {
      req.write(options.body)
    }

    req.end()
  })
}

async function testBackendHealth() {
  console.log("🔍 Testing backend health...")

  try {
    const response = await makeRequest(`${BACKEND_URL}/shorturls`)
    if (response.status === 200) {
      console.log("✅ Backend is running and responsive")
      return true
    } else {
      console.log(`⚠️  Backend returned status ${response.status}`)
      return false
    }
  } catch (error) {
    console.log("❌ Backend is not running or not accessible")
    console.log("   Make sure to start it with: npm run backend:dev")
    return false
  }
}

async function testFrontendHealth() {
  console.log("🔍 Testing frontend health...")

  try {
    const response = await makeRequest(FRONTEND_URL)
    if (response.status === 200) {
      console.log("✅ Frontend is running and responsive")
      return true
    } else {
      console.log(`⚠️  Frontend returned status ${response.status}`)
      return false
    }
  } catch (error) {
    console.log("❌ Frontend is not running or not accessible")
    console.log("   Make sure to start it with: npm run dev")
    return false
  }
}

async function testCreateShortUrl() {
  console.log("🔍 Testing URL shortening...")

  const testUrl = {
    url: "https://www.example.com/very-long-url-for-testing",
    validity: 60,
    shortcode: "test123",
  }

  try {
    const response = await makeRequest(`${BACKEND_URL}/shorturls`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testUrl),
    })

    if (response.status === 201) {
      console.log("✅ URL shortening works correctly")
      console.log(`   Created: ${response.data.shortLink}`)
      return response.data
    } else {
      console.log(`❌ URL shortening failed with status ${response.status}`)
      console.log(`   Response: ${JSON.stringify(response.data)}`)
      return null
    }
  } catch (error) {
    console.log("❌ URL shortening request failed:", error.message)
    return null
  }
}

async function testRedirect(shortcode) {
  console.log("🔍 Testing URL redirect...")

  try {
    const response = await makeRequest(`${BACKEND_URL}/${shortcode}`)

    if (response.status === 302) {
      console.log("✅ URL redirect works correctly")
      console.log(`   Redirects to: ${response.headers.location}`)
      return true
    } else {
      console.log(`❌ URL redirect failed with status ${response.status}`)
      return false
    }
  } catch (error) {
    console.log("❌ URL redirect request failed:", error.message)
    return false
  }
}

async function testStats(shortcode) {
  console.log("🔍 Testing URL statistics...")

  try {
    const response = await makeRequest(`${BACKEND_URL}/shorturls/${shortcode}/stats`)

    if (response.status === 200) {
      console.log("✅ URL statistics work correctly")
      console.log(`   Click count: ${response.data.clickCount}`)
      return true
    } else {
      console.log(`❌ URL statistics failed with status ${response.status}`)
      return false
    }
  } catch (error) {
    console.log("❌ URL statistics request failed:", error.message)
    return false
  }
}

async function main() {
  console.log("🧪 Integration Test Suite")
  console.log("=========================")

  const results = {
    backend: false,
    frontend: false,
    shortening: false,
    redirect: false,
    stats: false,
  }

  // Test backend health
  results.backend = await testBackendHealth()

  // Test frontend health
  results.frontend = await testFrontendHealth()

  if (results.backend) {
    // Test URL shortening
    const shortUrl = await testCreateShortUrl()
    if (shortUrl) {
      results.shortening = true

      const shortcode = shortUrl.shortLink.split("/").pop()

      // Test redirect
      results.redirect = await testRedirect(shortcode)

      // Test stats
      results.stats = await testStats(shortcode)
    }
  }

  console.log("")
  console.log("📊 Test Results Summary")
  console.log("=======================")
  console.log(`Backend Health:    ${results.backend ? "✅ PASS" : "❌ FAIL"}`)
  console.log(`Frontend Health:   ${results.frontend ? "✅ PASS" : "❌ FAIL"}`)
  console.log(`URL Shortening:    ${results.shortening ? "✅ PASS" : "❌ FAIL"}`)
  console.log(`URL Redirect:      ${results.redirect ? "✅ PASS" : "❌ FAIL"}`)
  console.log(`URL Statistics:    ${results.stats ? "✅ PASS" : "❌ FAIL"}`)

  const passCount = Object.values(results).filter(Boolean).length
  const totalCount = Object.keys(results).length

  console.log("")
  console.log(`Overall: ${passCount}/${totalCount} tests passed`)

  if (passCount === totalCount) {
    console.log("🎉 All tests passed! Your integration is working correctly.")
  } else {
    console.log("⚠️  Some tests failed. Please check the logs above for details.")
  }
}

if (require.main === module) {
  main()
}

module.exports = { testBackendHealth, testFrontendHealth, testCreateShortUrl, testRedirect, testStats }
