// 系统配置文件
// 这里存放所有可配置的系统参数

const CONFIG = {
    // 应用配置
    APP: {
        NAME: '医疗平台',
        VERSION: '1.0.0',
        DESCRIPTION: '专业的医疗服务平台',
        SUPPORT_EMAIL: 'support@medical-platform.com',
        SUPPORT_PHONE: '400-123-4567'
    },
    
    // API配置
    API: {
        TIMEOUT: 30000, // 30秒超时
        RETRY_ATTEMPTS: 3, // 重试次数
        BASE_URL: '/api' // API基础路径
    },
    
    // Supabase配置（生产环境应从环境变量读取）
    SUPABASE: {
        URL: 'https://your-project.supabase.co', // 替换为你的Supabase项目URL
        ANON_KEY: 'your-anon-key', // 替换为你的anon key
        TABLES: {
            USERS: 'users',
            SESSIONS: 'sessions',
            SETTINGS: 'settings'
        }
    },
    
    // 安全配置
    SECURITY: {
        SESSION_TIMEOUT: 30, // 分钟
        PASSWORD_MIN_LENGTH: 8,
        PASSWORD_REQUIRE_UPPERCASE: true,
        PASSWORD_REQUIRE_NUMBERS: true,
        PASSWORD_REQUIRE_SPECIAL_CHARS: false,
        ENABLE_2FA: false
    },
    
    // UI配置
    UI: {
        THEME: {
            PRIMARY: '#4F46E5',
            SECONDARY: '#10B981',
            SUCCESS: '#10B981',
            WARNING: '#F59E0B',
            ERROR: '#EF4444',
            INFO: '#3B82F6'
        },
        LANGUAGE: 'zh-CN',
        TIMEZONE: 'Asia/Shanghai',
        DATE_FORMAT: 'YYYY-MM-DD',
        TIME_FORMAT: 'HH:mm:ss'
    },
    
    // 功能开关
    FEATURES: {
        SOCIAL_LOGIN: true, // 社交登录
        USER_REGISTRATION: true, // 用户注册
        PASSWORD_RESET: true, // 密码重置
        EMAIL_VERIFICATION: false, // 邮箱验证
        DARK_MODE: true, // 暗色模式
        OFFLINE_MODE: false // 离线模式
    },
    
    // 缓存配置
    CACHE: {
        ENABLED: true,
        DEFAULT_TTL: 3600, // 1小时
        MAX_ITEMS: 1000
    },
    
    // 错误处理配置
    ERROR_HANDLING: {
        SHOW_DETAILED_ERRORS: false, // 生产环境应为false
        LOG_LEVEL: 'warn', // error, warn, info, debug
        REPORTING_ENABLED: false
    }
};

// 环境检测
CONFIG.ENV = {
    IS_DEVELOPMENT: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    IS_PRODUCTION: !(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'),
    IS_TEST: window.location.hostname.includes('test')
};

// 根据环境调整配置
if (CONFIG.ENV.IS_PRODUCTION) {
    CONFIG.ERROR_HANDLING.SHOW_DETAILED_ERRORS = false;
    CONFIG.ERROR_HANDLING.LOG_LEVEL = 'error';
}

if (CONFIG.ENV.IS_DEVELOPMENT) {
    CONFIG.ERROR_HANDLING.SHOW_DETAILED_ERRORS = true;
    CONFIG.ERROR_HANDLING.LOG_LEVEL = 'debug';
}

// 验证配置
function validateConfig() {
    const errors = [];
    
    if (!CONFIG.SUPABASE.URL || CONFIG.SUPABASE.URL === 'https://your-project.supabase.co') {
        errors.push('Supabase URL未配置');
    }
    
    if (!CONFIG.SUPABASE.ANON_KEY || CONFIG.SUPABASE.ANON_KEY === 'your-anon-key') {
        errors.push('Supabase anon key未配置');
    }
    
    if (errors.length > 0) {
        console.warn('配置警告:', errors.join(', '));
        console.info('请更新 config.js 中的Supabase配置');
    }
    
    return errors;
}

// 初始化配置验证
document.addEventListener('DOMContentLoaded', function() {
    const configErrors = validateConfig();
    
    if (configErrors.length === 0) {
        console.log('✓ 配置验证通过');
    } else {
        console.warn('⚠ 配置存在问题，部分功能可能无法正常工作');
    }
});

// 导出配置对象
window.CONFIG = CONFIG;