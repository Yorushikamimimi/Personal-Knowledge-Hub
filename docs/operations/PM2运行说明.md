# PM2 运行说明

## 1. 目标

通过 `PM2`（Node 进程守护）托管 Next.js 生产进程，保证异常自动拉起、重启后可恢复。

## 2. 进程定义

项目根目录包含：`ecosystem.config.cjs`

核心配置：

- 进程名：`pkh-web`
- 启动命令：`npm run start -- -p 3001 -H 127.0.0.1`
- 内存阈值：`500M`
- 环境：`NODE_ENV=production`

## 3. 常用命令

```bash
# 首次启动
pm2 start ecosystem.config.cjs --env production

# 更新后重载
pm2 reload ecosystem.config.cjs --update-env

# 查看状态
pm2 ls

# 查看日志
pm2 logs pkh-web --lines 100

# 保存开机启动状态
pm2 save

# 生成 systemd 开机自启命令
pm2 startup systemd -u root --hp /root
```

## 4. 与部署脚本配合

推荐只走统一入口：

```bash
bash scripts/ops/deploy.sh
```

该脚本会自动执行：

1. 拉代码
2. `npm ci && npm run build`
3. `pm2 start/reload`
4. 健康检查

## 5. 事故处理

### 5.1 进程反复重启

检查：

```bash
pm2 logs pkh-web --lines 200
```

通常是：

- Node 版本不兼容
- `.next` 构建不完整
- 环境变量缺失

### 5.2 机器重启后站点不起来

执行：

```bash
pm2 resurrect
pm2 ls
```

若仍失败，重新执行一次：

```bash
bash scripts/ops/deploy.sh
```
