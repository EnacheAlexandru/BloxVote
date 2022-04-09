const Vote = artifacts.require("Vote");

module.exports = function (deployer) {
  deployer.deploy(Vote);
};

//truffle compile
//truffle migrate --reset

//truffle console

// vote = await Vote.deployed()
