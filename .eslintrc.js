module.exports = {
  root: true,
  extends: '@react-native-community',
  "plugins": [
    "react-hooks"
  ],
  rules: {
    'prettier/prettier': 0,
    'react-native/no-inline-styles': 0,
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  },
};
