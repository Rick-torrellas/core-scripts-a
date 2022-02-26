#!/usr/bin/env node
/**
 * @file index.js es el archivo raiz para @core_/scripts .
 * @author Ricardo Torrellas <ricardo.torrejas@gmail.com>
 * @see {@link https://github.com/Rick-torrellas github}
 * @see {@link https://www.npmjs.com/~rick-torrellas npm}
 */
const program = require('commander');
const {version} = require('./../package.json');
program.version(version);

require('./command');

program.parse(process.argv);