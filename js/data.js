// =====================================================================================
// Sitenin TUM icerigi bu dosyada: arayuz metinleri (EN/TR), projeler ve yetenekler.
// =====================================================================================
// Non-teknik not: Bir metni, projeyi ya da yetenegi degistirmek icin sadece bu dosyayi duzenle.
// HTML'e ve main.js'e dokunmana gerek yok; sayfa acilinca her sey buradan uretilir.
//
// Teknik notlar:
//  - Bu dosya klasik bir <script> (ES module degil). Boylece index.html'e cift tiklayinca da
//    (file:// adresinden, sunucusuz) calisir; ES module'ler file:// altinda tarayici tarafindan engellenir.
//  - Buradaki "const" degiskenler, sonra yuklenen main.js tarafindan dogrudan okunur
//    (klasik script'lerde en ust seviyedeki const'lar sayfadaki diger script'lerle paylasilir).
//  - Icerik, ana projedeki (Next.js) frontend/src/lib/i18n/dictionary.ts ve backend/sql/projects.sql
//    ile ayni. Iki site artik bagimsiz: birinde yapilan degisiklik digerine kendiliginden gecmez.

// --- Arayuz metinleri -------------------------------------------------------------------
// HTML'deki data-i18n="hero.eyebrow" gibi anahtarlar bu nesnedeki yollara karsilik gelir.
const DICTIONARY = {
  en: {
    nav: { projects: "Projects", about: "About", skills: "Skills", contact: "Contact" },
    hero: {
      eyebrow: "Computer Engineer · System Architect",
      headingPre: "Engineering ",
      headingHighlight: "elegant systems",
      headingPost: " for the modern web.",
      paragraph:
        "I'm Alkın Korkut, a Computer Engineer who architects scalable backend systems and clean, production-ready APIs.",
      ctaPrimary: "View My Work",
      ctaSecondary: "Get in Touch",
    },
    projects: {
      heading: "Selected Projects",
      subtitle: "Coursework, research and systems I've built — from search-engine algorithms to CPU design.",
      // Proje linklerindeki "label" degerlerinin cevirisi (asagidaki PROJECTS'e bak).
      linkLabels: {
        "View Report": "View Report",
        "Source Code": "Source Code",
        "View README": "View README",
      },
      viewDetails: "View details",
      close: "Close",
      technologies: "Technologies",
      links: "Links",
    },
    about: {
      heading: "About Me",
      paragraph:
        "Gained hands-on experience in backend development and system architecture as an active software engineer. Designed and maintained scalable backend services using Python (FastAPI/Flask), and developed RESTful APIs for seamless service integration. Worked extensively with Oracle PL/SQL to optimize queries and data structures for high-performance applications. Streamlined business operations by building automated workflows with a flow-diagram-based system. Contributed to architectural decisions, wrote clean, testable code, and ensured code quality through debugging and peer reviews.",
    },
    skills: {
      heading: "Skills",
      // Yetenek grubu ve oge adlarinin cevirisi (asagidaki SKILL_GROUPS'a bak).
      // Burada olmayan bir ad cevrilmeden, oldugu gibi gosterilir (ornegin "Python").
      groups: {
        "Programming Languages": "Programming Languages",
        "Frameworks & Tools": "Frameworks & Tools",
        "Hardware & Systems": "Hardware & Systems",
        "Language Skills": "Language Skills",
      },
      items: {
        "Native Turkish Speaker": "Native Turkish Speaker",
        "Written and Oral Fluency in English": "Written and Oral Fluency in English",
        "Elementary Level Deutsch": "Elementary Level Deutsch",
      },
    },
    contact: {
      heading: "Get in Touch",
      subtitle: "Always looking for new opportunities. Feel free to reach out to me!",
      emailCta: "Email Me",
    },
    footer: { rights: "All rights reserved." },
  },
  tr: {
    nav: { projects: "Projeler", about: "Hakkımda", skills: "Yetenekler", contact: "İletişim" },
    hero: {
      eyebrow: "Bilgisayar Mühendisi · Sistem Mimarı",
      headingPre: "Modern web için ",
      headingHighlight: "zarif sistemler",
      headingPost: " tasarlıyorum.",
      paragraph:
        "Ben Alkın Korkut, ölçeklenebilir backend sistemleri ve temiz, üretime hazır API'lar tasarlayan bir Bilgisayar Mühendisiyim.",
      ctaPrimary: "Projelerimi Gör",
      ctaSecondary: "İletişime Geç",
    },
    projects: {
      heading: "Seçili Projeler",
      subtitle: "Ders projelerim, araştırmalarım ve geliştirdiğim sistemler — arama motoru algoritmalarından CPU tasarımına.",
      linkLabels: {
        "View Report": "Raporu Gör",
        "Source Code": "Kaynak Kod",
        "View README": "README'yi Gör",
      },
      viewDetails: "Detayları gör",
      close: "Kapat",
      technologies: "Teknolojiler",
      links: "Bağlantılar",
    },
    about: {
      heading: "Hakkımda",
      paragraph:
        "Aktif bir yazılım mühendisi olarak backend geliştirme ve sistem mimarisi konularında uygulamalı deneyim kazandım. Python (FastAPI/Flask) kullanarak ölçeklenebilir backend servisleri tasarladım ve sürdürdüm; sorunsuz servis entegrasyonu için RESTful API'lar geliştirdim. Yüksek performanslı uygulamalar için sorgu ve veri yapılarını optimize etmek amacıyla Oracle PL/SQL ile yoğun şekilde çalıştım. Akış-diyagramı tabanlı bir sistemle otomatik iş akışları kurarak operasyonları sadeleştirdim. Mimari kararlara katkı sağladım, temiz ve test edilebilir kod yazdım; hata ayıklama ve kod incelemeleriyle kod kalitesini güvence altına aldım.",
    },
    skills: {
      heading: "Yetenekler",
      groups: {
        "Programming Languages": "Programlama Dilleri",
        "Frameworks & Tools": "Framework'ler & Araçlar",
        "Hardware & Systems": "Donanım & Sistemler",
        "Language Skills": "Dil Becerileri",
      },
      items: {
        "Native Turkish Speaker": "Anadili Türkçe",
        "Written and Oral Fluency in English": "İngilizce yazılı ve sözlü akıcılık",
        "Elementary Level Deutsch": "Başlangıç seviyesi Almanca",
      },
    },
    contact: {
      heading: "İletişime Geç",
      subtitle: "Her zaman yeni fırsatlara açığım. Benimle iletişime geçmekten çekinme!",
      emailCta: "E-posta Gönder",
    },
    footer: { rights: "Tüm hakları saklıdır." },
  },
};

// --- Projeler ("Selected Projects") -----------------------------------------------------
// Siralama bu dizideki sira ile ayni. Kart duzeni 6'li bir kalip: 1. ve 6. kart genis
// (bkz. styles.css, .projects-grid). 7. projeden itibaren kalip bastan tekrar eder.
//  - image: images/ klasorundeki dosya; gorsel yoksa null (Simple CPU'da bilerek yok).
//  - links[].label: DICTIONARY'deki projects.linkLabels ile cevrilir. Oradaki uc etiket disinda
//    bir sey yazarsan cevrilmeden gosterilir.
//  - Yeni bir gorsel eklersen dosyayi images/ klasorune koymayi unutma.
const PROJECTS = [
  {
    title: "Analysis Of PageRank Algorithm",
    description: {
      en: "Developed with my friends Emir Mehmet Eryılmaz and Ezgi Alışan for the Algorithm Analysis lecture. Includes an analysis paper of the PageRank algorithm and two Python implementation files.",
      tr: "Emir Mehmet Eryılmaz ve Ezgi Alışan ile birlikte Algoritma Analizi dersi için geliştirildi. PageRank algoritmasının analiz raporunu ve iki Python uygulama dosyasını içerir.",
    },
    image: "images/pagerank.jpg",
    tags: ["Python", "NumPy", "Search Engine"],
    links: [
      {
        label: "View Report",
        href: "https://github.com/alkinkorkut/Analysis-Of-PageRank-Algorithm/blob/main/PageRank_Algorithm_Analysis.pdf",
      },
      { label: "Source Code", href: "https://github.com/alkinkorkut/Analysis-Of-PageRank-Algorithm" },
    ],
  },
  {
    title: "Dynamic IO Scheduler",
    description: {
      en: "Developed with my friends Emir Mehmet Eryılmaz and Ezgi Alışan for the Operating Systems lecture. Includes a research paper analyzing Linux IO schedulers and a dynamic scheduler program that switches strategy based on block size and record length.",
      tr: "Emir Mehmet Eryılmaz ve Ezgi Alışan ile birlikte İşletim Sistemleri dersi için geliştirildi. Linux IO zamanlayıcılarını inceleyen bir araştırma raporu ve blok boyutu ile kayıt uzunluğuna göre strateji değiştiren dinamik bir zamanlayıcı programı içerir.",
    },
    image: "images/io_scheduling.jpg",
    tags: ["Python", "OS Performance Profiling", "IO Scheduling"],
    links: [
      {
        label: "View Report",
        href: "https://github.com/alkinkorkut/Dynamic-IO-Scheduler/blob/main/OS-Performance%20Profiling%20%26%20IO-Scheduling.pdf",
      },
      { label: "Source Code", href: "https://github.com/alkinkorkut/Dynamic-IO-Scheduler" },
    ],
  },
  {
    title: "Deterministic Finite Automaton (DFA)",
    description: {
      en: "A DFA structure implemented in C++. Reads the automaton definition from a text file and simulates it against given input strings.",
      tr: "C++ ile geliştirilmiş bir DFA (Belirlenimli Sonlu Otomat) yapısı. Otomat tanımını bir metin dosyasından okur ve verilen girdi dizileri üzerinde simüle eder.",
    },
    image: "images/dfa.jpg",
    tags: ["C++", "DFA"],
    links: [
      { label: "View README", href: "https://github.com/alkinkorkut/Deterministic-Finite-Automaton/blob/main/README.md" },
      { label: "Source Code", href: "https://github.com/alkinkorkut/Deterministic-Finite-Automaton" },
    ],
  },
  {
    title: "Pushdown Automata (PDA)",
    description: {
      en: "A PDA implemented in Java. Reads the automaton definition from a text file and simulates it against given input strings.",
      tr: "Java ile geliştirilmiş bir PDA (Yığıtlı Otomat). Otomat tanımını bir metin dosyasından okur ve verilen girdi dizileri üzerinde simüle eder.",
    },
    image: "images/pda.jpg",
    tags: ["Java", "PDA"],
    links: [
      { label: "View README", href: "https://github.com/alkinkorkut/Pushdown-Automata/blob/main/README.md" },
      { label: "Source Code", href: "https://github.com/alkinkorkut/Pushdown-Automata" },
    ],
  },
  {
    title: "Simple CPU",
    description: {
      en: "A simple CPU designed and implemented in Verilog.",
      tr: "Verilog ile tasarlanmış ve gerçeklenmiş basit bir CPU.",
    },
    image: null,
    tags: ["Verilog", "Computer Architecture"],
    links: [{ label: "Source Code", href: "https://github.com/alkinkorkut/SimpleCPU" }],
  },
  {
    title: "Advanced CPP Programming",
    description: {
      en: "Coursework exploring advanced C++ programming techniques and programming paradigms.",
      tr: "İleri düzey C++ programlama teknikleri ve programlama paradigmalarını konu alan ders çalışması.",
    },
    image: "images/advanced_cpp.jpg",
    tags: ["C++", "Programming Paradigms"],
    links: [{ label: "Source Code", href: "https://github.com/alkinkorkut/Advanced-CPP-Programming" }],
  },
];

// --- Yetenekler ---------------------------------------------------------------------------
// Grup ve oge adlari DICTIONARY'deki skills.groups / skills.items ile cevrilir.
const SKILL_GROUPS = [
  { title: "Programming Languages", items: ["Python", "C++", "JavaScript", "Java"] },
  { title: "Frameworks & Tools", items: ["FastAPI", "Flask", "RabbitMQ", "Redis"] },
  { title: "Hardware & Systems", items: ["Verilog", "FPGA"] },
  {
    title: "Language Skills",
    items: ["Native Turkish Speaker", "Written and Oral Fluency in English", "Elementary Level Deutsch"],
  },
];
