import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';
import { Zodiac } from '../shared/models/zodiac.interface';
import { ZODIAC_DATA } from '../shared/data/zodiac.data';

import { logger } from '../shared/config/logger.config';

/**
 * 主頁組件
 * 包含滾動驅動的動畫效果、阿皮狗介紹區塊、星座配對功能
 *
 * @class HomeComponent
 * @implements {OnInit}
 * @implements {AfterViewInit}
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, AfterViewInit {

  private readonly COMPONENT_NAME = 'HomeComponent';

  /** 控制是否顯示阿皮狗名稱區塊 */
  showDogName: WritableSignal<boolean> = signal(false);

  /** 控制是否顯示阿皮狗標題區塊 */
  showDogTitle: WritableSignal<boolean> = signal(true);

  /** 控制是否顯示阿皮狗故事區塊 */
  showDogStory: WritableSignal<boolean> = signal(false);

  /** 控制是否顯示阿皮狗技能區塊 */
  showDogSkills: WritableSignal<boolean> = signal(false);

  /** 控制是否顯示阿皮狗名言區塊 */
  showDogQuote: WritableSignal<boolean> = signal(false);

  /**
   * 獲取頁面上所有的 section 元素（用於滾動監聽）
   * 包含阿皮狗區塊、圖片區塊、星座區塊等所有 section
   * @type {QueryList<ElementRef<HTMLElement>>}
   * @memberof HomeComponent
   */
  @ViewChildren('section', { read: ElementRef })
  allSections!: QueryList<ElementRef<HTMLElement>>;

  /**
   * 獲取所有需要淡入動畫的元素
   * 使用 ViewChildren 比 document.querySelectorAll 更 Angular 化
   * @type {QueryList<ElementRef<HTMLElement>>}
   * @memberof HomeComponent
   */
  @ViewChildren('.fade-in-section', { read: ElementRef })
  fadeInSections!: QueryList<ElementRef<HTMLElement>>;





  /**
   * 十二星座資料
   * 從外部檔案匯入的星座資料常數
   *
   * @protected
   * @readonly
   * @type {readonly Zodiac[]}
   * @memberof HomeComponent
   */
  protected readonly zodiacs = ZODIAC_DATA;

  /**
  * 建構函式
  * 注入 Router 服務用於路由導航
  *
  * @param {Router} router - Angular 路由器服務
  * @memberof HomeComponent
  */
  constructor(private readonly router: Router) { }

  /**
   * 組件初始化生命週期
   * 目前沒有初始化邏輯
   *
   * @memberof HomeComponent
   */
  ngOnInit = (): void => { }

  /**
   * 組件視圖初始化完成後的生命週期
   * 設定滾動動畫（僅在瀏覽器環境中執行）
   *
   * @memberof HomeComponent
   */
  ngAfterViewInit = (): void => {
    if (isPlatformBrowser(this.platformId)) {
      this.setupScrollAnimations();
    }
  }

  /**
   * 平台 ID 用於判斷是否在瀏覽器環境中執行
   *
   * @private
   * @memberof HomeComponent
   */
  private platformId = inject(PLATFORM_ID);



  /**
   * 設定滾動動畫和條件渲染邏輯
   *
   * 這個函式主要做兩件事：
   * 1. 監聽阿皮狗區塊的滾動，實現條件渲染（一次只顯示一個區塊）
   * 2. 為其他區塊設定淡入動畫效果
   *
   * 統一使用 ViewChildren 來獲取 DOM 元素，保持 Angular 工具的概念一致性
   * 避免混用原生 DOM API 和 Angular API，讓程式碼思維更清晰
   *
   * @private
   * @memberof HomeComponent
   */
  private setupScrollAnimations = (): void => {
    this.setupApidogSectionObserver();
    this.setupFadeInAnimations();
  }

  /**
   * 設定阿皮狗區塊的滾動監聽器
   *
   * 監聽所有 section 元素的滾動狀態，當某個區塊的可見度超過 50% 時，
   * 根據區塊內容自動切換顯示對應的阿皮狗資訊（標題、名稱、故事、技能、名言）
   *
   * @private
   * @memberof HomeComponent
   */
  private setupApidogSectionObserver(): void {
    /** 獲取頁面上所有的 section 元素，用於滾動位置監聽 */
    const sectionElements: QueryList<ElementRef<HTMLElement>> = this.allSections;

    /** 如果沒有 section 元素則提早返回 */
    if (!sectionElements || sectionElements.length === 0) {
      return;
    }

    /** 建立阿皮狗區塊觀察器 */
    const observer: IntersectionObserver = this.createApidogObserver();

    /** 為每個 section 元素註冊 IntersectionObserver */
    sectionElements.forEach((sectionRef, index) => {
      const element = sectionRef.nativeElement;

      logger.debug(`${this.COMPONENT_NAME}.setupApidogSectionObserver: 註冊觀察器`, {
        index,
        className: element.className,
        id: element.id || 'no-id',
        tagName: element.tagName,
        textPreview: element.textContent?.substring(0, 50) || 'no-text'
      }, `tagName 是指 element tag, like : SECTION, textPreview 是指 element text 的前 50 個字元`);

      observer.observe(element);
    });
  }

  /**
   * 建立阿皮狗區塊的 IntersectionObserver
   *
   * 設定觀察器選項並定義當 section 元素可見度改變時的處理邏輯
   *
   * @private
   * @returns {IntersectionObserver} 配置完成的觀察器實例
   * @memberof HomeComponent
   */
  private createApidogObserver(): IntersectionObserver {
    /**
     * IntersectionObserver 設定選項
     * - threshold: 監聽元素的可見度百分比 [0%, 50%, 100%]
     * - rootMargin: 根元素的邊界偏移量，預設為視窗邊界
     */
    const observerOptions: IntersectionObserverInit = {
      threshold: [0, 0.5, 1],
      rootMargin: '0px'
    };

    return new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry: IntersectionObserverEntry) => {

        if (process.env['NODE_ENV'] === 'development') logger.debug(this.COMPONENT_NAME, 'createApidogObserver', entries);

        this.handleSectionIntersection(entry);
      });
    }, observerOptions);
  }

  /**
   * 處理 section 元素的交集狀態變化
   *
   * 當元素可見度超過 50% 時，根據內容判斷並切換對應的阿皮狗區塊
   *
   * @private
   * @param {IntersectionObserverEntry} entry - 觀察器觸發時的元素狀態
   * entry 包含：
   * - target: 被觀察的 DOM 元素
   * - intersectionRatio: 元素可見度比例 (0-1)
   * - isIntersecting: 元素是否進入觀察區域
   * - boundingClientRect: 元素的邊界框資訊
   * - rootBounds: 根容器的邊界框資訊
   * - intersectionRect: 交集區域的邊界框資訊
   * @memberof HomeComponent
   */
  private handleSectionIntersection(entry: IntersectionObserverEntry): void {
    /** 只處理可見度超過 50% 的元素 */
    if (entry.intersectionRatio > 0.5) {
      /** 取得當前觸發的 section 元素 */
      const sectionElement: HTMLElement = entry.target as HTMLElement;

      /** 根據 section 內容判斷要顯示哪個阿皮狗區塊 */
      if (sectionElement.querySelector('h2')?.textContent?.includes('阿皮狗')) {
        this.setCurrentSection('title');
      } else if (sectionElement.querySelector('p')?.textContent?.includes('傻狗幫 CEO')) {
        this.setCurrentSection('name');
      } else if (sectionElement.querySelector('p')?.textContent?.includes('從內湖收容所')) {
        this.setCurrentSection('story');
      } else if (sectionElement.querySelector('p')?.textContent?.includes('不會後空翻')) {
        this.setCurrentSection('skills');
      } else if (sectionElement.querySelector('blockquote')?.textContent?.includes('看什麼看')) {
        this.setCurrentSection('quote');
      }
    }
  }

  /**
   * 設定淡入動畫效果
   *
   * 為所有標記為 '.fade-in-section' 的元素設定滾動觸發的淡入動畫，
   * 當元素進入視窗可見範圍時自動播放淡入效果，並支援延遲和不同方向的動畫
   *
   * @private
   * @memberof HomeComponent
   */
  private setupFadeInAnimations(): void {
    /** 獲取所有需要淡入動畫的元素 */
    const fadeInElements: QueryList<ElementRef<HTMLElement>> = this.fadeInSections;

    /** 如果沒有動畫元素則提早返回 */
    if (!fadeInElements || fadeInElements.length === 0) {
      return;
    }

    /**
     * 建立淡入動畫觀察器
     * - threshold: 0.1 表示元素 10% 進入視窗時觸發
     * - rootMargin: 底部增加 100px 邊界，讓動畫提早觸發
     *
     * @param {IntersectionObserverEntry[]} entries - 進入視窗的元素陣列
     * 每個 entry 代表一個觸發動畫的元素狀態
     */
    const fadeInObserver: IntersectionObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry: IntersectionObserverEntry) => {
        /** 當元素進入視窗可見範圍時觸發動畫 */
        if (entry.isIntersecting) {
          this.triggerFadeInAnimation(entry.target as HTMLElement);
          /** 動畫觸發後停止觀察該元素，避免重複執行 */
          fadeInObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });

    /** 為每個動畫元素初始化樣式並開始觀察 */
    fadeInElements.forEach(elementRef => {
      /** 取得實際的 DOM 元素 */
      const element: HTMLElement = elementRef.nativeElement;
      /** 設定初始動畫狀態（隱藏、位移等） */
      this.initializeFadeInElement(element);
      /** 開始觀察元素進入視窗的時機 */
      fadeInObserver.observe(element);
    });
  }

  private initializeFadeInElement(element: HTMLElement): void {
    element.style.opacity = '0';
    element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';

    const animation: string | undefined = element.dataset['animation'];
    if (animation === 'fade-up') {
      element.style.transform = 'translateY(30px)';
    } else if (animation === 'fade-left') {
      element.style.transform = 'translateX(-30px)';
    } else if (animation === 'fade-right') {
      element.style.transform = 'translateX(30px)';
    }
  }

  private triggerFadeInAnimation(element: HTMLElement): void {
    const animation: string | undefined = element.dataset['animation'];
    const delay: number = parseInt(element.dataset['delay'] || '0', 10);

    setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';

      if (animation === 'fade-left' || animation === 'fade-right') {
        element.style.transform = 'translateX(0)';
      }
    }, delay);
  }
  /**
   * 根據滾動位置設定當前要顯示的 section
   * 只會顯示一個 section，其他全部隱藏
   *
   * @private
   * @param {('title' | 'name' | 'story' | 'skills' | 'quote')} section - 要顯示的區塊類型
   * @memberof HomeComponent
   */
  private setCurrentSection = (section: 'title' | 'name' | 'story' | 'skills' | 'quote'): void => {
    // 重置所有 signals
    this.showDogTitle.set(false);
    this.showDogName.set(false);
    this.showDogStory.set(false);
    this.showDogSkills.set(false);
    this.showDogQuote.set(false);

    // 設定當前要顯示的 section
    switch (section) {
      case 'title':
        this.showDogTitle.set(true);
        break;
      case 'name':
        this.showDogName.set(true);
        break;
      case 'story':
        this.showDogStory.set(true);
        break;
      case 'skills':
        this.showDogSkills.set(true);
        break;
      case 'quote':
        this.showDogQuote.set(true);
        break;
    }
  }

  /**
   * 選擇星座並導航到詳細頁面
   * 將星座英文名稱轉為小寫作為路由參數
   *
   * @protected
   * @param {Zodiac} zodiac - 被選擇的星座物件
   * @memberof HomeComponent
   */
  protected selectZodiac = (zodiac: Zodiac): void => {
    this.router.navigate(['/zodiac-detail', zodiac.englishName.toLowerCase()]);
  }
}