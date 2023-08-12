module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'refactor', 'chore']],
    'scope-case': [2, 'always', ['camel-case']],
    'subject-case': [2, 'always', ['sentence-case']]
  }
}
