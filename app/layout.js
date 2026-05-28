"use client";

import "./globals.css";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [location, setLocation] = useState("부산진구 부전동");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("userLocation");
    if (saved) setLocation(saved);
  }, []);

  const changeLocation = (newLoc) => {
    setLocation(newLoc);
    localStorage.setItem("userLocation", newLoc);
    window.dispatchEvent(new Event("locationChanged"));
    setIsModalOpen(false);
  };

  const findMyLocation = () => {
    setIsLocating(true);
    setTimeout(() => {
      changeLocation("해운대구 우동"); // MVP GPS 목업
      setIsLocating(false);
    }, 1500);
  };

  const showBottomNav = pathname === "/" || 
                        pathname.startsWith("/category") || 
                        pathname === "/apply" || 
                        pathname === "/partner" || 
                        pathname === "/mypage";

  return (
    <html lang="ko">
      <head>
        <title>빌리드림 | 부산 중고가전 렌탈 플랫폼</title>
        <meta name="description" content="부산 중고가전 렌탈·매입·즉시설치. 월 9,900원부터 부담 없이 시작하세요. (believedream.co.kr)" />
        <link rel="stylesheet" as="style" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      </head>
      <body className="flex justify-center min-h-screen overflow-x-hidden bg-gray-50">
        {/* 모바일 앱 프레임 */}
        <div className="w-full max-w-[480px] bg-[var(--bg-main)] min-h-screen relative flex flex-col shadow-2xl overflow-x-hidden">
          
          {/* ── 헤더 ── */}
          {pathname === "/" && (
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-[var(--border-light)]">
              <div className="flex items-center justify-between h-[52px] px-5">
                <div className="flex items-center gap-3">
                  <Link href="/" className="flex items-center gap-1.5 py-1 active:scale-95 transition-transform">
                    <img src="/logo.png" alt="빌리드림 로고" className="w-8 h-8 object-contain" />
                    <div className="flex items-baseline gap-0.5 mt-0.5">
                      <span className="text-[20px] font-black tracking-tight text-[var(--primary)]">빌리</span>
                      <span className="text-[20px] font-black tracking-tight text-[var(--accent)]">드림</span>
                    </div>
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <button aria-label="검색" className="w-[44px] h-[44px] flex items-center justify-center rounded-full hover:bg-[var(--bg-sub)] active:scale-95 transition-all">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-light)" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  </button>
                  <button onClick={() => alert("알림 기능이 준비 중입니다.")} aria-label="알림" className="w-[44px] h-[44px] flex items-center justify-center rounded-full hover:bg-[var(--bg-sub)] active:scale-95 transition-all relative">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-light)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                    {/* 알림 배지 (카카오톡 느낌의 오렌지 닷) */}
                    <span className="absolute top-[10px] right-[10px] w-2 h-2 bg-[var(--accent)] rounded-full border border-white"></span>
                  </button>
                </div>
              </div>
            </header>
          )}

          {/* ── 메인 ── */}
          <main className="flex-1 pb-[80px] w-full overflow-x-hidden">
            {children}
          </main>

          {/* ── 하단 네비게이션 ── */}
          {showBottomNav && (
            <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 max-w-[480px] w-full bg-white/95 backdrop-blur-md rounded-t-2xl shadow-nav z-50 safe-bottom">
              <div className="flex items-center justify-between h-[64px] px-4">
                <NavItem href="/" icon={<IconHome />} label="홈" active={pathname === "/"} />
                <NavItem href="/category/all" icon={<IconGrid />} label="카테고리" active={pathname.startsWith("/category")} />
                <NavItem href="/apply" icon={<IconDoc />} label="렌탈신청" active={pathname.startsWith("/apply")} />
                <NavItem href="/partner" icon={<IconStore />} label="입점신청" active={pathname.startsWith("/partner")} />
                <NavItem href="/mypage" icon={<IconUser />} label="마이" active={pathname.startsWith("/mypage")} />
              </div>
            </nav>
          )}

          {/* ── 동네 설정 바텀 시트 (모달) ── */}
          {isModalOpen && (
            <>
              {/* 배경 딤 처리 */}
              <div 
                className="absolute inset-0 bg-black/50 z-[60]" 
                onClick={() => setIsModalOpen(false)} 
              />
              {/* 시트 콘텐츠 */}
              <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[70] flex flex-col p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] pb-10 transform transition-transform duration-300">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-5" />
                <h3 className="text-[20px] font-black text-[var(--text-dark)] mb-1">어느 동네에서 찾을까요?</h3>
                <p className="text-[13px] text-[var(--text-light)] mb-6">동네를 설정하고 내 근처 당일 설치 매장을 만나보세요.</p>
                
                <button 
                  onClick={findMyLocation}
                  disabled={isLocating}
                  className="w-full flex items-center justify-center gap-2 bg-[var(--primary)] text-white font-bold py-4 rounded-xl shadow-md active:scale-95 transition-transform mb-6 disabled:opacity-70"
                >
                  {isLocating ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
                      현재 위치로 찾기
                    </>
                  )}
                </button>
                
                <div className="mb-2">
                  <p className="text-[13px] font-bold text-[var(--text-light)] mb-3">부산 인기 지역</p>
                  <div className="flex flex-wrap gap-2">
                    {["부산진구 부전동", "부산진구 전포동", "해운대구 우동", "수영구 광안동", "동래구 온천동"].map(loc => (
                      <button 
                        key={loc}
                        onClick={() => changeLocation(loc)}
                        className={`px-4 py-2.5 rounded-full text-[13px] font-bold transition-all ${
                          location === loc ? 'bg-[var(--accent)] text-white shadow-md' : 'bg-[#F8F9FA] text-[var(--text-dark)] border border-[var(--border)] hover:border-[var(--accent)]'
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </body>
    </html>
  );
}

function NavItem({ href, icon, label, active }) {
  return (
    <Link href={href} className={`flex flex-col items-center justify-center gap-1 flex-1 h-full min-h-[44px] active:scale-95 transition-all duration-200 ${active ? '' : 'opacity-60 hover:opacity-80'}`}>
      <div className={`w-6 h-6 flex items-center justify-center ${active ? 'text-[var(--primary)]' : 'text-[var(--text)]'}`}>{icon}</div>
      <span className={`text-[11px] font-bold ${active ? 'text-[var(--primary)]' : 'text-[var(--text)]'}`}>{label}</span>
    </Link>
  );
}

/* ── 아이콘 SVG 컴포넌트 ── */
function IconHome() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l9 8v10a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1V11l9-8z"/></svg>;
}
function IconGrid() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>;
}
function IconDoc() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H14a1 1 0 01-1-1V3.5zM8 13h8v1.5H8V13zm0 3.5h8V18H8v-1.5z"/></svg>;
}
function IconStore() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4v2l1 3v1a3 3 0 005 2.24 3 3 0 004 0A3 3 0 0019 10V9l1-3V4zM5 14.03V20h14v-5.97a4.96 4.96 0 01-2 .47 4.97 4.97 0 01-3-1.01 4.97 4.97 0 01-4 .54 4.96 4.96 0 01-3 .5A4.96 4.96 0 015 14.03z"/></svg>;
}
function IconUser() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 10-16 0h16z"/></svg>;
}
