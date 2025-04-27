module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    // Prevent direct imports from bndy-ui/src/types/calendar
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['bndy-ui/src/types/calendar', 'bndy-ui/dist/types/calendar'],
            message: 'Import calendar types from bndy-types instead. See docs/SHARED_TYPES.md for guidance.'
          }
        ]
      }
    ],
    // Enforce using import type for type-only imports
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      {
        prefer: 'type-imports',
        disallowTypeAnnotations: false,
      },
    ],
  },
  overrides: [
    {
      // Apply TypeScript-specific rules only to TypeScript files
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      rules: {
        // Additional TypeScript-specific rules
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-explicit-any': 'warn',
      },
    },
  ],
};
