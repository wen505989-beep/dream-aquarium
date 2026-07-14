# 梦光水族箱

一个无需账号、无需服务器的 Canvas 电子宠物鱼缸。游戏进度保存在访问者自己的浏览器 `localStorage` 中；不同设备和浏览器的存档彼此独立。

## 本地启动

先安装 Node.js 20.19+ 或 22.12+，然后在项目根目录执行：

```bash
npm install
npm run dev
```

终端会显示可在本机浏览器中打开的开发地址。也可以运行 `启动梦光水族箱.ps1`，它会启动开发服务并打开浏览器。

## 生产构建与预览

```bash
npm run build
npm run preview
```

生产文件生成在 `dist/`。请不要手动编辑该目录；它会在每次构建时重新生成。

## 部署到 Vercel

1. 将项目推送到 GitHub、GitLab 或 Bitbucket，确保提交了源码、`package.json`、`pnpm-lock.yaml` 和 `vercel.json`，不要提交 `.env`、`node_modules` 或 `dist`。
2. 在 Vercel 选择 **Add New → Project**，导入该仓库并选择项目根目录。
3. Framework Preset 选择 **Vite**。Build Command 使用 `npm run build`，Output Directory 使用 `dist`。
4. 本项目不需要环境变量。点击 Deploy；部署完成后，Vercel 会提供一个可公开访问的 HTTPS 链接，可从项目的 Domains 页面复制和分享。

`vercel.json` 仅包含单页应用刷新回退规则：访问任意前端地址时会返回入口页面，避免刷新时出现 404。静态资源由 Vite 打包为项目内的带哈希文件名，并随构建一同上传。
