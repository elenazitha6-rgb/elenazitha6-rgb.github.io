---
title: "Ağ Geçidi Nedir? Uygulama Kurmadan Cihazları Kapsayın"
description: "Ağ geçidi (yan yönlendirici), ona yönlendirilen her cihazı tek bağlantıdan geçirir; TV ve konsollara uygulama gerekmez. İşleyişini ve sınırlarını öğrenin."
pubDate: 2026-11-06T12:00:00+08:00
category: gateway
tags: ["ağ geçidi", "yan yönlendirici", "şeffaf proxy", "Linux", "ev ağı"]
faq:
  - q: "AnboVPN ağ geçidinin arkasındaki her cihaza uygulama kurmam gerekir mi?"
    a: "Hayır. Ağ geçidinin arkasındaki cihazlarda istemci gerekmez. Ancak onu kullanacak şekilde ayarlanmaları gerekir: ağ geçidi ve DNS ayarlarını, onu çalıştıran makineye yönlendirirsiniz."
  - q: "Ağ geçidini yönlendiricime kurabilir miyim?"
    a: "Yönlendirici yazılımı (firmware) veya yönlendirici uygulaması yoktur. Ağ geçidi; sunucu, yazılım yönlendirici ya da boşta duran bir bilgisayar gibi Debian veya Ubuntu Linux (amd64 ya da arm64) makineye, root olarak çalıştırılan tek satırlık bir komutla kurulur."
  - q: "Bir ağ geçidinde bölge değiştirebilir miyim?"
    a: "Hayır. Ağ geçidi tek bir bölge kullanır, o da satın aldığınız bölgedir. Farklı bir bölgeye ihtiyacınız varsa o bölge için bir pakete ihtiyacınız vardır."
  - q: "Ağ geçidi ile şeffaf proxy aynı şey mi?"
    a: "Aynı fikri iki açıdan anlatırlar. Şeffaf proxy, her cihaza ayrı proxy ayarı yapılmadan trafiği işler; ağ geçidi ise bunu mümkün kılan ağ rolüdür."
---

## Ağ geçidi (yan yönlendirici) nedir?

**Ağ geçidi**, yerel ağınızdaki diğer cihazların internete ulaşmak için kullandığı bir makinedir. Bu trafiği aynı zamanda bir VPN veya proxy bağlantısından geçirdiğinde **yan yönlendirici** (side router) olarak çalışır; buna şeffaf proxy da denir: arkasındaki cihazlarda VPN uygulaması gerekmez, çünkü işi önlerindeki makine yapar.

## Ağ geçidi, VPN uygulaması kurmaktan nasıl farklıdır?

Bir VPN uygulaması yalnızca üzerinde çalıştığı cihazı kapsar. Ağ geçidi ise işletim sistemi ne olursa olsun, onu kullanacak şekilde ayarlanmış her cihazı kapsar. Karşılığında bir makineyi daha ayakta tutmanız gerekir.

| | Her cihazda VPN uygulaması | Ağ geçidi |
|---|---|---|
| Kurulum | Her cihaza kurun ve giriş yapın | Bir kez kurun, sonra her cihazı ona yönlendirin |
| Çalışan cihazlar | Desteklenen bir işletim sistemi olanlar | Ağ geçidi ve DNS ayarlamanıza izin veren her cihaz |
| Cihaz bazında kontrol | Her cihazda uygulama bazlı yönlendirme | Onu kullanan cihazların tüm trafiği |
| Bakımını yaptığınız makine | Yok | Açık kalması gereken bir Linux makine |
| Durursa | Yalnızca o cihaz etkilenir | Ona yönlendirilen cihazlar, siz ayarlarını geri alana kadar yolunu kaybeder |

Tek bir bilgisayarda hangi uygulamaların bağlantıyı kullanacağını seçmek istiyorsanız bunu AnboVPN istemcisinin uygulama bazlı yönlendirmesi ve TUN modu yapar. Ağ geçidi, istemci çalıştıramayan cihazlar içindir.

## AnboVPN ağ geçidini kurmak için neye ihtiyacınız var?

Bir ağ geçidi paketine ve sürekli açık kalan bir Debian veya Ubuntu Linux makinesine (amd64 ya da arm64) ihtiyacınız var; küçük bir sunucu, yazılım yönlendirici veya boşta duran bir bilgisayar olabilir. AnboVPN ağ geçidi, root olarak çalıştırılan tek satırlık bir komutla kurulur. Yönlendirici yazılımı veya yönlendirici uygulaması yoktur. Bu ayrıntılar Kasım 2026’da AnboVPN web sitesine göre kontrol edilmiştir.

1. **Bir paket ve bölge seçin.** Ağ geçidi tek bir bölge kullanır, yani satın aldığınız bölgeyi; bu yüzden dikkatle seçin. Satıştakiler için [ağ geçidi sayfasına](https://www.anbovpn.com/tr/gateway) bakın.
2. **Makineyi hazırlayın.** Yerel ağınızda sabit bir adresi olan bir Debian veya Ubuntu sistemi.
3. **Kurulum komutunu çalıştırın.** Hesabınızda paketiniz için gösterilen tek satırlık komutu kopyalayın ve o makinede root olarak çalıştırın.
4. **Bir cihazı ona yönlendirin.** Cihazda veya yönlendiricinizin DHCP ayarlarında, ağ geçidini ve DNS’i makinenin yerel adresine ayarlayın.
5. **Doğrulayın.** Cihazın genel adresini `curl https://www.anbovpn.com/ip` ile veya ücretsiz [IP sorgulama aracıyla](https://www.anbovpn.com/tr/tools/ip-lookup) kontrol edin.

## Hangi cihazlar ağ geçidinden en çok yararlanır?

VPN istemcisi çalıştıramayan ama ağ ayarlarını değiştirmenize izin veren cihazlar en çok yararlanır. Buna akıllı TV’ler, oyun konsolları ve bazı medya oynatıcılar dahildir. Aynı yerel ağda ağ geçidine yönlendirdiğiniz her şey aynı bağlantıyı alır; yani tek bir kurulum birden fazla kişiye ve cihaza hizmet edebilir.

## Ağ geçidinin sınırları nelerdir?

Ağ geçidi basittir ama ödünsüz değildir. Karar vermeden önce şunları bilin:

- **Tek bölge.** Ağ geçidine yönlendirilen her cihaz aynı bölgeyi kullanır. Cihaz bazında bölge değiştiremezsiniz.
- **Her zaman açık.** Makine açık ve bağlı kalmalıdır. Kapalıyken ona yönlendirilen cihazların yolu olmaz.
- **Ya hep ya hiç yönlendirme.** Ağ geçidini kullanan bir cihazın tüm trafiği ondan geçer. Tek bir bilgisayarda uygulama bazlı seçim için bunun yerine istemciyi kullanın.
- **Bakımı size aittir.** Güncellemeler ve yerel ağ ayarları sizin sorumluluğunuzdadır.
- **Hız vaadi yok.** Bağlantı; ağınıza, makineye ve bölgeye bağlıdır ve AnboVPN hız, gecikme veya kesintisiz çalışma vaat etmez.

İlgili okumalar: [Özel IP ve paylaşımlı IP](/tr/posts/dedicated-ip-vs-shared-ip/) yazısı sabit bir adresin ne zaman önemli olduğunu açıklar; [HTTP ve SOCKS5 proxy](/tr/posts/http-vs-socks5-proxy/) ise tek bir araç için sabit bir adresi kullanmanın daha hafif bir yolunu ele alır.
