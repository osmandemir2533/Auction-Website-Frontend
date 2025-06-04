# 🚀 Açık Artırma Web Sitesi

[![GitHub](https://img.shields.io/badge/GitHub-Backend-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/osmandemir2533/Auction-Website-Backend)
[![GitHub](https://img.shields.io/badge/GitHub-Frontend-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/osmandemir2533/Auction-Website-Frontend)

> **Önemli Not:** Bu proje, backend ve frontend olmak üzere iki ana bölümden oluşmaktadır. Projeyi çalıştırmak için öncelikle backend kurulumunu tamamlamanız gerekmektedir. Backend kurulumu tamamlandıktan sonra frontend kurulumuna geçebilirsiniz.
>
> Backend kurulumu için: [Backend Repo](https://github.com/osmandemir2533/Auction-Website-Backend)

Bu proje, modern web teknolojileri kullanılarak geliştirilmiş, gerçek zamanlı açık artırma işlemlerini destekleyen tam kapsamlı bir web uygulamasıdır. SignalR ile anlık güncellemeler, JWT ile güvenli kullanıcı yönetimi, Stripe ile ödeme altyapısı ve MSSQL veritabanı üzerinde Code-First mimarisi kullanılmıştır.

> **Not:** Bu proje, detaylı bir sunum dosyası (yaklaşık 80 sayfa) ve kapsamlı bir rapor tezi içermektedir. Projenin tüm detayları ve teknik dokümantasyonu bu belgelerde yer almaktadır.

## 📋 İçindekiler

- [Proje Hakkında](#-proje-hakkında)
- [Özellikler](#-özellikler)
- [Teknik Detaylar](#-teknik-detaylar)
- [Kurulum](#-kurulum)
- [Kullanıcı Arayüzü](#-kullanıcı-arayüzü)
- [Ödeme Sistemi](#-ödeme-sistemi)
- [Gerçek Zamanlı İletişim](#-gerçek-zamanlı-iletişim)
- [Yönetici Paneli](#-yönetici-paneli)
- [Test Bilgileri](#-test-bilgileri)

---

## 👥 Proje Ekibi

Bu kapsamlı proje, 8 kişilik bir ekip tarafından geliştirilmiştir:

### Backend Ekibi (3 Kişi)
- Katmanlı mimari tasarımı
- API geliştirme
- Veritabanı yönetimi
- SignalR entegrasyonu
- Stripe ödeme sistemi entegrasyonu

### Frontend Ekibi (3 Kişi)
- React.js ile modern UI geliştirme
- Gerçek zamanlı teklif sistemi
- Kullanıcı deneyimi optimizasyonu
- Responsive tasarım

### Test Ekibi (2 Kişi)
- API testleri
- Kullanıcı arayüzü testleri
- Performans testleri
- Güvenlik testleri

> **Not:** Projede hem backend hem de frontend geliştirme süreçlerinde aktif rol aldım. Backend tarafında API geliştirme ve veritabanı yönetimi, frontend tarafında ise kullanıcı arayüzü geliştirme , gerçek zamanlı teklif sistemi entegrasyonu , stripe ödeme sistemi entegresi ve dashboard sayfa tasarımları ve endpoint tanımlamaları görevlerinde çalıştım.


## 🔍 Proje Hakkında

Kullanıcılar, araç, elektronik, müzik aletleri, emlak ve giyim kategorilerinde ürünler ekleyebilir ve bu ürünlere açık artırma usulüyle teklif verebilir. SignalR sayesinde teklifler anlık olarak tüm kullanıcılarla senkronize edilir. Ödeme işlemleri Stripe üzerinden güvenli bir şekilde gerçekleştirilir.

### 🎯 Temel Özellikler

| Özellik                                | Açıklama                                                              |
| -------------------------------------- | --------------------------------------------------------------------- |
| 🧑‍💼 Kullanıcı Kayıt / Giriş Sistemi  | JWT ile kimlik doğrulama ve güvenli oturum yönetimi                   |
| ⚡ Gerçek Zamanlı Teklif Güncellemeleri | SignalR ile canlı teklif artışları ve anlık bildirimler               |
| 💳 Stripe ile Ödeme Entegrasyonu       | Kullanıcıların güvenli ödeme yapabilmesi için Stripe API entegrasyonu |
| 🧾 Ürün Listeleme ve Filtreleme        | Kategori bazlı arama ve ürün listeleme özellikleri                    |
| 📦 Code-First Entity Framework (MSSQL) | MSSQL ve EF Core ile modern veri modellemesi                          |
| 🧑‍💻 Yönetici Paneli (Admin Panel)    | Ürün ve kullanıcı yönetimi için özel yönetim ekranları                |

## 🛠️ Teknik Detaylar

### Frontend Teknolojileri

- **React.js + Vite**: Modern ve hızlı geliştirme ortamı
- **React Router**: Sayfa yönlendirme ve navigasyon
- **React Icons**: Zengin ikon kütüphanesi
- **React Context API**: Durum yönetimi
- **Axios**: HTTP istekleri
- **React Toastify**: Bildirim sistemi
- **Styled Components**: CSS-in-JS çözümü

### Backend Teknolojileri

- **ASP.NET Core 8**: API ve iş mantığı katmanı
- **SignalR**: Gerçek zamanlı iletişim
- **JWT**: Kimlik doğrulama
- **Entity Framework Core**: Veritabanı işlemleri
- **Stripe API**: Ödeme işlemleri
- **Swagger**: API dokümantasyonu

## 💻 Kullanıcı Arayüzü

### Ana Sayfa ve Kategoriler
![Ana Sayfa](https://i.imgur.com/jtp9skl.png)
![Kategoriler](https://i.imgur.com/x9ENO9J.png)

### Kullanıcı İşlemleri
![Login Sayfası](https://i.imgur.com/1t1wbDk.png)

### Ürün Detay Sayfaları
![Vehicle Sayfası 1](https://i.imgur.com/KmkJNAw.png)
![Vehicle Sayfası 2](https://i.imgur.com/mzt2hCq.png)

### Ödeme ve Teklif Süreci
![Ön Ödeme Hazırlık](https://i.imgur.com/27QmTKK.png)
![Stripe Ödeme](https://i.imgur.com/ywzP2q3.png)
![Teklifler](https://i.imgur.com/g6nD0VF.png)

### Yönetim Panelleri
![Admin Panel](https://i.imgur.com/V9LpXBi.png)
![Satıcı Panel](https://i.imgur.com/xslyRmY.png)

## 💳 Ödeme Sistemi

Proje, üç aşamalı bir ödeme ve teklif sürecine sahiptir:

1. **Ön Ödeme Hazırlık**
   - Kullanıcı bilgileri (isim, e-posta, telefon)
   - Form validasyonları
   - Ödeme öncesi onay

2. **Stripe Ödeme**
   - Güvenli ödeme altyapısı
   - Kredi kartı işlemleri
   - Ödeme onayı

3. **Teklif Verme**
   - Ödeme sonrası teklif butonu aktifleşir
   - Gerçek zamanlı teklif güncellemeleri
   - SignalR ile anlık bildirimler

## ⚡ Gerçek Zamanlı İletişim

SignalR kullanılarak gerçekleştirilen özellikler:

- Anlık teklif güncellemeleri
- Canlı fiyat değişimleri
- Kullanıcı bildirimleri
- Oturum yönetimi

## 🧑‍💻 Yönetici Paneli

### Admin Panel Özellikleri
- **Kullanıcı Yönetimi**
  - Kullanıcı listesi görüntüleme
  - Kullanıcı yetkilendirme
  - Kullanıcı bilgilerini düzenleme
  - Kullanıcı engelleme/aktifleştirme

- **Ürün Yönetimi**
  - Tüm ürünleri görüntüleme
  - Ürün onaylama/reddetme
  - Ürün düzenleme
  - Ürün silme

- **İstatistikler ve Raporlar**
  - Toplam satış istatistikleri
  - Kategori bazlı satış raporları
  - Kullanıcı aktivite raporları
  - Gelir raporları

- **Sistem Ayarları**
  - Site ayarları
  - Ödeme ayarları
  - Bildirim ayarları
  - Güvenlik ayarları

### Satıcı (Seller) Panel Özellikleri
- **Ürün Yönetimi**
  - Yeni ürün ekleme
  - Mevcut ürünleri düzenleme
  - Ürün silme
  - Ürün durumu takibi

- **Teklif Takibi**
  - Aktif teklifleri görüntüleme
  - Teklif geçmişi
  - Teklif istatistikleri
  - Kazanan teklifleri görüntüleme

- **Satış Raporları**
  - Satış geçmişi
  - Gelir raporları
  - Kategori bazlı satış analizi
  - Performans metrikleri

- **Profil Yönetimi**
  - Profil bilgilerini güncelleme
  - Şifre değiştirme
  - İletişim bilgilerini güncelleme
  - Bildirim tercihleri

## 🚀 Kurulum

### Backend Kurulumu

1. **Veritabanı Hazırlığı**
   ```bash
   # Veritabanı bağlantı ayarları
   ConnectionStrings: {
     "DefaultConnection": "Server=YOUR_SERVER;Database=MyGalaxyAuctionDB;Trusted_Connection=True;"
   }
   ```

2. **Migration İşlemleri**
   ```bash
   Add-Migration InitialCreate
   Update-Database
   ```

### Frontend Kurulumu

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

## 🧪 Test Bilgileri

### SignalR Testi
- İki farklı tarayıcı sekmesinde aynı ürün detay sayfasını açın
- Bir sekmeden teklif verin
- Diğer sekmede anlık güncellemeyi gözlemleyin

### Stripe Test Kartı
- Kart No: 4242 4242 4242 4242
- Son Kullanım: 12/25
- CVC: 123

## 📦 Klasör Yapısı

```
client-app/
├── public/                 # Statik dosyalar
├── src/
│   ├── Admin/             # Yönetici paneli
│   ├── assets/            # Görseller ve statik varlıklar
│   ├── components/        # UI bileşenleri
│   ├── context/           # React Context tanımları
│   ├── emptypage/         # Boş şablon sayfalar
│   ├── Helpers/           # Yardımcı fonksiyonlar
│   ├── HOC/               # Higher-Order Components
│   ├── Interfaces/        # TypeScript arayüzleri
│   └── services/          # API ve servis entegrasyonları
```

## 📜 Lisans

Stripe test kartı: 4242 4242 4242 4242 - Son kullanım: 12/25 - CVC: 123

---

> Proje, modern web standartlarına uygun olarak geliştirilmiştir.  
> Hem güvenli hem de kullanıcı dostu bir açık artırma deneyimi sunar.


