# PROJECT_MEMORY

> Long-term project knowledge only. Never store secrets.
> This file is not a chat log and not a Git log.

## Memory Index

### 项目核心
- 项目名称：Pixel-Pic
- 项目目标：免费在线拼豆图案生成器，将照片/插画转为可打印拼豆图案
- 产品/业务核心规则：浏览器本地处理（不上传图片）、CIEDE2000 感知配色、多品牌色板、PNG/PDF 导出

### 当前开发
- 当前阶段：v1.0 已完成开发、验证、部署
- 当前任务：功能已上线，等待用户验收与后续迭代
- 当前阻塞：无

### 架构
- 技术栈：Next.js 15 (App Router) + TypeScript + Tailwind CSS 3 + jsPDF
- 主要模块：ciede2000 配色引擎 / palettes 色板 / processor 图像处理 / exporter 导出 / BeadTool 交互组件
- 关键数据流：上传图片 → resizeToBeadGrid → processImage(CIEDE2000+抖动+降色) → renderPreview → 导出 PNG/PDF

### 关键决策
- 采用 CIEDE2000 而非 RGB 距离做颜色匹配（感知更准确）
- 颜色数据使用 get-colors-from-beans 开源项目（MIT 协议），含 13 个品牌 5888 色
- 图片处理全部在浏览器端完成（无后端、无服务器存储）
- 广告位全部预留占位（AdSlot 组件），未来可替换

### 失败经验
- `**` 运算符不能直接应用于一元表达式（如 `-x ** 2`），需用 Math.pow 或加括号 — 已修复
- Vercel 部署默认开启 SSO 保护，需通过 API 将 ssoProtection 设为 null 才能公开访问

### 部署
- GitHub：https://github.com/dgq533-gemini/Pixel-Pic （已推送 master）
- Vercel：https://pixel-pic8.vercel.app （生产部署，SSO 保护已关闭）
- CI/CD：Vercel 自动监听 GitHub push 触发部署

### 人工确认
- 无（v1.0 需求已全部实现并部署）

---

# 1. 项目基本信息

- 项目名称：Pixel-Pic
- 项目目标：免费在线拼豆图案生成器，照片转拼豆图案
- 产品定位：对标 pixelbead.art，但使用国产品牌色板、原创 UI、防侵权
- 主要用户：拼豆爱好者、手工创作者
- 当前阶段：v1.0 已开发完成并部署上线

# 2. 技术栈

- Language: TypeScript
- Framework: Next.js 15 (App Router)
- Runtime: Node.js 24
- Database: 无（纯前端，浏览器本地处理）
- Package Manager: npm
- Test: 手动浏览器验证
- Lint/Typecheck: tsc + next lint
- Build: next build

# 3. 项目架构

## 主要目录
- `app/` — Next.js 页面（首页、照片转图案、色卡、板尺寸、图案库、品牌对比、关于、隐私）
- `components/` — UI 组件（Header、Footer、BeadTool、AdSlot）
- `lib/colors/` — CIEDE2000 算法 + 品牌色板
- `lib/image/` — 图像处理（resize、dither、processor、exporter）
- `get-colors.json` — 开源颜色数据（13 品牌 5888 色）

## 核心模块
- `ciede2000.ts` — RGB→Lab 转换 + CIEDE2000 色差计算
- `palettes.ts` — 13 个品牌色板加载与归一化
- `processor.ts` — 图片缩放、颜色匹配、抖动、降色
- `exporter.ts` — PNG/PDF 导出（含色卡图例与用量统计）
- `BeadTool.tsx` — 主交互组件（上传/控件/预览/统计/导出）

## 关键数据流
用户上传图片 → resizeToBeadGrid(缩放到目标列数) → processImage(CIEDE2000 匹配+Floyd/Atkinson/Bayer 抖动+颜色数限制) → renderPreview 渲染画布 → 下载 PNG/PDF

# 4. 已完成模块

- 首页（Hero + 工具 + 功能介绍 + 三步流程 + FAQ + 资源）
- 照片转图案工具页
- 色卡指南（13 品牌色板浏览）
- 板尺寸指南
- 可爱图案库
- 品牌对比页
- 关于 / 隐私页
- PNG + PDF 导出
- 广告位预留组件

# 5. 当前任务

- 

# 6. 下一步任务

- 

# 7. 关键决策记录

## [YYYY-MM-DD] Decision

**问题：**
**候选方案：**
**最终采用：**
**原因：**
**Trade-offs：**
**未来重新考虑条件：**

# 8. 产品与业务规则

- 

# 9. API / 数据结构

- 

# 10. GitHub

- Repository: https://github.com/dgq533-gemini/Pixel-Pic
- Default branch: master
- Branch strategy: master 主分支直接开发
- Commit convention: 中文 + conventional commit 前缀
- CI: Vercel 自动构建
- CD: Vercel 自动部署（push master 触发）
- Release flow: push master → Vercel 自动构建部署到生产

# 11. Vercel / Deployment

- Provider: Vercel
- Project: pixel-pic (team: caesars-projects-0553edc7)
- Production: https://pixel-pic8.vercel.app
- Preview: 每次 push 自动生成 preview URL
- Domain: 暂无自定义域名（使用 vercel.app 子域名）
- Production branch: master
- Automatic deployment: 开启（监听 GitHub）
- Rollback notes: Vercel 控制台可一键回滚到任意历史部署

# 12. 环境变量

> 纯前端项目，无后端环境变量。.env.example 中的模板变量暂不需要。

- 无必需环境变量

# 13. 常用命令

- Install: npm install
- Dev: npm run dev
- Build: npm run build
- Test: 无自动化测试（手动浏览器验证）
- Lint: npm run lint
- Typecheck: npx tsc --noEmit
- Deploy: 自动（push master）或 npx vercel --prod

# 14. 已知问题

- 

# 15. 已解决问题

- 

# 16. 失败方案与经验

## [YYYY-MM-DD] 方案名称

**状态：** 已验证失败 / 暂停 / 不推荐 / 待重新验证

**目标：**
**采用方案：**
**验证过程：**
**结果：**
**失败原因：**
**失败证据：**
**最终结论：**
**替代方案：**
**未来重新验证条件：**
**避免重复踩坑：**

# 17. 重新验证记录

## [YYYY-MM-DD] 方案重新验证

**历史方案：**
**历史失败原因：**
**发生的环境变化：**
**重新验证过程：**
**结果：**
**新结论：**

# 18. 重要注意事项

- 

# 19. 需人工确认

- 无（v1.0 已按需求完成：复刻 pixelbead.art、优化排版/功能/效果、防侵权、广告位预留、GitHub 版本管理、Vercel 部署）

# 20. 最后更新时间

- 2026-10-04：完成 Pixel-Pic v1.0 全量开发与部署
  - 实现 CIEDE2000 配色引擎 + 13 品牌色板 + 多种抖动 + PNG/PDF 导出
  - 构建响应式首页与 6 个辅助页面
  - 广告位预留组件
  - GitHub: dgq533-gemini/Pixel-Pic
  - Vercel: https://pixel-pic8.vercel.app
