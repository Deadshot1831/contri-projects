// This file serves as the entry point for the application, initializing the CLI and setting up any necessary configurations.

import { initCLI } from './cli';

const start = async () => {
    try {
        await initCLI();
    } catch (error) {
        console.error('Error initializing the CLI:', error);
        process.exit(1);
    }
};

start();