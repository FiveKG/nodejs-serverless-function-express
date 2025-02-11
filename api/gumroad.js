// api/gumroad.js
import axios from 'axios';

export default async (req, res) => {
  // 动态目标地址（可扩展多个路径）
  const pathMap = {
    '/l/neswv': 'https://leooeoj.gumroad.com/l/neswv',
  };
  
  const targetPath = new URL(req.url).pathname;
  const targetUrl = pathMap[targetPath] || 'https://leooeoj.gumroad.com';
  
  // 深度伪造请求头系统
  const headers = {
    'Host': new URL(targetUrl).hostname,
    'Referer': 'https://gumroad.com/',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    'X-Forwarded-For': req.headers['x-real-ip'] || req.socket.remoteAddress,
    'Accept-Language': 'en-US,en;q=0.9',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'same-origin',
    'Te': 'trailers'
  };

  try {
    // 使用 axios 禁用自动重定向
    const response = await axios.get(targetUrl, {
      headers,
      maxRedirects: 0,
      validateStatus: () => true // 接收所有状态码
    });

    // 手动处理重定向
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const redirectUrl = response.headers.location;
      res.redirect(response.status, redirectUrl);
    } else {
      // 同步关键响应头
      res.setHeader('Content-Type', response.headers['content-type']);
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.setHeader('Access-Control-Allow-Origin', '*');
      
      // 返回最终内容
      res.status(response.status).send(response.data);
    }
  } catch (error) {
    res.status(500).send('Proxy Error: ' + error.message);
  }
};