#!/usr/bin/env node

/**
 * Script to pull environment variables from Infisical and generate TypeScript ENV_BINDING
 * Usage: node scripts/generate-env-binding.js [options]
 * 
 * Options:
 *   --environment <env>  Infisical environment (default: dev)
 *   --output <path>      Output TypeScript file path (default: pkg/env/src/index.ts)
 *   --dry-run           Show what would be generated without writing files
 *   --help              Show help message
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
        environment: 'dev',
        output: 'pkg/env/src/index.ts',
        dryRun: false,
        help: false
    };

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--environment':
                options.environment = args[++i];
                break;
            case '--output':
                options.output = args[++i];
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
🔧 Environment Binding Generator

Usage: node scripts/generate-env-binding.js [options]

Options:
  --environment <env>  Infisical environment (default: dev)
  --output <path>      Output TypeScript file path (default: pkg/env/src/index.ts)
  --dry-run           Show what would be generated without writing files
  --help              Show this help message

Examples:
  node scripts/generate-env-binding.js
  node scripts/generate-env-binding.js --environment staging
  node scripts/generate-env-binding.js --output custom/path/env.ts
  node scripts/generate-env-binding.js --dry-run
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

    // Check if we can access Infisical
    try {
        execSync('infisical export --format dotenv --env dev', { stdio: 'ignore' });
    } catch (error) {
        log('❌ Error: Cannot access Infisical. Please run "infisical login" first or check your workspace configuration.', 'red');
        process.exit(1);
    }
}

function pullEnvironmentVariables(environment) {
    log(`🔄 Pulling environment variables from Infisical ${environment} environment...`, 'yellow');
    
    try {
        // Pull environment variables from Infisical and write to temporary .env file
        const envOutput = execSync(`infisical export --format dotenv --env ${environment}`, { 
            encoding: 'utf8',
            stdio: 'pipe'
        });
        
        // Write to temporary .env file
        fs.writeFileSync('.env', envOutput);
        log('✅ Environment variables pulled successfully', 'green');
        
        return parseEnvContent(envOutput);
    } catch (error) {
        log('❌ Error pulling environment variables from Infisical:', 'red');
        log(error.message, 'red');
        process.exit(1);
    }
}

function parseEnvContent(content) {
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

function generateTypeScriptBinding(envVars, outputPath, dryRun = false) {
    const keys = Object.keys(envVars).sort(); // Sort keys for consistent output
    
    if (keys.length === 0) {
        log('⚠️  No environment variables found', 'yellow');
        return;
    }

    log(`📝 Found ${keys.length} environment variables`, 'blue');

    // Generate TypeScript interface
    const tsContent = `// This file is auto-generated by scripts/generate-env-binding.js
// Do not edit it directly. Run the script to regenerate.

export interface ENV_BINDING {
${keys.map(key => `  ${key}: string;`).join('\n')}
}

// Legacy exports for backward compatibility (will be removed in future versions)
export type BACKEND_BINDING = ENV_BINDING;
export type FRONTEND_BINDING = ENV_BINDING;
export type PACKAGE_BINDING = ENV_BINDING;
`;

    if (dryRun) {
        log('🔍 DRY RUN - Generated TypeScript content:', 'blue');
        console.log(tsContent);
        return;
    }

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write TypeScript file
    fs.writeFileSync(outputPath, tsContent);
    log(`✅ TypeScript bindings generated: ${outputPath}`, 'green');
}

async function main() {
    const options = parseArgs();

    if (options.help) {
        showHelp();
        return;
    }

    log('🚀 Starting environment binding generation...', 'blue');
    
    if (options.dryRun) {
        log('🔍 DRY RUN MODE - No files will be written', 'blue');
    }

    checkPrerequisites();

    // Pull environment variables from Infisical
    const envVars = pullEnvironmentVariables(options.environment);

    // Generate TypeScript binding
    generateTypeScriptBinding(envVars, options.output, options.dryRun);

    log('', 'reset');
    if (options.dryRun) {
        log('🔍 Dry run completed! Review the generated content above.', 'blue');
    } else {
        log('🎉 Environment binding generation completed successfully!', 'green');
        log(`📁 Generated file: ${options.output}`, 'blue');
        log('💡 Next steps: Run "npm run pkg" to build the updated env package', 'yellow');
    }
}

main().catch(error => {
    log(`❌ Unexpected error: ${error.message}`, 'red');
    process.exit(1);
});