---
title: "HTTP 代理与 SOCKS5 代理：区别与选择方法"
description: "HTTP 代理能理解网页请求，SOCKS5 代理可以转发任意 TCP 连接。选哪种应取决于你的软件支持什么，而不是速度，因为两种协议本身都谈不上更快。下文对比两者的区别和选择方法，介绍安泊 VPN 代理 IP 的支持范围，并附可直接使用的 curl 测试命令。"
pubDate: 2026-11-06T11:00:00+08:00
category: proxies
term: "SOCKS5 代理"
tags: [HTTP 代理, SOCKS5, 代理协议, curl, 浏览器环境]
faq:
  - q: "SOCKS5 比 HTTP 代理更快吗？"
    a: "两种协议本身都谈不上更快。速度取决于网络路径和代理服务器。请根据软件支持哪种协议来选择，而不是凭预期的速度。"
  - q: "SOCKS5 会加密我的流量吗？"
    a: "不会。SOCKS5 只负责转发你的连接。加密来自你在其上运行的协议，例如 HTTPS。除非另外封装，你与代理之间的那一段是不加密的。"
  - q: "安泊 VPN 的 SOCKS5 代理支持 UDP 吗？"
    a: "不支持。安泊 VPN 的 HTTP/SOCKS5 代理只处理 TCP 流量，不支持 SOCKS5 UDP，需要 UDP 的工具请改用 VPN 客户端。"
  - q: "HTTP 和 SOCKS5 可以使用同一组账号吗？"
    a: "可以。一组账号对两种协议都有效。如果在你的网络上其中一种协议被重置，可以用同一个账号换另一种试试。"
---

## HTTP 代理和 SOCKS5 代理有什么区别？

**HTTP 代理**理解 HTTP：它会读取你的网页请求，遇到 HTTPS 时则用 `CONNECT` 方法建立隧道。**SOCKS5 代理**工作在更低的一层：它把 TCP 连接转发到你指定的目的地，不解析其中传输的内容。因此 SOCKS5 适用的软件种类更多，而 HTTP 是网页类工具的天然选择。

| | HTTP 代理 | SOCKS5 代理 |
|---|---|---|
| 它能理解什么 | HTTP 请求 | 不解析内部传输的内容 |
| 典型流量 | 网页、API、通过 `CONNECT` 的 HTTPS | 任意 TCP 连接，如网页、SSH 或聊天应用 |
| 认证方式 | HTTP 头中的代理认证 | SOCKS 握手期间的用户名和密码 |
| UDP | 不支持 | 协议中有定义，但并非所有服务商都支持 |
| 支持最好的软件 | 浏览器、`curl`、爬虫框架 | 带 SOCKS 设置的应用、SSH 隧道、许多桌面客户端 |

## HTTPS 请求是怎样经过它们的？

使用 HTTP 代理时，客户端先发送一行明文的 `CONNECT`，写明目的地，然后由代理建立隧道。使用 SOCKS5 时，客户端和代理先进行一次简短的二进制握手，再用紧凑的二进制格式在请求中写明目的地。两种格式都会让代理知道你要去哪里，而且都不会单独对到代理的这一段加密。

```text
CONNECT example.com:443 HTTP/1.1
Host: example.com:443
Proxy-Authorization: Basic ...
```

`CONNECT` 方法定义在 [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110#name-connect) 中。SOCKS5 握手见 [RFC 1928](https://www.rfc-editor.org/rfc/rfc1928)，其中的用户名和密码步骤见 [RFC 1929](https://www.rfc-editor.org/rfc/rfc1929)。

一个实际的影响：有些网络会检查明文的 `CONNECT` 行，却不会以同样的方式读取二进制的 SOCKS5 握手。在这类网络上，可能出现一种协议被重置、另一种却能连上的情况。请把它当作排查问题的一个步骤，而不是定论，因为其他网络的表现可能不同。

## 应该选哪一个？

根据你的软件支持什么来选。如果两者都支持，SOCKS5 更通用，HTTP 更常规。

- **选 HTTP**：工具里只有 HTTP 代理输入框，或者你处理的是网页请求和 API，或者想要与爬虫框架和浏览器最广泛的兼容。
- **选 SOCKS5**：应用不是网页客户端，软件把 SOCKS5 列为选项，或者你想用一个设置覆盖多种协议。
- **两者都不选**：需要 UDP 时，例如某些游戏或语音通话。请改用 VPN 客户端。

## 安泊 VPN 的 HTTP/SOCKS5 代理支持什么？

安泊 VPN 的代理 IP 让你的每个浏览器环境或脚本都有各自的代理账号，HTTP（含 HTTPS 隧道）和 SOCKS5 共用一组账号。以下信息已于 2026 年 11 月对照安泊 VPN 官网核对。

- 一个账号同时适用于两种协议，还可以选择设置来源 IP 白名单，已批准的地址无需用户名和密码即可连接。
- 主机、端口、用户名和密码显示在你的账户中，是便于粘贴到浏览器环境工具里的单行 `host:port:username:password` 格式。管理很多条时，可以一次全部复制。
- 与你的固定 IP 使用同一份流量和 IP 资源。
- 不支持 SOCKS5 UDP，也不提供 25 端口和对内部网络的访问。
- 代理按节点开通。如果某个 IP 下看不到代理卡片，说明该节点尚未开通，这个 IP 仍然可以通过客户端或订阅链接使用。

当前在售的内容，请查看[代理 IP 页面](https://www.anbovpn.com/zh/proxy-ip)。

## 如何测试代理？

向一个会回显你地址的服务发送一次请求，确认返回的是代理的地址。使用 `curl` 时，把占位符替换成你自己的信息：

```bash
# SOCKS5（socks5h 让代理来解析域名）
curl -x socks5h://USERNAME:PASSWORD@HOST:PORT https://www.anbovpn.com/ip

# HTTP
curl -x http://USERNAME:PASSWORD@HOST:PORT https://www.anbovpn.com/ip
```

返回内容会显示网站看到的地址和位置。如果其中一种协议失败，用同样的信息换另一种再试。你也可以使用免费的[批量 HTTP 代理检测](https://www.anbovpn.com/zh/tools/http-proxy-test)和[批量 SOCKS5 代理检测](https://www.anbovpn.com/zh/tools/socks5-proxy-test)工具，一次检测一批代理。

想了解代理背后的地址类型，请阅读[固定 IP 与共享 IP 对比](/zh/posts/dedicated-ip-vs-shared-ip/)。
