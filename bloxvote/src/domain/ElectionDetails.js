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

export class ElectionDetails {
  constructor(
    id,
    title,
    description,
    dateStart,
    dateEnd,
    electionStatus,
    voterStatus,
    candidates
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.dateStart = dateStart;
    this.dateEnd = dateEnd;
    this.electionStatus = electionStatus;
    this.voterStatus = voterStatus;
    this.candidates = candidates;
  }
}
