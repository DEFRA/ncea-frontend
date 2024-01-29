import { IDateObject } from '../models/interfaces/searchPayload.interface';

const generateDateString = (dateObject: IDateObject): string => {
  const month = dateObject.month ?? 1;
  const day = dateObject.day ?? 1;

  const date = new Date(Date.UTC(dateObject.year, month - 1, day));

  const dateString = date.toISOString().slice(0, 10);

  return dateString;
};

export { generateDateString };
