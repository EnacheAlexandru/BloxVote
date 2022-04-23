const Vote = artifacts.require("Vote");

contract("Vote", (accounts) => {
  let instance;
  beforeEach(async () => {
    instance = await Vote.new();
  });

  // ===== ADD ELECTION =====

  it("addElection - Invalid | Empty election title", async () => {
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
        false,
        { from: accounts[0] }
      );
    } catch (error) {
      errorMsg = error.reason;
    }
    assert.equal(errorMsg, "Invalid election title");
  });

  it("addElection - Invalid | Election should lasts at least 30 minutes", async () => {
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
        false,
        { from: accounts[0] }
      );
    } catch (error) {
      errorMsg = error.reason;
    }
    assert.equal(errorMsg, "Election should lasts at least 30 minutes");
  });

  it("addElection - Invalid | Election should not start in the past", async () => {
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
        false,
        { from: accounts[0] }
      );
    } catch (error) {
      errorMsg = error.reason;
    }
    assert.equal(errorMsg, "Election should not start in the past");
  });

  it("addElection - Invalid | Should be at least two candidates", async () => {
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
        false,
        { from: accounts[0] }
      );
    } catch (error) {
      errorMsg = error.reason;
    }
    assert.equal(errorMsg, "Invalid number of candidates");
  });

  it("addElection - Invalid | One candidate has empty description", async () => {
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
        false,
        { from: accounts[0] }
      );
    } catch (error) {
      errorMsg = error.reason;
    }
    assert.equal(errorMsg, "At least one invalid candidate description");
  });

  it("addElection - Invalid | Not the administrator", async () => {
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
        false,
        { from: accounts[1] }
      );
    } catch (error) {
      errorMsg = error.reason;
    }
    assert.equal(errorMsg, "Not the administrator");
  });

  it("addElection - Valid | Add one election", async () => {
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
      false,
      { from: accounts[0] }
    );

    const elections = await instance.getElections();

    assert.equal(elections[0]["id"], "1");
    assert.equal(elections[0]["candidatesIDs"][1], "2");
  });

  // ===== REGISTER VOTER =====

  it("registerVoter - Invalid | Election does not exist", async () => {
    let errorMsg = "";
    try {
      await instance.registerVoter(accounts[1], 1);
    } catch (error) {
      errorMsg = error.reason;
    }
    assert.equal(errorMsg, "Election does not exist");
  });

  it("registerVoter - Invalid | Administrator not allowed to vote", async () => {
    const dateStart = new Date();
    dateStart.setDate(dateStart.getDate() - 2);

    const dateEnd = new Date();
    dateEnd.setDate(dateEnd.getDate() + 4);

    await instance.addElection(
      "Best tank",
      "We must decide once and for all which is the best tank",
      Math.floor(dateStart.getTime() / 1000),
      Math.floor(dateEnd.getTime() / 1000),
      [
        ["Tiger", "German"],
        ["Sherman", "American"],
        ["Cromwell", "British"],
      ],
      true,
      { from: accounts[0] }
    );

    let errorMsg = "";
    try {
      await instance.registerVoter(accounts[0], 1);
    } catch (error) {
      errorMsg = error.reason;
    }
    assert.equal(errorMsg, "Administrator not allowed to vote");
  });

  it("registerVoter - Valid | Voter successfully registered", async () => {
    const dateStart = new Date();
    dateStart.setDate(dateStart.getDate() - 2);

    const dateEnd = new Date();
    dateEnd.setDate(dateEnd.getDate() + 4);

    await instance.addElection(
      "Best tank",
      "We must decide once and for all which is the best tank",
      Math.floor(dateStart.getTime() / 1000),
      Math.floor(dateEnd.getTime() / 1000),
      [
        ["Tiger", "German"],
        ["Sherman", "American"],
        ["Cromwell", "British"],
      ],
      true,
      { from: accounts[0] }
    );

    await instance.registerVoter(accounts[1], 1);

    const listOfElectionToCandidate = await instance.getVoter({
      from: accounts[1],
    });

    assert.equal(listOfElectionToCandidate[0]["electionID"], 1);
    assert.equal(listOfElectionToCandidate[0]["candidateID"], 0);
  });

  it("registerVoter - Invalid | Voter already registered", async () => {
    const dateStart = new Date();
    dateStart.setDate(dateStart.getDate() - 2);

    const dateEnd = new Date();
    dateEnd.setDate(dateEnd.getDate() + 4);

    await instance.addElection(
      "Best tank",
      "We must decide once and for all which is the best tank",
      Math.floor(dateStart.getTime() / 1000),
      Math.floor(dateEnd.getTime() / 1000),
      [
        ["Tiger", "German"],
        ["Sherman", "American"],
        ["Cromwell", "British"],
      ],
      true,
      { from: accounts[0] }
    );

    await instance.registerVoter(accounts[1], 1);

    let errorMsg = "";
    try {
      await instance.registerVoter(accounts[1], 1);
    } catch (error) {
      errorMsg = error.reason;
    }
    assert.equal(errorMsg, "Already registered to the election");
  });

  it("registerVoter - Invalid | Election ended", async () => {
    const dateStart = new Date();
    dateStart.setDate(dateStart.getDate() - 4);

    const dateEnd = new Date();
    dateEnd.setDate(dateEnd.getDate() - 2);

    await instance.addElection(
      "Best tank",
      "We must decide once and for all which is the best tank",
      Math.floor(dateStart.getTime() / 1000),
      Math.floor(dateEnd.getTime() / 1000),
      [
        ["Tiger", "German"],
        ["Sherman", "American"],
        ["Cromwell", "British"],
      ],
      true,
      { from: accounts[0] }
    );

    let errorMsg = "";
    try {
      await instance.registerVoter(accounts[1], 1);
    } catch (error) {
      errorMsg = error.reason;
    }
    assert.equal(errorMsg, "Election ended");
  });

  // ===== VOTE =====

  it("vote - Invalid | Election not open", async () => {
    const dateStart = new Date();
    dateStart.setDate(dateStart.getDate() + 2);

    const dateEnd = new Date();
    dateEnd.setDate(dateEnd.getDate() + 4);

    await instance.addElection(
      "Best tank",
      "We must decide once and for all which is the best tank",
      Math.floor(dateStart.getTime() / 1000),
      Math.floor(dateEnd.getTime() / 1000),
      [
        ["Tiger", "German"],
        ["Sherman", "American"],
        ["Cromwell", "British"],
      ],
      true,
      { from: accounts[0] }
    );

    await instance.registerVoter(accounts[1], 1);

    let errorMsg = "";
    try {
      await instance.vote(1, 3, { from: accounts[1] });
    } catch (error) {
      errorMsg = error.reason;
    }
    assert.equal(errorMsg, "Election not open");
  });

  it("vote - Invalid | Candidate does not exists", async () => {
    const dateStart = new Date();
    dateStart.setDate(dateStart.getDate() - 2);

    const dateEnd = new Date();
    dateEnd.setDate(dateEnd.getDate() + 4);

    await instance.addElection(
      "Best tank",
      "We must decide once and for all which is the best tank",
      Math.floor(dateStart.getTime() / 1000),
      Math.floor(dateEnd.getTime() / 1000),
      [
        ["Tiger", "German"],
        ["Sherman", "American"],
        ["Cromwell", "British"],
      ],
      true,
      { from: accounts[0] }
    );

    await instance.registerVoter(accounts[1], 1);

    let errorMsg = "";
    try {
      await instance.vote(1, 4, { from: accounts[1] });
    } catch (error) {
      errorMsg = error.reason;
    }
    assert.equal(errorMsg, "Candidate does not exist");
  });

  it("vote - Invalid | Candidate exists but not in election", async () => {
    let dateStart = new Date();
    dateStart.setDate(dateStart.getDate() - 2);

    let dateEnd = new Date();
    dateEnd.setDate(dateEnd.getDate() + 4);

    await instance.addElection(
      "Best tank",
      "We must decide once and for all which is the best tank",
      Math.floor(dateStart.getTime() / 1000),
      Math.floor(dateEnd.getTime() / 1000),
      [
        ["Tiger", "German"],
        ["Sherman", "American"],
        ["Cromwell", "British"],
      ],
      true,
      { from: accounts[0] }
    );

    dateStart = new Date();
    dateStart.setDate(dateStart.getDate() - 2);

    dateEnd = new Date();
    dateEnd.setDate(dateEnd.getDate() + 4);

    await instance.addElection(
      "Best tank",
      "We must decide once and for all which is the best tank",
      Math.floor(dateStart.getTime() / 1000),
      Math.floor(dateEnd.getTime() / 1000),
      [
        ["Tiger", "German"],
        ["Sherman", "American"],
        ["Cromwell", "British"],
      ],
      true,
      { from: accounts[0] }
    );

    await instance.registerVoter(accounts[1], 1);

    let errorMsg = "";
    try {
      await instance.vote(1, 4, { from: accounts[1] });
    } catch (error) {
      errorMsg = error.reason;
    }
    assert.equal(errorMsg, "Candidate not in election");
  });

  it("vote - Invalid | Voter not registered", async () => {
    const dateStart = new Date();
    dateStart.setDate(dateStart.getDate() - 2);

    const dateEnd = new Date();
    dateEnd.setDate(dateEnd.getDate() + 4);

    await instance.addElection(
      "Best tank",
      "We must decide once and for all which is the best tank",
      Math.floor(dateStart.getTime() / 1000),
      Math.floor(dateEnd.getTime() / 1000),
      [
        ["Tiger", "German"],
        ["Sherman", "American"],
        ["Cromwell", "British"],
      ],
      true,
      { from: accounts[0] }
    );

    let errorMsg = "";
    try {
      await instance.vote(1, 3, { from: accounts[1] });
    } catch (error) {
      errorMsg = error.reason;
    }
    assert.equal(errorMsg, "Not registered");
  });

  it("vote - Valid | Voter successfully voted", async () => {
    const dateStart = new Date();
    dateStart.setDate(dateStart.getDate() - 2);

    const dateEnd = new Date();
    dateEnd.setDate(dateEnd.getDate() + 4);

    await instance.addElection(
      "Best tank",
      "We must decide once and for all which is the best tank",
      Math.floor(dateStart.getTime() / 1000),
      Math.floor(dateEnd.getTime() / 1000),
      [
        ["Tiger", "German"],
        ["Sherman", "American"],
        ["Cromwell", "British"],
      ],
      true,
      { from: accounts[0] }
    );

    await instance.registerVoter(accounts[1], 1);

    const candidatesBefore = await instance.getCandidatesByElectionID(1);
    assert.equal(candidatesBefore[2]["numberVotes"], 0);

    await instance.vote(1, 3, { from: accounts[1] });

    const votes = await instance.getVoter({ from: accounts[1] });
    const candidatesAfter = await instance.getCandidatesByElectionID(1);

    assert.equal(candidatesAfter[2]["numberVotes"], 1);
    assert.equal(votes[0]["electionID"], 1);
    assert.equal(votes[0]["candidateID"], 3);
  });

  it("vote - Invalid | Voter has already voted", async () => {
    const dateStart = new Date();
    dateStart.setDate(dateStart.getDate() - 2);

    const dateEnd = new Date();
    dateEnd.setDate(dateEnd.getDate() + 4);

    await instance.addElection(
      "Best tank",
      "We must decide once and for all which is the best tank",
      Math.floor(dateStart.getTime() / 1000),
      Math.floor(dateEnd.getTime() / 1000),
      [
        ["Tiger", "German"],
        ["Sherman", "American"],
        ["Cromwell", "British"],
      ],
      true,
      { from: accounts[0] }
    );

    await instance.registerVoter(accounts[1], 1);
    await instance.vote(1, 3, { from: accounts[1] });

    let errorMsg = "";
    try {
      await instance.vote(1, 2, { from: accounts[1] });
    } catch (error) {
      errorMsg = error.reason;
    }
    assert.equal(errorMsg, "Already voted");
  });
});
