---
title: "HTTP 代理與 SOCKS5 代理的差異與選擇方法"
description: "HTTP 代理看得懂網頁請求，SOCKS5 代理則能轉發任何 TCP 連線。該選哪一種，要看你的軟體支援什麼，而不是看速度。本文說明兩者的差異與適用情境，介紹安泊 VPN 代理 IP 的支援範圍與限制，並附上 curl 測試指令，讓你快速確認代理是否正常運作。"
pubDate: 2026-11-06T11:00:00+08:00
category: proxies
term: "SOCKS5 代理"
tags: [HTTP 代理, SOCKS5, 代理協定, curl, 瀏覽器環境]
faq:
  - q: "SOCKS5 比 HTTP 代理快嗎？"
    a: "兩種協定本身都沒有比較快。速度取決於網路路徑與代理伺服器。請依你的軟體支援什麼來選擇，而不是依預期的速度。"
  - q: "SOCKS5 會加密我的流量嗎？"
    a: "不會。SOCKS5 只負責轉發你的連線。加密來自你在其上執行的協定，例如 HTTPS。除非另外包裝，你與代理之間的這一段並不會加密。"
  - q: "安泊 VPN 的 SOCKS5 代理支援 UDP 嗎？"
    a: "不支援。安泊 VPN 的 HTTP/SOCKS5 代理只處理 TCP 流量，不支援 SOCKS5 UDP，需要 UDP 的工具請改用 VPN 用戶端。"
  - q: "HTTP 與 SOCKS5 可以使用同一組憑證嗎？"
    a: "可以。一組憑證對兩種協定都有效。如果在你的網路上其中一種協定被重設，可以用同一個帳戶改試另一種。"
---

## HTTP 代理與 SOCKS5 代理有什麼差別？

**HTTP 代理**看得懂 HTTP：它會讀取你的網頁請求，遇到 HTTPS 時則以 `CONNECT` 方法建立通道。**SOCKS5 代理**運作在更低的一層：它把 TCP 連線轉發到你指定的目的地，並不解讀裡面傳送的內容。因此 SOCKS5 適用的軟體種類更多，而 HTTP 則是網頁類工具的自然選擇。

| | HTTP 代理 | SOCKS5 代理 |
|---|---|---|
| 看得懂什麼 | HTTP 請求 | 對內部的流量一無所知 |
| 典型流量 | 網頁、API，HTTPS 透過 `CONNECT` | 任何 TCP 連線，例如網頁、SSH 或聊天應用程式 |
| 驗證方式 | 在 HTTP 標頭中進行代理驗證 | 在 SOCKS 交握過程中提供使用者名稱與密碼 |
| UDP | 不支援 | 協定中有定義，但並非每家服務商都支援 |
| 支援最好的對象 | 瀏覽器、`curl`、爬蟲函式庫 | 有 SOCKS 設定的應用程式、SSH 通道、許多桌面用戶端 |

## HTTPS 請求如何經過這兩種代理？

使用 HTTP 代理時，你的用戶端會先送出一行明文的 `CONNECT`，指出目的地，再由代理開啟通道。使用 SOCKS5 時，用戶端與代理先進行一段簡短的二進位交握，請求再以精簡的二進位格式指明目的地。兩種格式都會讓代理知道你要去哪裡，也都不會自行加密連到代理的那一段。

```text
CONNECT example.com:443 HTTP/1.1
Host: example.com:443
Proxy-Authorization: Basic ...
```

`CONNECT` 方法定義於 [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110#name-connect)。SOCKS5 交握定義於 [RFC 1928](https://www.rfc-editor.org/rfc/rfc1928)，其中的使用者名稱與密碼步驟則定義於 [RFC 1929](https://www.rfc-editor.org/rfc/rfc1929)。

一個實際的影響是：有些網路會檢查明文的 `CONNECT` 行，卻不會以同樣的方式讀取二進位的 SOCKS5 交握。在這樣的網路上，可能出現其中一種協定被重設、另一種卻能連上的情形。請把這當作排查問題的一個步驟，而不是定則，因為其他網路的行為可能不同。

## 該選哪一種？

依你的軟體支援什麼來選。如果兩種都支援，SOCKS5 是比較通用的選項，HTTP 則是比較傳統的選項。

- **選 HTTP**：你的工具只有 HTTP 代理欄位、你處理的是網頁請求與 API，或你希望與爬蟲函式庫和瀏覽器有最廣泛的相容性。
- **選 SOCKS5**：應用程式不是網頁用戶端、軟體把 SOCKS5 列為選項，或你希望用一個設定涵蓋多種協定。
- **兩者都不選**：需要 UDP 時，例如某些遊戲或語音通話，請改用 VPN 用戶端。

## 安泊 VPN 的 HTTP/SOCKS5 代理支援什麼？

安泊 VPN 的 HTTP/SOCKS5 代理 IP 可以讓你的每個瀏覽器環境或指令碼各有一個獨立的代理帳號，HTTP（含 HTTPS 通道）與 SOCKS5 共用同一組憑證。以下內容已於 2026 年 11 月對照安泊 VPN 官網核實。

- 一個帳號對兩種協定都有效，並可選擇設定來源 IP 白名單，讓核准的位址不必輸入使用者名稱或密碼就能連線。
- 主機、連接埠、使用者名稱與密碼會顯示在你的帳戶中，格式為一行 `host:port:username:password`，方便貼進瀏覽器環境工具。如果你管理大量代理，可以一次全部複製。
- 它與你的固定 IP 使用同一份流量與 IP 資源。
- 不支援 SOCKS5 UDP，也不提供 25 連接埠與內部網路的存取。
- 代理依節點啟用。如果你在某個 IP 上看不到代理卡片，代表該節點尚未啟用，這個 IP 仍然可以透過用戶端或訂閱連結使用。

目前販售的內容，請見 [HTTP/SOCKS5 代理 IP 頁面](https://www.anbovpn.com/zh-Hant/proxy-ip)。

## 如何測試代理？

透過代理向一個會回傳你位址的服務發出一個請求，並確認回傳的位址是代理的位址。使用 `curl` 時，把佔位符換成你自己的資料：

```bash
# SOCKS5（socks5h 讓代理負責解析網域名稱）
curl -x socks5h://USERNAME:PASSWORD@HOST:PORT https://www.anbovpn.com/ip

# HTTP
curl -x http://USERNAME:PASSWORD@HOST:PORT https://www.anbovpn.com/ip
```

回應會顯示網站看到的位址與所在地。如果其中一種協定失敗，請用相同的資料改試另一種。你也可以使用免費的 [HTTP 代理檢測](https://www.anbovpn.com/zh-Hant/tools/http-proxy-test)與 [SOCKS5 代理檢測](https://www.anbovpn.com/zh-Hant/tools/socks5-proxy-test)工具，一次檢查一批代理。

想了解代理背後的位址類型，請閱讀[固定 IP 與共享 IP 比較](/zh-Hant/posts/dedicated-ip-vs-shared-ip/)。
