---
title: "Ağ Geçidi Nedir ve Nasıl Kurulur? Akıllı TV Örneği"
description: "Ağ geçidi (yan yönlendirici), kendisine yönlendirilen tüm cihazları tek bağlantıdan geçirir; TV ve konsola uygulama gerekmez. Kurulumu ve sınırları öğrenin."
pubDate: 2026-11-06T12:00:00+08:00
category: gateway
term: "Ağ geçidi"
tags: ["ağ geçidi", "yan yönlendirici", "şeffaf proxy", "akıllı TV VPN", "Linux", "ev ağı"]
faq:
  - q: "Akıllı TV ve oyun konsoluna VPN uygulaması kurmadan nasıl bağlanırım?"
    a: "Ağ geçidiyle. Ağ geçidini Linux bir makineye kurar, TV’nin ya da konsolun ağ geçidi ve DNS ayarını bu makinenin yerel adresine çevirirsiniz. Cihazlarda istemci gerekmez, ama bu ayarın yapılması gerekir."
  - q: "AnboVPN ağ geçidi yönlendiricimin içine kurulur mu?"
    a: "Hayır, yönlendirici yazılımı (firmware) ya da yönlendirici uygulaması yoktur. Ağ geçidi, Debian veya Ubuntu Linux (amd64 ya da arm64) çalışan bir sunucuya, yazılım yönlendiriciye ya da boşta duran bir bilgisayara tek satırlık komutla kurulur."
  - q: "Ağ geçidiyle farklı bölgelere geçebilir miyim?"
    a: "Hayır. Bir ağ geçidi yalnızca satın aldığınız tek bölgeyi kullanır. Başka bir bölge istiyorsanız o bölge için ayrı bir paket gerekir."
  - q: "Ağ geçidi ile şeffaf proxy aynı şey midir?"
    a: "Aynı fikrin iki adıdır. Şeffaf proxy, her cihaza proxy ayarı yapmadan trafiği yönlendirmeyi anlatır; ağ geçidi bunu mümkün kılan ağ rolüdür."
  - q: "Ağ geçidi makinesi kapanırsa ne olur?"
    a: "Ona yönlendirilmiş cihazlar bağlantı yolunu kaybeder. Makine yeniden açılana kadar bu cihazların ayarlarını eski haline döndürmeniz gerekir."
---

## Ağ geçidi (yan yönlendirici) nedir?

**Ağ geçidi**, yerel ağınızdaki cihazların internete çıkmak için kullandığı bir makinedir; trafiği aynı zamanda bir VPN ya da proxy bağlantısından geçirdiğinde **yan yönlendirici** (side router) olarak çalışır ve buna şeffaf proxy da denir. Arkasındaki cihazlara VPN uygulaması kurmanız gerekmez, çünkü işi onların önündeki makine yapar.

Sorunu somutlaştıralım: salondaki akıllı TV’ye, çocuk odasındaki oyun konsoluna ya da ofisteki NAS’a VPN uygulaması kuramazsınız; çoğunda bu seçenek yoktur. Ama hepsinin ağ ayarını değiştirebilirsiniz. Ağ geçidi işte bu boşluğu doldurur.

## Akıllı TV ve oyun konsolunda neden uygulama yerine ağ geçidi?

Çünkü bu cihazların çoğuna VPN istemcisi kurulamaz, ama ağ ayarları değiştirilebilir. Ağ geçidi, ayarı değiştirilen her cihazı işletim sistemi ne olursa olsun aynı bağlantıdan geçirir; karşılığında ayakta tutmanız gereken bir makine çıkar.

- **Uygulama yeterliyse:** Tek bilgisayarınızda bazı programları seçip geçirmek istiyorsanız AnboVPN istemcisinin uygulama bazlı akıllı yönlendirmesi ve TUN modu daha pratiktir.
- **Ağ geçidi mantıklıysa:** Evde ya da ofiste istemci kurulamayan birkaç cihaz varsa, ya da aynı çıkışı birden fazla kişiyle paylaşıyorsanız.
- **Bedeli:** Bir Linux makinenin sürekli açık kalması ve bakımının size ait olması.

Gündelik örnekler şunlardır:

- **Ev ağı ve akıllı TV:** Salondaki TV, konsol ve medya oynatıcı aynı bölgeden çıkar; her birini ayrı ayrı uğraşmadan tek makineye yönlendirirsiniz.
- **Ofis ve ev ofis:** NAS, yazıcı ya da ortak kullanılan bilgisayarlar gibi istemci kurulması zor cihazlar aynı çıkışı paylaşır.
- **Test ve geliştirme:** Bir test bilgisayarını ya da sanal makineyi ağ geçidine yöneltip uygulamanızı o bölgeden denersiniz.
- **Uzaktan çalışma:** Evdeki iş bilgisayarınız her seferinde aynı bölgeden görünür; kabul edip etmemek karşı sistemin politikasına bağlıdır.

> **Özetle:** İstemci kurabiliyorsanız istemciyi, kuramıyorsanız ağ geçidini seçin. Tek bir araç ya da tarayıcı profili için [HTTP/SOCKS5 proxy](/tr/posts/http-vs-socks5-proxy/) daha hafif bir çözümdür.

## AnboVPN ağ geçidi adım adım nasıl kurulur?

Debian veya Ubuntu Linux çalışan (amd64 ya da arm64) sürekli açık bir makineye, hesabınızdaki tek satırlık komutu root olarak çalıştırarak kurarsınız. Yönlendirici yazılımı ya da yönlendirici uygulaması yoktur. Bu bilgiler Kasım 2026’da resmî AnboVPN web sitesinden kontrol edilmiştir.

1. **Paket ve bölge seçin.** Ağ geçidi yalnızca satın aldığınız bölgeyi kullanır, bu yüzden bölgeyi dikkatle seçin. Satıştakiler [ağ geçidi sayfasında](https://www.anbovpn.com/tr/gateway) listelenir.
2. **Makineyi hazırlayın.** Sunucu, yazılım yönlendirici ya da boşta duran bir bilgisayar olabilir. Yerel ağda sabit bir adres vermeniz iyi olur.
3. **Komutu çalıştırın.** Paket ayrıntıları sayfasındaki size özel tek satırlık komutu kopyalayın ve makinede root olarak çalıştırın.
4. **Cihazı ona yönlendirin.** TV’nin ya da konsolun ağ ayarında “ağ geçidi” (gateway) ve DNS alanlarına makinenin yerel adresini yazın. Yönlendiricinizin DHCP ayarlarından bu iki alanı değiştirebiliyorsanız ağdaki tüm cihazlar için toplu yapabilirsiniz; yalnız ağ geçidi makinesinin kendisini bunun dışında tutun.
5. **Doğrulayın.** TV’de terminal yoktur; aynı ayarı bir dizüstü bilgisayarda deneyip `curl https://www.anbovpn.com/ip` çalıştırın ya da ücretsiz [IP sorgulama aracını](https://www.anbovpn.com/tr/tools/ip-lookup) açın.

> **İpucu:** Cihaz ayarındaki “Ağ geçidi / Gateway” alanı, cihazın trafiği gönderdiği kapıdır. Oraya AnboVPN’i kurduğunuz makinenin yerel IP adresini yazdığınızda, cihazın çıkış kapısı bu makine olur.

## Kurmadan önce bilmeniz gereken sınırlar

Ağ geçidinin dört temel sınırı vardır: tek bölge, sürekli açık makine, “hep ya da hiç” yönlendirme ve bakımın size ait olması. Hız, gecikme ya da kesintisiz çalışma da vaat etmiyoruz.

- **Tek bölge.** Ona yönlendirilen her cihaz aynı bölgeden çıkar; cihaz başına bölge seçemezsiniz.
- **Makine açık kalmalı.** Kapandığında ona yönlendirilmiş cihazların yolu kesilir.
- **Tüm trafik geçer.** Yönlendirilen cihazın bütün trafiği ağ geçidinden geçer. Uygulama bazında seçim için istemciyi kullanın.
- **Bakım size ait.** Güncellemeler ve yerel ağ ayarları sizin sorumluluğunuzdadır.
- **Hız garantisi yok.** Bağlantının kalitesi ağınıza, makineye ve bölgeye bağlıdır.

> **Dikkat:** Cihazların ağ geçidi ayarı elle değiştirilir. Makine kapalıyken TV’nin internete çıkamadığını görürseniz bunun nedeni ayardır; ayarı eski haline getirmeniz yeterli.

## Ağ geçidi, istemci ve proxy arasında nasıl karar verirsiniz?

Cihazın kendisine uygulama kurabiliyorsanız istemci, tek bir araca sabit adres vermek istiyorsanız proxy, kurulamayan cihazları topluca kapsamak istiyorsanız ağ geçidi seçilir. Sabit adresin ne zaman değerli olduğunu [Özel IP mi Paylaşımlı IP mi?](/tr/posts/dedicated-ip-vs-shared-ip/) yazımızda anlattık.

| Durum | Uygun seçenek |
|---|---|
| Tek bilgisayarda bazı uygulamalar | İstemci (uygulama bazlı yönlendirme, TUN modu) |
| Tarayıcı profili veya betik başına ayrı adres | HTTP/SOCKS5 proxy |
| Akıllı TV, konsol, istemci kurulamayan cihazlar | Ağ geçidi |
| Evdeki ya da ofisteki birkaç cihaz | Ağ geçidi |
