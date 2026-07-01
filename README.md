# TaskFlow Manager - Radical Brutalist Offline Task Manager

TaskFlow Manager adalah aplikasi manajemen tugas (*task management*) berbasis web yang dirancang menggunakan ekosistem **React + TypeScript** modern dengan pendekatan arsitektur komponen yang bersih. Untuk memberikan impresi visual yang kuat, antarmuka aplikasi ini dibangun dengan estetika **Contemporary Underground Brutalism**, serta animasi mikro menggunakan GSAP.

Aplikasi ini beroperasi sepenuhnya secara offline namun mensimulasikan perilaku server sungguhan (*asynchronous data fetching*, latensi jaringan, validasi *auth header*, dan penanganan *error state*).

---

## 🛠️ Tech Stack & Arsitektur Utama

Aplikasi dibangun dengan dependensi utama yang diwajibkan dalam *take-home test*:
*   **Framework:** React v18 (Vite) + TypeScript
*   **Styling & Animasi:** Tailwind CSS + GSAP (GreenSock Animation Platform)
*   **Global State Management:** Zustand
*   **Data Fetching & Caching:** Axios + TanStack Query (React Query) v5
*   **Form Handling & Validation:** React Hook Form + Zod
*   **Storage (Mock DB):** LocalStorage

---

## 📂 Struktur Folder Proyek

Proyek ini menerapkan arsitektur berbasis fitur (*feature-based architecture*) untuk memisahkan abstraksi logika data layer dari presentasi UI:

```text
src/
├── api/             # DATA LAYER: Abstraksi Mock API, Axios Interceptors, & Latensi
│   └── mockApis.ts  # Pembungkus Promise manual untuk simulasi CRUD & Latensi (800ms)
├── features/        # DOMAIN UTAMA (Fitur Aplikasi)
│   ├── auth/        # Login, LoginForm, Auth Protected Routes, & Zustand Session Store
│   └── tasks/       # Dashboard, TaskCard, TaskFormPage, & Hooks React Query
├── hooks/           # Kumpulan custom hooks global (termasuk usePageTransition)
├── routes/          # Konfigurasi routing aplikasi (React Router)
├── store/           # Global State Management (Zustand untuk Filter, Search, & Sesi)
├── utilities/       # Fungsi pembantu / helper functions umum
├── App.tsx          # Root Component (Penyusun Router, QueryProvider, & Global Layout)
├── index.css        # Konfigurasi utility class Tailwind CSS global
└── main.tsx         # Entry point aplikasi

⚙️ Implementasi Requirement Fitur

A. Autentikasi & Sesi (Mock Offline)
Hardcoded Credentials: Validasi login aman ditangani secara lokal menggunakan skema Zod pada sisi client side.

Session Persistence: Sesi user diisolasi menggunakan Zustand Store yang dikonfigurasi dengan middleware persist untuk disinkronisasikan langsung ke LocalStorage. Saat halaman di-refresh, user tetap berada dalam sesi aktif.

Private Route: Repositori routing membungkus halaman utama menggunakan komponen <ProtectedRoute />. Akses paksa ke /dashboard tanpa token valid akan diredireksi secara otomatis kembali ke halaman /login.

B. Task Management & Abstraksi Data Layer (CRUD)
Separation of Concerns: Komponen UI tidak melakukan pemanggilan storage langsung. Seluruh operasi CRUD didelegasikan ke pembungkus Promise manual berbasis Axios yang mensimulasikan network latency selama 800ms - 1000ms menggunakan setTimeout.

Axios Interceptors: Mengimplementasikan interceptor request untuk menyisipkan token autentikasi tiruan ke dalam header sebelum proses fetching dijalankan.

TanStack Query Integration: Pengelolaan state asinkron menggunakan React Query untuk mengotomatisasi status isLoading, isError, serta melakukan otomatisasi cache invalidation (invalidateQueries) pasca melakukan mutasi data (Create, Update, Delete).

C. Global Search & Filter
Sinkronisasi pencarian kata kunci (search keyword) dan status filter kelompok (Semua, Selesai, Belum Selesai) dikelola secara terpusat di dalam Zustand Store.

Sistem penyaringan data bersifat reaktif, memastikan render daftar tugas langsung menyesuaikan dengan kombinasi filter dan kata kunci aktif secara instan.

D. Advanced Task: Multi-Select & Bulk Actions (Opsional)
Selection State: Menyediakan kapabilitas manajemen state kompleks untuk memilih beberapa task card sekaligus via checkbox.

Conditional Bulk Toolbar: Tombol aksi massal (Bulk Delete dan Bulk Complete) diisolasi dan hanya akan muncul secara kondisional ke layar jika jumlah item terpilih > 0.

Select All Logical: Implementasi fitur Select All yang adaptif, di mana tombol akan secara cerdas hanya memilih seluruh item yang saat itu lolos dari filter aktif (bukan memilih seluruh isi database).

🧠 Tantangan Teknis & Solusi Alternatif
Mitigasi Layout Overflow: Saat pengujian entri data ekstrem (input teks tanpa spasi yang sangat panjang pada judul tugas), teks merusak struktur grid responsif. Masalah ini diselesaikan dengan menyematkan utilitas Tailwind break-words di dalam komponen <TaskCard /> agar teks melakukan word-wrap secara paksa mengikuti lebar kontainer.

Asinkronitas Animasi & State: Integrasi animasi masuk (entrance animation) menggunakan GSAP sempat mengalami kendala kalkulasi dimensi elemen visual saat state loading beralih dari true ke false. Diselesaikan secara manual dengan mengandalkan pendekatan ResizeObserver agar inisialisasi garis gerak animasi baru dieksekusi tepat setelah elemen selesai dirender sepenuhnya pada DOM.