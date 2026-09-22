# draft 内容验证

## 文档说明

本文档用于验证 `status=draft` 的内容不会进入当前站点的公开展示范围，包括列表页、首页精选区和静态参数生成结果。

验证对象：
- draft Note
- draft DownloadResource
- draft Topic

## 当前已知 draft 测试对象

| 内容类型 | slug | 预期行为 |
| --- | --- | --- |
| Note | `project-retro-from-chaos-to-checklist` | 不显示在 `/notes`，不可访问详情页，不出现在首页精选区 |
| DownloadResource | `system-design-notes-draft` | 不显示在 `/downloads`，不可访问详情页，不出现在首页精选区 |
| Topic | `draft-topic-sandbox` | 不显示在 `/topics`，不出现在首页精选区 |

## 列表页过滤验证

| 页面 | 验证步骤 | 预期结果 | 结果 | 备注 |
| --- | --- | --- | --- | --- |
| `/notes` | 打开页面，核对列表 slug | draft Note 不出现 | 待验收 |  |
| `/downloads` | 打开页面，核对列表 slug | draft Download 不出现 | 待验收 |  |
| `/topics` | 打开页面，核对 Topic 列表 | draft Topic 不出现 | 待验收 |  |

## 首页精选区过滤验证

| 精选区 | 验证步骤 | 预期结果 | 结果 | 备注 |
| --- | --- | --- | --- | --- |
| Notes 精选区 | 打开首页，核对内容 | draft Note 不出现 | 待验收 |  |
| Downloads 精选区 | 打开首页，核对内容 | draft Download 不出现 | 待验收 |  |
| Topics 精选区 | 打开首页，核对内容 | draft Topic 不出现 | 待验收 |  |

## 详情页访问验证

| 内容类型 | 访问路径 | 预期结果 | 结果 | 备注 |
| --- | --- | --- | --- | --- |
| Note | `/notes/project-retro-from-chaos-to-checklist` | notFound | 待验收 |  |
| DownloadResource | `/downloads/system-design-notes-draft` | notFound | 待验收 |  |

## 构建结果验证

### 构建命令

```bash
npm run build
```

检查项：
- [ ] published Note 进入静态构建。
- [ ] published Download 进入静态构建。
- [ ] draft Note 不进入静态参数生成结果。
- [ ] draft Download 不进入静态参数生成结果。
- [ ] draft Topic 不进入页面展示结果。

## 复核记录

| 复核项 | 结果 | 备注 |
| --- | --- | --- |
| Note draft 过滤 | 待验收 |  |
| Download draft 过滤 | 待验收 |  |
| Topic draft 过滤 | 待验收 |  |
| 首页精选区过滤 | 待验收 |  |
| 构建结果过滤 | 待验收 |  |

## 结论

- [ ] 所有 draft 内容均被正确过滤。
- [ ] 当前版本可继续进入正式验收或后续优化。