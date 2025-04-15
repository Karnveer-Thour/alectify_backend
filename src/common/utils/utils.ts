import * as moment from 'moment';
import * as momentTimeZone from 'moment-timezone';
import { find as findTimeZone } from 'geo-tz';
import { extname } from 'path';

const DISPLAY_DATE_TIME_FORMAT_24H = 'MMM DD, YYYY, HH:mm:ss';
const DISPLAY_DATE_TIME_FORMAT_12H = 'MMM DD, YYYY, h:mm:ss A';
const DISPLAY_DATE_TIME_WITHOUT_SECOND_FORMAT_24H = 'MMM DD, YYYY, HH:mm';
const DISPLAY_DATE_TIME_WITHOUT_SECOND_FORMAT_12H = 'MMM DD, YYYY, h:mm A';

export const enumToTile = (text: string): string => {
  return text
    .replace(/_/g, ' ')
    .replace(
      /\w\S*/g,
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .replace('Pm', 'PM');
};

export const decodeURL = (text: string): string => {
  return decodeURIComponent(text.split('?')[0].split('.com/').reverse()[0]);
};

export const dateToUTC = (date = null) => {
  return (date ? moment(date) : moment()).utc().toDate();
};

export const getTimeZone = (lat, lng) => {
  return findTimeZone(lat, lng)[0]; // Get timezone based on lat/lng
};

export const getTimeZoneShortForm = (timezone) => {
  return new Intl.DateTimeFormat('en', {
    timeZone: timezone,
    timeZoneName: 'short',
  })
    .formatToParts()
    .find((part) => part.type === 'timeZoneName')?.value;
};

export const displayDate = (date) => {
  return date ? moment(date).format('MMM DD, YYYY') : '-';
};

export const displayDateWithTime = (date, use12HourFormat) => {
  return date
    ? moment(date).format(
        use12HourFormat
          ? DISPLAY_DATE_TIME_FORMAT_12H
          : DISPLAY_DATE_TIME_FORMAT_24H,
      )
    : '-';
};

export const displayDateWithTimeZone = (date, use12HourFormat, timezone) => {
  return date
    ? timezone
      ? momentTimeZone(date)
          .tz(timezone)
          .format(
            use12HourFormat
              ? DISPLAY_DATE_TIME_FORMAT_12H
              : DISPLAY_DATE_TIME_FORMAT_24H,
          )
      : moment(date).format(
          use12HourFormat
            ? DISPLAY_DATE_TIME_FORMAT_12H
            : DISPLAY_DATE_TIME_FORMAT_24H,
        )
    : '-';
};

export const displayDateWithTimeZoneWithOutSecond = (
  date,
  use12HourFormat,
  timezone,
) => {
  return date
    ? timezone
      ? momentTimeZone(date)
          .tz(timezone)
          .format(
            use12HourFormat
              ? DISPLAY_DATE_TIME_WITHOUT_SECOND_FORMAT_12H
              : DISPLAY_DATE_TIME_WITHOUT_SECOND_FORMAT_24H,
          )
      : moment(date).format(
          use12HourFormat
            ? DISPLAY_DATE_TIME_WITHOUT_SECOND_FORMAT_12H
            : DISPLAY_DATE_TIME_WITHOUT_SECOND_FORMAT_24H,
        )
    : '-';
};

export const toArray = (value: string | string[]): string[] => {
  return typeof value === 'string' ? [value] : value ?? [];
};

export const cleanHtmlTags = (text: string): string => {
  return text.replace(/<[^>]+>/g, '');
};

export const getFileNameFromFiles = (files): string[] => {
  return files.map((file) => file.originalname);
};

export const getFileNameFromFolders = (files, folders): string[] => {
  const fileNames = [];
  Object.keys(folders).map((folder) => {
    const element = files[folders[folder]];
    if (element?.length) {
      fileNames.push(...element.map((file) => file.originalname));
    }
  });
  return fileNames;
};

export const disAllowedExtensions = (filenames: string[]) => {
  const DISALLOWED_EXTENSIONS = [
    '.exe',
    '.bat',
    '.sh',
    '.js',
    '.vbs',
    '.scr',
    '.pif',
    '.msi',
    '.com',
    '.jar',
    '.php',
    '.pl',
    '.zip',
  ];
  const disAllowedExtensions = filenames.filter((filename) => {
    const extnme = extname(filename).toLowerCase();
    return DISALLOWED_EXTENSIONS.includes(extnme);
  });

  return disAllowedExtensions;
};
