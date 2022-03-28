export function dateToString(date) {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [day, month, year].join("/");
}

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
