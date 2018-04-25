import { findNextRangeIndex, getMonthDisplayRange, calcFocusDate, generateStyles } from './utils';
import { enGB, enUS } from 'date-fns/locale';

const dateOptions = {
  locale: enGB,
};

const USADateOptions = {
  locale: enUS,
};

const rangeProps = {
  displayMode: 'dateRange',
  months: 1,
  focusedRange: [0, 0],
  updateShownDateOnChange: true,
  updateShownDateToFocusedRange: false,
  ...dateOptions,
};

const calendarProps = {
  displayMode: 'date',
  months: 1,
  ...dateOptions,
};

const testDate = new Date(2018, 3, 26, 12, 0, 0, 0);

describe('range focusing operations', () => {
  const ranges = [
    {},
    { disabled: true },
    { autoFocus: false },
    { disabled: true, autoFocus: false },
    {},
  ];
  it('should focus first range at initial', () => {
    expect(findNextRangeIndex(ranges)).toBe(0);
  });

  it('should consider disable/autoFocus props of range', () => {
    expect(findNextRangeIndex(ranges, 0)).toBe(4);
  });

  it('should reiterate the first range after the last focused range', () => {
    expect(findNextRangeIndex(ranges, findNextRangeIndex(ranges, 0))).toBe(0);
  });
});

describe('getMonthDisplayRange', () => {
  it('should get month display range', () => {
    const range = getMonthDisplayRange(testDate, dateOptions);
    expect(range).toEqual({
      start: new Date(2018, 2, 26, 0, 0, 0, 0),
      end: new Date(2018, 4, 6, 23, 59, 59, 999),
      startDateOfMonth: new Date(2018, 3, 1, 0, 0, 0, 0),
      endDateOfMonth: new Date(2018, 3, 30, 23, 59, 59, 999),
    });
  });

  it('should get month display range with locale', () => {
    const range = getMonthDisplayRange(new Date(2018, 3, 26), USADateOptions);
    expect(range).toEqual({
      start: new Date(2018, 3, 1, 0, 0, 0, 0),
      end: new Date(2018, 4, 5, 23, 59, 59, 999),
      startDateOfMonth: new Date(2018, 3, 1, 0, 0, 0, 0),
      endDateOfMonth: new Date(2018, 3, 30, 23, 59, 59, 999),
    });
  });
});

describe('calcFocusDate', () => {
  it('should focus shownDate at dateRange display', () => {
    expect(
      calcFocusDate(null, {
        ranges: [{ startDate: testDate, endDate: testDate }],
        ...rangeProps,
        shownDate: new Date(2018, 0, 15, 0, 0, 0, 0),
      })
    ).toEqual(new Date(2018, 0, 15, 0, 0, 0, 0));
  });

  it('should focus shownDate at calendar display', () => {
    expect(
      calcFocusDate(null, {
        ...calendarProps,
        shownDate: new Date(2018, 0, 15, 0, 0, 0, 0),
      })
    ).toEqual(new Date(2018, 0, 15, 0, 0, 0, 0));
  });

  it('should focus start date of first range', () => {
    expect(
      calcFocusDate(null, {
        ranges: [{ startDate: testDate, endDate: testDate }],
        ...rangeProps,
      })
    ).toEqual(new Date(2018, 3, 1, 0, 0, 0, 0));
  });

  it('should focus the range that the focused one', () => {
    expect(
      calcFocusDate(null, {
        ...calendarProps,
        date: testDate,
      })
    ).toEqual(new Date(2018, 3, 1, 0, 0, 0, 0));
  });

  it('should focus to focused date of ranges', () => {
    expect(
      calcFocusDate(null, {
        ...rangeProps,
        focusedRange: [0, 1],
        ranges: [
          {
            startDate: new Date(2018, 1, 5, 0, 0, 0, 0),
            endDate: new Date(2018, 6, 26, 0, 0, 0, 0),
          },
        ],
      }).toDateString()
    ).toEqual(new Date(2018, 6, 31, 23, 59, 59, 999).toDateString());
  });

  it("shouldn't change focused range if view range is overlapping target range", () => {
    expect(
      calcFocusDate(new Date(2018, 2, 26, 12, 0, 0, 0), {
        ...rangeProps,
        ranges: [
          {
            startDate: new Date(2018, 1, 26, 0, 0, 0, 0),
            endDate: new Date(2018, 4, 26, 0, 0, 0, 0),
          },
        ],
      })
    ).toEqual(new Date(2018, 2, 26, 12, 0, 0, 0));
  });

  it("should focus if view range isn't overlapping target range", () => {
    expect(
      calcFocusDate(new Date(2018, 2, 26, 12, 0, 0, 0), {
        ...rangeProps,
        ranges: [
          {
            startDate: new Date(2019, 1, 1, 0, 0, 0, 0),
            endDate: new Date(2019, 1, 26, 0, 0, 0, 0),
          },
        ],
      })
    ).toEqual(new Date(2019, 1, 1, 0, 0, 0, 0));
  });
});

describe('generateStyles', () => {
  const mockThemeStyles = {
    calendarWrapper: 'rdrCalendarWrapper',
    months: 'rdrMonths',
    nonValid: undefined,
  };
  const sampleUserStyles = {
    calendarWrapper: 'calendar',
    unused: 'unusedStyle',
  };
  it('should generate styles with the classnames props', () => {
    expect(generateStyles([mockThemeStyles, sampleUserStyles])).toEqual({
      calendarWrapper: 'rdrCalendarWrapper calendar',
      months: 'rdrMonths',
      unused: 'unusedStyle',
    });
  });
});
