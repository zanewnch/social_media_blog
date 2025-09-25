import { Zodiac } from '../models/zodiac.interface';

/**
 * 十二星座資料常數
 * 包含星座的中英文名稱、表情符號和日期範圍
 *
 * @constant
 * @type {readonly Zodiac[]}
 */
export const ZODIAC_DATA: readonly Zodiac[] = [
  { name: '摩羯座', englishName: 'Capricorn', emoji: '♑', dates: '12/22-1/19' },
  { name: '水瓶座', englishName: 'Aquarius', emoji: '♒', dates: '1/20-2/18' },
  { name: '雙魚座', englishName: 'Pisces', emoji: '♓', dates: '2/19-3/20' },
  { name: '牡羊座', englishName: 'Aries', emoji: '♈', dates: '3/21-4/19' },
  { name: '金牛座', englishName: 'Taurus', emoji: '♉', dates: '4/20-5/20' },
  { name: '雙子座', englishName: 'Gemini', emoji: '♊', dates: '5/21-6/21' },
  { name: '巨蟹座', englishName: 'Cancer', emoji: '♋', dates: '6/22-7/22' },
  { name: '獅子座', englishName: 'Leo', emoji: '♌', dates: '7/23-8/22' },
  { name: '處女座', englishName: 'Virgo', emoji: '♍', dates: '8/23-9/22' },
  { name: '天秤座', englishName: 'Libra', emoji: '♎', dates: '9/23-10/23' },
  { name: '天蠍座', englishName: 'Scorpio', emoji: '♏', dates: '10/24-11/21' },
  { name: '射手座', englishName: 'Sagittarius', emoji: '♐', dates: '11/22-12/21' }
] as const;