module.exports = {
  "*/**/*.{ts,tsx}": [() => "tsc --noEmit"],
  "*/**/*.{js,jsx,ts,tsx}": ["prettier --write", "eslint"],
  "*/**/*.{json,css,md}": ["prettier --write"],
};
