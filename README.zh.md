<p align="center">
<a href="./README.md">English</a> | <b>简体中文</b>
</p>

<p align="center">
  <img src="./public/brand/anbo-logo-256.png" alt="安泊 VPN" width="96" height="96">
</p>

<h1 align="center">AnboVPN（安泊 VPN）官方博客</h1>

<p align="center">
  <b>一个账户，四类连接方式：共享 IP、固定 IP、代理 IP 与透明网关。</b><br>
  注册即送 10 GB 免费流量，先试再买。
</p>

<p align="center">
  <a href="https://www.anbovpn.com/zh/download?utm_source=anbovpn_blog&amp;utm_medium=blog&amp;utm_campaign=readme-top-download"><b>下载客户端 · 注册送 10 GB</b></a>
  &nbsp;·&nbsp;
  <a href="https://www.anbovpn.com/zh/pricing?utm_source=anbovpn_blog&amp;utm_medium=blog&amp;utm_campaign=readme-top-pricing">查看流量套餐</a>
  &nbsp;·&nbsp;
  <a href="https://elenazitha6-rgb.github.io/zh/">阅读博客</a>
</p>

---

安泊 VPN（英文名 AnboVPN）提供共享 IP、固定 IP、代理 IP 和透明网关四类连接方式，配有官方客户端，打开即可一键连接。这个博客是安泊 VPN 团队写的使用指南：每种连接方式是什么、适合谁、怎么选、有哪些限制，都讲清楚，再让你决定要不要试。

## 为什么选安泊 VPN

- **注册即送 10 GB**：注册赠送 10 GB 免费流量（仅一次，有效期 1 个月），先试再买。
- **AI 专线优化**：面向 AI 服务做专线优化，出口可选住宅 IP 或家宽 IP。
- **打开即用**：官方客户端一键连接，支持应用级智能分流。
- **四类连接方式**：共享 IP、固定 IP、代理 IP 与透明网关，一个账户不限设备。

## 四类连接方式，怎么选？

| 连接方式 | 一句话 | 适合 |
|---|---|---|
| **共享 IP** | 在多个地区的共享节点间随时切换 | 日常使用、需要随时换地区 |
| **固定 IP** | 固定在某个地区长期使用，地址不变 | 做 IP 白名单、长期用同一个登录地址 |
| **代理 IP** | 只给指定软件配置出口，填 HTTP / SOCKS5 即可 | 让某个软件、脚本或工具单独走出口 |
| **透明网关** | 装在常开的 Linux 机器上，设备指向它即可 | 一次覆盖电视、游戏主机等没法装 App 的设备 |

**各自的细节和限制**

- **共享 IP**：所有共享节点共用同一份流量，不必按地区分别购买。
  → [固定 IP 和共享 IP 哪个好？一张表看懂怎么选](https://elenazitha6-rgb.github.io/zh/posts/dedicated-ip-vs-shared-ip/)
- **固定 IP**：套餐有效期内地址不变，出口可选住宅 IP 或家宽 IP。
  → [家宽 IP 是什么？和机房 IP、住宅 IP 怎么区分](https://elenazitha6-rgb.github.io/zh/posts/isp-residential-ip-explained/)
- **代理 IP**：不用让整台设备走代理；一套凭据两种协议通用，可选来源 IP 白名单；不支持 SOCKS5 UDP。
  → [HTTP 代理和 SOCKS5 代理有什么区别？填哪个更合适](https://elenazitha6-rgb.github.io/zh/posts/http-vs-socks5-proxy/)
- **透明网关**：装在 Debian / Ubuntu（amd64 / arm64）Linux 机器上，一行命令、root 执行；设备本身不用装客户端，整台设备只走一个地区。
  → [透明网关怎么用？电视、游戏主机不装 App 也能接入](https://elenazitha6-rgb.github.io/zh/posts/network-gateway-explained/)

**AI 专线优化**不是单独的商品，而是固定 IP 与代理 IP 的一种搭配：面向 AI 服务做过线路优化，出口是住宅 IP 或家宽 IP。详见 [AI 专线优化是什么？它能做什么，不能承诺什么](https://elenazitha6-rgb.github.io/zh/posts/ai-optimized-routes-explained/)。

## 三步开始

1. **下载并注册**：到[下载页](https://www.anbovpn.com/zh/download?utm_source=anbovpn_blog&utm_medium=blog&utm_campaign=readme-steps-download)获取官方客户端，注册即领 10 GB 免费流量（仅一次，有效期 1 个月）。
2. **选连接方式**：不确定选哪种，就先读上面的对照表和对应文章。
3. **一键连接**：打开客户端点连接；需要时用应用级智能分流，只让指定的应用走出口。

## 博客里能读到什么

- [**固定 IP 和共享 IP 哪个好？一张表看懂怎么选**](https://elenazitha6-rgb.github.io/zh/posts/dedicated-ip-vs-shared-ip/)<br>
  日常切换地区用共享 IP，要做 IP 白名单、长期用同一个登录地址就选固定 IP。
- [**HTTP 代理和 SOCKS5 代理有什么区别？填哪个更合适**](https://elenazitha6-rgb.github.io/zh/posts/http-vs-socks5-proxy/)<br>
  软件里只有 HTTP 代理框就填 HTTP，想一套设置兼容更多程序就填 SOCKS5；附测试命令和报错排查表。
- [**家宽 IP 是什么？和机房 IP、住宅 IP 怎么区分**](https://elenazitha6-rgb.github.io/zh/posts/isp-residential-ip-explained/)<br>
  讲清机房、住宅、家宽三种标签的区别，教你自己查 IP 类型。
- [**透明网关怎么用？电视、游戏主机不装 App 也能接入**](https://elenazitha6-rgb.github.io/zh/posts/network-gateway-explained/)<br>
  适合谁、五步怎么设置，以及只能选一个地区、机器必须常开等限制。
- [**AI 专线优化是什么？它能做什么，不能承诺什么**](https://elenazitha6-rgb.github.io/zh/posts/ai-optimized-routes-explained/)<br>
  拆解三个常见误会和适用场景。

## 常见问题

**注册后能免费用多少流量？**
注册赠送 10 GB 免费流量，仅一次，有效期 1 个月。四类连接方式的流量余额各自独立计算。

**AI 专线优化能保证访问某个 AI 平台吗？**
不能。我们不承诺速度、延迟或可用率，也不保证某个平台一定可用：各 AI 平台的访问策略由平台自行决定，不保证可用，请遵守各平台的服务条款。

**固定 IP、共享 IP、代理 IP、透明网关，我该选哪个？**
日常切换地区选共享 IP；要做 IP 白名单或长期用同一个登录地址选固定 IP；只想让某个软件单独走出口选代理 IP；想一次覆盖电视、游戏主机这类没法装 App 的设备，并且手上有一台常开的 Linux 机器，选透明网关。每种的限制都写在上面的对应文章里。

**价格和套餐在哪里看？**
价格会变，博客不写具体数字，请以[官网价格页](https://www.anbovpn.com/zh/pricing?utm_source=anbovpn_blog&utm_medium=blog&utm_campaign=readme-faq-pricing)为准。

## 多语言

博客目前有英文和简体中文两个版本，两种语言都是按当地写作习惯各自写的，不是互相翻译：

[English](https://elenazitha6-rgb.github.io/) ·
[简体中文](https://elenazitha6-rgb.github.io/zh/)

## 关于这个博客

- **这是安泊 VPN 的官方博客**，文章会提到并链到我们自己的产品，我们不把它包装成中立评测；技术对比是为了帮你选，包括「你其实不需要付费产品」的情况。
- 每篇文章先给结论再讲理由，标明发布和更新日期；会变的产品事实写明核对时间，技术性说法链到 RFC 或官方文档。
- 产品信息核对于 **2026 年 11 月**，以[官网](https://www.anbovpn.com/zh?utm_source=anbovpn_blog&utm_medium=blog&utm_campaign=readme-footer-home)当前页面为准。
- 安泊 VPN 由 Anbo Technology LLC（美国怀俄明州有限责任公司）运营。文章问题或勘误请发邮件到 service@anbollc.com。

---

<sub>开发、发布和写作维护：见 [`docs/DEVELOPMENT.md`](./docs/DEVELOPMENT.md)；品牌、术语和对外口径：见 [`CLAUDE.md`](./CLAUDE.md)。</sub>
