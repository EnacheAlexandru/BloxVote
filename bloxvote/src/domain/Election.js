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
