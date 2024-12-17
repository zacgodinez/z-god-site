import { I18N } from 'astrowind:config';

export const formatter: Intl.DateTimeFormat = new Intl.DateTimeFormat(I18N?.language, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

export const getFormattedDate = (date: Date): string => (date ? formatter.format(date) : '');

export const trim = (str = '', ch?: string) => {
  const FIRST_INDEX = 0;
  const LAST_INDEX_OFFSET = 1;

  let start = FIRST_INDEX;
  let end = str.length;

  while (start < end && str[start] === ch) {
    ++start;
  }

  while (end > start && str[end - LAST_INDEX_OFFSET] === ch) {
    --end;
  }

  const trimmingOccurred = start > FIRST_INDEX || end < str.length;
  return trimmingOccurred ? str.substring(start, end) : str;
};
