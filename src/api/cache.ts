import { AxiosRequestConfig } from 'axios';

// 缓存规则类型
export interface CacheRule {
  // URL匹配规则，可以是字符串或正则表达式
  urlPattern: string | RegExp;
  // 缓存过期时间（毫秒），默认5分钟
  expireTime?: number;
  // 是否需要根据请求方法区分缓存，默认true
  methodSensitive?: boolean;
  // 是否需要根据请求参数区分缓存，默认true
  paramSensitive?: boolean;
}

// 缓存项类型
interface CacheItem<T = any> {
  value: T;
  timestamp: number;
  expireTime: number;
}

export class CacheManager {
  private cache: Map<string, CacheItem> = new Map();
  private rules: CacheRule[] = [];

  constructor(rules: CacheRule[] = []) {
    this.rules = rules;
  }

  /**
   * 添加缓存规则
   */
  addRule(rule: CacheRule): void {
    this.rules.push(rule);
  }

  /**
   * 设置缓存规则
   */
  setRules(rules: CacheRule[]): void {
    this.rules = rules;
  }

  /**
   * 根据URL判断是否需要缓存
   */
  shouldCache(url: string, config: AxiosRequestConfig): CacheRule | null {
    // 只缓存GET请求
    if (config.method && config.method.toUpperCase() !== 'GET') {
      return null;
    }

    // 尝试匹配规则
    for (const rule of this.rules) {
      const pattern = rule.urlPattern;
      const isMatch = typeof pattern === 'string' ? url.includes(pattern) : pattern.test(url);

      if (isMatch) {
        return rule;
      }
    }

    return null;
  }

  /**
   * 生成缓存键
   */
  generateCacheKey(url: string, config: AxiosRequestConfig, rule: CacheRule): string {
    let key = url;

    // 根据方法区分缓存
    if (rule.methodSensitive !== false && config.method) {
      key = `${config.method.toUpperCase()}:${key}`;
    }

    // 根据参数区分缓存
    if (rule.paramSensitive !== false) {
      // 处理查询参数
      if (config.params) {
        key = `${key}?${JSON.stringify(config.params)}`;
      }

      // 处理请求体
      if (config.data) {
        key = `${key}|${JSON.stringify(config.data)}`;
      }
    }

    return key;
  }

  /**
   * 获取缓存
   */
  get<T = any>(url: string, config: AxiosRequestConfig): T | null {
    const rule = this.shouldCache(url, config);
    if (!rule) return null;

    const key = this.generateCacheKey(url, config, rule);
    const cached = this.cache.get(key);

    if (!cached) return null;

    // 检查缓存是否过期
    const now = Date.now();
    if (now - cached.timestamp > cached.expireTime) {
      this.cache.delete(key);
      return null;
    }

    return cached.value;
  }

  /**
   * 设置缓存
   */
  set<T = any>(url: string, config: AxiosRequestConfig, value: T, rule?: CacheRule): void {
    const cacheRule = rule || this.shouldCache(url, config);
    if (!cacheRule) return;

    const key = this.generateCacheKey(url, config, cacheRule);
    const expireTime = cacheRule.expireTime || 5 * 60 * 1000; // 默认5分钟

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      expireTime,
    });
  }

  /**
   * 删除缓存
   */
  delete(url: string, config: AxiosRequestConfig): boolean {
    const rule = this.shouldCache(url, config);
    if (!rule) return false;

    const key = this.generateCacheKey(url, config, rule);
    return this.cache.delete(key);
  }

  /**
   * 清除所有缓存
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * 获取缓存大小
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * 清理过期缓存
   */
  cleanExpired(): number {
    const now = Date.now();
    let count = 0;

    this.cache.forEach((item, key) => {
      if (now - item.timestamp > item.expireTime) {
        this.cache.delete(key);
        count++;
      }
    });

    return count;
  }
}

// 创建默认缓存管理器实例
export const cacheManager = new CacheManager();

// 导出缓存管理器工厂方法
export const createCacheManager = (rules: CacheRule[] = []) => new CacheManager(rules);
