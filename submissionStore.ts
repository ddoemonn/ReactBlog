interface Submission {
  timestamp: number;
  count: number;
}

const submissionStore: { [ip: string]: Submission } = {};

export function getSubmission(ip: string): Submission | undefined {
  return submissionStore[ip];
}

export function updateSubmission(ip: string): void {
  const currentTimestamp = Date.now();
  if (!submissionStore[ip]) {
    submissionStore[ip] = { timestamp: currentTimestamp, count: 1 };
  } else {
    const submission = submissionStore[ip];
    const oneDay = 24 * 60 * 60 * 1000;

    if (currentTimestamp - submission.timestamp > oneDay) {
      submissionStore[ip] = { timestamp: currentTimestamp, count: 1 };
    } else {
      submissionStore[ip].count += 1;
    }
  }
}
