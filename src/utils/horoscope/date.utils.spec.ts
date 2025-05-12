import { getHoroscope } from './date.utils';

describe('getHoroscope', () => {
  it('should return Aries for March 21', () => {
    console.info('test')
    console.info(getHoroscope(new Date('1990-01-01')))
    expect(getHoroscope(new Date('2000-03-21'))).toBe('Aries');
  });
});
