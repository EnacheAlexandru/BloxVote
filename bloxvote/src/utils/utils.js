export const ElectionStatus = {
  NOT_STARTED: "NOT_STARTED",
  OPEN: "OPEN",
  ENDED: "ENDED",
};

export const VoterStatus = {
  NOT_REGISTERED: "NOT_REGISTERED",
  NOT_VOTED: "NOT_VOTED",
  VOTED: "VOTED",
};

export function dateToString(date) {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear(),
    hour = "" + d.getHours(),
    minute = "" + d.getMinutes();

  if (month.length < 2) {
    month = "0" + month;
  }
  if (day.length < 2) {
    day = "0" + day;
  }
  if (hour.length < 2) {
    hour = "0" + hour;
  }
  if (minute.length < 2) {
    minute = "0" + minute;
  }

  return `${day}/${month}/${year} ${hour}:${minute}`;
}

export function computeElectionStatus(dateStart, dateEnd) {
  const now = Math.floor(new Date().getTime());

  if (now < dateStart) {
    return ElectionStatus.NOT_STARTED;
  }
  if (now >= dateStart && now <= dateEnd) {
    return ElectionStatus.OPEN;
  }
  return ElectionStatus.ENDED;
}

export function computeVoterStatus(electionID, votes) {
  if (!votes.hasOwnProperty(electionID)) {
    return VoterStatus.NOT_REGISTERED;
  }
  if (votes[electionID] === "0") {
    return VoterStatus.NOT_VOTED;
  }
  return VoterStatus.VOTED;
}
