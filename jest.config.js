// jest.config.js or package.json

  module.exports = {
    "collectCoverage": true,
    "collectCoverageFrom": ["employeeHierarchyApp.js"],
    "coverageReporters": ["json", "lcov", "text", "clover"],
    // other Jest configurations...
  }

