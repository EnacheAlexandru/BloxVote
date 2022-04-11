const Vote = artifacts.require("Vote");

contract("Vote", (accounts) => {
  let instance;
  before(async () => {
    instance = await Vote.deployed();
  });

  it("addElection - Invalid election title", async () => {
    const dateStart = new Date();
    dateStart.setDate(dateStart.getDate() + 2);

    const dateEnd = new Date();
    dateEnd.setDate(dateEnd.getDate() + 4);

    let errorMsg = "";
    try {
      await instance.addElection(
        "",
        "The next 4 years will be important for our city! Your vote is very important for our future!",
        dateStart.getTime(),
        dateEnd.getTime(),
        [
          ["John Manner", "I want to make lots of parks!"],
          [
            "Umbert Gothium",
            "I want to make a new hospital and a new mall for my lovely citizens!",
          ],
          ["Cassandra Biggiy", "I want to build an airport!"],
        ],
        { from: accounts[0] }
      );
    } catch (error) {
      errorMsg = error.reason;
    }
    assert.equal(errorMsg, "Invalid election title");
  });

  it("addElection - End and start dates should be more than one day apart", async () => {
    const dateStart = new Date();
    dateStart.setDate(dateStart.getDate() + 2);

    const dateEnd = new Date();
    dateEnd.setDate(dateEnd.getDate() + 2);

    let errorMsg = "";
    try {
      await instance.addElection(
        "Vote for your mayor",
        "The next 4 years will be important for our city! Your vote is very important for our future!",
        dateStart.getTime(),
        dateEnd.getTime(),
        [
          ["John Manner", "I want to make lots of parks!"],
          [
            "Umbert Gothium",
            "I want to make a new hospital and a new mall for my lovely citizens!",
          ],
          ["Cassandra Biggiy", "I want to build an airport!"],
        ],
        { from: accounts[0] }
      );
    } catch (error) {
      errorMsg = error.reason;
    }
    assert.equal(
      errorMsg,
      "End and start dates should be more than one day apart"
    );
  });

  it("addElection - Invalid start date", async () => {
    const dateStart = new Date();
    dateStart.setDate(dateStart.getDate() - 1);

    const dateEnd = new Date();
    dateEnd.setDate(dateEnd.getDate() + 2);

    let errorMsg = "";
    try {
      await instance.addElection(
        "Vote for your mayor",
        "The next 4 years will be important for our city! Your vote is very important for our future!",
        dateStart.getTime(),
        dateEnd.getTime(),
        [
          ["John Manner", "I want to make lots of parks!"],
          [
            "Umbert Gothium",
            "I want to make a new hospital and a new mall for my lovely citizens!",
          ],
          ["Cassandra Biggiy", "I want to build an airport!"],
        ],
        { from: accounts[0] }
      );
    } catch (error) {
      errorMsg = error.reason;
    }
    assert.equal(errorMsg, "Invalid start date");
  });

  it("addElection - Invalid number of candidates", async () => {
    const dateStart = new Date();
    dateStart.setDate(dateStart.getDate() + 2);

    const dateEnd = new Date();
    dateEnd.setDate(dateEnd.getDate() + 4);

    let errorMsg = "";
    try {
      await instance.addElection(
        "Vote for your mayor",
        "The next 4 years will be important for our city! Your vote is very important for our future!",
        dateStart.getTime(),
        dateEnd.getTime(),
        [["John Manner", "I want to make lots of parks!"]],
        { from: accounts[0] }
      );
    } catch (error) {
      errorMsg = error.reason;
    }
    assert.equal(errorMsg, "Invalid number of candidates");
  });

  it("addElection - One candidate has invalid description", async () => {
    const dateStart = new Date();
    dateStart.setDate(dateStart.getDate() + 2);

    const dateEnd = new Date();
    dateEnd.setDate(dateEnd.getDate() + 4);

    let errorMsg = "";
    try {
      await instance.addElection(
        "Vote for your mayor",
        "The next 4 years will be important for our city! Your vote is very important for our future!",
        dateStart.getTime(),
        dateEnd.getTime(),
        [
          ["John Manner", "I want to make lots of parks!"],
          ["Umbert Gothium", ""],
          ["Cassandra Biggiy", "I want to build an airport!"],
        ],
        { from: accounts[0] }
      );
    } catch (error) {
      errorMsg = error.reason;
    }
    assert.equal(errorMsg, "At least one invalid candidate description");
  });

  it("addElection - Not the administrator", async () => {
    const dateStart = new Date();
    dateStart.setDate(dateStart.getDate() + 2);

    const dateEnd = new Date();
    dateEnd.setDate(dateEnd.getDate() + 4);

    let errorMsg = "";
    try {
      await instance.addElection(
        "Vote for your mayor",
        "The next 4 years will be important for our city! Your vote is very important for our future!",
        dateStart.getTime(),
        dateEnd.getTime(),
        [
          ["John Manner", "I want to make lots of parks!"],
          [
            "Umbert Gothium",
            "I want to make a new hospital and a new mall for my lovely citizens!",
          ],
          ["Cassandra Biggiy", "I want to build an airport!"],
        ],
        { from: accounts[1] }
      );
    } catch (error) {
      errorMsg = error.reason;
    }
    assert.equal(errorMsg, "Not the administrator");
  });

  it("addElection - Valid", async () => {
    const dateStart = new Date();
    dateStart.setDate(dateStart.getDate() + 2);

    const dateEnd = new Date();
    dateEnd.setDate(dateEnd.getDate() + 4);

    await instance.addElection(
      "Vote for your mayor",
      "The next 4 years will be important for our city! Your vote is very important for our future!",
      dateStart.getTime(),
      dateEnd.getTime(),
      [
        ["John Manner", "I want to make lots of parks!"],
        [
          "Umbert Gothium",
          "I want to make a new hospital and a new mall for my lovely citizens!",
        ],
        ["Cassandra Biggiy", "I want to build an airport!"],
      ],
      { from: accounts[0] }
    );

    const elections = await instance.getElections();

    assert.equal(elections[0]["id"], "1");
    assert.equal(elections[0]["candidatesIDs"][1], "2");
  });
});
