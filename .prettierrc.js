module.exports = {
  overrides: [
    {
      // View Default Options @ https://github.com/prettier-solidity/prettier-plugin-solidity#configuration-file
      files: "*.sol",
      options: {
        explicitTypes: "preserve", // default: always
        printWidth: 120, // default: 80
        useTabs: true, // default: false
      },
    },
  ],

  //   Below from my own ~/.prettierrc.js file
  // printWidth: 80,
  printWidth: 1000,
  // ^^ Default is 80 characters per line.
  requirePragma: false,
  // ^ That is defautl false though. Read about it @ https://prettier.io/docs/en/options.html#insert-pragma
  trailingComma: "es5",
  tabWidth: 2,
  semi: false,
  //  ^^ This is for semicolon.

  singleQuote: true,
  //  ^^ This rule doesn't specify for jsx.

  jsxSingleQuote: true,
  // ^^ This rule specify for jsx only.

  bracketSpacing: false,
  useTabs: true,

  //  Php formatting options below -
  braceStyle: "1tbs",
  //  ^^ this sets the brace style for php formatting like to put on same line.
  //  Read more about php formatting @ https://github.com/prettier/plugin-php
};
