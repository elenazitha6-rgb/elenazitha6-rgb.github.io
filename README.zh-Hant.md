<p align="center">
  <a href="./README.zh.md">简体中文</a> | <a href="./README.md">English</a> | <b>繁體中文</b> | <a href="./README.ja.md">日本語</a> | <a href="./README.ru.md">Русский</a> | <a href="./README.fa.md">فارسی</a> | <a href="./README.tr.md">Türkçe</a>
</p>

<p align="center">
  <img src="./public/brand/anbo-logo-256.png" alt="安泊 VPN" width="96" height="96">
</p>

<h1 align="center">安泊 VPN 官方部落格</h1>

<p align="center">
  <b>一個帳戶，四類連線方式：共享 IP、固定 IP、代理 IP 與透明閘道。</b><br>
  註冊即送 10 GB 免費流量，先試再買。
</p>

<p align="center">
  <a href="https://www.anbovpn.com/zh-Hant/download?utm_source=anbovpn_blog&amp;utm_medium=blog&amp;utm_campaign=readme-top-download"><b>下載安泊 VPN・註冊送 10 GB</b></a>
  &nbsp;·&nbsp;
  <a href="https://www.anbovpn.com/zh-Hant/pricing?utm_source=anbovpn_blog&amp;utm_medium=blog&amp;utm_campaign=readme-top-pricing">查看流量方案</a>
  &nbsp;·&nbsp;
  <a href="https://elenazitha6-rgb.github.io/zh-Hant/">閱讀部落格</a>
</p>

---

剛接觸這些名詞也沒關係。這個部落格由安泊 VPN 團隊撰寫，照著「先弄懂名詞、再挑適合的方式、最後動手設定」的順序，把每一種連線方式的用途、適合對象和限制交代清楚，讓你試用之前就心裡有數。

## 先看四個重點

- **註冊即送 10 GB**：註冊贈送 10 GB 免費流量（僅一次，有效期 1 個月），先試再買。
- **AI 專線優化**：面向 AI 服務做專線優化，出口可選住宅 IP 或家寬 IP。
- **開啟即用**：官方客戶端一鍵連線，支援應用級智慧分流。
- **四類連線方式**：共享 IP、固定 IP、代理 IP 與透明閘道，一個帳戶不限裝置。

## 四類連線方式，我該選哪一種？

| 連線方式 | 簡單來說 | 適合誰 |
|---|---|---|
| **共享 IP** | 在多個地區的共享節點之間隨時切換 | 日常使用、常常想換地區 |
| **固定 IP** | 固定在某個地區長期使用，位址不會變 | 要設 IP 白名單、想長期用同一個登入位址 |
| **代理 IP** | 只替指定的軟體設定獨立出口 | 只想讓某個軟體、腳本或工具單獨走出口 |
| **透明閘道** | 裝在一台常開的 Linux 主機上，裝置指向它就能用 | 想一次涵蓋電視、遊戲主機這類沒辦法裝 App 的裝置 |

### 選擇之前，先看這些細節

- **共享 IP**：所有共享節點共用同一份流量，不用依地區分開購買。
  → [固定 IP 和共享 IP 差在哪？新手選購一次看懂](https://elenazitha6-rgb.github.io/zh-Hant/posts/dedicated-ip-vs-shared-ip/)
- **固定 IP**：方案有效期間內位址不會變，出口可選住宅 IP 或家寬 IP。
  → [家寬 IP 是什麼？和資料中心 IP 的差別一次說清楚](https://elenazitha6-rgb.github.io/zh-Hant/posts/isp-residential-ip-explained/)
- **代理 IP**：在軟體裡填入 HTTP / SOCKS5 資訊就能接入，不必讓整台裝置都走代理。一組憑證兩種協定通用，可選擇設定來源 IP 白名單；不支援 SOCKS5 UDP。
  → [HTTP 代理和 SOCKS5 代理怎麼選？看軟體支援什麼](https://elenazitha6-rgb.github.io/zh-Hant/posts/http-vs-socks5-proxy/)
- **透明閘道**：需要一台常開的 Debian / Ubuntu（amd64 / arm64）Linux 機器，以 root 執行一行指令安裝。裝置本身不用裝用戶端，但整台機器只能走同一個地區。
  → [透明閘道（旁路由）是什麼？電視、NAS 不裝 App 也能用](https://elenazitha6-rgb.github.io/zh-Hant/posts/network-gateway-explained/)

另外提醒一下：**AI 專線優化**不是獨立的商品，而是固定 IP 與代理 IP 的組合包裝，針對 AI 服務優化線路，出口是住宅 IP 或家寬 IP。想先弄清楚它能做什麼、不能承諾什麼，可以看這篇：[AI 專線優化是什麼？能做到什麼、不能承諾什麼](https://elenazitha6-rgb.github.io/zh-Hant/posts/ai-optimized-routes-explained/)。

## 新手三步上手

1. **下載並註冊**：到[下載頁](https://www.anbovpn.com/zh-Hant/download?utm_source=anbovpn_blog&utm_medium=blog&utm_campaign=readme-steps-download)取得官方客戶端，註冊後即可領取 10 GB 免費流量（僅一次，有效期 1 個月）。
2. **挑一種連線方式**：拿不定主意的話，先看上面的表格，再讀對應的文章。
3. **一鍵連線**：開啟客戶端按下連線；只想讓特定的應用程式走出口時，再開啟應用級智慧分流。

## 建議閱讀順序

照這個順序讀，名詞會一層一層疊上去，比較不容易卡關：

1. [**固定 IP 和共享 IP 差在哪？新手選購一次看懂**](https://elenazitha6-rgb.github.io/zh-Hant/posts/dedicated-ip-vs-shared-ip/)<br>
   最基本的觀念：日常切換地區用共享，要設 IP 白名單、長期固定登入再選固定。
2. [**家寬 IP 是什麼？和資料中心 IP 的差別一次說清楚**](https://elenazitha6-rgb.github.io/zh-Hant/posts/isp-residential-ip-explained/)<br>
   用「戶籍」的比喻看懂 ASN，並教你自己查 IP 的類型。
3. [**HTTP 代理和 SOCKS5 代理怎麼選？看軟體支援什麼**](https://elenazitha6-rgb.github.io/zh-Hant/posts/http-vs-socks5-proxy/)<br>
   兩者沒有誰天生比較快，依軟體支援哪一種來選；附 curl 測試指令。
4. [**透明閘道（旁路由）是什麼？電視、NAS 不裝 App 也能用**](https://elenazitha6-rgb.github.io/zh-Hant/posts/network-gateway-explained/)<br>
   五個設定步驟與五項限制，動手前先完整看過一遍。
5. [**AI 專線優化是什麼？能做到什麼、不能承諾什麼**](https://elenazitha6-rgb.github.io/zh-Hant/posts/ai-optimized-routes-explained/)<br>
   購買前把「能做」和「不能承諾」的界線看清楚。

## 常見問題

**免費的 10 GB 怎麼領？可以用多久？**
註冊時就會贈送，僅此一次，有效期 1 個月。

**不同連線方式的流量可以互相通用嗎？**
共享 IP 的各個節點共用同一份流量；不過四類連線方式的流量餘額各自獨立，不會互相通用。

**買了 AI 專線優化，就一定連得上 AI 平台嗎？**
不一定，我們也不承諾速度、延遲或可用率。各 AI 平台的存取政策由平台自行決定，不保證可用，請遵守各平台的服務條款。

**價格和方案去哪裡看？**
價格會變動，所以這裡不寫具體數字，請以[官網價格頁](https://www.anbovpn.com/zh-Hant/pricing?utm_source=anbovpn_blog&utm_medium=blog&utm_campaign=readme-faq-pricing)為準。

## 部落格的其他語言版本

共有 7 種語言，每一種都是依當地讀者的閱讀習慣各自撰寫，並非互相翻譯：

[English](https://elenazitha6-rgb.github.io/) ·
[简体中文](https://elenazitha6-rgb.github.io/zh/) ·
[繁體中文](https://elenazitha6-rgb.github.io/zh-Hant/) ·
[日本語](https://elenazitha6-rgb.github.io/ja/) ·
[Русский](https://elenazitha6-rgb.github.io/ru/) ·
[فارسی](https://elenazitha6-rgb.github.io/fa/) ·
[Türkçe](https://elenazitha6-rgb.github.io/tr/)

## 關於這個部落格

- **這是安泊 VPN 的官方部落格**，文章會提到並連結到我們自己的產品，我們會明白標示；技術比較是為了幫你做選擇，包括「其實你不需要付費產品」的情況。
- 每篇文章都先給結論再說明理由，標示發布與更新日期；可能會變動的產品資訊會註明核對時間，技術性說法則連結到 RFC 或官方文件。
- 產品資訊於 **2026 年 11 月**對照[官網](https://www.anbovpn.com/zh-Hant?utm_source=anbovpn_blog&utm_medium=blog&utm_campaign=readme-footer-home)核對，一切以官網當前頁面為準。
- 安泊 VPN 由 Anbo Technology LLC（美國懷俄明州有限責任公司）營運。文章有疑問或需要更正，歡迎來信 service@anbollc.com。
