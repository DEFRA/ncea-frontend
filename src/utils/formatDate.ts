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

const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

const getYear = (dateString: string): string => {
  if (!isValidDate(dateString)) {
    return '';
  }
  const date = new Date(dateString);
  return `${date.getFullYear()}`;
};

const formatDate = (
  dateString: string,
  includeTime: boolean = true,
  includeSuffix: boolean = false,
  delimiter: string = ' ',
): string => {
  if (!isValidDate(dateString)) {
    return '';
  }

  const date = new Date(dateString);
  const day: number | string = date.getDate();
  const month: string = date.toLocaleString('en-GB', { month: 'long' });
  const year: number = date.getFullYear();
  const hours: number | string = date.getHours();
  const minutes: number | string = date.getMinutes();

  let formattedDate = `${day}`;

  if (includeSuffix) {
    const suffix = getDaySuffix(+day);
    formattedDate += suffix;
  }

  formattedDate += `${delimiter}${month}${delimiter}${year}`;

  if (includeTime && (hours !== 0 || minutes !== 0)) {
    formattedDate += ` at ${hours}`;
    formattedDate += minutes > 0 ? `:${minutes}` : '';
    formattedDate += hours >= 12 ? 'pm' : 'am';
  }

  return formattedDate;
};

export { formatDate, getYear };
