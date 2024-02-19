const isEmpty = (value: string | number | undefined | null): boolean => {
  if (typeof value !== 'undefined' && value !== null && value !== '') {
    return false;
  }
  return true;
};

export { isEmpty };
