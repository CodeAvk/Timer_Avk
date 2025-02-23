module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^lucide-react$": "<rootDir>/__mocks__/lucide-react.js", // Use the mock file
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(lucide-react)/)", // Allow Jest to transform lucide-react
  ],
  moduleNameMapper: {
    "^lucide-react$": "<rootDir>/__mocks__/lucide-react.js",
  },
};
