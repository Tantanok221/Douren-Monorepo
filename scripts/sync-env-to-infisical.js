#!/usr/bin/env node

/**
 * Script to sync environment variables from .env files to Infisical
 * Usage: node scripts/sync-env-to-infisical.js [options]
 * 
 * Options:
 *   --env-file <path>     Path to .env file (default: .env)
 *   --environment <env>   Infisical environment (default: dev)
 *   --dry-run            Show what would be synced without actually setting secrets
 *   --help               Show help message
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function parseArgs() {
    const args = process.argv.slice(2);
    const options = {
        envFile: '.env',
        environment: 'dev',
        dryRun: false,
        help: false
    };

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--env-file':
                options.envFile = args[++i];
                break;
            case '--environment':
                options.environment = args[++i];
                break;
            case '--dry-run':
                options.dryRun = true;
                break;
            case '--help':
                options.help = true;
                break;
            default:
                // If no flag provided, treat as environment name for backward compatibility
                if (!args[i].startsWith('--')) {
                    options.environment = args[i];
                }
                break;
        }
    }

    return options;
}

function showHelp() {
    console.log(`
🔐 Infisical Environment Variable Sync Tool

Usage: node scripts/sync-env-to-infisical.js [options]

Options:
  --env-file <path>     Path to .env file (default: .env)
  --environment <env>   Infisical environment (default: dev)
  --dry-run            Show what would be synced without actually setting secrets
  --help               Show this help message

Examples:
  node scripts/sync-env-to-infisical.js
  node scripts/sync-env-to-infisical.js --environment staging
  node scripts/sync-env-to-infisical.js --env-file .env.production --environment prod
  node scripts/sync-env-to-infisical.js --dry-run
    `);
}

function checkPrerequisites() {
    // Check if infisical CLI is available
    try {
        execSync('which infisical', { stdio: 'ignore' });
    } catch (error) {
        log('❌ Error: Infisical CLI not found. Please install it first.', 'red');
        log('Visit: https://infisical.com/docs/cli/overview', 'blue');
        process.exit(1);
    }

    // Check if we can access Infisical by trying to export (this will fail if not logged in)
    try {
        execSync('infisical export --format dotenv --env dev', { stdio: 'ignore' });
    } catch (error) {
        log('❌ Error: Cannot access Infisical. Please run "infisical login" first or check your workspace configuration.', 'red');
        process.exit(1);
    }
}

function parseEnvFile(filePath) {
    if (!fs.existsSync(filePath)) {
        log(`❌ Error: ${filePath} file not found`, 'red');
        process.exit(1);
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const envVars = {};
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Skip empty lines and comments
        if (!line || line.startsWith('#')) {
            continue;
        }

        // Parse key=value pairs
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            let [, key, value] = match;
            key = key.trim();
            
            // Remove quotes from value if present
            if ((value.startsWith('"') && value.endsWith('"')) || 
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            
            if (key) {
                envVars[key] = value;
            }
        }
    }

    return envVars;
}

async function setSecret(key, value, environment, dryRun = false) {
    if (dryRun) {
        log(`🔍 Would set: ${key}`, 'blue');
        return true;
    }

    try {
        // Escape special characters in value for shell
        const escapedValue = value.replace(/"/g, '\\"');
        execSync(`infisical secrets set "${key}=${escapedValue}" --env "${environment}" --silent`, {
            stdio: 'ignore'
        });
        log(`✅ Set: ${key}`, 'green');
        return true;
    } catch (error) {
        log(`❌ Failed to set: ${key}`, 'red');
        return false;
    }
}

async function main() {
    const options = parseArgs();

    if (options.help) {
        showHelp();
        return;
    }

    log(`🔄 Syncing environment variables from ${options.envFile} to Infisical ${options.environment} environment...`, 'yellow');
    
    if (options.dryRun) {
        log('🔍 DRY RUN MODE - No secrets will actually be set', 'blue');
    }

    checkPrerequisites();

    const envVars = parseEnvFile(options.envFile);
    const keys = Object.keys(envVars);

    if (keys.length === 0) {
        log('⚠️  No environment variables found in the file', 'yellow');
        return;
    }

    log(`📝 Found ${keys.length} environment variables`, 'blue');

    // Run all secret setting operations in parallel
    log('🚀 Setting secrets in parallel...', 'blue');
    const results = await Promise.all(
        keys.map(key => setSecret(key, envVars[key], options.environment, options.dryRun))
    );

    const successCount = results.filter(Boolean).length;
    const errorCount = results.length - successCount;

    log('', 'reset');
    log('📊 Summary:', 'green');
    log(`   ✅ Successfully ${options.dryRun ? 'would set' : 'set'}: ${successCount} secrets`);
    
    if (errorCount > 0) {
        log(`   ❌ Errors: ${errorCount} secrets`, 'red');
    }

    if (errorCount === 0) {
        if (options.dryRun) {
            log(`🔍 Dry run completed! ${successCount} secrets would be synced to Infisical ${options.environment} environment.`, 'blue');
        } else {
            log(`🎉 All environment variables successfully synced to Infisical ${options.environment} environment!`, 'green');
        }
    } else {
        log('⚠️  Some errors occurred during sync. Please check the output above.', 'yellow');
        process.exit(1);
    }
}

main().catch(error => {
    log(`❌ Unexpected error: ${error.message}`, 'red');
    process.exit(1);
});