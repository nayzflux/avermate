import dayjs from "dayjs";

export const formatGradeValue = (value: number) => {
  return parseFloat((value / 100).toFixed(2));
};

export const formatDiff = (value: number) => {
  return value > 0 ? `+${value.toFixed(2)}` : `${value.toFixed(2)}`;
};

export const formatDate = (date: Date) => {
  return dayjs(date).format("DD MMM[.] YYYY");
};
