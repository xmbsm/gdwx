// SEO工具函数：更新页面meta标签
const SITE_BASE_URL = 'https://xinwenyi.com'; // 替换为你的实际域名

// 更新页面完整SEO
export function updatePageSEO(options) {
  const { title, description, keywords, author, image, type = 'article', structuredData } = options;

  // 更新页面标题
  if (title) {
    document.title = title;
  }

  // 更新meta description
  updateMetaTag('description', description || '新文艺 - 理想生活杂志，收录诗歌、名著、散文等文学作品');

  // 更新meta keywords
  updateMetaTag('keywords', keywords || '新文艺,理想生活,诗歌,名著,散文,文学,艺术,生活美学');

  // 更新作者信息
  if (author) {
    updateMetaTag('author', author);
  }

  // 更新Open Graph标签（社交分享用）
  updateMetaTag('og:title', title, 'property');
  updateMetaTag('og:description', description, 'property');
  updateMetaTag('og:type', type, 'property');
  updateMetaTag('og:url', window.location.href, 'property');
  updateMetaTag('og:site_name', '新文艺 - 理想生活杂志', 'property');
  updateMetaTag('og:locale', 'zh_CN', 'property');
  if (image) {
    updateMetaTag('og:image', image, 'property');
  }

  // 更新Twitter Card标签
  updateMetaTag('twitter:card', 'summary');
  updateMetaTag('twitter:title', title);
  updateMetaTag('twitter:description', description);

  // 更新Canonical URL
  updateCanonicalURL();

  // 添加结构化数据
  if (structuredData) {
    addStructuredData(structuredData);
  }
}

// 文学作品结构化数据
export function createArticleSchema(options) {
  const { title, author, datePublished, dateModified, description, image, keywords } = options;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    author: {
      '@type': 'Person',
      name: author
    },
    publisher: {
      '@type': 'Organization',
      name: '新文艺',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_BASE_URL}/favicon.svg`
      }
    },
    datePublished: datePublished || new Date().toISOString(),
    dateModified: dateModified || new Date().toISOString(),
    image: image || [],
    keywords: keywords || [],
    inLanguage: 'zh-CN'
  };
}

// 诗人/作者结构化数据
export function createPersonSchema(options) {
  const { name, description, image, birthDate, deathDate, nationality } = options;
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: name,
    description: description,
    image: image || '',
    birthDate: birthDate,
    deathDate: deathDate,
    nationality: nationality || '中国'
  };
}

// 更新单个meta标签
function updateMetaTag(name, content, attributeType = 'name') {
  if (!content) return;

  let meta = document.querySelector(`meta[${attributeType}="${name}"]`);

  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attributeType, name);
    document.head.appendChild(meta);
  }

  meta.setAttribute('content', content);
}

// 更新Canonical URL
function updateCanonicalURL() {
  let link = document.querySelector('link[rel="canonical"]');
  
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  
  link.setAttribute('href', window.location.href);
}

// 添加结构化数据（JSON-LD）
function addStructuredData(data) {
  // 先移除旧的结构化数据
  const oldScripts = document.querySelectorAll('script[type="application/ld+json"]');
  oldScripts.forEach(script => script.remove());

  // 添加新的结构化数据
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

// 移除结构化数据
function removeStructuredData() {
  const oldScripts = document.querySelectorAll('script[type="application/ld+json"]');
  oldScripts.forEach(script => script.remove());
}

// 重置到默认SEO
export function resetSEO() {
  document.title = '新文艺 - 理想生活杂志';
  updateMetaTag('description', '新文艺 - 理想生活杂志，收录诗歌、名著、散文等文学作品');
  updateMetaTag('keywords', '新文艺,理想生活,诗歌,名著,散文,文学,艺术,生活美学');
  removeStructuredData();
  updateCanonicalURL();
}
