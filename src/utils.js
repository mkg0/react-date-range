import classnames from 'classnames';
import defaultLocale from 'date-fns/locale/en-US';
import {
  addMonths,
  areIntervalsOverlapping,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
} from 'date-fns';

export function calcFocusDate(currentFocusedDate, props) {
  const { shownDate, date, months, ranges, focusedRange, displayMode } = props;
  const dateOptions = getDateOptions(props);

  const getFocusedDateOfRange = (range, focusedRange) => {
    const focusedStep = focusedRange[1];
    if (focusedStep === 1) return range.end;
    return range.start;
  };

  let targetInterval;
  const isRangeMode = displayMode === 'dateRange';
  if (isRangeMode) {
    const range = ranges[focusedRange[0]] || {};
    targetInterval = {
      start: range.startDate,
      end: range.endDate,
    };
  } else {
    targetInterval = {
      start: date,
      end: date,
    };
  }

  // move interval to edges
  targetInterval.start = startOfMonth(targetInterval.start || new Date(), dateOptions);
  targetInterval.end = endOfMonth(targetInterval.end || targetInterval.start, dateOptions);

  let targetDate = isRangeMode
    ? getFocusedDateOfRange(targetInterval, focusedRange)
    : targetInterval.start;
  if (!targetDate) {
    targetDate = targetInterval.start || targetInterval.end || shownDate || new Date();
  }
  // initial focus
  if (!currentFocusedDate) return shownDate || targetDate;

  // // just return targetDate for native scrolled calendars
  // if (props.scroll.enabled) return targetDate;
  const currentFocusInterval = {
    start: startOfMonth(currentFocusedDate, dateOptions),
    end: endOfMonth(addMonths(currentFocusedDate, months - 1), dateOptions),
  };
  if (areIntervalsOverlapping(targetInterval, currentFocusInterval)) {
    // don't change focused if new selection in view area
    return currentFocusedDate;
  }
  return targetDate;
}

export function findNextRangeIndex(ranges, currentRangeIndex = -1) {
  const nextIndex = ranges.findIndex(
    (range, i) => i > currentRangeIndex && range.autoFocus !== false && !range.disabled
  );
  if (nextIndex !== -1) return nextIndex;
  return ranges.findIndex(range => range.autoFocus !== false && !range.disabled);
}

export function getMonthDisplayRange(date, dateOptions) {
  const startDateOfMonth = startOfMonth(date, dateOptions);
  const endDateOfMonth = endOfMonth(date, dateOptions);
  const startDateOfCalendar = startOfWeek(startDateOfMonth, dateOptions);
  const endDateOfCalendar = endOfWeek(endDateOfMonth, dateOptions);
  return {
    start: startDateOfCalendar,
    end: endDateOfCalendar,
    startDateOfMonth,
    endDateOfMonth,
  };
}

export function generateStyles(sources) {
  if (!sources.length) return {};
  const generatedStyles = sources
    .filter(source => Boolean(source))
    .reduce((styles, styleSource) => {
      Object.keys(styleSource).forEach(key => {
        if (styleSource[key]) styles[key] = classnames(styles[key], styleSource[key]);
      });
      return styles;
    }, {});
  return generatedStyles;
}

export function getDateOptions(props) {
  debugger;
  return {
    locale: props.locale || defaultLocale,
  };
}
