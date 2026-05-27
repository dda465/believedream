"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const pathname = usePathname();

  // 초간단 세션 유지 (새로고침 방지)
  useEffect(() => {
    const auth = sessionStorage.getItem("adminAuth");
    if (auth === "true") setIsAuthenticated(true);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pin === "1234") {
      setIsAuthenticated(true);
      sessionStorage.setItem("adminAuth", "true");
      setError("");
    } else {
      setError("PIN 번호가 일치하지 않습니다.");
      setPin("");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center p-5">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-card max-w-sm w-full text-center border border-[var(--border-light)]">
          <div className="w-16 h-16 bg-[var(--accent-soft)] rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🔒</span>
          </div>
          <h1 className="text-[20px] font-black text-[var(--text-dark)] mb-2">관리자 로그인</h1>
          <p className="text-[13px] text-[var(--text-light)] mb-6">초기 PIN 번호는 1234 입니다.</p>
          
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="PIN 입력"
            className="w-full h-12 text-center tracking-[0.5em] text-[18px] font-bold bg-[var(--bg-main)] border border-[var(--border)] rounded-xl outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] transition-all mb-3"
            maxLength={6}
            autoFocus
          />
          {error && <p className="text-red-500 text-[12px] mb-4">{error}</p>}
          
          <button type="submit" className="w-full h-12 bg-gradient-to-r from-[var(--primary)] to-[#362920] text-white font-bold rounded-xl shadow-md active:scale-95 transition-transform">
            접속하기
          </button>
          
          <Link href="/" className="block mt-6 text-[13px] text-[var(--text-light)] hover:text-[var(--primary)]">
            ← 사이트 홈으로 돌아가기
          </Link>
        </form>
      </div>
    );
  }

  const navs = [
    { name: "대시보드", href: "/admin", icon: "📊" },
    { name: "상품 관리", href: "/admin/products", icon: "📦" },
    { name: "렌탈 접수내역", href: "/admin/orders", icon: "📝" },
    { name: "입점 접수내역", href: "/admin/partners", icon: "🏪" },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col md:flex-row">
      {/* Sidebar (Desktop) / Topbar (Mobile) */}
      <aside className="w-full md:w-64 bg-white border-b md:border-r border-[var(--border-light)] shadow-sm flex-shrink-0 z-10 sticky top-0 md:h-screen">
        <div className="p-5 flex items-center justify-between md:block border-b border-[var(--border-light)] md:border-0">
          <Link href="/admin" className="flex items-baseline gap-1">
            <span className="text-[22px] font-black text-[var(--primary)]">빌리</span>
            <span className="text-[22px] font-black text-[var(--accent)]">Admin</span>
          </Link>
          <button 
            onClick={() => {
              sessionStorage.removeItem("adminAuth");
              setIsAuthenticated(false);
            }}
            className="md:hidden text-[12px] px-3 py-1.5 bg-gray-100 rounded-md font-bold text-gray-600"
          >
            로그아웃
          </button>
        </div>
        
        <nav className="flex overflow-x-auto md:flex-col p-3 md:p-4 gap-2 no-scrollbar border-b md:border-0 border-[var(--border-light)]">
          {navs.map((nav) => {
            const isActive = nav.href === "/admin" ? pathname === "/admin" : pathname.startsWith(nav.href);
            return (
              <Link 
                key={nav.name} 
                href={nav.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap min-w-max md:min-w-0 ${isActive ? 'bg-[var(--primary)] text-white shadow-md' : 'text-[var(--text)] hover:bg-[var(--bg-sub)]'}`}
              >
                <span className="text-[18px]">{nav.icon}</span>
                <span className={`text-[14px] font-bold ${isActive ? 'text-white' : 'text-[var(--text-dark)]'}`}>{nav.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="hidden md:block absolute bottom-6 left-6 right-6">
          <button 
            onClick={() => {
              sessionStorage.removeItem("adminAuth");
              setIsAuthenticated(false);
            }}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors text-[13px]"
          >
            안전하게 로그아웃
          </button>
          <Link href="/" className="block mt-4 text-center text-[12px] text-gray-500 hover:text-gray-800">
            실제 웹사이트 보기 ↗
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
