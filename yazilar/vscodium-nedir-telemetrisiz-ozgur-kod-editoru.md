---
title: "VSCodium Nedir? Telemetrisiz, Özgür ve Güçlü Bir Kod Editörü"
date: "2026-02-07T22:53:04Z"
meta: "VSCodium, Visual Studio Code'un telemetrisiz, özgür ve güçlü bir alternatifi olarak neden tercih edildiğini ve nasıl kurulacağını anlatan kapsamlı rehber."
summary: "VSCodium'un telemetri içermeyen yapısını, kullanım senaryolarını ve kurulum adımlarını adım adım inceleyen yazı."
image: "https://vscodium.com/img/codium_cnl.svg"
tags: ["vscodium", "editor", "opensource", "privacy", "development"]
---

# VSCodium Nedir? Telemetrisiz, Özgür ve Güçlü Bir Kod Editörü

> Bu blog yazısı, özgür yazılım felsefesini benimseyen geliştiriciler için hazırlanmıştır.

![VSCodium Logo](https://vscodium.com/img/codium_cnl.svg)

Günümüzde yazılım geliştirme dünyası hızla **AI destekli “vibe coding”** anlayışına kayıyor. Ancak herkes kod yazarken arka planda çalışan modelleri, telemetriyi ve kapalı lisansları kabullenmek zorunda değil. Eğer **“ben kodumun kontrolünü elinde tutmak istiyorum”** diyorsan, **VSCodium** tam sana göre.

## VSCodium Nedir?

**VSCodium**, Microsoft’un Visual Studio Code editörünün **topluluk tarafından derlenen**, **telemetri içermeyen** ve **MIT lisanslı** binary dağıtımıdır.

Kısa tanım:

- Visual Studio Code deneyimi ✅
- Microsoft’a ait telemetri ❌
- Tamamen özgür ve açık kaynak ✅

## Neden Böyle Bir Proje Var?

VS Code’un kaynak kodu MIT lisansı ile açık olsa da, Microsoft’un sunduğu hazır binary:

- Telemetri içerir
- Microsoft servislerine varsayılan olarak bağlıdır
- FLOSS uyumlu değildir

Microsoft’un bir geliştirici yorumu durumu net özetliyor:

> Microsoft olarak VS Code’u derlerken product.json dosyasını özelleştiriyor,

> telemetri ve Microsoft’a özel servisleri ekleyerek kendi lisansımızla yayımlıyoruz.

İşte **VSCodium**, tam bu noktada devreye giriyor.

- Aynı kaynak kod
- Aynı özellikler
- Ama **temiz**, **takipsiz** ve **özgür**

## Kimler İçin İdeal?

- 🔐 Gizliliğe önem veren geliştiriciler
- 🐧 Linux kullanıcıları
- 🧠 AI bağımlılığı olmadan üretmek isteyenler
- 📜 Lisans ve etik konularına hassas olanlar

## Ekran Görüntüsü

![VSCodium Screenshot](https://vscodium.com/img/vscodium.png)

## Nasıl İndirilir?

VSCodium; Windows, macOS ve Linux için hazır binary olarak sunulur.

### macOS (Homebrew)

```
brew install --cask vscodium
```

### Windows

```
winget install vscodium
```

```
choco install vscodium
```

```
scoop bucket add extras
scoop install vscodium
```

### Linux

```
snap install codium --classic
```

```
sudo apt update && sudo apt install codium
```

```
yay -S vscodium-bin
```

```
sudo dnf install codium
```

```
flatpak install flathub com.vscodium.codium
```

## Lisans ve Topluluk

- 📄 Lisans: **MIT**
- 🤝 Topluluk odaklı
- 💬 Gitter üzerinden aktif destek
- 🚫 Telemetri yok

## Sonuç

Eğer:

- Kod editörünün sana hizmet etmesini,
- Seni izlemesini değil,
- AI olmadan da güçlü bir geliştirme deneyimi sunmasını

istiyorsan, **VSCodium** net bir şekilde doğru tercih.

Özgür yazılım ruhu burada yaşıyor. 🐧✨
