#!/usr/bin/env node
const fsPr = require("fs").promises;
const path = require("path");
const util = require("util");
const puppeteer = require("puppeteer");
const Git = require("nodegit");
const argv = require("yargs")
  .array("b")
  .array("branches").argv;

const { warnLog } = require("./lib/helpers");

// regex for parsing branch from reference name
const REF_NAME_REGEX = /^refs\/(?:(?:remotes\/[\w\d-]+)|(?:head))\/(.+)$/;

async function main() {
  const adPath = argv._[0];
  const branches = argv.b || argv.branches;

  try {
    const repo = await Git.Repository.open(adPath);
    const startingRef = await repo.getCurrentBranch()
    const startingRefName = startingRef.name()
    const startingBranchName = _branchFromRefName(startingRefName)
    const refNames = await repo.getReferenceNames(Git.Reference.TYPE.LISTALL);
    // get list of branches that exist
    const validBranches = [];
    branches.forEach(branch => {
      if (_branchExists(branch, refNames, REF_NAME_REGEX)) {
        validBranches.push(branch);
      } else {
        // fuzzy matching?
        warnLog(`${branch} is not a valid branch!`);
      }
    });

    // mapping branches to deferred Promises (e.g. Function returning Promise)
    const branchMeasures = validBranches.map(branch => () => async function() {

    })

  // per-branch actions
  const results = await chainPromises(branchMeasures)

  // TODO: revert to original branch
  
  } catch (err) {
    throw err;
  }
}

function _branchExists(branch, gitRefNames, refNameRegex) {
  // first match = main branch name
  return gitRefNames.some(refName => {
    const branchName = _branchFromRefName(refName, refNameRegex)
    return refName === branchName;
  });
}

function _branchFromRefName(refName, refNameRegex) {
    const match = refNameRegex.exec(refName);
    return match && match[1];
}

main();
