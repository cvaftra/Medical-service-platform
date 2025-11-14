# 医疗平台项目设置指南

## 🚀 快速开始

### 1. 数据库表结构创建

**在Supabase控制台中执行以下步骤：**

1. 登录您的Supabase控制台：https://supabase.com/dashboard
2. 选择您的项目：`cyllktsqjqobvdinfgig`
3. 进入SQL编辑器
4. 复制并执行 `create-tables.sql` 文件中的SQL语句

### 2. 启动本地服务器

**方式一：使用批处理文件（推荐）**
- 双击 `start.bat` 文件
- 系统会自动检查Node.js并启动服务器

**方式二：使用命令行**
```bash
cd "e:/QianDuan/Projects/test"
node server.js
```

### 3. 访问应用

服务器启动后，访问以下地址：
- **首页**: http://localhost:8000
- **登录页面**: http://localhost:8000/login.html
- **注册页面**: http://localhost:8000/register.html

## 📊 用户注册和登录流程

### 用户注册流程
1. 用户访问注册页面
2. 填写完整的注册信息：
   - 用户名（必填）
   - 邮箱地址（必填）
   - 手机号码（必填）
   - 密码（至少8位）
   - 确认密码
   - 同意服务条款
3. 系统验证：
   - 检查邮箱格式
   - 检查密码强度
   - 检查邮箱是否已注册
4. 注册成功后：
   - 用户信息保存到Supabase Auth系统
   - 用户资料保存到`users`表
   - 显示成功消息
   - 3秒后自动跳转到登录页面

### 用户登录流程
1. 用户访问登录页面
2. 输入注册时使用的邮箱和密码
3. 系统验证：
   - 调用Supabase Auth进行身份认证
   - 检查邮箱和密码是否匹配
4. 登录成功后：
   - 用户会话信息保存到localStorage
   - 显示登录成功消息
   - 立即跳转到控制台首页

## 🔧 技术实现细节

### 数据库连接配置
- **Supabase URL**: `https://cyllktsqjqobvdinfgig.supabase.co`
- **Anon Key**: 已正确配置在 `supabase.js` 中

### 核心功能模块

#### 1. 用户认证 (AuthService)
- `login(email, password)` - 用户登录
- `register(email, password, userData)` - 用户注册
- `checkEmailExists(email)` - 检查邮箱是否已注册
- `logout()` - 用户登出

#### 2. 数据操作 (DataService)
- `getUsers()` - 获取用户列表
- `addUser(userData)` - 添加用户
- `updateUser(userId, userData)` - 更新用户
- `deleteUser(userId)` - 删除用户
- `getStatistics()` - 获取统计信息

#### 3. 工具函数 (Utils)
- `showMessage(message, type)` - 显示消息提示
- `validateEmail(email)` - 验证邮箱格式
- `formatDate(dateString)` - 格式化日期

## 🛠️ 故障排除

### 常见问题

#### 1. 注册失败
- **错误**: "邮箱已被注册"
  - **原因**: 邮箱已在Supabase Auth系统中存在
  - **解决**: 使用其他邮箱或登录现有账户

#### 2. 登录失败
- **错误**: "邮箱或密码错误"
  - **原因**: 邮箱不存在或密码不匹配
  - **解决**: 检查邮箱和密码是否正确

#### 3. 数据库连接错误
- **错误**: "无法连接到数据库"
  - **原因**: Supabase配置错误或网络问题
  - **解决**: 检查Supabase URL和Anon Key配置

#### 4. 表不存在错误
- **错误**: "关系 \"users\" 不存在"
  - **原因**: 数据库表未创建
  - **解决**: 执行 `create-tables.sql` 中的SQL语句

### 调试方法

1. **检查浏览器控制台**
   - 按F12打开开发者工具
   - 查看Console标签页的错误信息

2. **检查网络请求**
   - 在Network标签页查看API请求状态
   - 确认Supabase API调用是否成功

3. **检查本地存储**
   - 在Application标签页查看localStorage
   - 确认用户会话信息是否正确保存

## 🔒 安全注意事项

1. **邮箱验证**: Supabase会自动发送验证邮件
2. **密码安全**: 密码在Supabase端进行哈希加密
3. **会话管理**: 使用localStorage保存访问令牌
4. **权限控制**: 数据库表启用行级安全策略

## 📈 下一步开发建议

1. **邮箱验证**: 完善邮箱验证流程
2. **密码重置**: 添加密码重置功能
3. **用户角色**: 实现用户角色和权限管理
4. **数据备份**: 添加数据库备份机制
5. **性能优化**: 优化前端加载性能

## 📞 支持

如遇到问题，请检查：
- Supabase项目配置是否正确
- 数据库表结构是否创建
- 网络连接是否正常
- 浏览器控制台错误信息