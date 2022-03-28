export class ElectionDetails {
  constructor(
    id,
    title,
    description,
    dateStart,
    dateEnd,
    electionStatus,
    candidates
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.dateStart = dateStart;
    this.dateEnd = dateEnd;
    this.electionStatus = electionStatus;
    this.candidates = candidates; // Map<candidateID, numberVotes>
  }
}
