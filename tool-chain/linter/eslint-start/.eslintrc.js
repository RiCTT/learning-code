module.exports = {
  env: {
    es2021: true,
    node: true,
    browser: true
  },
  extends: "eslint:recommended",
  rules: {
    "max-len": ["error", { "code": 80 }]
  }
}