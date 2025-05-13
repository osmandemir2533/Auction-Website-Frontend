🚀 Modern Web Geliştirme ile Açık Artırma Uygulaması
Bu proje, modern web teknolojileri kullanılarak geliştirilmiş, gerçek zamanlı açık artırma işlemlerini destekleyen tam kapsamlı bir web uygulamasıdır. SignalR ile anlık güncellemeler, JWT ile güvenli kullanıcı yönetimi, Stripe ile ödeme altyapısı ve MSSQL veritabanı üzerinde Code-First mimarisi kullanılmıştır.

🔍 Proje Hakkında
Kullanıcılar, araç, elektronik, müzik aletleri, emlak ve giyim kategorilerinde ürünler ekleyebilir ve bu ürünlere açık artırma usulüyle teklif verebilir. SignalR sayesinde teklifler anlık olarak tüm kullanıcılarla senkronize edilir. Ödeme işlemleri Stripe üzerinden güvenli bir şekilde gerçekleştirilir.

| Özellik                                | Açıklama                                                              |
| -------------------------------------- | --------------------------------------------------------------------- |
| 🧑‍💼 Kullanıcı Kayıt / Giriş Sistemi  | JWT ile kimlik doğrulama ve güvenli oturum yönetimi                   |
| ⚡ Gerçek Zamanlı Teklif Güncellemeleri | SignalR ile canlı teklif artışları ve anlık bildirimler               |
| 💳 Stripe ile Ödeme Entegrasyonu       | Kullanıcıların güvenli ödeme yapabilmesi için Stripe API entegrasyonu |
| 🧾 Ürün Listeleme ve Filtreleme        | Kategori bazlı arama ve ürün listeleme özellikleri                    |
| 📦 Code-First Entity Framework (MSSQL) | MSSQL ve EF Core ile modern veri modellemesi                          |
| 🧑‍💻 Yönetici Paneli (Admin Panel)    | Ürün ve kullanıcı yönetimi için özel yönetim ekranları                |



📦 Kategoriler
Uygulama aşağıdaki ana ürün kategorilerini desteklemektedir:

🚗 Vehicles (Araçlar)

💻 Electronic (Elektronik)

🎸 Musical Instruments (Müzik Aletleri)

🏠 Estates (Gayrimenkul)

👗 Dresses (Kıyafetler)


| **Bileşen**                 | **Teknoloji / Araç**                       | **Açıklama**                                   |
| --------------------------- | ------------------------------------------ | ---------------------------------------------- |
| **Backend**                 | ASP.NET Core 8                             | API ve iş mantığı katmanı                      |
| **Gerçek Zamanlı İletişim** | SignalR                                    | Anlık teklif güncellemeleri                    |
| **Kimlik Doğrulama**        | JWT (JSON Web Token)                       | Kullanıcı oturumları ve yetkilendirme          |
| **Veritabanı**              | MSSQL + Entity Framework Core (Code-First) | Veritabanı yönetimi ve veri modeli oluşturma   |
| **Frontend**                | React.js + Vite                            | Kullanıcı arayüzü                              |
| **Durum Yönetimi**          | React Context API                          | Kullanıcı, sepet ve teklif durumlarını yönetme |
| **Ödeme Sistemi**           | Stripe API                                 | Güvenli ödeme alma işlemleri                   |
| **API Testi**               | Postman / Swagger                          | Endpoint testleri ve dokümantasyonu            |
| **Paket Yöneticisi**        | NuGet (Backend), NPM (Frontend)            | Bağımlılık yönetimi                            |
| **Geliştirme Ortamı**       | Visual Studio, VS Code                     | Kodlama ve hata ayıklama                       |
| **Versiyon Kontrolü**       | Git + GitHub                               | Sürüm takibi ve ekip içi işbirliği             |

<pre><code>## 📁 Klasör Yapısı 
   client-app/
├── public/                 # Statik dosyalar (favicon, vs.)
├── src/
│   ├── Admin/              # Yöneticiye özel sayfalar/bileşenler
│   ├── assets/             # Görseller ve statik varlıklar
│   ├── components/         # Genel arayüz bileşenleri
│   ├── context/            # React Context API tanımları
│   ├── emptypage/          # Boş şablon veya placeholder sayfalar
│   ├── Helpers/            # Yardımcı fonksiyonlar / araçlar
│   ├── HOC/                # Higher-Order Components
│   ├── Interfaces/         # TypeScript arayüz tanımları
│   └── services/           # API istekleri, dış servis entegrasyonları
│
├── App.jsx                 # Ana uygulama bileşeni
├── App.css                 # Global CSS stilleri
├── index.jsx               # Giriş dosyası (React DOM render)
├── index.css               # Genel stiller
├── index.html              # HTML şablonu
├── vite.config.js          # Vite yapılandırması
├── eslint.config.js        # Lint kuralları
├── package.json            # Proje bağımlılıkları ve betikler
├── package-lock.json       # Sabitlenmiş bağımlılıklar
├── README.md               # Proje açıklaması
└── .gitignore              # Git tarafından yok sayılan dosyalar
   </code></pre>
   
🧪 Test Bilgileri
SignalR testi için iki farklı tarayıcı sekmesinden aynı ürün detay sayfasına girerek teklif deneyebilirsiniz.

Stripe test kartı: 4242 4242 4242 4242 - Son kullanım: 12/25 - CVC: 123


📜 Lisans
Bu proje MIT Lisansı ile lisanslanmıştır.


