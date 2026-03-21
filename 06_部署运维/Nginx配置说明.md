# Nginx 配置说明

## 1. 目标

使用宿主机已有 Nginx 统一入口，把域名流量转发到内网服务，不新增公网端口。

## 2. 关键约束

- 主站：`yoruming.cn / www.yoruming.cn -> 127.0.0.1:3001`
- 音乐站：`music.yoruming.cn -> 127.0.0.1:81`
- 公网入口复用：`80/443`
- 每次变更后必须执行：`sudo nginx -t`

## 3. 配置文件

- 主站示例：`scripts/ops/nginx-site.conf.example`
- 音乐站示例：`scripts/ops/nginx-music-site.conf.example`

## 4. 生效步骤

```bash
# 1) 下发主站配置
sudo cp scripts/ops/nginx-site.conf.example /etc/nginx/conf.d/pkh-web.conf

# 2) 下发音乐站配置
sudo cp scripts/ops/nginx-music-site.conf.example /etc/nginx/conf.d/music-web.conf

# 3) 检查并重载
sudo nginx -t
sudo systemctl reload nginx
```

## 5. HTTPS 证书（Let’s Encrypt / certbot）

```bash
# 主站（若已签发可跳过）
sudo certbot --nginx -d yoruming.cn -d www.yoruming.cn --redirect

# 音乐子域名
sudo certbot --nginx -d music.yoruming.cn --redirect

# 续期演练
sudo certbot renew --dry-run
```

## 6. 验收命令

```bash
# DNS
nslookup music.yoruming.cn

# HTTP/HTTPS
curl -I http://music.yoruming.cn
curl -I https://music.yoruming.cn

# 站内回源
curl -I http://127.0.0.1:81
```

## 7. 常见问题

### 7.1 conflicting server name

现象：`nginx -t` 提示 `conflicting server name`。  
处理：说明多个 `server` 块里写了相同 `server_name`，保留一个，其他删除或改名。

### 7.2 502 Bad Gateway

排查顺序：

1. 确认上游服务在线（主站 `3001`，音乐站 `81`）
2. `curl -I http://127.0.0.1:3001` 与 `curl -I http://127.0.0.1:81`
3. `sudo tail -n 100 /var/log/nginx/error.log`
