// api/gumroad.ts
import { NowRequest, NowResponse } from '@vercel/node';
import axios, { AxiosResponseHeaders } from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';


// 类型定义
interface PathMap {
  [key: string]: string;
}

interface EnhancedHeaders extends Record<string, string> {
  'Host': string;
  'Referer': string;
  'User-Agent': string;
  'X-Forwarded-For': string;
  'Accept-Language': string;
  'Sec-Fetch-Dest': string;
  'Sec-Fetch-Mode': string;
  'Sec-Fetch-Site': string;
}

const pathMap: PathMap = {
  '/l/neswv': 'https://leooeoj.gumroad.com/l/neswv',
};

export default async (req: NowRequest, res: NowResponse) => {
  try {
    const targetPath = new URL(req.url || '', 'http://localhost').pathname;
    const targetUrl = pathMap[targetPath] || 'https://leooeoj.gumroad.com';

    // 构建增强请求头
    const headers: EnhancedHeaders = {
      'Host': new URL(targetUrl).hostname,
      'Referer': 'https://gumroad.com/',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
      'X-Forwarded-For': Array.isArray(req.headers['x-real-ip']) ? req.headers['x-real-ip'][0] : req.headers['x-real-ip'] || req.socket.remoteAddress || '1.1.1.1',
      'Accept-Language': 'en-US,en;q=0.9',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'same-origin'
    };

    // const proxyUrl = "http://B606539A:A13BB57207F1@tun-buhuph.qg.net:14446";
    // const httpsAgent = new HttpsProxyAgent(proxyUrl);    // 执行代理请求
    const response = await axios.get(targetUrl, {
      headers,
      // httpsAgent,
      maxRedirects: 0,
      validateStatus: () => true
    });

    // 处理重定向
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.location;
      if (location) {
        return res.redirect(response.status, location);
      }
    }

    // 同步响应头
    const excludedHeaders = ['connection', 'content-encoding'];
    Object.entries(response.headers as AxiosResponseHeaders).forEach(([key, value]) => {
      if (!excludedHeaders.includes(key.toLowerCase())) {
        res.setHeader(key, Array.isArray(value) ? value[0] : value);
      }
    });

    // 设置安全头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=3600');

    return res.status(response.status).send(response.data);
  } catch (error) {
    console.error('Proxy Error:', error);
    return res.status(500).json({
      error: 'Proxy Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};