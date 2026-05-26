import "./globals.css";

export const metadata = {
  title: "빌리드림 | 부산 중고가전 렌탈 플랫폼",
  description: "부산 중고가전 렌탈·매입·즉시설치. 월 9,900원부터 부담 없이 시작하세요. (believedream.co.kr)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" as="style" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, viewport-fit=cover" />
      </head>
      <body className="flex justify-center min-h-screen overflow-x-hidden">
        {/* 모바일 앱 프레임 */}
        <div className="w-full max-w-[480px] bg-[var(--bg-main)] min-h-screen relative flex flex-col shadow-2xl overflow-x-hidden">
          
          {/* ── 헤더 ── */}
          <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[var(--border-light)]">
            <div className="flex items-center justify-between h-[52px] px-5">
              <a href="/" className="flex items-baseline gap-0.5">
                <span className="text-[20px] font-black tracking-tight text-[var(--primary)]">빌리</span>
                <span className="text-[20px] font-black tracking-tight text-[var(--accent)]">드림</span>
              </a>
              <div className="flex items-center gap-3">
                <button aria-label="검색" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--bg-sub)] transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-light)" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </button>
                <button aria-label="알림" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--bg-sub)] transition-colors relative">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--accent)] rounded-full"></span>
                </button>
              </div>
            </div>
          </header>

          {/* ── 메인 ── */}
          <main className="flex-1 pb-[80px] w-full overflow-x-hidden">
            {children}
          </main>

          {/* ── 하단 네비게이션 ── */}
          <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 max-w-[480px] w-full bg-white border-t border-[var(--border-light)] shadow-nav z-50 safe-bottom">
            <div className="flex items-center justify-between h-[64px] px-4">
              <NavItem href="/" icon={<IconHome />} label="홈" active />
              <NavItem href="/category/all" icon={<IconGrid />} label="카테고리" />
              <NavItem href="/apply" icon={<IconDoc />} label="렌탈신청" />
              <NavItem href="/partner" icon={<IconStore />} label="입점신청" />
              <NavItem href="#" icon={<IconUser />} label="마이" />
            </div>
          </nav>
        </div>
      </body>
    </html>
  );
}

function NavItem({ href, icon, label, active }) {
  return (
    <a href={href} className={`flex flex-col items-center gap-1 flex-1 max-w-[64px] py-1 ${active ? '' : 'opacity-40 hover:opacity-70'} transition-opacity`}>
      <div className={`w-6 h-6 ${active ? 'text-[var(--primary)]' : 'text-[var(--text)]'}`}>{icon}</div>
      <span className={`text-[10px] font-bold ${active ? 'text-[var(--primary)]' : 'text-[var(--text)]'}`}>{label}</span>
    </a>
  );
}

/* ── 아이콘 SVG 컴포넌트 ── */
function IconHome() {
  return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l9 8v10a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1V11l9-8z"/></svg>;
}
function IconGrid() {
  return <svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>;
}
function IconDoc() {
  return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H14a1 1 0 01-1-1V3.5zM8 13h8v1.5H8V13zm0 3.5h8V18H8v-1.5z"/></svg>;
}
function IconStore() {
  return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4v2l1 3v1a3 3 0 005 2.24 3 3 0 004 0A3 3 0 0019 10V9l1-3V4zM5 14.03V20h14v-5.97a4.96 4.96 0 01-2 .47 4.97 4.97 0 01-3-1.01 4.97 4.97 0 01-4 .54 4.96 4.96 0 01-3 .5A4.96 4.96 0 015 14.03z"/></svg>;
}
function IconUser() {
  return <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 10-16 0h16z"/></svg>;
}
