module.exports = {
    apps : [
        {
          name: "paperstack",
          script: "./lib/index.js",
          watch: false,
          env: {
              "NODE_ENV": "development"
          },
          env_production: {
              "NODE_ENV": "production",
          }
        }
    ]
  }
