export class Voter {
  constructor(address, votes) {
    this.address = address;
    this.votes = votes; // Map<electionID, candidateID>
  }
}
