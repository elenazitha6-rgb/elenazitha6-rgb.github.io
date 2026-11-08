---
title: "HTTP mi SOCKS5 mi? Proxy Protokolü Nasıl Seçilir?"
description: "SOCKS5 proxy her TCP bağlantısını olduğu gibi aktarır, HTTP proxy yalnızca web isteklerini anlar. Seçimi hıza göre değil, aracınızın ayarına göre yapın."
pubDate: 2026-11-06T11:00:00+08:00
category: proxies
term: "SOCKS5 proxy"
tags: ["SOCKS5 proxy", "HTTP proxy", "proxy protokolü", "curl proxy", "tarayıcı profili", "proxy nasıl test edilir"]
faq:
  - q: "SOCKS5 proxy HTTP proxy’den hızlı mıdır?"
    a: "Hayır, protokol tek başına hızı belirlemez. Hız ağ yoluna ve proxy sunucusuna bağlıdır. Seçimi beklenen hıza göre değil, kullandığınız aracın hangi protokolü desteklediğine göre yapın."
  - q: "SOCKS5 trafiğimi şifreler mi?"
    a: "Hayır. SOCKS5 bağlantıyı yalnızca aktarır. Şifreleme, üzerinden çalıştırdığınız protokolden gelir; örneğin HTTPS. Sizinle proxy arasındaki hat ayrıca korunmadıkça şifreli değildir."
  - q: "AnboVPN proxy’sinde SOCKS5 UDP çalışıyor mu?"
    a: "Hayır. AnboVPN HTTP/SOCKS5 proxy yalnızca TCP trafiği için hazırlanmıştır, SOCKS5 UDP desteklenmez. UDP gerektiren araçlar için AnboVPN istemcisini kullanın."
  - q: "Tek hesapla hem HTTP hem SOCKS5 kullanabilir miyim?"
    a: "Evet. Bir proxy hesabının kullanıcı adı ve parolası iki protokolde de geçerlidir. Ağınızda biri takılırsa aynı bilgilerle diğerini deneyebilirsiniz."
  - q: "Proxy kullanıcı adı ve parolası olmadan bağlanabilir miyim?"
    a: "Hesabınızda kaynak IP izin listesi tanımlarsanız, listedeki adreslerden gelen bağlantılar kullanıcı adı ve parola girmeden kurulur. Liste boşsa kimlik doğrulama gerekir."
---

## SOCKS5 proxy nedir, HTTP proxy’den farkı ne?

**SOCKS5 proxy**, kendisine iletilmesi istenen bir TCP bağlantısını, içindekini yorumlamadan hedefe aktaran ve isteğe bağlı olarak kullanıcı adı ve parolayla kimlik doğrulayan bir ara sunucudur (RFC 1928). HTTP proxy ise HTTP’yi anlar: web isteklerinizi okur, HTTPS için de `CONNECT` yöntemiyle bir tünel açar.

Basit bir benzetme: HTTP proxy, gelen mektubun üstündeki adrese ve yazıya bakan sekreterdir; SOCKS5 ise paketi açmadan adrese ileten kuryedir. Bu yüzden SOCKS5 daha çok yazılımla çalışır, HTTP proxy ise web araçları için doğal seçimdir.

> **Özetle:** Aracınızda yalnızca “HTTP proxy” alanı varsa HTTP, “SOCKS” seçeneği de varsa genel amaçlı SOCKS5 daha esnektir. UDP gerekiyorsa proxy yerine VPN istemcisini düşünün.

## Hangisini seçmeliyim? Ayar ekranınıza bakın

Doğru protokolü hızdan değil, aracınızın ayar ekranından anlarsınız: orada hangi protokol listeleniyorsa onu kullanırsınız. İkisi de varsa web odaklı işlerde HTTP, web dışı işlerde SOCKS5 daha rahat eder.

| Araç | Genellikle uygun olan |
|---|---|
| Tarayıcı profili araçları, `curl`, tarama kütüphaneleri | HTTP (SOCKS5 de çoğunlukla desteklenir) |
| SSH tüneli, sohbet ve masaüstü uygulamaları | SOCKS5 |
| Yalnızca “HTTP proxy” kutusu olan yazılımlar | HTTP |
| UDP kullanan oyun ya da sesli görüşme | Proxy değil, VPN istemcisi |

Pratikte karar genelde tek bakışta verilir. Örneğin her tarayıcı profiline ayrı bir adres vermek istiyorsanız profil ayarında “HTTP” ya da “SOCKS5” seçeneklerinden birini işaretler, aynı hesap bilgilerini yapıştırırsınız. Betiklerde ise kütüphanenizin hangi proxy şemasını (`http://` ya da `socks5://`) kabul ettiğine bakmanız yeter.

> **İpucu:** Sorun çıkarsa aynı bilgilerle diğer protokolü deneyin. Bazı ağlar düz metin `CONNECT` satırlarını inceler, SOCKS5 el sıkışmasına farklı davranır; bir protokol sıfırlanırken diğeri bağlanabilir. Bu bir kural değil, hata ayıklama adımıdır.

## HTTPS isteği proxy’den nasıl geçer?

HTTP proxy’de istemci önce hedefi düz metin bir `CONNECT` satırıyla bildirir, proxy da tüneli açar. SOCKS5’te ise istemci ve proxy kısa bir ikili el sıkışma yapar ve hedef kısa bir ikili biçimde iletilir. İki yöntemde de proxy hedefi görür; hiçbiri proxy’ye giden hattı kendiliğinden şifrelemez.

```text
CONNECT example.com:443 HTTP/1.1
Host: example.com:443
Proxy-Authorization: Basic ...
```

`CONNECT` yöntemi [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110#name-connect)’da, SOCKS5 el sıkışması [RFC 1928](https://www.rfc-editor.org/rfc/rfc1928)’de, kullanıcı adı ve parola adımı ise [RFC 1929](https://www.rfc-editor.org/rfc/rfc1929)’da tanımlıdır.

## SOCKS5 daha mı hızlı, daha mı güvenli?

İkisi de değildir. Hız, ağ yoluna ve proxy sunucusuna bağlıdır; protokol seçimi bunu belirlemez ve biz hız ya da gecikme vaat etmiyoruz. Güvenlik ise bağlantının şifrelenmesinden gelir: HTTPS kullanan bir site, ister HTTP ister SOCKS5 proxy üzerinden olsun, içeriğini şifreli taşır.

## AnboVPN HTTP/SOCKS5 proxy’de neler var?

AnboVPN, her tarayıcı profiline ya da betiğe ayrı bir proxy hesabı verir; HTTP (HTTPS tünelleri dahil) ve SOCKS5 tek bir kullanıcı adı ve parolayla çalışır. Bilgiler Kasım 2026’da resmî AnboVPN web sitesinden kontrol edilmiştir.

- Ana makine, port, kullanıcı adı ve parola hesabınızda gösterilir. Tek satırlık `host:port:username:password` biçimi, tarayıcı profili araçlarına yapıştırmak için hazırdır; çok sayıda proxy’yi tek tıkla kopyalayabilirsiniz.
- İsteğe bağlı kaynak IP izin listesiyle onaylı adresler parolasız bağlanır.
- Proxy, Özel IP ile aynı veriyi ve aynı IP kaynağını kullanır.
- SOCKS5 UDP desteklenmez; 25. port ve iç ağ erişimi sunulmaz.
- Proxy, düğüm bazında açılır. Bir IP için proxy kartı görünmüyorsa o düğüm henüz açılmamıştır; IP yine de istemci ya da abonelik bağlantısıyla kullanılabilir.

Satıştaki seçenekler için [HTTP/SOCKS5 proxy sayfasına](https://www.anbovpn.com/tr/proxy-ip) bakın.

## Proxy çalışıyor mu? curl ile iki dakikada test

Proxy üzerinden adresinizi gösteren bir servise tek istek atın ve dönen adresin proxy’ye ait olduğunu doğrulayın. Büyük harfli yerlere kendi bilgilerinizi yazın:

```bash
# SOCKS5 (socks5h: alan adını proxy çözer)
curl -x socks5h://KULLANICI:PAROLA@ANA_MAKINE:PORT https://www.anbovpn.com/ip

# HTTP
curl -x http://KULLANICI:PAROLA@ANA_MAKINE:PORT https://www.anbovpn.com/ip
```

Dönen yanıt, sitenin gördüğü adresi ve konumu gösterir. Çalışmıyorsa şu üç şeyi kontrol edin:

- **Port karışıklığı:** Hesabınızda gösterilen portu olduğu gibi kullanın. HTTP ve SOCKS5 için ayrı port yazıyorsa her protokole kendi portunu verin.
- **Özel karakterler:** Parolada `@`, `:` ya da `/` varsa curl adresinde yüzde kodlamasıyla (`@` yerine `%40` gibi) yazın.
- **Protokol değişimi:** Bir protokol bağlanmıyorsa aynı bilgilerle diğerini deneyin.

Birden fazla proxy’yi tek seferde denemek istiyorsanız ücretsiz [HTTP proxy testi](https://www.anbovpn.com/tr/tools/http-proxy-test) ve [SOCKS5 proxy testi](https://www.anbovpn.com/tr/tools/socks5-proxy-test) araçlarını kullanabilirsiniz.

Proxy’nin arkasındaki adres türlerini merak ediyorsanız [Özel IP mi Paylaşımlı IP mi?](/tr/posts/dedicated-ip-vs-shared-ip/) yazımıza göz atın. Evdeki akıllı TV gibi uygulama kurulamayan cihazlar için ise [ağ geçidi rehberi](/tr/posts/network-gateway-explained/) daha uygun bir yoldur.
