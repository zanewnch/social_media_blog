/**
 * @fileoverview Angular 應用程式的主要進入點檔案
 *
 * 此檔案負責啟動 Angular 應用程式。這是使用 Angular 14+ 的獨立元件架構，
 * 不需要傳統的 NgModule (app.module.ts) 來啟動應用程式。
 */

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

/**
 * 啟動 Angular 應用程式
 *
 * 使用 bootstrapApplication 函數來啟動獨立元件 (Standalone Component)。
 * 這是 Angular 現代化的啟動方式，取代了傳統的 NgModule 啟動模式。
 *
 * @function
 * @description 執行流程：
 * 1. 載入根元件 (App)
 * 2. 套用應用程式配置 (appConfig)
 * 3. 在瀏覽器中渲染應用程式
 * 4. 如果啟動失敗，會在控制台輸出錯誤訊息
 *
 * @param {Type<any>} App - 根元件類別
 * @param {ApplicationConfig} appConfig - 應用程式配置物件
 * @returns {Promise<ApplicationRef>} 回傳應用程式參考的 Promise
 *
 * @example
 * ```typescript
 * // 傳統 NgModule 方式 (舊版)
 * platformBrowserDynamic().bootstrapModule(AppModule);
 *
 * // 獨立元件方式 (新版)
 * bootstrapApplication(App, appConfig);
 * ```
 */
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
