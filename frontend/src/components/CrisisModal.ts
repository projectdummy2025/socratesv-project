// Render crisis emergency alert modal structure
export function getCrisisModalHTML(): string {
  return `
    <div id="crisisModal" class="hidden fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-rose-950 border border-rose-600 rounded-2xl p-5 text-center space-y-4 max-w-sm">
        <div class="w-12 h-12 rounded-full bg-rose-900 text-rose-200 flex items-center justify-center mx-auto text-xl font-extrabold">
          !
        </div>
        <h2 class="text-lg font-bold text-rose-200">Deteksi Situasi Darurat</h2>
        <p class="text-xs text-rose-300 leading-relaxed">
          Kami mendeteksi ungkapan krisis atau risiko bahaya. Sesi bimbingan suara dihentikan sementara.
        </p>
        <div class="bg-slate-900 border border-rose-800 rounded-xl p-3 text-left space-y-2 text-xs">
          <p class="font-bold text-slate-200">Layanan Bantuan 24 Jam:</p>
          <p class="text-emerald-400 font-bold">119 (Layanan Darurat Kemenkes)</p>
          <p class="text-slate-300">Kemenkes Hotline: 1500-567</p>
        </div>
        <button id="closeCrisisBtn" class="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all">
          Tutup & Mengerti
        </button>
      </div>
    </div>
  `;
}
