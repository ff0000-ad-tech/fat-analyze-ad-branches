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
    const startingBranchName = _getCurrBranch(repo)
    const validBranches = await _getValidBranches(repo, branches);

    // per-branch actions
    const results = await _analyzeBranches(branches, repo);

    // await fsPr.writeFile(path.resolve(adPath, 'branch-results.json'), JSON.stringify(results, null, 2))
  } catch (err) {
    throw err;
  } finally {
    // clean up code
    // TODO: revert to original branch
  }
}

async function _analyzeBranches(branches, repo) {
  const currBranch = await _getCurrBranch(repo);
  // mapping branches to deferred Promises (e.g. Function returning Promise)
  const branchAnalyses = validBranches.map(branch => () =>
    function() {
      return _analyzeBranch({ branch, currBranch });
    }
  );

  // per-branch actions
  const results = await chainPromises(branchAnalyses)();
  return results;
}

async function _analyzeBranch({ branch, currBranch }) {
  if (branch !== currBranch) {
    // await -- change to branch
    // await -- reinstall
  }

  // - [ ] run Creative Server
  // - [ ] run 2-debug and 3-traffic processes
  // - [ ] Get build.bundle size for debug and traffic builds
  // - [ ] Preview w/ Puppeteer to get HAR
  // - [ ] Analyze HAR and ad runtime for:
  //   - [ ] Total size of requests
  //   - [ ] Time to ad completion
}

async function _getValidBranches(repo, branches) {
  const refNames = await repo.getReferenceNames(Git.Reference.TYPE.LISTALL);
  // get list of branches that exist
  const validBranches = [];
  branches.forEach(branch => {
    if (_branchExists(branch, refNames, REF_NAME_REGEX)) {
      validBranches.push(branch);
    } else {
      // fuzzy matching?
      warnLog(`${branch} is not an existing branch!`);
    }
  });
  return validBranches;
}

async function _getCurrBranch(repo) {
  const startingRef = await repo.getCurrentBranch();
  const startingRefName = startingRef.name();
  return _branchFromRefName(startingRefName);
}

function _branchExists(branch, gitRefNames, refNameRegex) {
  // first match = main branch name
  return gitRefNames.some(refName => {
    const branchName = _branchFromRefName(refName, refNameRegex);
    return refName === branchName;
  });
}

function _branchFromRefName(refName, refNameRegex) {
  const match = refNameRegex.exec(refName);
  return match && match[1];
}

main();
