// 全局脚本文件 - 用于页面导航和通用功能

// 页面导航函数
function navigateTo(page) {
    window.location.href = page;
}

// 检查登录状态并重定向
function checkAuth() {
    // 使用AuthService检查登录状态（包含占位符检查）
    const isLoggedIn = AuthService.isLoggedIn();
    const currentPage = window.location.pathname.split('/').pop();
    
    // 对于注册页面，不需要重定向检查
    if (currentPage === 'register.html') {
        return true;
    }
    
    // 如果未登录且不在登录页面，重定向到登录页
    if (!isLoggedIn && currentPage !== 'login.html' && currentPage !== 'register.html') {
        window.location.href = 'login.html';
        return false;
    }
    
    // 如果已登录且在登录页面，重定向到控制台
    if (isLoggedIn && currentPage === 'login.html') {
        window.location.href = 'dashboard.html';
        return false;
    }
    
    return true;
}

// 初始化页面
function initializePage() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // 对于注册页面，不进行认证检查（双重保护）
    if (currentPage === 'register.html') {
        console.log('注册页面，跳过认证检查');
        return;
    }
    
    // 检查认证状态
    if (!checkAuth()) {
        return;
    }
    
    // 设置当前活跃的导航链接
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // 设置用户信息（如果已登录）
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userNameElements = document.querySelectorAll('#userName');
    userNameElements.forEach(el => {
        if (user.email) {
            el.textContent = user.email;
        }
    });
}

// 登录表单处理
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me')?.checked || false;
    
    // 验证输入
    if (!email || !password) {
        showMessage('请输入邮箱和密码', 'error');
        return;
    }
    
    if (!Utils.validateEmail(email)) {
        showMessage('请输入有效的邮箱地址', 'error');
        return;
    }
    
    try {
        // 显示加载状态
        const submitBtn = document.querySelector('#loginForm button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '登录中...';
        submitBtn.disabled = true;
        
        // 使用Supabase进行登录
        const result = await AuthService.login(email, password);
        
        if (result.success) {
            // 如果勾选了"记住我"，设置较长的过期时间
            if (rememberMe) {
                const expiration = new Date();
                expiration.setDate(expiration.getDate() + 30); // 30天后过期
                localStorage.setItem('token_expiration', expiration.toISOString());
            }
            
            showMessage('登录成功！', 'success');
            
            // 立即跳转到首页，不使用延迟
            window.location.href = 'dashboard.html';
        } else {
            showMessage(result.error || '登录失败，请重试', 'error');
            
            // 恢复按钮状态
            submitBtn.textContent = '登录';
            submitBtn.disabled = false;
        }
        
    } catch (error) {
        console.error('登录处理错误:', error);
        showMessage('登录过程中发生错误', 'error');
        
        // 恢复按钮状态
        const submitBtn = document.querySelector('#loginForm button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = '登录';
            submitBtn.disabled = false;
        }
    }
}

// 注册表单处理
async function handleRegister(event) {
    event.preventDefault();
    
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const role = 'user'; // 强制设置为普通用户
    const terms = document.getElementById('terms').checked;
    
    // 验证输入
    if (!fullname || !email || !phone || !password || !confirmPassword) {
        showMessage('请填写所有必填字段', 'error');
        return;
    }
    
    if (!terms) {
        showMessage('请同意服务条款和隐私政策', 'error');
        return;
    }
    
    if (!Utils.validateEmail(email)) {
        showMessage('请输入有效的邮箱地址', 'error');
        return;
    }
    
    if (password.length < 8) {
        showMessage('密码长度至少为8位', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('两次输入的密码不一致', 'error');
        return;
    }
    
    try {
        // 显示加载状态
        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '注册中...';
        submitBtn.disabled = true;
        
        // 检查邮箱是否已存在
        const emailCheck = await AuthService.checkEmailExists(email);
        if (emailCheck.exists) {
            showMessage('该邮箱已被注册，请使用其他邮箱', 'error');
            return;
        }
        
        // 使用Supabase进行注册
        const userData = {
            fullname: fullname,
            phone: phone,
            role: role
        };
        
        const result = await AuthService.register(email, password, userData);
        
        if (result.success) {
            showMessage(result.message || '注册成功！您已自动登录。', 'success');
            
            // 注册成功后直接跳转到首页
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
        } else {
            // 简化错误处理
            showMessage(result.error || '注册失败，请重试', 'error');
        }
        
    } catch (error) {
        console.error('注册处理错误:', error);
        showMessage('注册过程中发生错误', 'error');
    } finally {
        // 恢复按钮状态
        const submitBtn = event.target.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = '注册账户';
            submitBtn.disabled = false;
        }
    }
}

// 显示消息提示
function showMessage(message, type = 'info') {
    // 创建消息元素
    const messageEl = document.createElement('div');
    messageEl.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        type === 'warning' ? 'bg-yellow-500 text-black' :
        'bg-blue-500 text-white'
    }`;
    messageEl.textContent = message;
    
    // 添加到页面
    document.body.appendChild(messageEl);
    
    // 3秒后自动移除
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.parentNode.removeChild(messageEl);
        }
    }, 3000);
}

// 用户登出
function logout() {
    // 清除本地存储
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_expiration');
    
    // 显示消息并重定向到登录页
    showMessage('已成功登出', 'success');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

// 加载统计数据（示例）
async function loadStatistics() {
    try {
        // 模拟API调用
        const stats = {
            totalUsers: 1250,
            activeUsers: 893,
            newUsersThisMonth: 45
        };
        
        // 更新页面显示
        if (document.getElementById('totalUsers')) {
            document.getElementById('totalUsers').textContent = stats.totalUsers;
        }
        if (document.getElementById('activeUsers')) {
            document.getElementById('activeUsers').textContent = stats.activeUsers;
        }
        if (document.getElementById('newUsers')) {
            document.getElementById('newUsers').textContent = stats.newUsersThisMonth;
        }
        
    } catch (error) {
        console.error('加载统计数据失败:', error);
        showMessage('加载数据失败', 'error');
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // 对于注册页面，完全跳过认证检查和初始化
    if (currentPage === 'register.html') {
        console.log('注册页面 - 跳过所有认证检查和初始化逻辑');
        
        // 只绑定注册表单事件
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            console.log('注册页面 - 绑定注册表单事件');
            registerForm.addEventListener('submit', handleRegister);
        }
        
        // 完全阻止任何认证相关的初始化
        // 确保不会调用initializePage()和其他可能的重定向逻辑
        return;
    }
    
    // 其他页面正常初始化
    initializePage();
    
    // 如果是控制台页面，加载统计数据
    if (window.location.pathname.includes('dashboard.html')) {
        loadStatistics();
    }
    
    // 绑定登录表单提交事件
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

// 响应式导航菜单（移动端）
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 导出函数供其他脚本使用
window.navigateTo = navigateTo;
window.checkAuth = checkAuth;
window.logout = logout;
window.showMessage = showMessage;
window.formatDate = formatDate;