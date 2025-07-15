module.exports = {
  '**/*.+(js|css|sass|less|graphql|yml|yaml|scss|json|vue)': [
    'prettier --write',
    'eslint --fix',
    'jest --findRelatedTests'
  ]
}
