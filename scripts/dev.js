const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load .env.local if it exists
const envLocalPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envLocalPath)) {
  console.log(`Loading environment from ${envLocalPath}`);
  const envConfig = dotenv.parse(fs.readFileSync(envLocalPath));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
    // Create override variables for Infisical-managed keys
    // This allows us to restore them after "infisical run" overwrites the originals
    if (['VITE_BACKEND_URL', 'VITE_API_URL'].includes(k)) {
      process.env[`${k}_OVERRIDE`] = envConfig[k];
    }
  }
} else {
  console.log('.env.local not found, using default environment');
}

// Run turbo dev
const cmd = 'turbo';
const args = ['dev'];

console.log(`Running: ${cmd} ${args.join(' ')}`);

const child = spawn(cmd, args, {
  stdio: 'inherit',
  shell: true,
  env: process.env
});

child.on('close', (code) => {
  process.exit(code);
});
