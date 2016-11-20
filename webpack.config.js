var getConfig = require('hjs-webpack');

module.exports = getConfig({
  in: 'src/app.js',
  out: 'public',
  clearBeforeBuild: '!(index.html|favicon.ico)',
  isDev: process.env.NODE_ENV !== 'production',
  html: false,
  output: {
    filename: "app.js",
  },
});
