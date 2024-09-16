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
  return `${date.getUTCFullYear()}`;
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

  const monthNames: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const date = new Date(dateString);
  const day: number | string = date.getUTCDate();
  const month: string = monthNames[date.getUTCMonth()]!;
  const year: number = date.getUTCFullYear();
  let hours: number | string = date.getUTCHours();
  const minutes: number | string = date.getUTCMinutes();

  let formattedDate = `${day}`;

  if (includeSuffix) {
    const suffix = getDaySuffix(+day);
    formattedDate += suffix;
  }

  formattedDate += `${delimiter}${month}${delimiter}${year}`;

  if (includeTime && (hours !== 0 || minutes !== 0)) {
    const meridian: string = hours >= 12 ? 'pm' : 'am';
    hours = hours < 10 ? '0' + hours : hours;
    formattedDate += ` at ${hours}`;
    if (minutes > 0) {
      formattedDate += minutes < 10 ? ':0' + minutes : `:${minutes}`;
    }
    formattedDate += meridian;
  }

  return formattedDate;
};

const validateDate = (date: number, month: number, year: number): boolean => {
  const dtStr = `${year}-${month}-${date}`;
  const dt = new Date(dtStr);
  const dtYear = dt.getFullYear();
  const dtMonth = dt.getMonth() + 1;
  const dtDate = dt.getDate();
  return dtDate === date && dtMonth === month && dtYear === year;
};

export { formatDate, getYear, validateDate };
