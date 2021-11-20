module.exports = {
  apps: [
    {
    name: "app1",
    script: "./index.js",
    env_development: {
      ASSETS_FROM: "0",
      ASSETS_TO: "20",
    }
  },
  {
    name: "app2",
    script: "./index.js",
    env_development: {
      ASSETS_FROM: "21",
      ASSETS_TO: "40",
    }
  },
  {
    name: "app3",
    script: "./index.js",
    env_development: {
      ASSETS_FROM: "41",
      ASSETS_TO: "60",
    }
  },
  {
    name: "app4",
    script: "./index.js",
    env_development: {
      ASSETS_FROM: "61",
      ASSETS_TO: "80",
    }
  },
  {
    name: "app5",
    script: "./index.js",
    env_development: {
      ASSETS_FROM: "81",
      ASSETS_TO: "100",
    }
  },
  {
    name: "app5",
    script: "./index.js",
    env_development: {
      ASSETS_FROM: "101",
      ASSETS_TO: "120",
    }
  },
  {
    name: "app6",
    script: "./index.js",
    env_development: {
      ASSETS_FROM: "121",
      ASSETS_TO: "140",
    }
  },
],
}