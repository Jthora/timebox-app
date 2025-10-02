export default {
  preset: 'ts-jest/presets/js-with-ts-esm',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  '\\.(gif|ttf|eot|svg|wav|mp3|png|jpg|jpeg)$': '<rootDir>/test/__mocks__/fileMock.ts',
  },
  transform: {
  '^.+\\.tsx?$': ['ts-jest', { useESM: true, tsconfig: './tsconfig.app.json' }],
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
};