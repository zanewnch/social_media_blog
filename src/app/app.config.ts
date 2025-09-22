import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

/**
 * Angular 應用程式配置物件。
 * 配置應用程式運行所需的主要提供者和服務。
 *
 * @type {ApplicationConfig}
 * @description 此配置包含：
 * - 瀏覽器錯誤處理的全域錯誤監聽器
 * - 具有事件合併優化的 Zone.js 變更檢測
 * - 包含應用程式路由的路由提供者
 *
 * @example
 * ```typescript
 * import { bootstrapApplication } from '@angular/platform-browser';
 * import { AppComponent } from './app/app.component';
 * import { appConfig } from './app/app.config';
 *
 * bootstrapApplication(AppComponent, appConfig);
 * ```
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
  ]
};
