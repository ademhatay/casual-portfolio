---
title: "WireGuard Nedir? Nasıl Kurulur?"
description: "Wireguard hızlı, modern ve güvenli bir VPN protokolüdür. Bu rehberde, WireGuard'ın ne olduğunu, nasıl çalıştığını ve kimlerin işine yarayacağını detaylı bir şekilde ele alacağız."
date: "2024-08-09"
tags: ["wireguard", "vpn", "self-host", "güvenli vpn"]
---

<img src="https://fineproxy.org/wp-content/uploads/2023/09/WireGuard-logo.png" width="300" />

## WireGuard Nedir? Ne İşe Yarar? Ne Amaçla Kuruldu?

**WireGuard**, hızlı, modern ve güvenli bir VPN (Virtual Private Network) protokolüdür. Bu protokol, cihazlar arasındaki iletişimi şifreleyerek güvenli bir ağ tüneli oluşturur. WireGuard, basitliği ve performansıyla dikkat çeker. Diğer VPN protokollerine göre daha az kod içermesi, onu daha güvenli ve verimli kılar. WireGuard, başlangıçta Linux çekirdeği için geliştirilmiştir, ancak günümüzde neredeyse tüm büyük işletim sistemleri için destek sunmaktadır.

WireGuard'ın temel amacı, geleneksel VPN protokollerine (OpenVPN, IPSec vb.) kıyasla daha yüksek güvenlik, daha az gecikme ve daha iyi performans sunmaktır. Ayrıca, karmaşık yapılandırmalara gerek kalmadan kolayca kullanılabilen bir çözüm sunmayı hedefler.

## WireGuard Nasıl Çalışır?

WireGuard, VPN tünelleri oluşturmak için "kapsamlı ağ kodu" yerine modern kriptografik protokolleri kullanır. Bu, protokolün daha hızlı, daha güvenli ve daha esnek olmasını sağlar. Her bir WireGuard bağlantısı, "public key" (genel anahtar) ve "private key" (özel anahtar) çifti kullanılarak kimlik doğrulama ve şifreleme gerçekleştirir. Ayrıca, WireGuard bağlantıları, UDP protokolü üzerinden yapılır, bu da onu hızlı ve verimli kılar.

## Kimlerin İşine Yarar?

WireGuard, aşağıdaki amaçlar için idealdir:

- **Bireyler ve küçük işletmeler:** Evde veya küçük ofis ortamlarında güvenli bir şekilde internete bağlanmak isteyen kullanıcılar için uygundur.

- **Büyük ölçekli şirketler:** Şirket içi ağlar arasında güvenli bağlantılar oluşturmak için kullanılabilir.

- **Geliştiriciler ve ağ yöneticileri:** Kolay kurulumu ve yapılandırması nedeniyle, test ve geliştirme ortamları için mükemmeldir.

## WireGuard Nasıl Kurulur?

WireGuard'ı iki farklı yöntemle kurabilirsiniz: self-hosted (kendi sunucunuzda) veya Docker kullanarak. İki yöntem de oldukça basit ve etkili.

#### Self-Hosted Kurulum

1. **Sunucuyu Hazırlayın:**

   - Sunucunuzun işletim sistemini güncelleyin:

     ```bash
     sudo apt update && sudo apt upgrade -y
     ```

   - WireGuard'ı kurmak için gerekli olan paketleri yükleyin:

     ```bash
     sudo apt install wireguard -y
     ```

2. **Anahtar Çifti Oluşturun:**

   - Private ve public key çiftini oluşturun:

     ```bash
     wg genkey | tee privatekey | wg pubkey > publickey
     ```

3. **Konfigürasyon Dosyasını Ayarlayın:**

   - `/etc/wireguard/wg0.conf` dosyasını oluşturun ve aşağıdaki gibi yapılandırın:

     ```bash
     [Interface]
     PrivateKey = <Sunucunun Private Key i>
     Address = 10.0.0.1/24
     ListenPort = 51820
     SaveConfig = true
     ```

4. **WireGuard'ı Başlatın:**

   ```bash
   sudo systemctl start wg-quick@wg0
   sudo systemctl enable wg-quick@wg0
   ```

#### Docker ile WireGuard Kurulumu (wg-easy)

**wg-easy**, WireGuard'ı Docker ile kurmayı ve yönetmeyi oldukça kolaylaştıran bir çözüm sunar. Bu yazılım, web tabanlı bir arayüz üzerinden VPN'inizi yönetmenizi sağlar.

##### Adım 1: Docker'ı Kurun

Docker'ın yüklü olup olmadığını kontrol edin ve gerekirse yükleyin:

```bash
curl -sSL https://get.docker.com | sh
sudo usermod -aG docker $(whoami)
exit
```

Komutlardan sonra tekrar oturum açarak Docker'ın düzgün çalıştığını doğrulayın.

##### Adım 2: WireGuard Easy'i Çalıştırın

WireGuard Easy'i Docker üzerinde çalıştırmak için aşağıdaki komutu kullanın:

```bash
docker run -d \
  --name=wg-easy \
  -e LANG=tr \
  -e WG_HOST=<Sunucunuzun_IP_Adresi> \
  -e PASSWORD_HASH=<Şifrenizin_Bcrypt_Hash'i> \
  -e PORT=51821 \
  -e WG_PORT=51820 \
  -v ~/.wg-easy:/etc/wireguard \
  -p 51820:51820/udp \
  -p 51821:51821/tcp \
  --cap-add=NET_ADMIN \
  --cap-add=SYS_MODULE \
  --sysctl="net.ipv4.conf.all.src_valid_mark=1" \
  --sysctl="net.ipv4.ip_forward=1" \
  --restart unless-stopped \
  ghcr.io/wg-easy/wg-easy
```

Bu komut, WireGuard'ı Docker üzerinde çalıştırır ve web arayüzü üzerinden yönetim sağlar. Web arayüzü, sunucunuzun IP adresi veya alan adı üzerinden erişilebilir olacaktır (örneğin: `http://0.0.0.0:51821`).

##### Adım 3: wg-easy Kullanarak İstemciyi Kurun

Web arayüzünden yeni bir istemci oluşturun. Oluşturulan istemci için QR kodunu kullanarak mobil cihazdan bağlanabilirsiniz. Mobil cihazınızda WireGuard uygulamasını açın, "Add Tunnel" seçeneği ile QR kodunu taratın.

##### Adım 4: Docker'ı Nginx ile Custom Domain'e Bağlamak

WireGuard arayüzünü bir custom domain altında çalıştırmak için Nginx'i proxy olarak kullanabilirsiniz.

1. **Nginx'i Kurun:**

   ```bash
   sudo apt install nginx -y
   ```

2. **Nginx Konfigürasyon Dosyasını Ayarlayın:**

   - `/etc/nginx/sites-available/wireguard` dosyasını oluşturun ve aşağıdaki gibi yapılandırın:

     ```bash
     server {
         listen 80;
         server_name vpn.example.com;

         location / {
             proxy_pass http://localhost:51821;
             proxy_set_header Host $host;
             proxy_set_header X-Real-IP $remote_addr;
             proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
             proxy_set_header X-Forwarded-Proto $scheme;
         }
     }
     ```

3. **Domain Adınızı Etkinleştirin:**

   ```bash
   sudo ln -s /etc/nginx/sites-available/wireguard /etc/nginx/sites-enabled/
   sudo systemctl restart nginx
   ```

4. **DNS Ayarlarınızı Yapın:**

   - Domain adınızın DNS ayarlarında, A kaydı ekleyerek sunucunuzun IP adresini ekleyin.

Artık VPN sunucunuza `vpn.sizin-domaininiz.com` üzerinden erişebilirsiniz.

## Sonuç

Bu rehberde, WireGuard'ın ne olduğunu, nasıl çalıştığını ve kimlerin işine yarayacağını detaylı bir şekilde ele aldık. Ayrıca, hem self-hosted hem de Docker ile nasıl kurulacağını gösterdik. Özellikle Docker tabanlı **wg-easy** aracı sayesinde, WireGuard VPN sunucusunu kurmak ve yönetmek oldukça basit hale gelmektedir. Nginx ile custom domain üzerinden erişim sağlayarak, daha profesyonel bir yapı kurabilirsiniz. Bu adımları izleyerek kendi güvenli VPN altyapınızı kurabilir ve yönetebilirsiniz.
