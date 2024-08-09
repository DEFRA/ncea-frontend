export const ValidateDate = (date, month, year) => {
  const dtStr = year + '-' + month + '-' + date;
  const dt = new Date(dtStr);
  const dtYear = dt.getFullYear();
  const dtMonth = dt.getMonth() + 1;
  const dtDate = dt.getDate();
  return dtDate == date && dtMonth == month && dtYear == year;
};
