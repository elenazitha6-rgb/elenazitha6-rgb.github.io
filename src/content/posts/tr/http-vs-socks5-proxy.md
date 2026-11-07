---
title: "HTTP ve SOCKS5 Proxy: Farklar ve Nasıl Seçilir"
description: "HTTP proxy web isteklerini anlar, SOCKS5 proxy ise her TCP bağlantısını aktarır. Hıza göre değil, yazılımınızın desteğine göre seçin. Test komutları da içeride."
pubDate: 2026-11-06T11:00:00+08:00
category: proxies
tags: ["HTTP proxy", "SOCKS5", "proxy protokolü", "curl", "tarayıcı profilleri"]
faq:
  - q: "SOCKS5, HTTP proxy’den daha hızlı mı?"
    a: "İki protokol de doğası gereği daha hızlı değildir. Hız, ağ yoluna ve proxy sunucusuna bağlıdır. Aralarında seçimi beklenen hıza göre değil, yazılımınızın desteğine göre yapın."
  - q: "SOCKS5 trafiğimi şifreler mi?"
    a: "Hayır. SOCKS5 yalnızca bağlantınızı aktarır. Şifreleme, onun üzerinden çalıştırdığınız protokolden gelir; örneğin HTTPS. Sizinle proxy arasındaki hat, ayrıca sarmalanmadıkça şifrelenmez."
  - q: "AnboVPN SOCKS5 proxy’si UDP’yi destekliyor mu?"
    a: "Hayır. AnboVPN HTTP/SOCKS5 proxy yalnızca TCP trafiğini işler. SOCKS5 UDP desteklenmez; UDP gerektiren araçlar bunun yerine VPN istemcisini kullanmalıdır."
  - q: "HTTP ve SOCKS5 için aynı hesap bilgilerini kullanabilir miyim?"
    a: "Evet. Tek bir hesap bilgisi iki protokolde de çalışır. Ağınızda bir protokol sıfırlanıyorsa, aynı hesapla diğerini deneyebilirsiniz."
---

## HTTP proxy ile SOCKS5 proxy arasındaki fark nedir?

Bir **HTTP proxy** HTTP’yi anlar: web isteklerinizi okur ve HTTPS için `CONNECT` yöntemiyle bir tünel açar. Bir **SOCKS5 proxy** ise bir seviye aşağıda çalışır: içinden geçeni yorumlamadan, belirttiğiniz hedefe bir TCP bağlantısı aktarır. SOCKS5’in daha fazla yazılım türüne uyması, HTTP’nin ise web araçlarına doğal bir seçenek olması bu yüzdendir.

| | HTTP proxy | SOCKS5 proxy |
|---|---|---|
| Neyi anlar | HTTP istekleri | İçerideki trafik hakkında hiçbir şey |
| Tipik trafik | Web sayfaları, API’ler, `CONNECT` ile HTTPS | Web, SSH veya sohbet uygulamaları gibi her TCP bağlantısı |
| Kimlik doğrulama | HTTP başlıklarında proxy kimlik doğrulaması | SOCKS el sıkışması sırasında kullanıcı adı ve parola |
| UDP | Hayır | Protokolde tanımlıdır ama her sağlayıcı desteklemez |
| En iyi desteklendiği yerler | Tarayıcılar, `curl`, scraping kütüphaneleri | SOCKS ayarı olan uygulamalar, SSH tünelleri, birçok masaüstü istemcisi |

## Bir HTTPS isteği her birinden nasıl geçer?

HTTP proxy ile istemciniz önce hedefi belirten düz metin bir `CONNECT` satırı gönderir, ardından proxy tüneli açar. SOCKS5 ile istemciniz ve proxy kısa bir ikili (binary) el sıkışma yapar; istek de hedefi sıkıştırılmış ikili biçimde belirtir. Her iki biçim de proxy’ye nereye gittiğinizi söyler ve hiçbiri proxy’ye giden hattı kendi başına şifrelemez.

```text
CONNECT example.com:443 HTTP/1.1
Host: example.com:443
Proxy-Authorization: Basic ...
```

`CONNECT` yöntemi [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110#name-connect) içinde tanımlanır. SOCKS5 el sıkışması [RFC 1928](https://www.rfc-editor.org/rfc/rfc1928) içindedir; kullanıcı adı ve parola adımı ise [RFC 1929](https://www.rfc-editor.org/rfc/rfc1929) içinde yer alır.

Pratik bir sonuç: bazı ağlar düz metin `CONNECT` satırlarını inceler ama ikili SOCKS5 el sıkışmasını aynı şekilde okumaz. Böyle bir ağda bir protokolün bağlantısı sıfırlanırken diğeri bağlanabilir. Bunu bir kural değil, bir sorun giderme adımı olarak ele alın; çünkü diğer ağlar farklı davranır.

## Hangisini seçmelisiniz?

Yazılımınızın neyi desteklediğine göre seçin. İkisini de sunuyorsa SOCKS5 daha genel, HTTP ise daha geleneksel seçenektir.

- **HTTP’yi seçin:** aracınızda yalnızca bir HTTP proxy alanı varsa, web istekleri ve API’lerle çalışıyorsanız ya da scraping kütüphaneleri ve tarayıcılarla en geniş uyumu istiyorsanız.
- **SOCKS5’i seçin:** uygulama bir web istemcisi değilse, yazılım SOCKS5’i seçenek olarak listeliyorsa ya da tek bir ayarın birkaç protokolü kapsamasını istiyorsanız.
- **İkisini de seçmeyin:** UDP gerekiyorsa, örneğin bazı oyunlar veya sesli aramalar için. Bunun yerine bir VPN istemcisi kullanın.

## AnboVPN HTTP/SOCKS5 proxy neleri destekler?

AnboVPN’in HTTP/SOCKS5 proxy’si, her tarayıcı profilinize veya betiğinize kendi proxy hesabını verir; HTTP (HTTPS tünelleri dahil) ve SOCKS5 aynı hesap bilgileri üzerinden çalışır. Bu ayrıntılar Kasım 2026’da AnboVPN web sitesine göre kontrol edilmiştir.

- Tek hesap iki protokolde de çalışır. İsteğe bağlı bir kaynak IP izin listesiyle, onaylı adresler kullanıcı adı ve parola olmadan bağlanır.
- Ana makine, portlar, kullanıcı adı ve parola hesabınızda gösterilir; tarayıcı profili araçlarına yapıştırması kolay, tek satırlık `host:port:username:password` biçimindedir. Çok sayıda yönetiyorsanız hepsini tek seferde kopyalayabilirsiniz.
- Özel IP’nizle aynı veri ve IP kaynağını kullanır.
- SOCKS5 UDP desteklenmez; 25. port ve iç ağlara erişim sunulmaz.
- Proxy erişimi düğüm bazında etkinleştirilir. Bir IP için proxy kartını görmüyorsanız o düğüm henüz etkin değildir; IP yine de istemci veya abonelik bağlantısı üzerinden kullanılabilir.

Şu anda satışta olanlar için [HTTP/SOCKS5 proxy sayfasına](https://www.anbovpn.com/tr/proxy-ip) bakın.

## Bir proxy nasıl test edilir?

Proxy üzerinden adresinizi yansıtan bir hizmete tek bir istek gönderin ve adresin proxy’ye ait olduğunu kontrol edin. `curl` ile yer tutucuları kendi bilgilerinizle değiştirin:

```bash
# SOCKS5 (socks5h, alan adının proxy tarafından çözümlenmesini sağlar)
curl -x socks5h://USERNAME:PASSWORD@HOST:PORT https://www.anbovpn.com/ip

# HTTP
curl -x http://USERNAME:PASSWORD@HOST:PORT https://www.anbovpn.com/ip
```

Yanıt, web sitesinin gördüğü adresi ve konumu gösterir. Bir protokol başarısız olursa aynı bilgilerle diğerini deneyin. Ayrıca ücretsiz [HTTP proxy testi](https://www.anbovpn.com/tr/tools/http-proxy-test) ve [SOCKS5 proxy testi](https://www.anbovpn.com/tr/tools/socks5-proxy-test) araçlarıyla birden fazla proxy’yi tek seferde kontrol edebilirsiniz.

Bir proxy’nin arkasındaki adres türleri hakkında bilgi için [Özel IP ve paylaşımlı IP](/tr/posts/dedicated-ip-vs-shared-ip/) yazısını okuyun.
