/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  printWidth: 100,
  semi: true,
  tabWidth: 2,
  useTabs: false,
  arrowParens: "always",
  trailingComma: "es5",
  singleQuote: false,
  bracketSpacing: true,
};

export default config;
