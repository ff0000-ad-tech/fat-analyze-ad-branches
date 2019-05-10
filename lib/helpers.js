const fsPr = require("fs").promises;
const path = require("path");

exports.chainPromises = function chainPromises(
  promiseCreators,
  idx,
  currPromiseCreator,
  results = []
) {
  const last = promiseCreators.length - 1;
  idx = !isNaN(idx) ? idx : last;
  currPromiseCreator = currPromiseCreator || promiseCreators[last];
  if (idx === last) {
    currPromiseCreator = _interceptPromiseCreator(currPromiseCreator, results);
  }

  const prevPromiseCreator = promiseCreators[idx - 1];
  if (idx > 0) {
    return chainPromises(
      promiseCreators,
      idx - 1,
      () =>
        prevPromiseCreator().then(result => {
          results.push(result);
          return currPromiseCreator(result);
        }),
      results
    );
  } else {
    return () => currPromiseCreator().then(() => results);
  }
};

function _interceptPromiseCreator(promiseCreator, resultsArr) {
  return prevResult =>
    promiseCreator().then(result => {
      resultsArr.push(result);
      return result;
    });
}

exports.ensureDir = async function(dir) {
  await fsPr.mkdir(dir, { recursive: true }).catch(err => {
    if (err.code !== "EEXIST") throw err;
  });
};

exports.cleanDir = async function(dirPath) {
  const files = await fsPr.readdir(dirPath);
  const filePaths = files.map(file => path.resolve(dirPath, file));
  const rmPromises = filePaths.map(file => fsPr.unlink(file));
  await Promise.all(rmPromises);
};

exports.updateStrDimensions = (str, width, height) => {
  return str.replace(/\d+x\d+/, `${width}x${height}`);
};

exports.autoGenLabel = suffix => {
  return suffix
    .split("-")
    .map(word => {
      return word[0].toUpperCase() + word.slice(1);
    })
    .join(" ");
};

exports.generateTracker = gs => `\
// GENERIC SOURCE TRACKER: bt-Endframe-Resolve
if (typeof module === 'undefined') {
	module = {}
}
// prettier-ignore
module.exports = ${JSON.stringify(gs, null, 2)};
`;

const colors = {
  Reset: "\x1b[0m",
  Bright: "\x1b[1m",
  Dim: "\x1b[2m",
  Underscore: "\x1b[4m",
  Blink: "\x1b[5m",
  Reverse: "\x1b[7m",
  Hidden: "\x1b[8m",
  fg: {
    Black: "\x1b[30m",
    Red: "\x1b[31m",
    Green: "\x1b[32m",
    Yellow: "\x1b[33m",
    Blue: "\x1b[34m",
    Magenta: "\x1b[35m",
    Cyan: "\x1b[36m",
    White: "\x1b[37m",
    Crimson: "\x1b[38m" //القرمزي
  },
  bg: {
    Black: "\x1b[40m",
    Red: "\x1b[41m",
    Green: "\x1b[42m",
    Yellow: "\x1b[43m",
    Blue: "\x1b[44m",
    Magenta: "\x1b[45m",
    Cyan: "\x1b[46m",
    White: "\x1b[47m",
    Crimson: "\x1b[48m"
  }
};
exports.colors = colors;

const createColorCmdLogger = color => (cmd, ...args) => {
  console.log(color, `* ${cmd} *`, colors.Reset);
  console.log(color, "*".repeat(cmd.length + 4), colors.Reset);
  console.log(color, ...args, colors.Reset);
};

exports.cmdLog = createColorCmdLogger(colors.fg.Green);
exports.cmdErrorLog = createColorCmdLogger(colors.fg.Red);
exports.cmdWarnLog = createColorCmdLogger(colors.fg.Yellow);

const createColorLogger = color =>
  function(...args) {
    console.log(color, "*", ...args, colors.Reset);
  };

exports.progressLog = createColorLogger(colors.fg.Green);
exports.warnLog = createColorLogger(colors.fg.Yellow);
