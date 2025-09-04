require('dotenv').config();

module.exports = {
  apps: [
    {
      name: "flashpdf",
      cwd: "/home/s23100371/flashpdf.dcism.org",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 45183,
        ...process.env
      }
    }
  ]
}