import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';
import { Zodiac } from '../shared/models/zodiac.interface';
import { ZODIAC_DATA } from '../shared/data/zodiac.data';

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
    // ==================== 第一部分：阿皮狗區塊的條件渲染 ====================

    // 使用 ViewChildren 取得頁面上所有的 section 元素（包含阿皮狗區塊和其他區塊）
    // 統一使用 Angular 工具，保持概念一致性
    const sectionElements = this.allSections;

    // 如果還沒有初始化完成，直接返回
    if (!sectionElements || sectionElements.length === 0) {
      return;
    }

    /**
     * IntersectionObserver 設定物件
     *
     * threshold: [0, 0.5, 1] 表示當element的可見度為 0%、50%、100% 時都會觸發回調
     * - 0: element剛開始進入或完全離開視窗
     * - 0.5: element有一半在視窗中（我們用這個來觸發切換）
     * - 1: element完全在視窗中
     *
     * rootMargin: '0px' 表示沒有額外的邊距，使用視窗本身作為觀察範圍
     */
    const observerOptions: IntersectionObserverInit = {
      threshold: [0, 0.5, 1],
      rootMargin: '0px'
    };

    /**
     * 建立 IntersectionObserver 實例來監聽滾動
     *
     * 工作原理：
     * 1. 當使用者滾動時，Observer 會檢查哪些 section 在視窗中
     * 2. 如果某個 section 超過 50% 可見（intersectionRatio > 0.5）
     * 3. 就根據該 section 的內容來決定要顯示哪個阿皮狗區塊
     * 4. 透過 setCurrentSection() 來控制 signals，實現條件渲染
     */
    const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      // entries 是一個陣列，包含所有狀態改變的元素
      entries.forEach((entry: IntersectionObserverEntry) => {
        // 只有當元素超過一半可見時才處理
        if (entry.intersectionRatio > 0.5) {
          const section = entry.target as HTMLElement;

          // 透過檢查 section 內的文字內容來識別是哪個區塊
          // 這個方法雖然不是最優雅的，但很直觀且有效

          // 如果是包含「阿皮狗」標題的區塊
          if (section.querySelector('h2')?.textContent?.includes('阿皮狗')) {
            this.setCurrentSection('title');  // 顯示標題區塊

            // 如果是包含「傻狗幫 CEO」的區塊
          } else if (section.querySelector('p')?.textContent?.includes('傻狗幫 CEO')) {
            this.setCurrentSection('name');   // 顯示職稱區塊

            // 如果是包含故事內容的區塊
          } else if (section.querySelector('p')?.textContent?.includes('從內湖收容所')) {
            this.setCurrentSection('story');  // 顯示故事區塊

            // 如果是包含技能描述的區塊
          } else if (section.querySelector('p')?.textContent?.includes('不會後空翻')) {
            this.setCurrentSection('skills'); // 顯示技能區塊

            // 如果是包含名言的區塊
          } else if (section.querySelector('blockquote')?.textContent?.includes('看什麼看')) {
            this.setCurrentSection('quote');  // 顯示名言區塊
          }
        }
      });
    }, observerOptions);

    // 為每個 section 註冊觀察者，開始監聽滾動
    // 使用 ViewChildren 的 ElementRef，從中取得 nativeElement
    sectionElements.forEach(sectionRef => {
      observer.observe(sectionRef.nativeElement);
    });

    // ==================== 第二部分：其他區塊的淡入動畫 ====================

    // 使用 ViewChildren 獲取所有標記為 .fade-in-section 的元素（如 Zane、個人簡介、興趣等區塊）
    // 這比 document.querySelectorAll 更 Angular 化，且提供更好的類型安全
    const fadeInElements = this.fadeInSections;

    // 如果沒有找到需要動畫的元素，就跳過第二部分
    if (!fadeInElements || fadeInElements.length === 0) {
      return;
    }

    /**
     * 為其他區塊（非阿皮狗區塊）建立淡入動畫觀察者
     *
     * 這個觀察者與上面的不同：
     * - 上面是條件渲染（切換顯示/隱藏）
     * - 這個是淡入動畫（從透明變不透明，只執行一次）
     *
     * 設定說明：
     * - threshold: 0.1 表示元素只要有 10% 進入視窗就觸發
     * - rootMargin: '0px 0px -100px 0px' 表示底部提前 100px 觸發
     *   （讓動畫更早開始，使用者體驗更好）
     */
    const fadeInObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry: IntersectionObserverEntry) => {
        // isIntersecting 表示元素是否與觀察範圍重疊
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;

          // 從 HTML 的 data-* 屬性讀取動畫類型和延遲時間
          const animation = element.dataset['animation'];         // 如 'fade-up', 'fade-left'
          const delay = parseInt(element.dataset['delay'] || '0', 10);  // 延遲時間（毫秒）

          // 使用 setTimeout 來實現延遲動畫效果
          setTimeout(() => {
            // 基本的淡入效果：設定透明度為 1，位移歸零
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';

            // 根據動畫類型設定不同的最終位置
            if (animation === 'fade-left') {
              // 從左側滑入的動畫
              element.style.transform = 'translateX(0)';
            } else if (animation === 'fade-right') {
              // 從右側滑入的動畫
              element.style.transform = 'translateX(0)';
            }
            // fade-up 的動畫已經在上面的 translateY(0) 處理了
          }, delay);

          // 動畫觸發後就取消觀察，避免重複執行
          // （不像條件渲染需要持續監聽，淡入動畫只需要執行一次）
          fadeInObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,                     // 10% 可見就觸發
      rootMargin: '0px 0px -100px 0px'    // 底部提前 100px 觸發
    });

    // 為每個需要淡入動畫的元素設定初始狀態並開始監聽
    // 使用 ViewChildren 的 QueryList，提供更好的類型安全和 Angular 整合
    fadeInElements.forEach(elementRef => {
      // 從 ElementRef 取得實際的 DOM 元素
      const element = elementRef.nativeElement;

      // 設定初始狀態：完全透明
      element.style.opacity = '0';

      // 設定 CSS 過渡效果：0.8 秒的平滑動畫，使用 cubic-bezier 緩動函數
      element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';

      // 根據動畫類型設定初始位置（動畫會從這個位置移動到最終位置）
      const animation = element.dataset['animation'];
      if (animation === 'fade-up') {
        // 從下往上淡入：初始位置向下偏移 30px
        element.style.transform = 'translateY(30px)';
      } else if (animation === 'fade-left') {
        // 從左往右淡入：初始位置向左偏移 30px
        element.style.transform = 'translateX(-30px)';
      } else if (animation === 'fade-right') {
        // 從右往左淡入：初始位置向右偏移 30px
        element.style.transform = 'translateX(30px)';
      }

      // 開始觀察這個元素（注意：Observer 需要的是 Element，不是 ElementRef）
      fadeInObserver.observe(element);
    });
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