export class ElectionDetails {
  constructor(
    id,
    title,
    description,
    dateStart,
    dateEnd,
    electionStatus,
    voterStatus
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.dateStart = dateStart;
    this.dateEnd = dateEnd;
    this.electionStatus = electionStatus;
    this.voterStatus = voterStatus;
  }
}
