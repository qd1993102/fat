#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
process.stdout.on('error', process.exit);

const packpath = path.join(process.cwd(), 'package.json');
const pkg = require(packpath);
const key = args[0];
let value;

try {
    value = eval('(pkg.' + key + ')');
    process.stdout.write(value || '');
} catch(e) {
    process.stdout.write('');
    process.exit(1);
}
