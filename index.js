#!/usr/bin/env node
const fsPr = require("fs").promises;
const path = require("path");
const util = require("util");
const puppeteer = require("puppeteer");
const argv = require("yargs")
  .array("b")
  .array("branches").argv;

async function main() {
  const adPath = argv._[0];
  const branches = argv.b || argv.branches;
}

main();
