export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  return true;
};

export const isPositiveNumber = (value: any): boolean => {
  if (!isRequired(value)) return false;
  const num = Number(value);
  return !isNaN(num) && num > 0;
};

export const isNonNegativeNumber = (value: any): boolean => {
  if (!isRequired(value)) return false;
  const num = Number(value);
  return !isNaN(num) && num >= 0;
};

export const isValidDate = (value: any): boolean => {
  if (!isRequired(value)) return false;
  const date = new Date(value);
  return !isNaN(date.getTime());
};

export const isValidEmail = (value: string): boolean => {
  if (!isRequired(value)) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value.trim());
};
