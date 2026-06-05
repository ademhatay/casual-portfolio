---
title: "Self-Host Rehberi: VPS/VDS Üzerinde Docker, Nginx ve Open Source Projelerle Kendi Sunucunu Kur"
date: "2026-02-05T10:00:00Z"
meta: "Bu kapsamlı rehberde VPS/VDS sunucu kiralamaktan Docker ile open source projeler deploy etmeye, domain bağlamaktan Nginx ile yayına almaya kadar modern self-host dünyasını adım adım inceliyoruz."
summary: "Kendi sunucunu kirala, kontrolü eline al ve servislerini self-host et. Docker, Nginx, domain yönetimi ve güvenlik ipuçlarıyla dolu güncel bir rehber."
image: "https://www.docker.com/wp-content/uploads/2022/03/Moby-logo.png"
tags: ["self-host", "docker", "nginx", "vps", "vds", "opensource", "devops"]
---

# Self-Host Rehberi: VPS/VDS Üzerinde Docker, Nginx ve Open Source Projelerle Kendi Sunucunu Kur

![](https://img.shields.io/badge/self--hosted-%E2%9C%94-brightgreen)

![](https://img.shields.io/badge/docker-ready-blue)

> Bu yazı, bulut bağımlılığından kurtulmak ve dijital egemenliğini eline almak isteyenler için hazırlandı.

![](https://www.docker.com/wp-content/uploads/2022/03/Moby-logo.png)

## Self-Host Nedir ve Neden 2025’te Hâlâ Çok Güçlü?

**Self-host**, kullandığın servisleri (blog, git, cloud, mail, analytics, monitoring vb.) başkalarının SaaS platformlarında değil, **kendi kontrolündeki bir sunucuda** çalıştırmak demektir.

2025 itibarıyla self-host hâlâ çok güçlü çünkü:

- 🔐 Veri senin, kontrol senin
- 💸 SaaS aboneliklerinden kurtulursun
- ⚙️ İstediğin gibi özelleştirirsin
- 🌍 Vendor lock‑in yok
- 🧠 Gerçek sistem bilgisi kazanırsın

## VPS mi, VDS mi? Ne Kiralamalıyım?

Kısaca:

| Tür | Açıklama | Kime Uygun |
| --- | --- | --- |
| **VPS** | Paylaşımlı fiziksel sunucu | Blog, küçük projeler |
| **VDS** | Dedicated kaynaklar | Yoğun trafik, production |

Başlangıç için öneri:

- 2 vCPU
- 4 GB RAM
- 40–80 GB SSD
- Ubuntu 22.04 / 24.04 LTS

## Sunucu İlk Kurulum (Hardening)

```
ssh root@SUNUCU_IP
```

```
adduser deploy
usermod -aG sudo deploy
```

```
nano /etc/ssh/sshd_config
PermitRootLogin no
PasswordAuthentication no
```

```
ufw allow OpenSSH
ufw allow 80
ufw allow 443
ufw enable
```

## Docker Kurulumu

```
curl -fsSL https://get.docker.com | sh
usermod -aG docker deploy
```

```
sudo apt install docker-compose-plugin
```

```
docker compose version
```

## Open Source Projeleri Docker ile Deploy Etmek

Örnek: **Gitea**

```
version: "3"

services:
  gitea:
    image: gitea/gitea:latest
    container_name: gitea
    ports:
      - "3000:3000"
      - "222:22"
    volumes:
      - ./data:/data
    restart: unless-stopped
```

```
docker compose up -d
```

Artık servis ayağa kalktı.

## Domain Bağlamak

1. Domain aldığın yerden **A Record** ekle
2. IP → sunucu IP’si
3. TTL: Auto

```
gitea.example.com → 123.123.123.123
```

## Nginx ile Reverse Proxy

```
apt install nginx
```

```
server {
    server_name gitea.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```
ln -s /etc/nginx/sites-available/gitea /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

## HTTPS (Let’s Encrypt)

```
apt install certbot python3-certbot-nginx
certbot --nginx
```

🎉 Artık HTTPS aktif.

## En Çok Self-Host Edilen Servisler

- 📝 Ghost / WordPress
- ☁️ Nextcloud
- 🧠 Gitea / Forgejo
- 📊 Umami Analytics
- 🗂️ Vaultwarden
- 📡 Uptime Kuma

## Faydalı İpuçları

- 📦 Her servis için ayrı docker‑compose
- 🔁 Otomatik yedekleme (restic + cron)
- 📈 Monitoring (Netdata, Prometheus)
- 🔒 Fail2ban mutlaka kur
- 🧹 Log rotation yap

## Gerçek Hayat Kullanım Senaryosu

> Tek bir VDS üzerinde:

- 5 site
- 1 Git servisi
- Analytics
- Status page

Hepsi:

- Docker ile
- Nginx arkasında
- HTTPS aktif
- Aylık maliyet: **tek bir VPS ücreti**

## Sonuç

Self-host:

- Öğreticidir
- Özgürleştiricidir
- Uzun vadede ekonomiktir

Kendi altyapını kurmak zor değil. Zor olan **ilk adımı atmamak**.

Kontrolü geri al. 🚀
