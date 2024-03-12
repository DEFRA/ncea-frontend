import { months } from './constants';

const formatDate = (dateString: string): string => {
  const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  if (!isValidDate(dateString)) {
    return '';
  }

  const date = new Date(dateString);
  let day: number | string = date.getDate();
  const month: string = months[date.getMonth()]!;
  const year: number = date.getFullYear();
  let hours: number | string = date.getHours();
  let minutes: number | string = date.getMinutes();
  day = day < 10 ? '0' + day : day;

  let formattedDate = `${day} ${month} ${year}`;

  if (hours !== 0 || minutes !== 0) {
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    formattedDate += ` @${hours}${minutes}`;
  }

  return formattedDate;
};

export { formatDate };
