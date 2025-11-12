const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/docs/archive/'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '/.next/', '/docs/archive/'],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'hooks/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/docs/archive/**',
    '!**/app/admin/moderation/page.tsx',
  ],
  // Transform ESM modules from node_modules
  transformIgnorePatterns: [
    'node_modules/(?!(@vercel/kv|@instantdb|@google/generative-ai|@anthropic-ai)/)',
  ],
  // Mock modules that have ESM/CJS issues
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@vercel/kv$': '<rootDir>/__mocks__/@vercel/kv.js',
  },
}

module.exports = createJestConfig(customJestConfig)