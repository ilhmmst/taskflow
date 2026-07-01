# Requirements Document

## Introduction

Fitur ini adalah redesign visual menyeluruh aplikasi TaskFlow — sebuah aplikasi manajemen tugas berbasis React + TypeScript + Tailwind CSS v4. Redesign mencakup tiga area utama: halaman Login, halaman Dashboard, dan halaman Edit/Create Task. Tujuannya adalah menghadirkan tampilan yang lebih modern, konsisten dengan design system yang sudah didefinisikan di `index.css`, responsif di semua ukuran layar, dan dilengkapi animasi GSAP yang halus. Selain itu, fitur ini memperkenalkan komponen UI yang dapat digunakan ulang (reusable components) untuk Input dan Button.

## Glossary

- **Application**: Aplikasi TaskFlow secara keseluruhan
- **Login_Page**: Halaman autentikasi pengguna di route `/login`
- **Dashboard_Page**: Halaman utama manajemen tugas di route `/dashboard`
- **Task_Form_Page**: Halaman penuh untuk membuat atau mengedit tugas, menggantikan modal `EditTaskModal` saat ini
- **Task_Card**: Komponen kartu individual yang merepresentasikan satu tugas di Dashboard
- **Card_Grid**: Layout grid yang menampilkan kumpulan `Task_Card`
- **Search_Bar**: Komponen input pencarian berdesain pill (rounded-full) dengan tombol clear
- **Input_Component**: Komponen `<Input />` reusable yang dapat digunakan di seluruh aplikasi
- **Button_Component**: Komponen `<Button />` reusable yang dapat digunakan di seluruh aplikasi
- **GSAP_Animator**: Library GSAP yang bertanggung jawab atas semua animasi entrance, hover, dan transisi halaman
- **Design_System**: Kumpulan token warna dan tipografi yang didefinisikan di `src/index.css`
- **Primary_Color**: Warna `#202020` (gelap), didefinisikan sebagai `--color-primary`
- **Secondary_Color**: Warna `#D6FF03` (kuning-hijau neon), didefinisikan sebagai `--color-secondary`
- **Third_Color**: Warna `#D9D9D9` (abu-abu terang), didefinisikan sebagai `--color-third`
- **Fourty_Color**: Warna `#F8FAFC` (putih hangat), didefinisikan sebagai `--color-fourty`
- **Hanson_Bold**: Font heading `hanson-bold`, digunakan untuk semua elemen `h1`, `h2`, `h3`
- **Satoshi**: Font body `Satoshi`, digunakan untuk paragraf, label, dan teks umum

---

## Requirements

### Requirement 1: Redesign Halaman Login — Split Layout

**User Story:** Sebagai pengguna, saya ingin melihat halaman login yang modern dengan tampilan split layout, sehingga aplikasi terasa profesional dan berkarakter kuat.

#### Acceptance Criteria

1. THE `Login_Page` SHALL menampilkan dua kolom: kolom kiri berisi branding dan kolom kanan berisi form login.
2. WHILE layar memiliki lebar lebih dari atau sama dengan 768px, THE `Login_Page` SHALL menampilkan layout dua kolom secara berdampingan (side-by-side).
3. WHILE layar memiliki lebar kurang dari 768px, THE `Login_Page` SHALL menampilkan kolom kiri dan kanan secara vertikal (stacked), dengan kolom form di bawah.
4. THE `Login_Page` SHALL menerapkan `Primary_Color` (#202020) sebagai background kolom kiri.
5. THE `Login_Page` SHALL menampilkan nama aplikasi "TASKFLOW" di kolom kiri menggunakan `Hanson_Bold` dengan ukuran tipografi yang besar (minimal `text-5xl`).
6. THE `Login_Page` SHALL menampilkan teks aksen di kolom kiri menggunakan `Secondary_Color` (#D6FF03).
7. THE `Login_Page` SHALL menerapkan `Fourty_Color` (#F8FAFC) atau warna terang sebagai background kolom kanan yang memuat form login.
8. THE `Login_Page` SHALL mempertahankan fungsionalitas autentikasi yang sudah ada (validasi username `admin` dan password `password123`).

---

### Requirement 2: Redesign Form Login

**User Story:** Sebagai pengguna, saya ingin form login yang bersih dan intuitif dengan input field yang konsisten dengan design system, sehingga proses login terasa mulus.

#### Acceptance Criteria

1. THE `Login_Page` SHALL menampilkan form login menggunakan `Input_Component` untuk field username dan password.
2. THE `Login_Page` SHALL menampilkan tombol submit menggunakan `Button_Component` dengan variant primary.
3. WHEN pengguna mengirimkan form dengan kredensial yang salah, THE `Login_Page` SHALL menampilkan pesan error yang jelas di dalam UI (bukan `alert()` browser).
4. WHEN pengguna mengirimkan form dengan field kosong atau tidak valid, THE `Login_Page` SHALL menampilkan pesan validasi di bawah masing-masing field yang bermasalah.
5. WHEN pengguna berhasil login, THE `Login_Page` SHALL mengarahkan pengguna ke `/dashboard`.

---

### Requirement 3: Redesign Halaman Dashboard — Card Grid Layout

**User Story:** Sebagai pengguna, saya ingin melihat tugas-tugas saya dalam tampilan kartu (card grid) yang bersih dan minimalis, sehingga saya dapat dengan cepat memindai status semua tugas.

#### Acceptance Criteria

1. THE `Dashboard_Page` SHALL menampilkan semua tugas dalam layout `Card_Grid`, bukan tabel.
2. THE `Dashboard_Page` SHALL menerapkan background `Fourty_Color` (#F8FAFC) atau putih sebagai warna dasar halaman.
3. THE `Card_Grid` SHALL menggunakan minimal 1 kolom pada mobile, 2 kolom pada tablet (≥768px), dan 3 kolom pada desktop (≥1024px).
4. WHEN daftar tugas kosong atau tidak ada hasil pencarian, THE `Dashboard_Page` SHALL menampilkan pesan empty state yang informatif.
5. WHEN data tugas sedang dimuat, THE `Dashboard_Page` SHALL menampilkan skeleton loader atau indikator loading pada area `Card_Grid`.
6. THE `Task_Card` SHALL menampilkan judul tugas, deskripsi (jika ada), status (selesai/belum), dan tombol aksi (edit dan hapus).
7. THE `Task_Card` SHALL menampilkan indikator visual yang jelas membedakan tugas selesai (completed) dari tugas yang belum selesai (pending), misalnya dengan strikethrough pada judul atau perubahan warna background card.
8. WHEN pengguna mengklik tombol edit pada `Task_Card`, THE `Dashboard_Page` SHALL mengarahkan pengguna ke `Task_Form_Page` dengan data tugas yang sudah dipopulasi.
9. WHEN pengguna mengklik tombol hapus pada `Task_Card`, THE `Dashboard_Page` SHALL menghapus tugas tersebut setelah konfirmasi.
10. THE `Dashboard_Page` SHALL mempertahankan fungsionalitas bulk select, bulk complete, dan bulk delete yang sudah ada.

---

### Requirement 4: Redesign Search Bar — Pill Style

**User Story:** Sebagai pengguna, saya ingin search bar dengan tampilan modern dan tombol clear yang mudah dijangkau, sehingga saya dapat mencari dan mengosongkan pencarian dengan cepat.

#### Acceptance Criteria

1. THE `Search_Bar` SHALL menampilkan input pencarian dengan sudut membulat penuh (rounded-full / pill style).
2. THE `Search_Bar` SHALL menampilkan ikon pencarian (🔍 / `Search` dari Lucide) sebagai icon button di sisi kanan input.
3. WHEN nilai input pencarian tidak kosong, THE `Search_Bar` SHALL menampilkan tombol clear (×) di dalam input untuk mengosongkan teks pencarian.
4. WHEN pengguna mengklik tombol clear, THE `Search_Bar` SHALL mengosongkan nilai input dan mereset hasil pencarian di `Dashboard_Page`.
5. WHEN pengguna mengetik di `Search_Bar`, THE `Dashboard_Page` SHALL memfilter `Task_Card` secara real-time berdasarkan judul dan deskripsi tugas.

---

### Requirement 5: Redesign Halaman Edit/Create Task — Full Page Layout

**User Story:** Sebagai pengguna, saya ingin halaman penuh untuk membuat dan mengedit tugas (menggantikan modal), sehingga saya memiliki ruang yang cukup untuk mengisi detail tugas dengan nyaman.

#### Acceptance Criteria

1. THE `Task_Form_Page` SHALL menampilkan layout full page (bukan modal overlay).
2. THE `Task_Form_Page` SHALL menampilkan tombol "Kembali" (back button) di bagian atas untuk navigasi kembali ke `Dashboard_Page`.
3. THE `Task_Form_Page` SHALL menampilkan judul besar menggunakan `Hanson_Bold` yang mendeskripsikan aksi ("BUAT TUGAS BARU" atau "EDIT TUGAS").
4. THE `Task_Form_Page` SHALL menampilkan input field menggunakan `Input_Component` dengan border orange accent saat field sedang aktif (focused).
5. THE `Task_Form_Page` SHALL menampilkan tombol "Simpan" menggunakan `Button_Component` di bagian kanan atas atau bawah form.
6. WHEN mode edit aktif dan tugas sudah ada, THE `Task_Form_Page` SHALL menampilkan tombol "Hapus" di samping tombol "Simpan".
7. WHEN pengguna mengklik "Simpan" dengan data valid, THE `Task_Form_Page` SHALL menyimpan data tugas dan mengarahkan kembali ke `Dashboard_Page`.
8. WHEN pengguna mengklik "Simpan" dengan data tidak valid, THE `Task_Form_Page` SHALL menampilkan pesan validasi pada masing-masing field yang bermasalah tanpa berpindah halaman.
9. WHEN pengguna mengklik "Hapus" pada mode edit, THE `Task_Form_Page` SHALL menghapus tugas dan mengarahkan kembali ke `Dashboard_Page`.
10. THE `Task_Form_Page` SHALL menambahkan route baru `/tasks/new` untuk membuat tugas dan `/tasks/:id/edit` untuk mengedit tugas.

---

### Requirement 6: Reusable Input Component

**User Story:** Sebagai developer, saya ingin komponen Input yang dapat digunakan ulang dengan API yang konsisten, sehingga semua input field di seluruh aplikasi memiliki tampilan dan perilaku yang seragam.

#### Acceptance Criteria

1. THE `Input_Component` SHALL menerima props: `label` (string opsional), `error` (string opsional), `type` (string, default `"text"`), dan semua props standar HTML `<input>`.
2. THE `Input_Component` SHALL menampilkan label di atas input field apabila prop `label` diberikan.
3. THE `Input_Component` SHALL menampilkan pesan error di bawah input field apabila prop `error` diberikan, dengan warna merah.
4. WHEN input field dalam keadaan fokus, THE `Input_Component` SHALL menampilkan border dengan accent color (orange atau `Secondary_Color`) sebagai indikator fokus.
5. WHEN prop `error` diberikan, THE `Input_Component` SHALL menampilkan border merah sebagai indikator error.
6. THE `Input_Component` SHALL mendukung prop `ref` (forwardRef) agar kompatibel dengan React Hook Form.
7. THE `Input_Component` SHALL disimpan di `src/utilities/components/Input.tsx` dan diekspor sebagai named export.

---

### Requirement 7: Reusable Button Component

**User Story:** Sebagai developer, saya ingin komponen Button yang dapat digunakan ulang dengan beberapa variant, sehingga semua tombol di seluruh aplikasi memiliki tampilan yang konsisten.

#### Acceptance Criteria

1. THE `Button_Component` SHALL menerima props: `variant` (`"primary"` | `"secondary"` | `"danger"` | `"ghost"`, default `"primary"`), `size` (`"sm"` | `"md"` | `"lg"`, default `"md"`), `isLoading` (boolean, default `false`), `disabled` (boolean), dan semua props standar HTML `<button>`.
2. WHEN `variant` adalah `"primary"`, THE `Button_Component` SHALL menerapkan `Primary_Color` sebagai background dan `Secondary_Color` sebagai warna teks atau warna kontras yang sesuai.
3. WHEN `variant` adalah `"danger"`, THE `Button_Component` SHALL menerapkan warna merah sebagai background.
4. WHEN `variant` adalah `"ghost"`, THE `Button_Component` SHALL menampilkan tombol transparan dengan border dan teks berwarna gelap.
5. WHEN `isLoading` bernilai `true`, THE `Button_Component` SHALL menampilkan indikator spinner dan menonaktifkan interaksi tombol.
6. WHEN `disabled` bernilai `true`, THE `Button_Component` SHALL menampilkan tombol dengan opacity berkurang dan kursor `not-allowed`.
7. THE `Button_Component` SHALL disimpan di `src/utilities/components/Button.tsx` dan diekspor sebagai named export.

---

### Requirement 8: Animasi GSAP

**User Story:** Sebagai pengguna, saya ingin animasi yang halus saat berpindah halaman dan saat elemen muncul, sehingga pengalaman menggunakan aplikasi terasa dinamis dan premium.

#### Acceptance Criteria

1. THE `Application` SHALL menginstal paket `gsap` sebagai dependency melalui npm.
2. WHEN `Login_Page` pertama kali dimuat, THE `GSAP_Animator` SHALL menjalankan animasi entrance pada elemen kolom kiri dan form login (misalnya fade-in + slide-up) dengan durasi tidak lebih dari 800ms.
3. WHEN `Dashboard_Page` pertama kali dimuat, THE `GSAP_Animator` SHALL menjalankan animasi staggered entrance pada setiap `Task_Card` sehingga kartu muncul secara berurutan dari atas ke bawah.
4. WHEN `Task_Form_Page` pertama kali dimuat, THE `GSAP_Animator` SHALL menjalankan animasi entrance pada elemen form (fade-in + slide-up).
5. WHEN pengguna mengarahkan kursor (hover) ke `Task_Card`, THE `GSAP_Animator` SHALL menjalankan animasi hover yang halus (misalnya scale up 1.02) dengan durasi tidak lebih dari 200ms.
6. WHEN navigasi berpindah antar halaman, THE `GSAP_Animator` SHALL menjalankan animasi transisi keluar (exit) sebelum halaman baru dimuat, dengan durasi tidak lebih dari 400ms.
7. WHEN `Task_Card` baru ditambahkan ke `Card_Grid`, THE `GSAP_Animator` SHALL menjalankan animasi entrance pada kartu baru tersebut.

---

### Requirement 9: Responsivitas

**User Story:** Sebagai pengguna, saya ingin aplikasi yang tampil dengan baik di perangkat mobile, tablet, dan desktop, sehingga saya dapat menggunakannya dari mana saja.

#### Acceptance Criteria

1. THE `Application` SHALL menampilkan layout yang dapat digunakan dengan baik pada lebar viewport mulai dari 320px hingga 1920px.
2. WHILE lebar viewport kurang dari 768px, THE `Login_Page` SHALL menampilkan form login sebagai tampilan utama yang mengisi layar penuh.
3. WHILE lebar viewport kurang dari 768px, THE `Dashboard_Page` SHALL menampilkan `Card_Grid` dengan 1 kolom.
4. WHILE lebar viewport antara 768px dan 1023px, THE `Dashboard_Page` SHALL menampilkan `Card_Grid` dengan 2 kolom.
5. WHILE lebar viewport lebih dari atau sama dengan 1024px, THE `Dashboard_Page` SHALL menampilkan `Card_Grid` dengan 3 kolom atau lebih.
6. THE `Application` SHALL menggunakan kelas `.main-container` (max-width 1200px, auto margin) dari `Design_System` untuk membatasi lebar konten pada halaman Dashboard.
7. WHILE lebar viewport kurang dari 768px, THE `Task_Form_Page` SHALL menampilkan tombol aksi (Simpan/Hapus) di bagian bawah layar agar mudah dijangkau.

---

### Requirement 10: Konsistensi Design System

**User Story:** Sebagai developer, saya ingin semua komponen menggunakan token warna dan tipografi dari `index.css`, sehingga tampilan aplikasi konsisten dan mudah diubah di masa depan.

#### Acceptance Criteria

1. THE `Application` SHALL menggunakan variabel CSS `--color-primary`, `--color-secondary`, `--color-third`, dan `--color-fourty` dari `Design_System` untuk semua warna utama, bukan nilai hex hardcoded.
2. THE `Application` SHALL menggunakan kelas Tailwind `font-heading` (Hanson_Bold) untuk semua elemen heading (`h1`, `h2`, `h3`).
3. THE `Application` SHALL menggunakan kelas Tailwind `font-subHeading` (Satoshi) untuk semua teks body, label, dan paragraf.
4. THE `Application` SHALL menerapkan kelas `.selected` (selection highlight dengan `Secondary_Color`) pada area teks yang dapat dipilih oleh pengguna.
5. THE `Application` SHALL menggunakan kelas `.outlineTypo` untuk efek teks outline dekoratif pada elemen heading tertentu di `Login_Page` sesuai design reference.
