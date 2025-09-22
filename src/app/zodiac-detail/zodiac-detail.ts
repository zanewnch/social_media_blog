import { Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Zodiac {
  name: string;
  englishName: string;
  emoji: string;
  dates: string;
}

@Component({
  selector: 'app-zodiac-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './zodiac-detail.html',
  styleUrl: './zodiac-detail.css'
})
export class ZodiacDetail implements OnInit {
  protected readonly currentZodiac = signal<Zodiac | null>(null);

  private readonly zodiacs: Zodiac[] = [
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
  ];

  private readonly zodiacMatches: Record<string, string> = {
    'Capricorn': '處女座 ♍ - 實務派的完美組合，彼此欣賞對方的責任感和細心',
    'Aquarius': '雙子座 ♊ - 思想自由的靈魂伴侶，永遠有聊不完的話題',
    'Pisces': '巨蟹座 ♋ - 溫柔體貼的情感連結，天生的心靈相通',
    'Aries': '獅子座 ♌ - 火象星座的激情碰撞，充滿活力和冒險精神',
    'Taurus': '摩羯座 ♑ - 穩定踏實的土象配對，共同打造安穩的未來',
    'Gemini': '天秤座 ♎ - 風象星座的智慧對話，優雅而充滿趣味',
    'Cancer': '天蠍座 ♏ - 水象星座的深度情感，彼此的心靈港灣',
    'Leo': '射手座 ♐ - 火象星座的樂觀組合，一起探索世界的美好',
    'Virgo': '金牛座 ♉ - 土象星座的完美主義，追求品質生活的夥伴',
    'Libra': '水瓶座 ♒ - 風象星座的和諧平衡，理想主義的浪漫',
    'Scorpio': '雙魚座 ♓ - 水象星座的神秘吸引，深刻而浪漫的愛情',
    'Sagittarius': '牡羊座 ♈ - 火象星座的自由靈魂，一起追逐夢想和冒險'
  };

  private readonly zodiacPersonalities: Record<string, string> = {
    'Capricorn': '務實穩重，有強烈的責任感和事業心。喜歡有計劃的生活，是可靠的伴侶',
    'Aquarius': '獨立創新，思想前衛。重視友情和精神交流，需要自由空間',
    'Pisces': '敏感浪漫，富有同情心。直覺力強，容易受環境影響，需要理解和包容',
    'Aries': '積極主動，充滿活力。喜歡挑戰和競爭，有時略顯急躁但很有魅力',
    'Taurus': '穩定實際，追求安全感。喜歡美好事物，固執但忠誠可靠',
    'Gemini': '聰明機智，適應力強。好奇心旺盛，善於溝通但有時缺乏深度',
    'Cancer': '溫柔體貼，家庭觀念重。情感豐富，保護慾強，是天生的照顧者',
    'Leo': '自信大方，天生的領導者。喜歡被讚美和關注，慷慨而有魅力',
    'Virgo': '細心謹慎，追求完美。分析能力強，有時過於挑剔但很可靠',
    'Libra': '優雅和諧，追求平衡。社交能力強，猶豫不決但很有魅力',
    'Scorpio': '神秘深沉，情感強烈。洞察力強，佔有慾強但很專一',
    'Sagittarius': '樂觀自由，熱愛冒險。哲學思維，直率坦誠，需要自由空間'
  };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const zodiacName = this.route.snapshot.paramMap.get('zodiac');
    if (zodiacName) {
      const zodiac = this.zodiacs.find(z => z.englishName.toLowerCase() === zodiacName.toLowerCase());
      if (zodiac) {
        this.currentZodiac.set(zodiac);
      } else {
        this.router.navigate(['/']);
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  protected getBestMatch(englishName: string): string {
    return this.zodiacMatches[englishName] || '與所有星座都有獨特的緣分 ✨';
  }

  protected getPersonality(englishName: string): string {
    return this.zodiacPersonalities[englishName] || '每個星座都有獨特的魅力 ⭐';
  }

  protected goBack(): void {
    this.router.navigate(['/']);
  }
}