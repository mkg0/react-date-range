import { createStaticRanges } from './defaultRanges';
import { enGB } from 'date-fns/locale';

const rangeProps = {
  locale: enGB,
};

describe('createStaticRanges', () => {
  const testDate = new Date(2018, 1, 1);
  const definedRanges = createStaticRanges([
    {
      label: '',
      value: '',
      range() {
        return {
          startDate: testDate,
          endDate: testDate,
        };
      },
    },
  ]);

  it('should return defined range', () => {
    expect(definedRanges[0].range(rangeProps)).toEqual({
      startDate: testDate,
      endDate: testDate,
    });
  });

  it('should return isSelected false for nonmatching range', () => {
    const nonMatchingRange = {
      startDate: new Date(),
      endDate: new Date(),
    };
    expect(definedRanges[0].isSelected(nonMatchingRange, rangeProps)).toBe(false);
  });

  it('should return isSelected true for matching range', () => {
    const matchingRange = {
      startDate: new Date(2018, 1, 1),
      endDate: new Date(2018, 1, 1),
    };
    expect(definedRanges[0].isSelected(matchingRange, rangeProps)).toBe(true);
  });
});
