import { Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Zodiac } from '../shared/models/zodiac.interface';
import { ZODIAC_DATA } from '../shared/data/zodiac.data';
import { ZODIAC_MATCHES } from '../shared/data/zodiac-matches.data';
import { ZODIAC_PERSONALITIES } from '../shared/data/zodiac-personalities.data';

@Component({
  selector: 'app-zodiac-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './zodiac-detail.component.html',
  styleUrl: './zodiac-detail.component.css'
})
export class ZodiacDetailComponent implements OnInit {
  protected readonly currentZodiac = signal<Zodiac | null>(null);

  /**
   * 星座資料，從共享檔案匯入
   * @private
   * @readonly
   */
  private readonly zodiacs = ZODIAC_DATA;

  /**
   * 星座配對資料，從共享檔案匯入
   * @private
   * @readonly
   */
  private readonly zodiacMatches = ZODIAC_MATCHES;

  /**
   * 星座性格資料，從共享檔案匯入
   * @private
   * @readonly
   */
  private readonly zodiacPersonalities = ZODIAC_PERSONALITIES;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  /**
   * 組件初始化生命週期
   * 從路由參數中獲取星座名稱並設定當前星座
   * @memberof ZodiacDetailComponent
   */
  ngOnInit = (): void => {
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

  /**
   * 根據星座英文名稱獲取最佳配對資訊
   * @protected
   * @param {string} englishName - 星座英文名稱
   * @returns {string} 配對描述
   * @memberof ZodiacDetailComponent
   */
  protected getBestMatch = (englishName: string): string => {
    return this.zodiacMatches[englishName] || '與所有星座都有獨特的緣分 ✨';
  }

  /**
   * 根據星座英文名稱獲取性格特質描述
   * @protected
   * @param {string} englishName - 星座英文名稱
   * @returns {string} 性格描述
   * @memberof ZodiacDetailComponent
   */
  protected getPersonality = (englishName: string): string => {
    return this.zodiacPersonalities[englishName] || '每個星座都有獨特的魅力 ⭐';
  }

  /**
   * 返回首頁的導航方法
   * @protected
   * @memberof ZodiacDetailComponent
   */
  protected goBack = (): void => {
    this.router.navigate(['/']);
  }
}