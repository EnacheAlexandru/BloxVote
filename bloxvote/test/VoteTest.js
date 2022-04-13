const Vote = artifacts.require("Vote");

contract("Vote", (accounts) => {
  let instance;
  beforeEach(async () => {
    instance = await Vote.new();

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
  });

  // ===== ADD ELECTION =====

  xit("addElection - Invalid | Empty election title", async () => {
    const dateStart = new Date();
    dateStart.setDate(dateStart.getDate() + 2);

    const dateEnd = new Date();
    dateEnd.setDate(dateEnd.getDate() + 4);

    let errorMsg = "";
    try {
      await instance.addElection(
        "",
        "ab",
        Math.floor(dateStart.getTime() / 1000),
        Math.floor(dateEnd.getTime() / 1000),
        [
          ["ac", "ad"],
          ["ae", "af"],
          ["ag", "ah"],
        ],
        { from: accounts[0] }
      );
    } catch (error) {
      errorMsg = error.reason;
    }
    assert.equal(errorMsg, "Invalid election title");
  });

  xit("addElection - Invalid | End date should be at least one day after the start date", async () => {
    const dateStart = new Date();
    dateStart.setDate(dateStart.getDate() + 2);

    const dateEnd = new Date();
    dateEnd.setDate(dateEnd.getDate() + 2);

    let errorMsg = "";
    try {
      await instance.addElection(
        "aa",
        "ab",
        Math.floor(dateStart.getTime() / 1000),
        Math.floor(dateEnd.getTime() / 1000),
        [
          ["ac", "ad"],
          ["ae", "af"],
          ["ag", "ah"],
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

  xit("addElection - Invalid | Start date should be at least one day after the current date", async () => {
    const dateStart = new Date();
    dateStart.setDate(dateStart.getDate() - 1);

    const dateEnd = new Date();
    dateEnd.setDate(dateEnd.getDate() + 2);

    let errorMsg = "";
    try {
      await instance.addElection(
        "aa",
        "ab",
        Math.floor(dateStart.getTime() / 1000),
        Math.floor(dateEnd.getTime() / 1000),
        [
          ["ac", "ad"],
          ["ae", "af"],
          ["ag", "ah"],
        ],
        { from: accounts[0] }
      );
    } catch (error) {
      errorMsg = error.reason;
    }
    assert.equal(errorMsg, "Invalid start date");
  });

  xit("addElection - Invalid | Should be at least two candidates", async () => {
    const dateStart = new Date();
    dateStart.setDate(dateStart.getDate() + 2);

    const dateEnd = new Date();
    dateEnd.setDate(dateEnd.getDate() + 4);

    let errorMsg = "";
    try {
      await instance.addElection(
        "aa",
        "ab",
        Math.floor(dateStart.getTime() / 1000),
        Math.floor(dateEnd.getTime() / 1000),
        [["ac", "ad"]],
        { from: accounts[0] }
      );
    } catch (error) {
      errorMsg = error.reason;
    }
    assert.equal(errorMsg, "Invalid number of candidates");
  });

  xit("addElection - Invalid | One candidate has empty description", async () => {
    const dateStart = new Date();
    dateStart.setDate(dateStart.getDate() + 2);

    const dateEnd = new Date();
    dateEnd.setDate(dateEnd.getDate() + 4);

    let errorMsg = "";
    try {
      await instance.addElection(
        "aa",
        "ab",
        Math.floor(dateStart.getTime() / 1000),
        Math.floor(dateEnd.getTime() / 1000),
        [
          ["ac", "ad"],
          ["ae", ""],
          ["ag", "ah"],
        ],
        { from: accounts[0] }
      );
    } catch (error) {
      errorMsg = error.reason;
    }
    assert.equal(errorMsg, "At least one invalid candidate description");
  });

  xit("addElection - Invalid | Not the administrator", async () => {
    const dateStart = new Date();
    dateStart.setDate(dateStart.getDate() + 2);

    const dateEnd = new Date();
    dateEnd.setDate(dateEnd.getDate() + 4);

    let errorMsg = "";
    try {
      await instance.addElection(
        "aa",
        "ab",
        Math.floor(dateStart.getTime() / 1000),
        Math.floor(dateEnd.getTime() / 1000),
        [
          ["ac", "ad"],
          ["ae", "af"],
          ["ag", "ah"],
        ],
        { from: accounts[1] }
      );
    } catch (error) {
      errorMsg = error.reason;
    }
    assert.equal(errorMsg, "Not the administrator");
  });

  xit("addElection - Valid | Add one election", async () => {
    const dateStart = new Date();
    dateStart.setDate(dateStart.getDate() + 2);

    const dateEnd = new Date();
    dateEnd.setDate(dateEnd.getDate() + 4);

    await instance.addElection(
      "aa",
      "ab",
      Math.floor(dateStart.getTime() / 1000),
      Math.floor(dateEnd.getTime() / 1000),
      [
        ["ac", "ad"],
        ["ae", "af"],
        ["ag", "ah"],
      ],
      { from: accounts[0] }
    );

    const elections = await instance.getElections();

    // <!> - Initial election with ID 1 must be considered - <!>
    assert.equal(elections[1]["id"], "2");
    assert.equal(elections[1]["candidatesIDs"][1], "5");
  });

  xit("addElection - Valid | Add two elections", async () => {
    const dateStart = new Date();
    dateStart.setDate(dateStart.getDate() + 2);

    const dateEnd = new Date();
    dateEnd.setDate(dateEnd.getDate() + 4);

    await instance.addElection(
      "aa",
      "ab",
      Math.floor(dateStart.getTime() / 1000),
      Math.floor(dateEnd.getTime() / 1000),
      [
        ["ac", "ad"],
        ["ae", "af"],
        ["ag", "ah"],
      ],
      { from: accounts[0] }
    );

    await instance.addElection(
      "ba",
      "bb",
      Math.floor(dateStart.getTime() / 1000),
      Math.floor(dateEnd.getTime() / 1000),
      [
        ["bc", "bd"],
        ["be", "bf"],
      ],
      { from: accounts[0] }
    );

    const elections = await instance.getElections();

    // <!> - Initial election with ID 1 must be considered - <!>
    assert.equal(elections.length, 3);
    assert.equal(elections[1]["id"], "2");
    assert.equal(elections[2]["id"], "3");

    assert.equal(elections[1]["candidatesIDs"][1], "5");
    assert.equal(elections[2]["candidatesIDs"][0], "7");
  });

  // ===== REGISTER VOTER =====

  xit("registerVoter - Invalid | Election does not exist", async () => {
    let errorMsg = "";
    try {
      await instance.registerVoter(accounts[1], 2);
    } catch (error) {
      errorMsg = error.reason;
    }
    assert.equal(errorMsg, "Election does not exist");
  });

  xit("registerVoter - Invalid | Administrator not allowed to vote", async () => {
    let errorMsg = "";
    try {
      await instance.registerVoter(accounts[0], 1);
    } catch (error) {
      errorMsg = error.reason;
    }
    assert.equal(errorMsg, "Administrator not allowed to vote");
  });

  xit("registerVoter - Valid | Unregistered voter successfully registered", async () => {
    await instance.registerVoter(accounts[1], 1);

    const listOfElectionToCandidate = await instance.getVoterByAddress(
      accounts[1]
    );

    assert.equal(listOfElectionToCandidate[0]["electionID"], 1);
    assert.equal(listOfElectionToCandidate[0]["candidateID"], 0);
  });

  xit("registerVoter - Invalid | Voter already registered", async () => {
    await instance.registerVoter(accounts[1], 1);

    let errorMsg = "";
    try {
      await instance.registerVoter(accounts[1], 1);
    } catch (error) {
      errorMsg = error.reason;
    }
    assert.equal(errorMsg, "Already registered to the election");
  });

  // Cannot test because of start date
  xit("registerVoter - Invalid | Election ended", async () => {});

  // ===== VOTE =====

  it("vote - Invalid | Election not open", async () => {
    await instance.registerVoter(accounts[1], 1);

    let errorMsg = "";
    try {
      await instance.vote(accounts[1], 1, 3);
    } catch (error) {
      errorMsg = error.reason;
    }
    assert.equal(errorMsg, "Election not open");
  });

  it("vote - Invalid | Candidate does not exists", async () => {
    await instance.registerVoter(accounts[1], 1);

    let errorMsg = "";
    try {
      await instance.vote(accounts[1], 1, 4);
    } catch (error) {
      errorMsg = error.reason;
    }
    assert.equal(errorMsg, "Candidate does not exist");
  });

  // Cannot test because of start date
  xit("vote - Invalid | Candidate exists but not in election", async () => {
    await instance.registerVoter(accounts[1], 1);

    let errorMsg = "";
    try {
      await instance.vote(accounts[1], 1, 4);
    } catch (error) {
      errorMsg = error.reason;
    }
    assert.equal(errorMsg, "Candidate not in election");
  });

  // Cannot test because of start date
  xit("vote - Invalid | Voter not registered", async () => {
    let errorMsg = "";
    try {
      await instance.vote(accounts[1], 1, 3);
    } catch (error) {
      errorMsg = error.reason;
    }
    assert.equal(errorMsg, "Not registered");
  });

  // Cannot test because of start date
  xit("vote - Invalid | Voter has already voted", async () => {
    await instance.registerVoter(accounts[1], 1);
    await instance.vote(accounts[1], 1, 3);

    let errorMsg = "";
    try {
      await instance.vote(accounts[1], 1, 2);
    } catch (error) {
      errorMsg = error.reason;
    }
    assert.equal(errorMsg, "Already voted");
  });

  // Cannot test because of start date
  xit("vote - Valid | Voter successfully voted", async () => {});
});
