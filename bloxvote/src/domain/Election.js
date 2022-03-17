export class ElectionStatus {
  static NOT_STARTED = new ElectionStatus("NOT_STARTED");
  static OPEN = new ElectionStatus("OPEN");
  static ENDED = new ElectionStatus("ENDED");
}

export class VoterStatus {
  static NOT_REGISTERED = new VoterStatus("NOT_REGISTERED");
  static NOT_VOTED = new VoterStatus("NOT_VOTED");
  static VOTED = new VoterStatus("VOTED");
}

export class Election {
  constructor(id, title, dateStart, dateEnd, electionStatus, voterStatus) {
    this.id = id;
    this.title = title;
    this.dateStart = dateStart;
    this.dateEnd = dateEnd;
    this.electionStatus = electionStatus;
    this.voterStatus = voterStatus;
  }
}
