export class ElectionDetailsDTO {
  constructor(id, title, description, dateStart, dateEnd, candidatesIDs) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.dateStart = dateStart;
    this.dateEnd = dateEnd;
    this.candidatesIDs = candidatesIDs;
  }
}
