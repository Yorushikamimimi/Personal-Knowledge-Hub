module.exports = {
  apps: [
    {
      name: "pkh-web",
      cwd: ".",
      script: "npm",
      args: "run start -- -p 3001 -H 127.0.0.1",
      env: {
        NODE_ENV: "production",
      },
      autorestart: true,
      max_memory_restart: "500M",
      time: true,
    },
  ],
};
