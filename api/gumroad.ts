// 文件：/api/redirect.js
const axios = require('axios');
const HttpsProxyAgent = require('https-proxy-agent');

// 设置你的代理地址
const proxyUrl = 'http://B606539A:A13BB57207F1@tun-buhuph.qg.net:14446';
// 创建 https-proxy-agent 实例
const agent = new HttpsProxyAgent(proxyUrl);

module.exports = async (req:any, res:any) => {
  // 可选：通过 axios 发起请求，比如用于点击统计
  // try {
  //   await axios.get('https://example.com/tracking', {
  //     // 使用自定义的代理 agent，同时禁用 axios 内置代理配置
  //     httpsAgent: agent,
  //     proxy: false
  //   });
  // } catch (error) {
  //   console.error('Tracking 请求出错：', error);
  // }

  // 从请求 URL 中提取 slug，例如当请求为 "/l/neswv" 时，slug 为 "neswv"
  const match = req.url.match(/^\/l\/([^\/\?]+)(\?.*)?$/);
  const slug = match ? match[1] : null;
  console.log("path:", slug)
  if (!slug) {
    res.statusCode = 404;
    res.end('Not Found');
    return;
  }

  // 构造目标地址
  const targetUrl = `https://leooeoj.gumroad.com/l/${slug}`;

  // 返回 302 重定向
  res.writeHead(302, {
    Location: targetUrl
  });
  res.end();
};