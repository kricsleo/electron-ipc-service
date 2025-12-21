import eslint from '@antfu/eslint-config'

export default eslint({
  rules: {
    'style/brace-style': ['error', '1tbs'],
    'perfectionist/sort-imports': 'off',
  },
})
