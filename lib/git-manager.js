async function getCurrBranch(repo, refNameRegex) {
  const startingRef = await repo.getCurrentBranch();
  const startingRefName = startingRef.name();
  return branchFromRefName(startingRefName, refNameRegex);
}

function branchExists(branch, gitRefNames, refNameRegex) {
  // first match = main branch name
  return gitRefNames.some(refName => {
    const branchName = branchFromRefName(refName, refNameRegex);
    return refName === branchName;
  });
}

function branchFromRefName(refName, refNameRegex) {
  const match = refNameRegex.exec(refName);
  return match && match[1];
}

async function analyzeBranches(branches, repo) {
  const currBranch = await gitManager.getCurrBranch(repo);
  // mapping branches to deferred Promises (e.g. Function returning Promise)
  const branchAnalyses = validBranches.map(branch => () =>
    function() {
      return analyzeBranch({ branch, currBranch });
    }
  );

  // per-branch actions
  const results = await chainPromises(branchAnalyses)();
  return results;
}

async function analyzeBranch({ branch, currBranch }) {
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

async function getValidBranches(repo, branches, refNameRegex) {
  const refNames = await repo.getReferenceNames(Git.Reference.TYPE.LISTALL);
  // get list of branches that exist
  const validBranches = [];
  branches.forEach(branch => {
    if (branchExists(branch, refNames, refNameRegex)) {
      validBranches.push(branch);
    } else {
      // fuzzy matching?
      warnLog(`${branch} is not an existing branch!`);
    }
  });
  return validBranches;
}

module.exports = {
  getCurrBranch,
  analyzeBranches,
  getValidBranches
};
