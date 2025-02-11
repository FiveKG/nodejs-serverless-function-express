// 文件：/api/redirect.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

// 设置你的代理地址
const proxyUrl: string = 'http://B606539A:A13BB57207F1@tun-buhuph.qg.net:14446';
// 创建 https-proxy-agent 实例

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  // 从请求 URL 中提取 slug，例如当请求为 "/l/neswv" 时，slug 为 "neswv"
  // 注意：req.url 可能为 undefined，所以这里使用空字符串做兜底
  const url: string = req.url || '';
  const match: RegExpMatchArray | null = url.match(/^\/l\/([^\/\?]+)(\?.*)?$/);
  const slug: string | null = match ? match[1] : null;
  console.log("path:", slug);

  if (!slug) {
    res.status(404).send('Not Found');
    return;
  }

  // 构造目标地址
  const targetUrl: string = `https://leooeoj.gumroad.com/l/${slug}`;

  // 可选：如果你需要通过 axios 发起统计请求，也可在此处使用代理 agent
  // try {
  //   await axios.get('https://example.com/tracking', {
  //     httpsAgent: agent,
  //     proxy: false
  //   });
  // } catch (error) {
  //   console.error('Tracking 请求出错：', (error as Error).message);
  // }

  // 返回 302 重定向
  res.writeHead(302, { Location: targetUrl });
  res.end();
}