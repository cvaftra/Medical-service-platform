# 医疗平台管理系统

一个基于现代Web技术的医疗平台管理系统，具有用户友好的界面和完整的系统功能。

## 功能特性

- ✅ **用户认证系统** - 安全的登录/注册功能
- ✅ **响应式设计** - 支持桌面和移动设备
- ✅ **多页面导航** - 完整的页面间跳转功能
- ✅ **数据管理** - 用户信息CRUD操作
- ✅ **Supabase集成** - 实时数据库支持
- ✅ **现代化UI** - 基于Tailwind CSS的漂亮界面

## 页面结构

1. **login.html** - 登录页面
2. **dashboard.html** - 控制台首页
3. **users.html** - 用户管理页面
4. **settings.html** - 系统设置页面

## 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **样式**: Tailwind CSS
- **图标**: Font Awesome
- **数据库**: Supabase (PostgreSQL)
- **字体**: Google Fonts (Pacifico, Segoe UI)

## 快速开始

### 1. 配置Supabase

1. 访问 [Supabase官网](https://supabase.com) 创建账户
2. 创建新项目并获取项目URL和anon key
3. 在 `supabase.js` 中更新配置：

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

### 2. 数据库表结构

在Supabase中创建以下表：

**users表**:
```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. 运行项目

由于项目使用纯前端技术，可以直接在浏览器中打开 `login.html` 文件，或使用本地服务器：

```bash
# 使用Python简单服务器
python -m http.server 8000

# 或使用Node.js的http-server
npx http-server . -p 8000
```

然后访问 `http://localhost:8000/login.html`

## 功能说明

### 登录页面 (login.html)
- 用户认证
- 记住我功能
- 社交登录选项（微信、谷歌）
- 忘记密码链接
- 注册新账户链接

### 控制台 (dashboard.html)
- 系统概览统计
- 快速操作面板
- 最近活动记录
- 用户信息显示

### 用户管理 (users.html)
- 用户列表展示
- 搜索和筛选功能
- 添加/编辑/删除用户
- 分页显示

### 系统设置 (settings.html)
- 常规设置（平台信息、界面设置）
- 安全设置（密码策略、会话管理）
- 数据库配置（Supabase连接）

## 自定义配置

### 修改主题颜色
在 `styles.css` 中修改CSS变量：

```css
:root {
  --primary-color: #4F46E5;
  --secondary-color: #10B981;
}
```

### 添加新页面
1. 创建新的HTML文件
2. 引入共享样式和脚本
3. 添加导航链接
4. 实现页面特定功能

## 开发说明

### 项目结构
```
├── login.html          # 登录页面
├── dashboard.html       # 控制台页面
├── users.html           # 用户管理页面
├── settings.html        # 系统设置页面
├── styles.css           # 共享样式文件
├── script.js            # 通用脚本文件
├── supabase.js          # Supabase配置和API
└── README.md           # 项目说明文档
```

### 浏览器兼容性
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 注意事项

1. **Supabase配置**: 生产环境请妥善保管数据库密钥
2. **安全性**: 当前为演示版本，生产环境需要加强安全措施
3. **浏览器支持**: 确保浏览器支持现代JavaScript特性
4. **HTTPS**: 生产环境请使用HTTPS协议

## 许可证

MIT License - 可自由使用和修改