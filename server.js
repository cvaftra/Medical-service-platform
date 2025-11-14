// 简单的本地HTTP服务器
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const port = 8000;

// MIME类型映射
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    // 解析请求URL
    const parsedUrl = url.parse(req.url);
    let pathname = parsedUrl.pathname;
    
    // 处理根路径，重定向到登录页面
    if (pathname === '/' || pathname === '/index.html') {
        pathname = '/login.html';
    }
    
    // 获取文件路径
    const filePath = path.join(__dirname, pathname);
    
    // 获取文件扩展名
    const ext = path.extname(filePath).toLowerCase();
    
    // 设置Content-Type
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    // 读取文件
    fs.readFile(filePath, (err, data) => {
        if (err) {
            // 文件不存在，返回404
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - 页面未找到</h1><p>请求的页面不存在。</p>');
            } else {
                // 其他错误
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('<h1>500 - 服务器错误</h1>');
            }
        } else {
            // 成功读取文件
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
});

server.listen(port, () => {
    console.log(`🚀 医疗平台项目已启动！`);
    console.log(`📱 访问地址: http://localhost:${port}`);
    console.log(`📄 首页: http://localhost:${port}/login.html`);
    console.log(`📊 控制台: http://localhost:${port}/dashboard.html`);
    console.log(`👥 用户管理: http://localhost:${port}/users.html`);
    console.log(`⚙️ 设置: http://localhost:${port}/settings.html`);
    console.log(`📝 注册: http://localhost:${port}/register.html`);
    console.log('');
    console.log('按 Ctrl+C 停止服务器');
});