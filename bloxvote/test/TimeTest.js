const Vote = artifacts.require("Vote");

module.exports = async function (deployer) {
  const instance = await Vote.deployed();
  const accounts = await web3.eth.getAccounts();

  // await instance.addElection(
  //   "test",
  //   "time",
  //   1649538000,
  //   1663426000,
  //   [
  //     ["tiger", "leopard"],
  //     ["lion", "puma"],
  //   ],
  //   true
  // );

  for (let i = 28; i <= 38; i++) {
    let startTime = new Date();

    await instance.registerVoter(accounts[i], 2);
    const txReceipt = await instance.vote(2, 3, { from: accounts[i] });

    let endTime = new Date();

    console.log(
      "Vote #" +
        i.toString() +
        ": " +
        (endTime - startTime).toString() +
        " ms. Gas used: " +
        txReceipt.receipt.gasUsed.toString()
    );
  }
};
