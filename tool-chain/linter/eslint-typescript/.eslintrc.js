module.exports = {
  env: {
    es2021: true,
    node: true,
    browser: true
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json"], // 告诉 eslint：tsconfig 在哪
  },
  plugins: ["@typescript-eslint"],
  extends: "eslint:recommended",
  rules: {
    "max-len": ["error", { "code": 80 }]
  }
}