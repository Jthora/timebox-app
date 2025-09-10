import { formatHMS, formatDurationLabel, formatTime } from "../utils/timeFormatter";

describe('timeFormatter', () => {
  test('formatHMS under one hour', () => {
    expect(formatHMS(75)).toBe('1:15');
  });

  test('formatHMS over one hour', () => {
    expect(formatHMS(3661)).toBe('1:01:01');
  });

  test('formatDurationLabel minutes', () => {
    expect(formatDurationLabel(900)).toBe('15 mins');
  });

  test('formatDurationLabel single hour', () => {
    expect(formatDurationLabel(3600)).toBe('1 hr');
  });

  test('formatDurationLabel fractional hours', () => {
    expect(formatDurationLabel(5400)).toBe('1.5 hrs');
  });

  test('formatTime alias matches formatHMS', () => {
    expect(formatTime(7322)).toBe(formatHMS(7322));
  });
});