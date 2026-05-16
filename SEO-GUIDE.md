# 新文艺 - SEO优化指南

## 已完成的SEO优化

### 1. 基础Meta标签
- ✅ 唯一的title标签（每一页都不同）
- ✅ 有意义的meta description
- ✅ 相关的keywords标签
- ✅ author标签
- ✅ robots标签（index, follow）

### 2. Open Graph & Twitter Card
- ✅ og:title, og:description, og:url, og:type
- ✅ og:site_name, og:locale
- ✅ twitter:card, twitter:title, twitter:description

### 3. 结构化数据（Schema.org）
- ✅ Article类型用于文学作品详情页
- ✅ Person类型用于作者详情页
- ✅ JSON-LD格式，便于搜索引擎理解
- ✅ 包含publisher信息

### 4. 链接优化
- ✅ 语义化URL（带.html后缀）
- ✅ Canonical URL
- ✅ 内部链接（上一篇/下一篇导航）

### 5. 移动端优化
- ✅ viewport meta标签
- ✅ Apple PWA支持
- ✅ theme-color
- ✅ Web App Manifest

### 6. 可访问性
- ✅ lang="zh-CN" 声明
- ✅ 语义化HTML标签

## 需要部署后配置的优化

### 1. 域名配置
```javascript
// 修改 src/utils/seo.js 中的域名
const SITE_BASE_URL = 'https://yourdomain.com'; 
```

### 2. 网站地图（Sitemap）
建议使用工具或脚本生成sitemap.xml，包含：
- 所有作品详情页
- 所有作者详情页
- 分类页面
- 首页

示例sitemap.xml格式：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://xinwenyi.com/</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- 更多URL... -->
</urlset>
```

### 3. 搜索控制台
- Google Search Console
- 百度资源平台
- Bing Webmaster Tools

### 4. 性能优化
- ✅ 已使用系统字体，避免外部资源加载
- 建议进一步优化：懒加载、图片压缩

## 部署清单

- [ ] 替换所有文件中的 `https://xinwenyi.com` 为您的实际域名
- [ ] 生成sitemap.xml并放到根目录
- [ ] 在robots.txt中更新sitemap地址
- [ ] 注册Google Search Console和百度资源平台
- [ ] 提交sitemap到搜索引擎
- [ ] 监控SEO表现（排名、流量、点击率）

## SEO最佳实践

1. **内容为王** - 继续添加高质量的公有领域作品
2. **更新频率** - 保持网站内容定期更新
3. **内部链接** - 在相关作品之间添加链接
4. **外部链接** - 向其他权威网站链接，也鼓励其他网站链接到你
5. **加载速度** - 确保网站加载快速（优化图片、启用压缩）
6. **用户体验** - 确保网站易于导航、阅读舒适
7. **社交媒体** - 利用Open Graph标签优化社交分享
