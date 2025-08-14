### 一、项目介绍

本项目是基于 React、Ant Design、Redux 和 TypeScript 构建的前端脚手架，整合了常用技术栈，提供基础项目结构、路由配置、状态管理及典型功能模块（如登录、用户管理、仪表盘等 ），助力快速开发企业级前端应用。

### 二、技术栈

框架核心：React（构建 UI 交互）
UI 组件库：Ant Design（提供丰富、美观的组件 ）
状态管理：Redux Toolkit（高效的状态管理方案 ）
语言规范：TypeScript（增强代码类型安全性 ）
构建工具：Vite（快速启动、热更新，提升开发体验 ）
路由管理：React Router（管理页面路由跳转 ）
网络请求：Axios（封装于 api/axiosInstance.ts，处理接口请求 ）

### 三、项目结构

```plaintext
src
├── api               # 接口请求封装（axios 实例、接口定义）
│   └── axiosInstance.ts
├── layouts           # 布局组件（如身份验证布局、主布局 ）
│   ├── AuthLayout.tsx
│   └── MainLayout.tsx
├── pages             # 页面组件（仪表盘、登录、404 等页面 ）
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   ├── NotFound.tsx
│   ├── Register.tsx
│   ├── UserManagement.tsx
│   └── UserProfile.tsx
├── store             # Redux 状态管理（用户、认证等状态逻辑 ）
│   ├── slices        # Redux slices
│   │   ├── authSlice.ts
│   │   └── userSlice.ts
│   ├── hooks.ts      # 类型化的 Redux hooks
│   └── index.ts      # Store 配置
├── styles            # 全局样式（全局 CSS、样式重置等 ）
│   └── index.css
├── App.tsx           # 根组件（路由、布局集成 ）
└── main.tsx          # 项目入口（渲染根组件、初始化配置 ）
```

### 四、快速开始

环境准备
确保已安装 Node.js（建议 v16+ 版本 ）。

##### 步骤 1：克隆 / 下载项目

```bash
git clone [项目仓库地址]
cd [项目目录]
```

##### 步骤 2：安装依赖

```bash
npm install
# 或使用 yarn
yarn install
```

##### 步骤 3：启动开发环境

```bash
npm run dev
# 或
yarn dev
```

启动后，浏览器访问 http://localhost:3000 `即可查看运行效果，Vite` 会自动热更新。

##### 步骤 4：构建生产环境

```bash
npm run build
# 或
yarn build
```

生成的生产代码位于 dist 目录，可部署到服务器。

### 五、功能模块说明

##### 1. 路由与布局

`layouts/AuthLayout.tsx`：处理登录、注册等无需侧边栏 / 头部的页面布局。
`layouts/MainLayout.tsx`：包含侧边栏、头部的主布局，用于登录后页面（如仪表盘、用户管理 ）。
路由配置在 `App.tsx` 中，通过 `React Router` 管理页面跳转。

##### 2. 状态管理（Redux）

`store/slices/authSlice.ts`：管理用户登录状态、 `token` 等认证相关数据，提供登录、退出等操作方法。
`store/slices/userSlice.ts`：维护用户信息（如个人资料 ）、用户列表等数据及操作逻辑。
使用示例（在组件中）：

```tsx
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { loginUser } from '@/store/slices/authSlice';

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleLogin = () => {
    dispatch(loginUser({ username, password }));
  };
};
```

##### 3. 页面功能

`pages/Login.tsx`：处理用户登录逻辑，调用 Redux actions。
`pages/UserManagement.tsx`：展示用户列表，可结合 Redux 实现增删改查（需对接实际接口 ）。
`pages/Dashboard.tsx`：作为登录后首页，可展示统计数据、快捷入口等。

##### 4. 接口请求（api/axiosInstance.ts）

封装 `Axios` 实例，统一处理请求拦截（如添加 `token` ）、响应拦截（错误处理 ），在页面 / 组件中可直接导入使用：

```tsx
import axiosInstance from '@/api/axiosInstance';

const fetchUserList = async () => {
  const res = await axiosInstance.get('/user/list');
  return res.data;
};
```

### 六、自定义与扩展

##### 1. 新增页面 / 路由

在 `pages` 目录新建组件文件（如 `NewPage.tsx` ）。
在 `App.tsx` 中配置路由：

```tsx
import { Routes, Route } from 'react-router-dom';
import NewPage from '@/pages/NewPage';

<Routes>
  <Route path="/new-page" element={<NewPage />} />
  {/* 其他路由... */}
</Routes>;
```

##### 2. 扩展状态管理

在 `store/slices` 目录新增 slice 文件，参照 `authSlice.ts` 格式，用 Redux Toolkit 定义新的状态逻辑，再在组件中通过 `useAppSelector` 和 `useAppDispatch` 使用。

##### 3. 调整 UI 样式

全局样式在 `styles/index.css` 中修改（如调整主题色、组件间距 ）。
单个组件样式可通过 `Ant Design` 组件的 `style` 属性或 `CSS Modules` 自定义。

#### 七、注意事项

开发前需根据实际后端接口，修改 `api/axiosInstance.ts` 中的基础路径、请求拦截逻辑（如 `token` 携带 ）。
若涉及权限控制（如路由守卫 ），可在 `layouts` 或路由配置中扩展逻辑，结合 Redux 的登录状态判断。
生产环境部署时，需配置服务器反向代理（若有跨域 ），或调整 `axiosInstance` 的基础路径。
