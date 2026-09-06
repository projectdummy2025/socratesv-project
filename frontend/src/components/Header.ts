// Sleek Minimalist Header with Plus Jakarta Sans font
export function getHeaderHTML(userEmail?: string): string {
  return `
    <header class="flex items-center justify-between py-3 mb-2 border-b border-[#e6dfd8]/60 z-20 relative font-sans">
      <div class="flex items-center space-x-3">
        <div>
          <h1 class="text-lg md:text-xl font-bold tracking-tight text-[#141413]">Socrates Voice</h1>
          <p class="text-[11px] text-[#6c6a64] font-medium tracking-tight">${userEmail || 'Pengguna CBT'}</p>
        </div>
      </div>

      <div class="flex items-center space-x-2">
        <span id="connectionBadge" class="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-[#efe9de] text-[#141413] border border-[#e6dfd8] shadow-sm">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
          Ready
        </span>
      </div>
    </header>
  `;
}
