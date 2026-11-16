// Perlindungan konten: tidak bisa zoom, teks tidak bisa diseleksi (tidak muncul Google Lens saat ditekan lama),
// gambar tidak bisa disimpan/diunduh lewat menu klik-kanan atau tekan lama, video/audio tanpa tombol unduh.
// Catatan: ini menghalangi cara-cara biasa; screenshot atau alat pengembang browser tidak bisa dicegah dari sisi web.
(function () {
    var isAdminPage = window.PAGE_ROUTE === 'admin-dashboard';
    var root = document.documentElement;
    if (!isAdminPage) root.classList.add('protect-content');

    function isField(el) {
        return el && el.closest && el.closest('input, textarea, select, [contenteditable="true"]');
    }

    // --- Zoom ---
    ['gesturestart', 'gesturechange', 'gestureend'].forEach(function (ev) {
        document.addEventListener(ev, function (e) { e.preventDefault(); }, { passive: false });
    });
    document.addEventListener('touchmove', function (e) {
        if (e.touches && e.touches.length > 1) e.preventDefault();
    }, { passive: false });
    document.addEventListener('wheel', function (e) {
        if (e.ctrlKey) e.preventDefault();
    }, { passive: false });
    document.addEventListener('keydown', function (e) {
        var k = e.key;
        if ((e.ctrlKey || e.metaKey) && (k === '+' || k === '=' || k === '-' || k === '_' || k === '0')) e.preventDefault();
        if (!isAdminPage && (e.ctrlKey || e.metaKey) && (k === 's' || k === 'S' || k === 'u' || k === 'U' || k === 'p' || k === 'P')) e.preventDefault();
    });
    if (isAdminPage) return;

    // --- Seleksi, menu klik-kanan / tekan lama, seret gambar ---
    document.addEventListener('contextmenu', function (e) { if (!isField(e.target)) e.preventDefault(); });
    document.addEventListener('selectstart', function (e) { if (!isField(e.target)) e.preventDefault(); });
    document.addEventListener('dragstart', function (e) { e.preventDefault(); });
    document.addEventListener('copy', function (e) { if (!isField(document.activeElement)) e.preventDefault(); });

    // --- Gambar & media ---
    function lock(node) {
        if (!node || node.nodeType !== 1) return;
        var list = node.matches && node.matches('img, video, audio') ? [node] : [];
        if (node.querySelectorAll) list = list.concat(Array.prototype.slice.call(node.querySelectorAll('img, video, audio')));
        list.forEach(function (el) {
            if (el.tagName === 'IMG') { el.setAttribute('draggable', 'false'); }
            else {
                el.setAttribute('controlsList', 'nodownload noplaybackrate');
                el.setAttribute('disablePictureInPicture', '');
                el.setAttribute('disableRemotePlayback', '');
            }
        });
    }
    lock(document.documentElement);
    new MutationObserver(function (list) {
        list.forEach(function (r) { r.addedNodes.forEach(lock); });
    }).observe(document.documentElement, { childList: true, subtree: true });
})();
