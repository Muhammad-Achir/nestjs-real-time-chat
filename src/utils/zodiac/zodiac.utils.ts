import { zodiacData } from "./zodiac-data";

export const getZodiac = (birthDate: Date): string => {
  
    const birth = new Date(birthDate);
  
    for (const entry of zodiacData) {
      const start = new Date(entry.start);
      const end = new Date(entry.end);
  
      if (birth >= start && birth <= end) {
        return entry.zodiac;
      }
    }
    return 'Zodiac not found';
  };
  