module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^bndy-ui/(.*)$': '<rootDir>/__mocks__/bndy-ui/$1',
    '^bndy-types$': '<rootDir>/../bndy-types',
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
};
