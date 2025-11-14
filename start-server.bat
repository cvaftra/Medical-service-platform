@echo off
echo 正在启动医疗平台项目...
echo.

REM 检查是否安装了Node.js和http-server
node --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未检测到Node.js，请先安装Node.js
    echo 访问 https://nodejs.org/ 下载并安装
    pause
    exit /b 1
)

echo 安装http-server依赖包...
npm install -g http-server

echo.
echo 启动本地服务器...
echo 项目将在 http://localhost:8000 上运行
echo.
echo 按 Ctrl+C 停止服务器

REM 启动HTTP服务器
http-server . -p 8000 -o

pause