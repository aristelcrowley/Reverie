# REVERIE REPOSITORY

Deskripsi
--------
Proyek ini berisi sumber dan aset untuk game "Reverie" (RPG Maker). Struktur repo menyimpan
aset audio, gambar, data peta, efek, dan berkas konfigurasi proyek.

Aturan Development
------------------
- Koordinasi: Selalu koordinasikan perubahan terutama untuk map dan asset bersama agar tidak saling menimpa pekerjaan rekan.
- Cabang/Branch: Gunakan branch terpisah untuk fitur besar atau perubahan map, lalu ajukan pull request untuk digabung setelah review.
- Commit: Tulis pesan commit yang jelas dan terpisah per perubahan
Gunakan convetional commit (feat, fix, docs, perf) contoh:
`feat: add new npc in map01`

Deployment
----------
- Semua hasil build atau berkas yang disiapkan untuk rilis harus diarahkan ke folder `deploy`.
- Jangan men-deploy file ke lokasi lain, terutama di luar repository ini.

Catatan
------
- File penting proyek berada di folder `data/`, `img/`, `audio/`, dan `js/`.
- Jika ada aturan tambahan (format nama file, ukuran aset, dsb.), tambahkan dokumentasi di bawah ini.