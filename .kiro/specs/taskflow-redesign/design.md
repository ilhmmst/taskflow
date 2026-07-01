# Design Document

## Overview

TaskFlow Redesign adalah transformasi visual menyeluruh dari aplikasi manajemen tugas berbasis React + TypeScript + Tailwind CSS v4. Desain ini memperkenalkan layout split pada Login, mengganti tampilan tabel menjadi card grid pada Dashboard, mengkonversi modal menjadi halaman penuh untuk form tugas, menambahkan komponen reusable `Input` dan `Button`, serta mengintegrasikan animasi GSAP di seluruh aplikasi.

Pendekatan desain ini bersifat **non-breaking** — semua logika bisnis, Zustand store, TanStack Query hooks, dan mock API layer dipertahankan sepenuhnya. Hanya lapisan presentasi (komponen UI dan routing) yang mengalami perubahan signifikan.

---

## Architecture

### Struktur File Baru

```
src/
├── api/
│   └── mockApi.ts                        # Tidak berubah
├── features/
│   ├── auth/
│   │   ├── Login.tsx                     # REDESIGN — split layout
│   │   └── LoginForm.tsx                 # REDESIGN — pakai Input/Button component
│   └── tasks/
│       ├── Dashboard.tsx                 # REDESIGN — card grid, hapus tabel
│       ├── TaskCard.tsx                  # BARU — komponen kartu individual
│       ├── TaskFormPage.tsx              # BARU — halaman penuh (ganti EditTaskModal)
│       ├── TaskForm.tsx                  # HAPUS atau merge ke TaskFormPage
│       └── EditTaskModal.tsx             # HAPUS (digantikan TaskFormPage)
├── hooks/
│   └── useTasks.ts                       # Tidak berubah
├── routes/
│   └── PrivateRoute.tsx                  # Tidak berubah
├── store/
│   ├── useAuthStore.ts                   # Tidak berubah
│   └── useTaskFilterStore.ts             # Tidak berubah
├── utilities/
│   ├── components/
│   │   ├── Input.tsx                     # BARU — reusable input
│   │   └── Button.tsx                    # BARU — reusable button
│   └── font/
│       └── Hanson-Bold.ttf               # Tidak berubah
├── App.tsx                               # UPDATE — tambah routes baru
├── index.css                             # Tidak berubah
└── main.tsx                              # Tidak berubah
```

### Perubahan Routing

`App.tsx` diperbarui untuk menambahkan dua route baru di bawah `PrivateRoute`:

```
/login              → Login (tidak berubah)
/dashboard          → Dashboard (redesign)
/tasks/new          → TaskFormPage (mode: create) — BARU
/tasks/:id/edit     → TaskFormPage (mode: edit) — BARU
*                   → redirect ke /dashboard atau /login
```

Komponen `EditTaskModal` dan `TaskForm` (inline di dashboard) dihapus. Semua alur create/edit tugas kini melalui `TaskFormPage`.

---

## Components and Interfaces

### 1. `Input` — Reusable Input Component

**Lokasi:** `src/utilities/components/Input.tsx`

**Props Interface:**

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
```

**Perilaku:**
- Render `<label>` di atas input jika prop `label` diberikan
- Render pesan error berwarna merah di bawah input jika prop `error` diberikan
- Saat fokus: border menggunakan `--color-secondary` (#D6FF03) sebagai accent, atau orange sesuai preferensi
- Saat error: border merah
- Mendukung `forwardRef` untuk kompatibilitas dengan React Hook Form
- Named export: `export const Input`

**Pseudocode Styling:**

```
base:     border border-third rounded-lg px-4 py-2.5 w-full font-subHeading
          bg-fourty text-primary outline-none transition-all
focus:    border-secondary ring-2 ring-secondary/30
error:    border-red-500 ring-2 ring-red-500/20
disabled: opacity-50 cursor-not-allowed
```

---

### 2. `Button` — Reusable Button Component

**Lokasi:** `src/utilities/components/Button.tsx`

**Props Interface:**

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}
```

**Styling per Variant:**

| Variant     | Background         | Text               | Border             |
|-------------|--------------------|--------------------|---------------------|
| `primary`   | `--color-primary`  | `--color-secondary`| –                   |
| `secondary` | `--color-secondary`| `--color-primary`  | –                   |
| `danger`    | `red-600`          | white              | –                   |
| `ghost`     | transparent        | `--color-primary`  | `--color-third`     |

**Ukuran:**

| Size | Padding          | Font size |
|------|------------------|-----------|
| `sm` | `px-3 py-1.5`    | `text-xs` |
| `md` | `px-5 py-2.5`    | `text-sm` |
| `lg` | `px-7 py-3.5`    | `text-base`|

**Perilaku:**
- `isLoading=true`: tampilkan spinner SVG + disable button
- `disabled=true`: `opacity-50 cursor-not-allowed`
- Named export: `export const Button`

---

### 3. `Login` — Halaman Login Redesign

**Lokasi:** `src/features/auth/Login.tsx`

**Layout (Desktop ≥768px):**

```
┌─────────────────────┬─────────────────────┐
│   KOLOM KIRI        │   KOLOM KANAN       │
│   bg: primary       │   bg: fourty        │
│                     │                     │
│   "TASKFLOW"        │   Form Login        │
│   (Hanson Bold)     │   (LoginForm)       │
│                     │                     │
│   Teks aksen        │                     │
│   (secondary color) │                     │
└─────────────────────┴─────────────────────┘
```

**Layout (Mobile <768px):**

```
┌─────────────────────┐
│   KOLOM KIRI        │
│   (compact, fixed h)│
│   "TASKFLOW"        │
└─────────────────────┘
┌─────────────────────┐
│   KOLOM KANAN       │
│   Form Login        │
│   (full width)      │
└─────────────────────┘
```

**Konten Kolom Kiri:**
- Judul `TASKFLOW` dengan `font-heading` (Hanson Bold), `text-6xl md:text-7xl`, kelas `outlineTypo` untuk efek outline dekoratif
- Tagline/aksen teks dengan `text-secondary`
- Background `bg-primary`

**Konten Kolom Kanan:**
- `LoginForm` component (diperbarui dengan `Input` & `Button`)
- Background `bg-fourty`

**Animasi GSAP:**
- Kolom kiri: `opacity: 0 → 1`, `x: -50 → 0`, durasi 600ms, ease `power2.out`
- Form kanan: `opacity: 0 → 1`, `y: 30 → 0`, durasi 600ms, delay 200ms

---

### 4. `LoginForm` — Form Login Redesign

**Lokasi:** `src/features/auth/LoginForm.tsx`

**Perubahan dari versi sekarang:**
- Input `username` dan `password` diganti dengan `<Input />` component
- Tombol submit diganti dengan `<Button variant="primary" />`
- Error credential (saat ini `alert()`) diganti dengan state inline menggunakan `setError` dari React Hook Form
- Logika autentikasi (admin / password123) dipertahankan

**Error Handling:**
```typescript
// Ganti alert() dengan:
setError('root', { message: 'Kredensial salah! Gunakan admin / password123' });
// Render di JSX:
{errors.root && <p className="text-red-500 text-sm text-center">{errors.root.message}</p>}
```

---

### 5. `Dashboard` — Halaman Dashboard Redesign

**Lokasi:** `src/features/tasks/Dashboard.tsx`

**Perubahan Struktural:**
- Hapus `<table>` dan `<tbody>` — diganti dengan `Card_Grid`
- Hapus `EditTaskModal` dan state `editingTask`, `isEditModalOpen`
- Hapus `TaskForm` inline — pindah ke route `/tasks/new`
- Navigasi edit: `navigate(\`/tasks/${task.id}/edit\`)` via `useNavigate()`

**Layout Dashboard:**

```
┌─────────────────────────────────────────┐
│  HEADER (sticky top)                    │
│  Logo | Halo, {user} | Logout           │
├─────────────────────────────────────────┤
│  MAIN (.main-container)                 │
│                                         │
│  [ + Buat Tugas Baru ]  (Button)        │
│                                         │
│  [ 🔍 Search...    × ] [ALL|PENDING|   │
│                         COMPLETED]      │
│                                         │
│  [Bulk Toolbar — kondisional]           │
│                                         │
│  ┌────────┐ ┌────────┐ ┌────────┐      │
│  │ Card 1 │ │ Card 2 │ │ Card 3 │      │
│  └────────┘ └────────┘ └────────┘      │
│  ┌────────┐ ┌────────┐ ┌────────┐      │
│  │ Card 4 │ │ Card 5 │ │ ...    │      │
│  └────────┘ └────────┘ └────────┘      │
│                                         │
│  [Empty State — kondisional]            │
│  [Skeleton — kondisional saat loading]  │
└─────────────────────────────────────────┘
```

**Card Grid CSS:**
```
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6
```

**Search Bar (Pill Style):**
```
┌──────────────────────────────────────────┐
│  Cari tugas...                    [🔍] [×] │
└──────────────────────────────────────────┘
rounded-full border border-third bg-fourty
```
- Icon search sebagai `<button>` di sisi kanan
- Tombol clear `×` muncul conditional saat input tidak kosong
- Clear button onClick: `setSearchQuery('')`

**Header Redesign:**
- Background `bg-primary`
- Logo "TASKFLOW" dengan `font-heading text-secondary`
- User info dan logout button dengan warna yang sesuai kontras

**Animasi GSAP (Dashboard):**
- `TaskCard` staggered entrance: `gsap.from('.task-card', { opacity: 0, y: 30, stagger: 0.08, duration: 0.5 })`
- Dijalankan dalam `useEffect` setelah data loaded, dengan kondisi `!isLoading && filteredTasks.length > 0`
- Kartu baru (setelah create): animasi entrance individual

---

### 6. `TaskCard` — Komponen Kartu Tugas

**Lokasi:** `src/features/tasks/TaskCard.tsx`

**Props Interface:**

```typescript
interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    createdAt: string;
  };
  isSelected: boolean;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}
```

**Anatomi Kartu:**

```
┌─────────────────────────────────┐
│ ☐  [indikator status — bulat]  │  ← header row
├─────────────────────────────────┤
│ Judul Tugas                     │  ← font-heading atau font-bold
│ Deskripsi singkat (jika ada)    │  ← text-sm text-third/70
│                                 │
│ [Tanggal dibuat]                │
├─────────────────────────────────┤
│          [✏ Edit] [🗑 Hapus]   │  ← action row
└─────────────────────────────────┘
```

**State Visual:**

| Kondisi       | Judul             | Background                | Border            |
|---------------|-------------------|---------------------------|-------------------|
| Pending       | Normal            | `bg-fourty`               | `border-third`    |
| Completed     | `line-through`    | `bg-third/40`             | `border-third/60` |
| Selected      | –                 | `bg-secondary/10`         | `border-secondary`|

**Hover Animasi GSAP:**
- `onMouseEnter`: `gsap.to(el, { scale: 1.02, duration: 0.15, ease: 'power1.out' })`
- `onMouseLeave`: `gsap.to(el, { scale: 1, duration: 0.15, ease: 'power1.out' })`
- Ref: `useRef<HTMLDivElement>(null)` diteruskan ke elemen root card

---

### 7. `TaskFormPage` — Halaman Form Tugas (Pengganti Modal)

**Lokasi:** `src/features/tasks/TaskFormPage.tsx`

**Mode Deteksi:**
```typescript
const { id } = useParams<{ id: string }>();
const isEditMode = Boolean(id);
// Route /tasks/new → isEditMode = false
// Route /tasks/:id/edit → isEditMode = true
```

**Data Pre-population (Edit Mode):**
- Ambil data task dari TanStack Query cache via `useTasks()` dan filter by `id`
- Populasi form dengan `reset({ title: task.title, description: task.description })`

**Layout:**

```
┌─────────────────────────────────────────┐
│  ← Kembali         EDIT TUGAS / BUAT   │
│                    TUGAS BARU          │
├─────────────────────────────────────────┤
│                                         │
│  Label: Judul Tugas                     │
│  [ Input: judul...                    ] │
│                                         │
│  Label: Deskripsi (Opsional)            │
│  [ Textarea: deskripsi...             ] │
│                                         │
│  [Hapus] (edit only)    [Simpan]        │
└─────────────────────────────────────────┘
```

**Mobile Layout Adjustment:**
- Tombol Simpan/Hapus sticky di bagian bawah layar pada viewport <768px
- `fixed bottom-0 left-0 right-0 p-4 bg-fourty border-t border-third`

**Navigasi:**
- "Kembali": `navigate('/dashboard')`
- Setelah Simpan berhasil: `navigate('/dashboard')`
- Setelah Hapus berhasil: `navigate('/dashboard')`

**Konfirmasi Hapus:**
- Gunakan `window.confirm()` atau custom inline confirmation state (bukan modal terpisah)

**Animasi GSAP:**
- Entrance: `gsap.from(formRef.current, { opacity: 0, y: 40, duration: 0.6, ease: 'power2.out' })`
- Heading: `gsap.from(headingRef.current, { opacity: 0, y: -20, duration: 0.5 })`

---

## Data Models

Tidak ada perubahan pada data model. Interface `Task` dipertahankan:

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
}
```

Validasi form menggunakan Zod schema yang sudah ada (dipindahkan dari `EditTaskModal` ke `TaskFormPage`):

```typescript
const taskSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter'),
  description: z.string().optional(),
});
```

---

## State Management

### Existing Stores (Tidak Berubah)

**`useAuthStore`** (Zustand + persist):
- `isAuthenticated: boolean`
- `user: { username: string } | null`
- `login(username, token)` / `logout()`

**`useTaskFilterStore`** (Zustand):
- `searchQuery: string`
- `statusFilter: 'ALL' | 'COMPLETED' | 'PENDING'`
- `setSearchQuery()` / `setStatusFilter()`

### Perubahan State Lokal di Dashboard

| State Dihapus        | Alasan                                         |
|----------------------|------------------------------------------------|
| `editingTask`        | Edit navigasi ke `TaskFormPage` via router     |
| `isEditModalOpen`    | Modal tidak ada, diganti halaman penuh         |

State `selectedIds` tetap ada di `Dashboard` karena hanya dipakai untuk bulk actions.

---

## GSAP Animation Strategy

### Instalasi

```bash
npm install gsap
```

Tambahkan ke `package.json` dependencies.

### Pattern Penggunaan

Semua animasi dijalankan dalam `useEffect` dengan cleanup untuk menghindari memory leak:

```typescript
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Pola dasar
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.from('.target', { opacity: 0, y: 30, duration: 0.6 });
  }, containerRef); // scope ke container ref

  return () => ctx.revert(); // cleanup
}, []);
```

### Animasi per Halaman

#### Login Page
```typescript
// Kolom kiri
gsap.from(leftColRef.current, { x: -50, opacity: 0, duration: 0.6, ease: 'power2.out' });
// Form kanan
gsap.from(rightColRef.current, { y: 30, opacity: 0, duration: 0.6, delay: 0.2 });
```

#### Dashboard Page (Card Entrance)
```typescript
// Staggered cards — dijalankan setelah isLoading = false
useEffect(() => {
  if (!isLoading && filteredTasks.length > 0) {
    gsap.fromTo(
      '.task-card',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.08, duration: 0.45, ease: 'power2.out' }
    );
  }
}, [isLoading]);
```

#### TaskCard Hover
```typescript
const cardRef = useRef<HTMLDivElement>(null);

const handleMouseEnter = () => {
  gsap.to(cardRef.current, { scale: 1.02, duration: 0.15, ease: 'power1.out' });
};
const handleMouseLeave = () => {
  gsap.to(cardRef.current, { scale: 1, duration: 0.15 });
};
```

#### TaskFormPage Entrance
```typescript
gsap.from(formRef.current, { opacity: 0, y: 40, duration: 0.6, ease: 'power2.out' });
```

#### Page Transition (Exit Animation)
Implementasikan di `App.tsx` atau wrapper component menggunakan `useNavigate` dan GSAP timeline:

```typescript
const animateOut = (callback: () => void) => {
  gsap.to(pageRef.current, {
    opacity: 0,
    y: -20,
    duration: 0.35,
    ease: 'power2.in',
    onComplete: callback,
  });
};
```

Trigger `animateOut` sebelum memanggil `navigate()` pada semua navigasi yang dipicu user.

---

## Routing

### `App.tsx` — Perubahan

```typescript
import { TaskFormPage } from './features/tasks/TaskFormPage';

// Di dalam Routes:
<Route element={<PrivateRoute />}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/tasks/new" element={<TaskFormPage />} />
  <Route path="/tasks/:id/edit" element={<TaskFormPage />} />
</Route>
```

Tidak ada perubahan pada `PrivateRoute`, `QueryClientProvider`, atau redirect logic.

---

## Design System Usage

Semua komponen baru menggunakan token dari `index.css` melalui kelas Tailwind yang dipetakan ke CSS variables:

| Token CSS              | Kelas Tailwind       | Penggunaan                        |
|------------------------|----------------------|-----------------------------------|
| `--color-primary`      | `bg-primary`         | Header, kolom kiri Login, button  |
| `--color-secondary`    | `text-secondary`     | Aksen, teks logo, focus ring      |
| `--color-third`        | `bg-third`           | Border default, skeleton          |
| `--color-fourty`       | `bg-fourty`          | Background halaman, kartu         |
| `--font-heading`       | `font-heading`       | h1, h2, h3 semua halaman          |
| `--font-subHeading`    | `font-subHeading`    | Body text, label, paragraf        |

**Tidak ada nilai hex hardcoded** di komponen baru. Semua warna melalui variabel CSS atau kelas Tailwind yang terdefinisi.

---

## Skeleton Loader

Saat `isLoading = true` di Dashboard, tampilkan skeleton grid alih-alih pesan teks:

```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ ░░░░░░░░░░░░ │ │ ░░░░░░░░░░░░ │ │ ░░░░░░░░░░░░ │
│ ░░░░░░░░     │ │ ░░░░░░░░     │ │ ░░░░░░░░     │
│              │ │              │ │              │
│ ░░░░  ░░░░   │ │ ░░░░  ░░░░   │ │ ░░░░  ░░░░   │
└──────────────┘ └──────────────┘ └──────────────┘
```

Implementasi menggunakan `animate-pulse` Tailwind pada div placeholder:

```tsx
// SkeletonCard
<div className="bg-third/40 rounded-xl p-5 animate-pulse">
  <div className="h-4 bg-third rounded w-3/4 mb-3" />
  <div className="h-3 bg-third rounded w-1/2 mb-6" />
  <div className="h-8 bg-third rounded" />
</div>
```

Render 6 skeleton card (2 baris × 3 kolom) saat loading.

---

## Correctness Properties

Properti-properti berikut adalah invariant yang harus dipertahankan dan dapat diverifikasi dengan property-based testing:

### Property 1: Integritas Data Task

Setiap operasi (create, update, delete, toggle, bulk) pada task harus menghasilkan state `localStorage` yang konsisten dengan apa yang ditampilkan di UI.

```
∀ operation ∈ {create, update, delete, toggle, bulkDelete, bulkComplete}:
  after(operation) → storage.getTasks() reflects UI state
```

**Validates: Requirements 3.6, 3.9, 3.10**

**Test approach:** Gunakan property-based testing dengan `fast-check` untuk generate sequence operasi acak dan verifikasi konsistensi antara `storage.getTasks()` dan state query cache TanStack Query.

### Property 2: Filter Konsistensi

Hasil `filteredTasks` harus selalu merupakan subset dari `tasks` yang memenuhi kondisi `searchQuery` DAN `statusFilter`.

```
∀ task ∈ filteredTasks:
  matchesSearch(task, searchQuery) AND matchesStatus(task, statusFilter)
```

**Validates: Requirements 3.5, 4.5**

**Test approach:** Generate array task acak, searchQuery acak, dan statusFilter acak. Verifikasi bahwa setiap elemen di `filteredTasks` memenuhi kedua kondisi filter.

### Property 3: Bulk Selection Konsistensi

`isAllSelected` hanya bernilai `true` jika `filteredTasks.length > 0` DAN setiap task dalam `filteredTasks` ada di `selectedIds`.

```
isAllSelected ⟺ (filteredTasks.length > 0 ∧ ∀ t ∈ filteredTasks: t.id ∈ selectedIds)
```

**Validates: Requirements 3.10**

**Test approach:** Generate array task dan selectedIds acak. Verifikasi bahwa computed value `isAllSelected` selalu konsisten dengan definisi formalnya.

### Property 4: Route Guard

Route `/dashboard`, `/tasks/new`, dan `/tasks/:id/edit` tidak boleh dapat diakses jika `isAuthenticated = false`.

```
¬isAuthenticated → navigate('/login') for all protected routes
```

**Validates: Requirements 1.8, 5.10**

**Test approach:** Render `PrivateRoute` dengan `isAuthenticated = false` dan verifikasi bahwa output selalu `<Navigate to="/login" />` tanpa memandang route yang diminta.

### Property 5: Form Validasi

Form submit tidak boleh memanggil mutasi API jika ada field yang gagal validasi Zod.

```
∀ submit: ¬zod.parse(data).success → ¬mutation.mutate(data)
```

**Validates: Requirements 2.4, 5.8**

**Test approach:** Generate input data yang melanggar skema (title kurang dari 3 karakter, null, dsb.) dan verifikasi bahwa `mutation.mutate` tidak dipanggil.

### Property 6: Input Component Aksesibilitas

Setiap `Input` yang memiliki `label` harus memiliki atribut `id` yang cocok dengan `htmlFor` pada `<label>`, sehingga klik label memfokuskan input.

```
label.htmlFor === input.id (when label prop is provided)
```

**Validates: Requirements 6.2, 6.1**

**Test approach:** Render `Input` dengan berbagai kombinasi prop `label` dan `id`. Verifikasi asosiasi `htmlFor`/`id` selalu terpenuhi jika label diberikan.

### Property 7: GSAP Cleanup

Setiap `gsap.context()` yang dibuat dalam `useEffect` harus di-`revert()` pada cleanup function untuk mencegah memory leak dan animasi yang berulang.

```
∀ gsap.context(ctx) created in useEffect: cleanup function calls ctx.revert()
```

**Validates: Requirements 8.1, 8.2, 8.3, 8.4**

**Test approach:** Mount dan unmount komponen berkali-kali dalam test. Verifikasi tidak ada animasi aktif yang tersisa setelah unmount menggunakan `gsap.getTweensOf()`.

---

## Error Handling

### Login — Kredensial Salah
Saat ini error ditampilkan via `alert()`. Setelah redesign, error ditampilkan sebagai pesan inline menggunakan `setError('root', ...)` dari React Hook Form:

```tsx
// Di LoginForm.tsx onSubmit:
if (data.username === 'admin' && data.password === 'password123') {
  login(data.username, 'mock-jwt-token-xyz');
} else {
  setError('root', { message: 'Kredensial salah! Gunakan admin / password123' });
}

// Di JSX:
{errors.root && (
  <p className="text-red-500 text-sm text-center mt-2">{errors.root.message}</p>
)}
```

### Login — Validasi Field Kosong
React Hook Form + Zod menangani ini secara otomatis. Error per-field ditampilkan di bawah masing-masing `Input` via prop `error` pada `Input_Component`.

### TaskFormPage — Data Tidak Ditemukan (Edit Mode)
Jika `id` dari URL params tidak ditemukan di task list (misalnya URL tidak valid), tampilkan pesan error dan berikan tombol kembali ke dashboard:

```tsx
if (isEditMode && !taskData && !isLoading) {
  return (
    <div className="...">
      <p>Tugas tidak ditemukan.</p>
      <Button onClick={() => navigate('/dashboard')}>Kembali ke Dashboard</Button>
    </div>
  );
}
```

### Dashboard — Loading & Empty State
- **Loading:** Tampilkan 6 skeleton card (`animate-pulse`) selama `isLoading = true`
- **Empty (no tasks):** Pesan "Belum ada tugas. Buat tugas pertamamu!" dengan tombol CTA ke `/tasks/new`
- **Empty (search/filter):** Pesan "Tidak ada tugas yang cocok dengan pencarianmu." dengan tombol clear search

### GSAP — Graceful Degradation
Semua animasi GSAP dibungkus dalam `try-catch` atau menggunakan `gsap.context()` yang aman. Jika GSAP gagal load, halaman tetap berfungsi normal tanpa animasi (no-animation fallback).

```typescript
useEffect(() => {
  let ctx: gsap.Context | undefined;
  try {
    ctx = gsap.context(() => { /* animations */ }, containerRef);
  } catch (e) {
    // Animasi gagal, UI tetap berfungsi
  }
  return () => ctx?.revert();
}, []);
```

---

## Testing Strategy

### Unit Tests — Reusable Components

**`Input.tsx`**
- Render dengan dan tanpa prop `label` → verifikasi keberadaan `<label>` element
- Render dengan prop `error` → verifikasi pesan error muncul dengan warna merah
- Render tanpa `error` → verifikasi tidak ada error message
- Forward ref → verifikasi ref diteruskan ke underlying `<input>`
- Aksesibilitas → verifikasi `label.htmlFor === input.id` (Property 6)

**`Button.tsx`**
- Setiap `variant` render dengan kelas CSS yang benar
- `isLoading=true` → verifikasi spinner muncul dan button disabled
- `disabled=true` → verifikasi `cursor-not-allowed` dan opacity berkurang
- `onClick` handler dipanggil dengan benar saat tidak disabled/loading

### Integration Tests — Form Flows

**Login Flow**
- Submit dengan kredensial kosong → verifikasi error validation muncul per-field (tidak alert)
- Submit dengan kredensial salah → verifikasi inline error message muncul
- Submit dengan kredensial benar → verifikasi `navigate('/dashboard')` dipanggil
- Semua menggunakan React Testing Library + mock `useAuthStore`

**TaskFormPage — Create Mode**
- Render di route `/tasks/new` → verifikasi judul "BUAT TUGAS BARU"
- Submit dengan title < 3 karakter → verifikasi error muncul, `createTask.mutate` tidak dipanggil (Property 5)
- Submit valid → verifikasi `createTask.mutate` dipanggil dan navigate ke `/dashboard`

**TaskFormPage — Edit Mode**
- Render di route `/tasks/:id/edit` → verifikasi form ter-populate dengan data task
- Klik Hapus → verifikasi konfirmasi → verifikasi `deleteTask.mutate` dipanggil
- Invalid `id` → verifikasi tampilan error "Tugas tidak ditemukan"

### Property-Based Tests

Menggunakan library `fast-check` untuk generate arbitrary inputs:

**Filter Consistency (Property 2)**
```typescript
fc.assert(fc.property(
  fc.array(taskArbitrary),
  fc.string(),
  fc.constantFrom('ALL', 'PENDING', 'COMPLETED'),
  (tasks, query, filter) => {
    const result = filterTasks(tasks, query, filter);
    return result.every(t =>
      matchesSearch(t, query) && matchesStatus(t, filter)
    );
  }
));
```

**Bulk Selection Consistency (Property 3)**
```typescript
fc.assert(fc.property(
  fc.array(taskArbitrary),
  fc.array(fc.string()),
  (tasks, selectedIds) => {
    const isAllSelected = tasks.length > 0 && tasks.every(t => selectedIds.includes(t.id));
    return computeIsAllSelected(tasks, selectedIds) === isAllSelected;
  }
));
```

### E2E Tests (Opsional)

Menggunakan Playwright untuk smoke test end-to-end:
1. Login → Dashboard → Buat Task → Verifikasi kartu muncul
2. Edit Task → Simpan → Verifikasi perubahan tersimpan
3. Hapus Task → Verifikasi kartu hilang
4. Logout → Verifikasi redirect ke `/login`

---

## Dependency Changes

### Tambah

```json
"gsap": "^3.12.x"
```

### Tidak Berubah

Semua dependency yang ada (`@hookform/resolvers`, `@tanstack/react-query`, `axios`, `lucide-react`, `react-hook-form`, `react-router-dom`, `tailwindcss`, `zod`, `zustand`) dipertahankan tanpa perubahan versi.
