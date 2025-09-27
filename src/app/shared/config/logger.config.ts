/**
 * @fileoverview Logger 配置
 *
 * 集中管理日誌相關的配置設定，導出配置好的 consola 實例
 */

import { createConsola, LogLevel } from 'consola';

/**
 * 獲取日誌級別
 */
function getLogLevel(): LogLevel {
  const logLevel = process.env['LOG_LEVEL'] || 'info';

  switch (logLevel) {
    case 'silent': return 0;
    case 'error': return 1;
    case 'warn': return 2;
    case 'info': return 3;
    case 'debug': return 4;
    case 'trace': return 5;
    default: return 3;
  }
}

/**
 * 檢查是否為開發環境
 */
function isDevelopment(): boolean {
  return (process.env['NODE_ENV'] || 'development') === 'development';
}

/**
 * 配置好的 logger 實例
 */
export const logger = createConsola({
  level: getLogLevel(),
  formatOptions: {
    date: isDevelopment(),
    colors: process.env['COLORED_OUTPUT'] === 'true',
    compact: false
  }
});

// 如果不啟用控制台日誌，設為靜默模式
if (process.env['CONSOLE_LOGGING'] !== 'true') {
  logger.level = 0;
}

/**
 * 應用程式配置
 */
export const AppConfig = {
  /**
   * 獲取 API URL
   */
  getApiUrl: (): string => {
    return process.env['API_URL'] || 'http://localhost:3000/api';
  },

  /**
   * 檢查是否為開發環境
   */
  isDevelopment: (): boolean => {
    return (process.env['NODE_ENV'] || 'development') === 'development';
  },

  /**
   * 檢查是否為生產環境
   */
  isProduction: (): boolean => {
    return process.env['NODE_ENV'] === 'production';
  },

  /**
   * 功能開關
   */
  features: {
    isPerformanceMonitoringEnabled: (): boolean => {
      return process.env['ENABLE_PERFORMANCE_MONITORING'] === 'true';
    },

    isErrorTrackingEnabled: (): boolean => {
      return process.env['ENABLE_ERROR_TRACKING'] === 'true';
    }
  }
};