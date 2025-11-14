// Supabase配置和工具函数
// 注意：请替换为你的Supabase项目URL和anon key
const SUPABASE_URL = 'https://cyllktsqjqobvdinfgig.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5bGxrdHNxanFvYnZkaW5mZ2lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3NTY3MTAsImV4cCI6MjA3ODMzMjcxMH0.pSgc8pK7ql5UTW3HlZQHTcVVL0W2Sn5nvtYxAiXlM7I';

// 初始化Supabase客户端
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 用户认证函数
class AuthService {
    // 用户登录 - 直接验证数据库中的密码
    static async login(email, password) {
        try {
            // 1. 查询用户信息
            const { data: users, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .eq('status', 'active');
                
            if (error) throw error;
            
            // 2. 检查用户是否存在
            if (!users || users.length === 0) {
                return { success: false, error: '用户不存在或已被禁用' };
            }
            
            const user = users[0];
            
            // 3. 验证密码（明文比较）
            if (user.password !== password) {
                return { success: false, error: '密码错误' };
            }
            
            // 4. 保存用户信息到localStorage（包含角色信息）
            const userInfo = {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                phone: user.phone,
                role: user.role || 'user', // 默认为普通用户
                status: user.status,
                created_at: user.created_at
            };
            
            localStorage.setItem('user', JSON.stringify(userInfo));
            localStorage.setItem('access_token', 'local_' + user.id);
            
            return { success: true, user: userInfo };
        } catch (error) {
            console.error('登录错误:', error);
            return { success: false, error: error.message };
        }
    }
    
    // 用户注册 - 直接保存到users表
    static async register(email, password, userData) {
        try {
            // 1. 检查邮箱是否已存在
            const emailCheck = await this.checkEmailExists(email);
            if (emailCheck.exists) {
                return { success: false, error: '该邮箱已被注册' };
            }
            
            // 2. 生成新的用户ID
            const userId = this.generateUserId();
            
            // 3. 将用户信息直接保存到users表
            const { data: profileData, error: profileError } = await supabase
                .from('users')
                .insert({
                    id: userId,
                    email: email,
                    password: password,  // 明文保存密码
                    full_name: userData.fullname,
                    phone: userData.phone,
                    role: userData.role || 'user', // 默认普通用户
                    created_at: new Date().toISOString(),
                    status: 'active'
                })
                .select();
                
            if (profileError) {
                console.error('用户信息保存到数据库失败:', profileError);
                return { 
                    success: false, 
                    error: '注册失败: ' + profileError.message 
                };
            }
            
            console.log('用户信息成功保存到数据库:', profileData);
            
            // 4. 自动登录
            const userInfo = {
                id: userId,
                email: email,
                full_name: userData.fullname,
                phone: userData.phone,
                status: 'active',
                created_at: new Date().toISOString()
            };
            
            localStorage.setItem('user', JSON.stringify(userInfo));
            localStorage.setItem('access_token', 'local_' + userId);
            
            return { 
                success: true, 
                user: userInfo,
                message: '注册成功！您已自动登录。'
            };
        } catch (error) {
            console.error('注册错误:', error);
            return { success: false, error: error.message };
        }
    }
    
    // 检查邮箱是否已存在 - 直接查询users表
    static async checkEmailExists(email) {
        try {
            const { data: users, error } = await supabase
                .from('users')
                .select('id')
                .eq('email', email);
                
            if (error) {
                console.error('邮箱检查错误:', error);
                return { exists: false };
            }
            
            return { exists: users && users.length > 0 };
        } catch (error) {
            console.error('检查邮箱错误:', error);
            return { exists: false };
        }
    }
    
    // 生成用户ID
    static generateUserId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    
    // 检查用户是否已登录 - 检查本地存储
    static isLoggedIn() {
        const token = localStorage.getItem('access_token');
        const user = localStorage.getItem('user');
        
        // 检查token和user是否存在，且token格式正确
        return token !== null && user !== null && token.startsWith('local_');
    }
    
    // 用户登出
    static async logout() {
        try {
            localStorage.removeItem('user');
            localStorage.removeItem('access_token');
            localStorage.removeItem('token_expiration');
            return { success: true };
        } catch (error) {
            console.error('登出错误:', error);
            return { success: false, error: error.message };
        }
    }
    
    // 获取当前用户信息
    static getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
    
    // 调试函数：测试数据库连接和保存功能
    static async testDatabaseConnection() {
        try {
            // 测试插入简单数据
            const testData = {
                id: '00000000-0000-0000-0000-000000000999',
                email: 'test@example.com',
                password: 'test12345',
                full_name: '测试用户',
                phone: '1234567890',
                status: 'active',
                created_at: new Date().toISOString()
            };
            
            const { data, error } = await supabase
                .from('users')
                .insert(testData)
                .select();
                
            if (error) {
                console.error('数据库连接测试失败:', error);
                return { success: false, error: error.message };
            }
            
            console.log('数据库连接测试成功:', data);
            
            // 删除测试数据
            await supabase
                .from('users')
                .delete()
                .eq('id', testData.id);
                
            return { success: true, message: '数据库连接正常' };
        } catch (error) {
            console.error('数据库连接测试异常:', error);
            return { success: false, error: error.message };
        }
    }
}

// 数据操作函数
class DataService {
    // 获取用户列表
    static async getUsers() {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });
                
            if (error) throw error;
            return { success: true, data: data };
        } catch (error) {
            console.error('获取用户列表错误:', error);
            return { success: false, error: error.message };
        }
    }
    
    // 添加用户
    static async addUser(userData) {
        try {
            const { data, error } = await supabase
                .from('users')
                .insert([userData])
                .select();
                
            if (error) throw error;
            return { success: true, data: data };
        } catch (error) {
            console.error('添加用户错误:', error);
            return { success: false, error: error.message };
        }
    }
    
    // 更新用户
    static async updateUser(userId, userData) {
        try {
            const { data, error } = await supabase
                .from('users')
                .update(userData)
                .eq('id', userId)
                .select();
                
            if (error) throw error;
            return { success: true, data: data };
        } catch (error) {
            console.error('更新用户错误:', error);
            return { success: false, error: error.message };
        }
    }
    
    // 删除用户
    static async deleteUser(userId) {
        try {
            const { error } = await supabase
                .from('users')
                .delete()
                .eq('id', userId);
                
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('删除用户错误:', error);
            return { success: false, error: error.message };
        }
    }
    
    // 获取系统统计信息
    static async getStatistics() {
        try {
            const { data: usersData, error: usersError } = await supabase
                .from('users')
                .select('*');
                
            if (usersError) throw usersError;
            
            // 这里可以添加更多统计数据的获取
            const stats = {
                totalUsers: usersData.length,
                activeUsers: usersData.filter(user => user.status === 'active').length,
                newUsersThisMonth: usersData.filter(user => {
                    const userDate = new Date(user.created_at);
                    const now = new Date();
                    return userDate.getMonth() === now.getMonth() && 
                           userDate.getFullYear() === now.getFullYear();
                }).length
            };
            
            return { success: true, data: stats };
        } catch (error) {
            console.error('获取统计信息错误:', error);
            return { success: false, error: error.message };
        }
    }
}

// 工具函数
class Utils {
    // 显示消息提示
    static showMessage(message, type = 'info') {
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
            messageEl.remove();
        }, 3000);
    }
    
    // 验证邮箱格式
    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // 格式化日期
    static formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// 导出全局对象
window.AuthService = AuthService;
window.DataService = DataService;
window.Utils = Utils;