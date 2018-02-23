module.exports = {
  verifyConditions: ['@semantic-release/github'],
  prepare: [require.resolve('./scripts/semantic-release-prepare.js')],
  publish: [
    {
      path: '@semantic-release/github',
      assets: 'dist',
    },
  ],
};
