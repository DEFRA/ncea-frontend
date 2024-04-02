const getDaySuffix = (day: number): string => {
  if (day >= 11 && day <= 13) {
    return 'th';
  }
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

const formatDate = (
  dateString: string,
  includeTime: boolean = true,
  includeSuffix: boolean = false,
  delimiter: string = ' ',
): string => {
  const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  if (!isValidDate(dateString)) {
    return '';
  }

  const date = new Date(dateString);
  let day: number | string = date.getDate();
  const month: string = date.toLocaleString('en-GB', { month: 'short' });
  const year: number = date.getFullYear();
  let hours: number | string = date.getHours();
  let minutes: number | string = date.getMinutes();
  day = day < 10 ? '0' + day : day;

  let formattedDate = `${day}`;

  if (includeSuffix) {
    const suffix = getDaySuffix(+day);
    formattedDate += suffix;
  }

  formattedDate += `${delimiter}${month}${delimiter}${year}`;

  if (includeTime && (hours !== 0 || minutes !== 0)) {
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    formattedDate += ` @${hours}${minutes}`;
  }

  return formattedDate;
};

export { formatDate };
