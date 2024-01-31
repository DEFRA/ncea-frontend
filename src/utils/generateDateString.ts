import { IDateObject } from '../interfaces/searchPayload.interface';
import { isEmpty } from './isEmpty';

const generateDateString = (dateObject: IDateObject): string => {
  const month = !isEmpty(dateObject.month) ? dateObject.month! : 1;
  const day = !isEmpty(dateObject.day) ? dateObject.day! : 1;

  const date = new Date(Date.UTC(dateObject.year, month - 1, day));

  const dateString = date.toISOString().slice(0, 10);

  return dateString;
};

export { generateDateString };
