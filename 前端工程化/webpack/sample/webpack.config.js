module.exports = {
    entry: ['@babel/polyfill','./src/main.js'],
    output: {
      filename: 'bundle.js'
    },
    devServer: {
        compress: true
      }
  };