# Implementation Plan: TaskFlow Redesign

## Overview

Implementasi visual menyeluruh aplikasi TaskFlow menggunakan React + TypeScript + Tailwind CSS v4. Pendekatan ini bersifat non-breaking — semua logika bisnis, Zustand store, TanStack Query hooks, dan mock API layer dipertahankan. Hanya lapisan presentasi (komponen UI dan routing) yang diubah.

Urutan implementasi dimulai dari komponen reusable (`Input`, `Button`), dilanjutkan redesign halaman Auth, kemudian komponen dan halaman Dashboard (termasuk `TaskCard` dan `TaskFormPage`), diakhiri dengan integrasi GSAP dan penyambungan routing.

---

## Tasks

- [x] 1. Instal dependency dan buat komponen reusable
  - [x] 1.1 Instal paket GSAP
    - Jalankan `npm install gsap@^3.12.0` dan tambahkan ke `package.json` dependencies
    - Verifikasi `gsap` tersedia sebagai import di file TypeScript
    - _Requirements: 8.1_

  - [x] 1.2 Buat komponen `Input` reusable
    - Buat file `src/utilities/components/Input.tsx`
    - Implementasi `InputProps` yang meng-extend `React.InputHTMLAttributes<HTMLInputElement>` dengan tambahan prop `label?: string` dan `error?: string`
    - Render `<label>` di atas input jika prop `label` diberikan; gunakan `htmlFor` yang cocok dengan `id` input (auto-generate jika tidak disediakan)
    - Render pesan error berwarna merah di bawah input jika prop `error` diberikan
    - Terapkan styling: border `border-third`, fokus `border-secondary ring-2 ring-secondary/30`, error `border-red-500 ring-2 ring-red-500/20`
    - Gunakan `React.forwardRef` agar kompatibel dengan React Hook Form
    - Export sebagai named export `export const Input`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

  - [ ]* 1.3 Tulis property test untuk komponen `Input` (Property 6)
    - **Property 6: Input Component Aksesibilitas** — `label.htmlFor === input.id` ketika prop `label` diberikan
    - **Validates: Requirements 6.1, 6.2**
    - Gunakan `fast-check` untuk generate kombinasi prop `label` dan `id` yang arbitrary
    - Verifikasi asosiasi `htmlFor`/`id` selalu terpenuhi

  - [ ]* 1.4 Tulis unit test untuk komponen `Input`
    - Render dengan dan tanpa prop `label` → verifikasi keberadaan elemen `<label>`
    - Render dengan prop `error` → verifikasi pesan error muncul dengan kelas warna merah
    - Render tanpa `error` → verifikasi tidak ada error message
    - Verifikasi `forwardRef` meneruskan ref ke underlying `<input>`
    - _Requirements: 6.2, 6.3, 6.6_

  - [x] 1.5 Buat komponen `Button` reusable
    - Buat file `src/utilities/components/Button.tsx`
    - Implementasi `ButtonProps` yang meng-extend `React.ButtonHTMLAttributes<HTMLButtonElement>` dengan prop `variant?: 'primary' | 'secondary' | 'danger' | 'ghost'` (default `'primary'`), `size?: 'sm' | 'md' | 'lg'` (default `'md'`), `isLoading?: boolean` (default `false`)
    - Terapkan styling per variant sesuai design: `primary` → `bg-primary text-secondary`, `secondary` → `bg-secondary text-primary`, `danger` → `bg-red-600 text-white`, `ghost` → `bg-transparent text-primary border border-third`
    - Terapkan ukuran: `sm` → `px-3 py-1.5 text-xs`, `md` → `px-5 py-2.5 text-sm`, `lg` → `px-7 py-3.5 text-base`
    - Ketika `isLoading=true`: tampilkan spinner SVG inline dan set `disabled`
    - Ketika `disabled=true`: terapkan `opacity-50 cursor-not-allowed`
    - Export sebagai named export `export const Button`
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

  - [ ]* 1.6 Tulis unit test untuk komponen `Button`
    - Setiap `variant` render dengan kelas CSS yang benar
    - `isLoading=true` → verifikasi spinner muncul dan button disabled
    - `disabled=true` → verifikasi `cursor-not-allowed` dan opacity berkurang
    - `onClick` handler dipanggil dengan benar saat tidak disabled/loading
    - _Requirements: 7.2, 7.3, 7.4, 7.5, 7.6_

- [x] 2. Redesign halaman Login (split layout + form update)
  - [x] 2.1 Redesign `Login.tsx` menjadi split layout
    - Modifikasi `src/features/auth/Login.tsx`
    - Implementasi layout dua kolom (`flex md:flex-row flex-col min-h-screen`): kolom kiri `bg-primary` dan kolom kanan `bg-fourty`
    - Kolom kiri: tampilkan "TASKFLOW" dengan `font-heading text-6xl md:text-7xl` dan kelas `outlineTypo`, tambahkan teks aksen dengan `text-secondary`
    - Kolom kanan: render komponen `<LoginForm />`
    - Pada mobile (<768px): kolom stacked, kolom form di bawah, form mengisi layar penuh
    - Terapkan `gsap.context()` dalam `useEffect` untuk animasi entrance (kolom kiri: `x: -50 → 0, opacity: 0 → 1`, form kanan: `y: 30 → 0, opacity: 0 → 1, delay: 0.2`)
    - Cleanup GSAP context pada return `useEffect`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 8.2, 9.2, 10.2, 10.5_

  - [x] 2.2 Redesign `LoginForm.tsx` — ganti input/button, perbaiki error handling
    - Modifikasi `src/features/auth/LoginForm.tsx`
    - Ganti `<input>` native dengan `<Input />` component untuk field `username` dan `password`
    - Ganti tombol submit native dengan `<Button variant="primary" />` component
    - Ganti `alert()` dengan `setError('root', { message: '...' })` dari React Hook Form
    - Tambahkan render `{errors.root && <p className="text-red-500 text-sm text-center">{errors.root.message}</p>}` di JSX
    - Pertahankan logika validasi Zod yang sudah ada (`loginSchema`) dan logika autentikasi (`admin` / `password123`)
    - _Requirements: 1.8, 2.1, 2.2, 2.3, 2.4, 2.5_

  - [ ]* 2.3 Tulis integration test untuk Login flow
    - Submit dengan field kosong → verifikasi error validation per-field muncul (bukan alert)
    - Submit dengan kredensial salah → verifikasi inline error message muncul
    - Submit dengan kredensial benar → verifikasi `login()` dari store dipanggil
    - _Requirements: 2.3, 2.4, 2.5_

  - [ ]* 2.4 Tulis property test untuk form validasi (Property 5)
    - **Property 5: Form Validasi** — form submit tidak boleh memanggil mutasi API jika ada field yang gagal validasi Zod
    - **Validates: Requirements 2.4**
    - Generate input data yang melanggar skema (username kosong, password < 6 karakter, dll.)
    - Verifikasi bahwa fungsi `login()` dari store tidak dipanggil

- [x] 3. Checkpoint — Verifikasi komponen reusable dan halaman Login
  - Pastikan semua test yang berjalan di task 1 dan 2 lolos
  - Tanyakan kepada user jika ada pertanyaan sebelum melanjutkan ke Dashboard

- [x] 4. Buat komponen `TaskCard`
  - [x] 4.1 Implementasi komponen `TaskCard`
    - Buat file `src/features/tasks/TaskCard.tsx`
    - Implementasi interface `TaskCardProps` sesuai design: `task`, `isSelected`, `onSelect`, `onToggle`, `onEdit`, `onDelete`
    - Anatomi kartu: header row (checkbox + indikator status bulat), area konten (judul, deskripsi opsional, tanggal dibuat), action row (tombol edit & hapus)
    - State visual: pending → `bg-fourty border-third`; completed → `bg-third/40 border-third/60` dengan `line-through` pada judul; selected → `bg-secondary/10 border-secondary`
    - Tombol Edit navigasi ke `/tasks/:id/edit`, tombol Hapus memanggil prop `onDelete`
    - Gunakan `useRef<HTMLDivElement>` dan pasang GSAP hover animation (`scale: 1.02`) di `onMouseEnter` / `onMouseLeave`
    - Tambahkan kelas `task-card` di elemen root untuk selector GSAP staggered entrance di Dashboard
    - Gunakan token design system (`font-heading`, `font-subHeading`, `text-primary`, `text-secondary`) tanpa hardcode hex
    - _Requirements: 3.6, 3.7, 3.8, 3.9, 8.5, 10.1, 10.2, 10.3_

  - [ ]* 4.2 Tulis unit test untuk komponen `TaskCard`
    - Render task pending → verifikasi judul normal (tidak strikethrough)
    - Render task completed → verifikasi kelas `line-through` pada judul
    - Render task selected → verifikasi kelas border secondary
    - Klik tombol edit → verifikasi prop `onEdit` dipanggil dengan id yang benar
    - Klik tombol hapus → verifikasi prop `onDelete` dipanggil dengan id yang benar
    - _Requirements: 3.6, 3.7, 3.8, 3.9_

- [x] 5. Redesign `Dashboard.tsx` — card grid, search bar pill, header baru
  - [x] 5.1 Redesign layout utama dan header Dashboard
    - Modifikasi `src/features/tasks/Dashboard.tsx`
    - Hapus `<table>`, `<thead>`, `<tbody>` dan semua konten tabel
    - Hapus state `editingTask` dan `isEditModalOpen`, hapus import `EditTaskModal` dan `TaskForm`
    - Tambahkan import `useNavigate` dari `react-router-dom`
    - Ubah fungsi `handleEditTask` untuk memanggil `navigate(\`/tasks/${task.id}/edit\`)`
    - Redesign header: `bg-primary`, logo "TASKFLOW" dengan `font-heading text-secondary`, info user dan tombol logout dengan warna kontras
    - Tambahkan tombol "Buat Tugas Baru" (`<Button />`) yang navigate ke `/tasks/new`
    - Bungkus konten utama dalam `<main className="main-container ...">` sesuai design system
    - _Requirements: 3.1, 3.2, 5.1, 5.10, 9.6, 10.1_

  - [x] 5.2 Implementasi `Card_Grid` dengan `TaskCard` dan loading/empty state
    - Ganti tabel dengan grid: `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">`
    - Render `<TaskCard />` untuk setiap `filteredTask`
    - Saat `isLoading=true`: render 6 skeleton card (`<div className="bg-third/40 rounded-xl p-5 animate-pulse">...`) dalam grid yang sama
    - Saat daftar tugas kosong (tanpa filter): tampilkan empty state "Belum ada tugas. Buat tugas pertamamu!" dengan tombol CTA ke `/tasks/new`
    - Saat kosong karena filter/search: tampilkan "Tidak ada tugas yang cocok." dengan tombol clear search
    - Tambahkan `useEffect` untuk GSAP staggered entrance (`gsap.fromTo('.task-card', ...)`) yang dijalankan setelah `!isLoading && filteredTasks.length > 0`
    - _Requirements: 3.1, 3.3, 3.4, 3.5, 8.3, 9.3, 9.4, 9.5_

  - [x] 5.3 Implementasi `Search_Bar` pill style
    - Ganti input pencarian existing dengan implementasi pill style
    - Terapkan styling `rounded-full border border-third bg-fourty` pada container search
    - Posisikan ikon `Search` dari Lucide sebagai button di sisi kanan input
    - Render tombol clear `×` secara conditional ketika `searchQuery` tidak kosong
    - `onClick` pada clear button: panggil `setSearchQuery('')`
    - Pertahankan logika real-time filter yang sudah ada
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ]* 5.4 Tulis property test untuk filter konsistensi (Property 2)
    - **Property 2: Filter Konsistensi** — setiap elemen `filteredTasks` harus memenuhi `matchesSearch` AND `matchesStatus`
    - **Validates: Requirements 3.5, 4.5**
    - Ekstrak logika filter ke fungsi murni `filterTasks(tasks, query, filter)`
    - Gunakan `fast-check` untuk generate array task acak, searchQuery acak, statusFilter acak
    - Verifikasi `result.every(t => matchesSearch(t, query) && matchesStatus(t, filter))`

  - [ ]* 5.5 Tulis property test untuk bulk selection konsistensi (Property 3)
    - **Property 3: Bulk Selection Konsistensi** — `isAllSelected ⟺ (filteredTasks.length > 0 ∧ ∀ t ∈ filteredTasks: t.id ∈ selectedIds)`
    - **Validates: Requirements 3.10**
    - Ekstrak logika `computeIsAllSelected(filteredTasks, selectedIds)` ke fungsi murni
    - Gunakan `fast-check` untuk generate array task dan selectedIds acak
    - Verifikasi computed value selalu konsisten dengan definisi formal

- [x] 6. Buat `TaskFormPage` — halaman penuh pengganti modal
  - [x] 6.1 Implementasi komponen `TaskFormPage`
    - Buat file `src/features/tasks/TaskFormPage.tsx`
    - Gunakan `useParams<{ id: string }>()` untuk deteksi mode: `/tasks/new` → create mode, `/tasks/:id/edit` → edit mode
    - Pada edit mode: ambil data task dari `useTasks()` filter by `id`, populasi form dengan `reset({ title, description })`
    - Jika edit mode dan task tidak ditemukan (`!taskData && !isLoading`): tampilkan pesan "Tugas tidak ditemukan." dan tombol kembali ke dashboard
    - Layout: tombol "← Kembali" di kiri atas, judul besar dengan `font-heading` ("BUAT TUGAS BARU" atau "EDIT TUGAS")
    - Form input: `<Input />` untuk judul (label: "Judul Tugas") dan textarea untuk deskripsi (label: "Deskripsi (Opsional)")
    - Validasi menggunakan Zod `taskSchema` dan React Hook Form
    - Tombol "Simpan" (`<Button variant="primary" />`); pada edit mode tambahkan tombol "Hapus" (`<Button variant="danger" />`)
    - Pada mobile (<768px): tombol Simpan/Hapus menggunakan `fixed bottom-0 left-0 right-0 p-4 bg-fourty border-t border-third`
    - Navigasi setelah Simpan berhasil: `navigate('/dashboard')`; setelah Hapus berhasil: `navigate('/dashboard')`
    - Hapus: gunakan `window.confirm()` untuk konfirmasi sebelum mutasi
    - Terapkan GSAP entrance: `gsap.from(formRef.current, { opacity: 0, y: 40, duration: 0.6 })` dan `gsap.from(headingRef.current, { opacity: 0, y: -20, duration: 0.5 })`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10, 8.4, 9.7_

  - [ ]* 6.2 Tulis integration test untuk `TaskFormPage` — create mode
    - Render di route `/tasks/new` → verifikasi judul "BUAT TUGAS BARU" tampil
    - Submit dengan `title` < 3 karakter → verifikasi error muncul dan `createTask.mutate` tidak dipanggil (Property 5)
    - Submit valid → verifikasi `createTask.mutate` dipanggil dan navigate ke `/dashboard`
    - _Requirements: 5.3, 5.7, 5.8_

  - [ ]* 6.3 Tulis integration test untuk `TaskFormPage` — edit mode
    - Render di route `/tasks/:id/edit` dengan task valid → verifikasi form ter-populate dengan data task
    - Klik "Hapus" → konfirmasi → verifikasi `deleteTask.mutate` dipanggil dan navigate ke `/dashboard`
    - Render dengan `id` tidak valid → verifikasi pesan "Tugas tidak ditemukan." tampil
    - _Requirements: 5.6, 5.9, 5.10_

  - [ ]* 6.4 Tulis property test untuk integritas data task (Property 1)
    - **Property 1: Integritas Data Task** — setiap operasi menghasilkan state `storage` yang konsisten dengan UI
    - **Validates: Requirements 3.6, 3.9, 3.10**
    - Gunakan `fast-check` untuk generate sequence operasi acak (create, update, delete, toggle, bulkDelete, bulkComplete)
    - Verifikasi `storage.getTasks()` selalu merefleksikan state TanStack Query cache

- [x] 7. Update `App.tsx` — tambah route baru dan sambungkan `TaskFormPage`
  - [x] 7.1 Update routing di `App.tsx`
    - Modifikasi `src/App.tsx`
    - Tambahkan import `TaskFormPage` dari `./features/tasks/TaskFormPage`
    - Tambahkan dua route baru di dalam `<Route element={<PrivateRoute />}>`:
      - `<Route path="/tasks/new" element={<TaskFormPage />} />`
      - `<Route path="/tasks/:id/edit" element={<TaskFormPage />} />`
    - Pertahankan semua route dan logic redirect yang sudah ada
    - _Requirements: 5.10, 3.8_

  - [ ]* 7.2 Tulis property test untuk route guard (Property 4)
    - **Property 4: Route Guard** — semua protected route tidak dapat diakses saat `isAuthenticated = false`
    - **Validates: Requirements 1.8, 5.10**
    - Render `PrivateRoute` dengan `isAuthenticated = false`
    - Verifikasi output selalu `<Navigate to="/login" />` untuk semua route yang dilindungi

- [x] 8. Checkpoint — Verifikasi alur navigasi lengkap
  - Pastikan semua route berfungsi: `/login` → `/dashboard` → `/tasks/new` → back → `/tasks/:id/edit` → back
  - Pastikan `EditTaskModal.tsx` dan `TaskForm.tsx` (inline di dashboard lama) tidak lagi di-import atau digunakan
  - Tanyakan kepada user jika ada pertanyaan sebelum melanjutkan ke animasi GSAP dan responsivitas

- [x] 9. Implementasi animasi GSAP dan polishing responsivitas
  - [x] 9.1 Implementasi page transition exit animation
    - Buat helper atau tambahkan logika di `App.tsx` / wrapper component untuk animasi exit saat navigasi
    - Implementasi fungsi `animateOut(callback)` menggunakan `gsap.to(pageRef.current, { opacity: 0, y: -20, duration: 0.35, onComplete: callback })`
    - Trigger `animateOut` sebelum memanggil `navigate()` pada semua navigasi yang dipicu user di `Dashboard`, `TaskFormPage`, dan `Login`
    - _Requirements: 8.6_

  - [x] 9.2 Implementasi GSAP entrance animasi pada `Dashboard` untuk kartu baru
    - Setelah operasi `createTask.mutate` sukses dan kartu baru muncul di grid, jalankan animasi entrance individual pada kartu baru
    - Gunakan `useEffect` yang memperhatikan perubahan `filteredTasks.length` untuk mendeteksi kartu baru
    - _Requirements: 8.7_

  - [x] 9.3 Verifikasi dan perbaiki responsivitas di semua breakpoint
    - Audit semua halaman pada breakpoint 320px, 768px, dan 1024px
    - Pastikan Login stacked pada mobile, Dashboard card grid 1/2/3 kolom sesuai breakpoint
    - Pastikan `TaskFormPage` mobile: tombol aksi di bagian bawah (sticky/fixed)
    - Pastikan `.main-container` digunakan di Dashboard untuk membatasi lebar pada desktop
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

  - [ ]* 9.4 Tulis property test untuk GSAP cleanup (Property 7)
    - **Property 7: GSAP Cleanup** — setiap `gsap.context()` harus di-`revert()` pada cleanup
    - **Validates: Requirements 8.1, 8.2, 8.3, 8.4**
    - Mount dan unmount komponen (`Login`, `Dashboard`, `TaskFormPage`) berkali-kali dalam test
    - Verifikasi tidak ada animasi aktif yang tersisa setelah unmount menggunakan `gsap.getTweensOf()`

- [x] 10. Final Checkpoint — Pastikan semua test lolos
  - Jalankan seluruh test suite dan pastikan semua test lolos
  - Verifikasi konsistensi design system: tidak ada nilai hex hardcoded, semua warna via CSS variables/token Tailwind
  - Tanyakan kepada user jika ada pertanyaan atau penyesuaian yang diinginkan

---

## Notes

- Task bertanda `*` adalah opsional dan dapat dilewati untuk implementasi MVP yang lebih cepat
- Setiap task menyertakan referensi ke requirement spesifik untuk traceability
- Checkpoint di task 3, 8, dan 10 memastikan validasi inkremental sebelum melanjutkan
- Property test menggunakan `fast-check` — perlu diinstal jika belum ada: `npm install --save-dev fast-check`
- Logika bisnis di `useTasks.ts`, `useAuthStore.ts`, `useTaskFilterStore.ts`, dan `mockApi.ts` tidak boleh dimodifikasi
- `EditTaskModal.tsx` dan `TaskForm.tsx` (inline di dashboard) dihapus setelah `TaskFormPage` selesai
- Semua GSAP `useEffect` harus menggunakan `gsap.context()` dengan cleanup `ctx.revert()` (Property 7)

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.5"] },
    { "id": 1, "tasks": ["1.3", "1.4", "1.6", "2.1", "2.2", "4.1"] },
    { "id": 2, "tasks": ["2.3", "2.4", "4.2", "5.1"] },
    { "id": 3, "tasks": ["5.2", "5.3", "6.1"] },
    { "id": 4, "tasks": ["5.4", "5.5", "6.2", "6.3", "6.4", "7.1"] },
    { "id": 5, "tasks": ["7.2", "9.1", "9.2", "9.3"] },
    { "id": 6, "tasks": ["9.4"] }
  ]
}
```
