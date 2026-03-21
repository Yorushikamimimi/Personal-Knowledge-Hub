# Nginx 配置说明

## 1. 目标

使用宿主机已有 Nginx 统一入口，把域名流量转发到 `127.0.0.1:3001` 的 Next.js 服务，不新增公网端口。

## 2. 关键约束

- 应用端口固定：`127.0.0.1:3001`
- 公网入口复用：`80/443`
- 不占用你现有业务端口
- 每次变更后必须执行：`nginx -t`

## 3. 站点配置示例

参考文件：`scripts/ops/nginx-site.conf.example`

```nginx
server {
  listen 80;
  server_name yoruming.cn www.yoruming.cn;

  location / {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}
```

## 4. 生效步骤

```bash
sudo cp scripts/ops/nginx-site.conf.example /etc/nginx/conf.d/pkh-web.conf
sudo nginx -t
sudo systemctl reload nginx
```

## 5. 常见问题

### 5.1 conflicting server name

现象：`nginx -t` 提示 `conflicting server name`。  
处理：说明多个 `server` 块里写了相同 `server_name`，保留一个，其他删除或改名。

### 5.2 502 Bad Gateway

排查顺序：

1. `pm2 ls` 看 `pkh-web` 是否在线
2. `curl -I http://127.0.0.1:3001` 看本地服务
3. `sudo tail -n 100 /var/log/nginx/error.log` 看反向代理错误

### 5.3 证书续期

后续接 HTTPS 时，建议接入 `certbot`（证书自动续期工具）并保留 `80 -> HTTPS` 跳转。
