var helpers = require("../lib/helpers");

function _generateNumSeq(n) {
  return new Array(n).fill(1).map((_, i) => i + 1);
}

function _generatePromises(n, numSeq) {
  return (numSeq || _generateNumSeq(n)).map(num => () => Promise.resolve(num));
}

describe("Chain Promises", function() {
  it("resolves with results of deferred Promises", function(done) {
    const numPromises = 1 + ~~(5 * Math.random());
    const numSeq = _generateNumSeq(numPromises);
    const promises = _generatePromises(numPromises, numSeq);
    helpers
      .chainPromises(promises)()
      .then(results => {
        expect(results).toEqual(numSeq);
        done();
      });
  });
});
