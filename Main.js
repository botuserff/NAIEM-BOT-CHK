// ==========================
// Bot Main File (Decoded + Custom ASCII)
// ==========================

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const axios = require('axios');
const chalk = require('chalk');
const moment = require('moment-timezone');

// ==========================
// Global Objects
// ==========================
global.FCA = {
    commands: new Map(),
    events: new Map(),
    cooldowns: new Map(),
    mainPath: process.cwd(),
    handleSchedule: [],
    handleReaction: [],
    handleReply: []
};

global.DATA = {
    threadInfo: new Map(),
    threadData: new Map(),
    userName: new Map(),
    userBanned: new Map(),
    threadBanned: new Map()
};

global.LANG = {};
global.CONFIG = {};

// ==========================
// Load Config
// ==========================
try {
    const configPath = path.join(global.FCA.mainPath, 'config.json');
    const configValue = require(configPath);
    Object.assign(global.CONFIG, configValue);
    console.log(chalk.green('✅ Config loaded successfully.'));
} catch (err) {
    console.log(chalk.red('❌ Failed to load config.json'));
    process.exit(1);
}

// ==========================
// Load AppState
// ==========================
try {
    const appStateFile = path.resolve(global.FCA.mainPath, global.CONFIG.APPSTATEPATH || 'appstate.json');
    global.APPSTATE = require(appStateFile);
    console.log(chalk.green('✅ AppState loaded successfully.'));
} catch (err) {
    console.log(chalk.red('❌ Failed to load appstate.json'));
    process.exit(1);
}

// ==========================
// Load Language File
// ==========================
try {
    const langPath = path.join(__dirname, 'languages', (global.CONFIG.language || 'en') + '.lang');
    const langFile = fs.readFileSync(langPath, 'utf-8')
        .split(/\r?\n|\r/)
        .filter(line => line && line[0] !== '#');

    for (const item of langFile) {
        const sepIndex = item.indexOf('=');
        const key = item.substring(0, sepIndex).split('.').pop();
        const value = item.substring(sepIndex + 1).replace(/\\n/g, '\n');
        global.LANG[key] = value;
    }
    console.log(chalk.green('✅ Language loaded successfully.'));
} catch (err) {
    console.log(chalk.red('❌ Failed to load language file.'));
    process.exit(1);
}

// ==========================
// Helper Function for Language
// ==========================
global.getText = function(key, ...args) {
    if (!global.LANG[key]) throw `${__filename} - Key "${key}" not found`;
    let text = global.LANG[key];
    for (let i = args.length - 1; i >= 0; i--) {
        text = text.replace(new RegExp(`%${i}`, 'g'), args[i]);
    }
    return text;
};

// ==========================
// Custom ASCII Art
// ==========================
const colorOptions = ['red', 'green', 'blue', 'yellow', 'magenta', 'cyan', 'white'];
const selectedColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];

const BOT_ART = chalk[selectedColor](`
███╗░░██╗░█████╗░██╗███████╗███╗░░░███╗
████╗░██║██╔══██╗██║██╔════╝████╗░████║
██╔██╗██║███████║██║█████╗░░██╔████╔██║
██║╚████║██╔══██║██║██╔══╝░░██║╚██╔╝██║
██║░╚███║██║░░██║██║███████╗██║░╚═╝░██║
╚═╝░░╚══╝╚═╝░░╚═╝╚═╝╚══════╝╚═╝░░░░░╚═╝
`);

console.log(BOT_ART);

// ==========================
// Bot Login (Example)
// ==========================
const login = require('./utils/login');  // your custom login module

login({ appState: global.APPSTATE }, (error, api) => {
    if (error) return console.error(chalk.red('❌ Bot login failed:'), error);
    console.log(chalk.green('✅ Bot logged in successfully.'));
    
    // Example: start listening for events
    api.listenMqtt(async (err, event) => {
        if (err) console.error(err);
        // handle event
    });
});
