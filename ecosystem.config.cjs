module.exports = {
  apps: [{
    name: "ikea-watcher-send-updates",
    script: "./sendUpdates.ts",
    instances: 1,
    exec_mode: "fork",
    cron_restart: "*/5 * * * *",
    watch: false,
    autorestart: false,
    interpreter: "deno",
    interpreterArgs: "run --allow-net --allow-read --allow-env --allow-write",
    env: {
      "NODE_ENV": "production",
    },
  }],
};
