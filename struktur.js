// Tampilan halaman "Struktur Admin - Lorevia Entertainment" (route: struktur).

// Urutan level di bagan struktur (dari tertinggi ke terendah) — SUMBER KEBENARAN TUNGGAL,
// juga dipakai admin-dashboard.js buat validasi pas nambah/edit data.
// Tiap level berisi ARRAY jabatan — semua jabatan dalam satu level tampil SEJAJAR di bagan.
// Ini menentukan level, BUKAN urutan baris di Sheet — jadi aman ditambah data kapan saja.
const URUTAN_JABATAN_ADMIN = [
    ['Founder', 'Co-Founder'],                           // Level 1: Executive & Founder
    ['CFO'],                                              // Level 2: C-Level / Direksi
    ['Manager'],                                          // Level 3: Management / Lead
    ['Sekretaris', 'Admin'],                              // Level 4: Support & Administrasi Inti
    ['Coach Vocal', 'Coach Rap', 'Coach Dance Team'],     // Level 5: Coach
    ['PJ Medpart', 'Editor Team', 'Wording'],             // Level 6: Editor
    ['Security Team']                                     // Level 7: Staf Lapangan / Support
];

// Data struktur sekarang dari database Firestore (appData.adminStructure), diatur di Dasbor Admin → Struktur Admin.
const adminStructureLoaded = true;
async function reloadAdminStructure() {}
async function loadAdminStructure() {}

function renderView() {
    const content = document.getElementById('appContent');
    if (currentRoute !== 'toko') stopPromoBanner();
    if (currentRoute === 'struktur') {
        // Kelompokkan per level (1 = paling atas). Level diambil dari data; kalau kosong, dari urutan jabatan baku.
        const levelOf = a => {
            const n = parseInt(a.level, 10);
            if (n > 0) return n;
            const i = URUTAN_JABATAN_ADMIN.findIndex(l => l.includes(a.role));
            return i >= 0 ? i + 1 : 99;
        };
        const semuaLevel = [...new Set(appData.adminStructure.map(levelOf))]
            .sort((x, y) => x - y)
            .map(lv => appData.adminStructure.filter(a => levelOf(a) === lv));

        content.innerHTML = `
            <div class="max-w-6xl mx-auto py-8 space-y-8">
                <div class="text-center">
                    <h2 class="font-serif text-3xl md:text-4xl font-bold gold-text">Struktur Admin</h2>
                    <p class="text-gray-300 mt-2">Bagan kepengurusan inti Lorevia Entertainment, tersusun rapi dari level tertinggi hingga management.</p>
                </div>
                ${appData.adminStructure.length === 0 ? `
                    <div class="text-center py-16 bg-forest-800/40 rounded-2xl border border-forest-700">
                        <p class="text-gray-400">Belum ada data struktur admin.</p>
                    </div>
                ` : `
                <div class="flex flex-col items-center">
                    ${semuaLevel.map((nodes, levelIdx) => {
                        return `
                        <div class="flex flex-col items-center w-full">
                            ${levelIdx > 0 ? '<div class="tree-stub h-8"></div>' : ''}
                            <div class="tree-row flex flex-wrap justify-center gap-8 md:gap-10 pt-1 ${nodes.length > 1 ? 'border-t-2 border-gold-600/70 mt-1' : ''}">
                                ${nodes.map(admin => `
                                    <div class="flex flex-col items-center -mt-1">
                                        ${nodes.length > 1 ? '<div class="tree-stub h-4"></div>' : ''}
                                        <div class="admin-card rounded-2xl border-2 border-gold-600/60 p-5 relative overflow-hidden flex flex-col items-center text-center group w-44 md:w-48 transition-shadow duration-300">
                                            <div class="admin-avatar-glow w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-gold-400 overflow-hidden mb-3 group-hover:scale-105 transition duration-300">
                                                    <img src="${admin.img}" alt="${admin.name}" class="w-full h-full object-cover" onerror="this.onerror=null; this.classList.add('hidden'); this.nextElementSibling.classList.remove('hidden');">
                                                    <div class="hidden w-full h-full items-center justify-center bg-forest-700 text-gold-400 text-3xl font-bold">${(admin.name || '?').charAt(0).toUpperCase()}</div>
                                            </div>
                                            <p class="text-[11px] font-bold text-gray-300 uppercase tracking-widest">${admin.role}</p>
                                            <h3 class="font-serif text-lg font-bold gold-text leading-tight mt-0.5">${admin.name}</h3>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        `;
                    }).join('')}
                </div>
                `}
            </div>
        `;
    }
    animatePageReveal();
}