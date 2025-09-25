import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';

interface Zodiac {
  name: string;
  englishName: string;
  emoji: string;
  dates: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, AfterViewInit {
  protected readonly zodiacs: Zodiac[] = [
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

  private platformId = inject(PLATFORM_ID);

  constructor(private readonly router: Router) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setupScrollAnimations();
    }
  }

  private setupScrollAnimations(): void {
    const observerOptions: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          const animation = element.dataset['animation'];
          const delay = parseInt(element.dataset['delay'] || '0', 10);

          setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';

            if (animation === 'fade-left') {
              element.style.transform = 'translateX(0)';
            } else if (animation === 'fade-right') {
              element.style.transform = 'translateX(0)';
            }
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('.fade-in-section');
    sections.forEach(section => {
      const element = section as HTMLElement;
      element.style.opacity = '0';
      element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';

      const animation = element.dataset['animation'];
      if (animation === 'fade-up') {
        element.style.transform = 'translateY(30px)';
      } else if (animation === 'fade-left') {
        element.style.transform = 'translateX(-30px)';
      } else if (animation === 'fade-right') {
        element.style.transform = 'translateX(30px)';
      }

      observer.observe(section);
    });
  }

  protected selectZodiac(zodiac: Zodiac): void {
    this.router.navigate(['/zodiac-detail', zodiac.englishName.toLowerCase()]);
  }
}