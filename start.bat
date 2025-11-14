@echo off
title 医疗平台本地服务器
echo ========================================
echo     医疗平台管理系统 - 本地部署
echo ========================================
echo.

REM 检查Node.js是否安装
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未检测到Node.js
    echo.
    echo 请先安装Node.js:
    echo 1. 访问 https://nodejs.org/
    echo 2. 下载LTS版本并安装
    echo 3. 重新运行此脚本
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js已安装
echo.
echo 🚀 启动本地服务器...
echo.
echo 📱 项目将在以下地址运行:
echo     http://localhost:8000
echo.
echo 📄 主要页面:
echo     • 登录页面: http://localhost:8000/login.html
echo     • 注册页面: http://localhost:8000/register.html
echo     • 控制台: http://localhost:8000/dashboard.html
echo     • 用户管理: http://localhost:8000/users.html
echo     • 系统设置: http://localhost:8000/settings.html
echo.
echo ⚠️ 提示: 按 Ctrl+C 停止服务器
echo.
echo ========================================
echo.

REM 启动服务器
node server.js