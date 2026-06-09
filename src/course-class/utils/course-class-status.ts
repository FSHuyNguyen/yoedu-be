export enum CourseClassStatus {
  OPEN = 'OPEN',
  ONGOING = 'ONGOING',
  CLOSED = 'CLOSED',
}

export const getCourseClassStatus = (
  startDate: Date,
  endDate: Date,
): CourseClassStatus => {
  const now = new Date();

  if (now < startDate) {
    return CourseClassStatus.OPEN;
  }

  if (now <= endDate) {
    return CourseClassStatus.ONGOING;
  }

  return CourseClassStatus.CLOSED;
};
