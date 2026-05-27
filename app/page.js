"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getProducts } from "@/app/lib/db";

/* ═══════════════════════════════════════════════════════
   메인 v11 — Premium UI Remodeling 적용
   ═══════════════════════════════════════════════════════ */

const categories = [
  { icon: "💧", name: "제습기", slug: "dehumidifier" },
  { icon: "🌿", name: "공기청정기", slug: "air-purifier" },
  { icon: "👕", name: "건조기", slug: "dryer" },
  { icon: "🗑️", name: "음식물처리기", slug: "food-processor" },
  { icon: "🤖", name: "로봇청소기", slug: "robot-cleaner" },
  { icon: "💦", name: "정수기", slug: "water-purifier" },
  { icon: "🧺", name: "세탁기", slug: "washer" },
  { icon: "➕", name: "전체보기", slug: "all" },
];

const condStyle = { "S급": "bg-emerald-50 text-emerald-700", "A급": "bg-sky-50 text-sky-700", "B급": "bg-amber-50 text-amber-700" };

export default function Home() {
  const router = useRouter();
  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userDistrict, setUserDistrict] = useState("");
  const [rentalMode, setRentalMode] = useState("direct"); // "direct" | "brokerage"

  useEffect(() => {
    getProducts()
      .then(setProductList)
      .finally(() => setIsLoading(false));

    const updateDistrict = () => {
      const saved = localStorage.getItem("userLocation");
      if (saved) {
        setUserDistrict(saved.split(" ")[0]);
      }
    };
    updateDistrict(); // 초기 로드 시

    window.addEventListener("locationChanged", updateDistrict);
    return () => window.removeEventListener("locationChanged", updateDistrict);
  }, []);

  // 렌탈 방식(직영/중개)에 따라 1차 필터링 후, 유저의 '구'에 해당하는 상품을 상단 정렬
  const displayProducts = [...productList]
    .filter(p => rentalMode === "direct" ? p.store === "빌리드림 직영" : p.store !== "빌리드림 직영")
    .sort((a, b) => {
      if (a.district === userDistrict && b.district !== userDistrict) return -1;
      if (b.district === userDistrict && a.district !== userDistrict) return 1;
      return 0;
    });

  const handleSearch = () => {
    const q = searchQuery.trim();
    if (q) {
      router.push(`/category/all?q=${encodeURIComponent(q)}`);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="w-full overflow-x-hidden pb-[80px]">

      {/* ━━━━━━━━━━ 1. 히어로 배너 (이미지 + CTA) ━━━━━━━━━━ */}
      <div className="px-5 pt-4 pb-2 anim-fade-in">
        <div className="rounded-[var(--radius-xl)] overflow-hidden relative shadow-banner">
          {/* 배너 이미지 */}
          <div className="relative h-[190px] bg-gradient-to-br from-[var(--banner-from)] via-[var(--banner-via)] to-[var(--banner-to)]">
            <Image src="/hero-banner.png" alt="빌리드림 히어로 배너" fill className="object-cover opacity-60" priority />
            {/* 오버레이 그라데이션 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />
            {/* 텍스트 */}
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <p className="text-[11px] font-semibold text-white/70 mb-1 tracking-wider uppercase">부산 중고가전 렌탈 플랫폼</p>
              <h2 className="text-[20px] font-black leading-[1.25] tracking-tight mb-2.5">
                월 <span className="text-[var(--accent)]">3,900</span>원부터<br/>가전 렌탈 시작
              </h2>
              <Link href="/apply" className="inline-block bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-[13px] font-bold px-5 py-2.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-glow">
                지금 견적 받기 →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━ 1.5 렌탈 방식 탭 (토글) ━━━━━━━━━━ */}
      <div className="px-5 mt-4 mb-2">
        <div className="flex bg-[#F1F3F5] p-1 rounded-xl shadow-inner relative">
          <button 
            onClick={() => setRentalMode("direct")}
            className={`flex-1 py-3 text-[14px] font-bold rounded-lg transition-all z-10 ${rentalMode === 'direct' ? 'text-[var(--primary)]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            빌리드림 직영 렌탈
          </button>
          <button 
            onClick={() => setRentalMode("brokerage")}
            className={`flex-1 py-3 text-[14px] font-bold rounded-lg transition-all z-10 ${rentalMode === 'brokerage' ? 'text-[var(--primary)]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            동네 매장 직접 렌탈
          </button>
          {/* 부드럽게 움직이는 배경 Indicator */}
          <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-transform duration-300 ease-out ${rentalMode === 'direct' ? 'translate-x-0' : 'translate-x-[calc(100%+8px)]'}`} />
        </div>
      </div>

      {/* ━━━━━━━━━━ 2. 검색바 ━━━━━━━━━━ */}
      <div className="px-5 py-4">
        <div className="relative">
          <input type="text" placeholder="어떤 제품의 견적이 필요한가요?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            style={{ paddingLeft: '44px' }}
            className="w-full h-[46px] pr-4 bg-white rounded-[var(--radius-lg)] text-[13.5px] placeholder:text-[var(--text-lighter)] font-medium shadow-card focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:shadow-float transition-all border-none" />
          <button onClick={handleSearch} className="absolute left-0 top-0 h-full w-[44px] flex items-center justify-center text-[var(--text-lighter)] hover:text-[var(--accent)] transition-colors" aria-label="검색">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
        </div>
      </div>

      {/* ━━━━━━━━━━ 3. 카테고리 그리드 (가운데 정렬) ━━━━━━━━━━ */}
      <div className="px-5 pb-7 anim-fade-in anim-delay-1">
        <div className="grid grid-cols-4 gap-y-5 gap-x-4">
          {categories.map((cat) => (
            <Link href={`/category/${cat.slug}`} key={cat.name} className="flex flex-col items-center gap-1.5 group">
              <div className="w-[50px] h-[50px] rounded-[var(--radius-lg)] bg-white shadow-card flex items-center justify-center text-[24px] group-hover:shadow-float group-hover:scale-105 transition-all duration-200">
                {cat.icon}
              </div>
              <span className="text-[11px] font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors text-center leading-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <Divider />

      {/* ━━━━━━━━━━ 4. 인기 상품 리스트 (플랫 스타일 개편) ━━━━━━━━━━ */}
      <section className="px-5 py-6 anim-fade-in anim-delay-2">
        <SectionHeader title="🔥 인기 렌탈 TOP" sub="부산에서 지금 가장 인기있는 상품" link="/category/all" />
        {isLoading ? (
          <div className="flex flex-col mt-4 gap-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="flex items-center gap-3.5 px-4 py-3.5 bg-white shadow-card rounded-[var(--radius-lg)]">
                <div className="w-5 h-5 skeleton rounded" />
                <div className="w-[48px] h-[48px] skeleton rounded-[var(--radius-sm)]" />
                <div className="flex-1">
                  <div className="h-4 w-3/4 skeleton mb-2" />
                  <div className="h-3 w-1/2 skeleton" />
                </div>
                <div className="w-16 h-6 skeleton" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col mt-4 gap-3">
            {displayProducts.slice(0, 6).map((p, i) => (
              <Link href={`/product/${p.id}`} key={p.id}
                className="flex items-center gap-3.5 px-4 py-3.5 bg-white shadow-card rounded-[var(--radius-lg)] hover:shadow-float transition-all active:scale-[0.99] group">
                {/* 랭킹 */}
                <span className={`text-[15px] font-black w-5 text-center flex-shrink-0 ${i < 3 ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>{i+1}</span>
                {/* 이모지 */}
                <div className="w-[48px] h-[48px] bg-[var(--bg-sub)] rounded-[var(--radius-sm)] flex items-center justify-center text-[22px] flex-shrink-0 group-hover:bg-[var(--accent-soft)] transition-colors">
                  {p.emoji}
                </div>
                {/* 정보 */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-[var(--text-dark)] truncate">{p.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Badge className={condStyle[p.condition]}>{p.condition}</Badge>
                    {p.todayInstall && <Badge className="bg-[var(--success-soft)] text-[var(--success)]">⚡당일설치</Badge>}
                  </div>
                  <p className="text-[11px] text-[var(--text-light)] mt-0.5 truncate">📍 {p.district} · {p.store}</p>
                </div>
                {/* 가격 */}
                <div className="text-right flex-shrink-0 pl-2">
                  <p className="text-[16px] font-black text-[var(--accent)] leading-tight">{rentalMode === 'direct' ? p.price3 || p.price12 : p.price12}</p>
                  <p className="text-[11px] text-[var(--text-lighter)] font-medium">원/월</p>
                </div>
              </Link>
            ))}
            {displayProducts.length === 0 && (
              <div className="text-center py-10 text-[var(--text-light)] text-[13px]">
                해당 방식의 상품이 없습니다.
              </div>
            )}
          </div>
        )}
      </section>

      <Divider />

      {/* ━━━━━━━━━━ 5. 오늘 설치 가능 (가로 스크롤 개선) ━━━━━━━━━━ */}
      <section className="py-6 anim-fade-in anim-delay-3">
        <div className="px-5">
          <SectionHeader title="⚡ 오늘 설치 가능" sub="지금 바로 배송·설치 가능한 상품" />
        </div>
        {isLoading ? (
          <div className="flex w-full gap-3 overflow-x-auto hide-scrollbar mt-5 pb-4">
            <div className="flex-shrink-0 w-5" />
            {[1,2,3].map(i => (
              <div key={i} className="flex-shrink-0 w-[140px] bg-white shadow-card rounded-[var(--radius-lg)] overflow-hidden">
                <div className="h-[95px] skeleton" />
                <div className="p-3">
                  <div className="h-4 w-3/4 skeleton mb-2" />
                  <div className="h-5 w-1/2 skeleton mb-1" />
                  <div className="h-3 w-2/3 skeleton" />
                </div>
              </div>
            ))}
            <div className="flex-shrink-0 w-5" />
          </div>
        ) : (
          <div className="flex w-full gap-3 overflow-x-auto hide-scrollbar mt-5 pb-4">
            <div className="flex-shrink-0 w-5" />
            {displayProducts.filter(p => p.todayInstall).map(p => (
              <Link href={`/product/${p.id}`} key={`today-${p.id}`}
                className="flex-shrink-0 w-[140px] bg-white shadow-card rounded-[var(--radius-lg)] overflow-hidden hover:shadow-float transition-all group">
                <div className="h-[95px] bg-[var(--bg-sub)] flex items-center justify-center text-[32px] relative group-hover:bg-[var(--accent-soft)] transition-colors">
                  {p.emoji}
                  <span className="absolute top-2 left-2 text-[10px] font-bold bg-[var(--success)] text-white px-1.5 py-0.5 rounded-full">당일설치</span>
                </div>
                <div className="p-3">
                  <p className="text-[12px] font-bold text-[var(--text-dark)] line-clamp-2 leading-tight h-[34px]">{p.name}</p>
                  <p className="text-[14px] font-black text-[var(--accent)] mt-1.5">월 {rentalMode === 'direct' ? p.price3 || p.price12 : p.price12}원</p>
                  <p className="text-[11px] text-[var(--text-light)] mt-0.5 truncate">📍 {p.district}</p>
                </div>
              </Link>
            ))}
            {displayProducts.filter(p => p.todayInstall).length === 0 && (
              <div className="flex items-center justify-center w-full py-10 text-[13px] text-[var(--text-light)]">
                오늘 설치 가능한 상품이 없습니다.
              </div>
            )}
            <div className="flex-shrink-0 w-5" />
          </div>
        )}
      </section>

      <Divider />

      {/* ━━━━━━━━━━ 6. 신뢰 요소 ━━━━━━━━━━ */}
      <section className="px-5 py-8">
        <SectionHeader title="✅ 왜 빌리드림인가요?" sub="안심하고 빌리세요" />
        <div className="grid grid-cols-2 gap-3 mt-6">
          {[
            { icon:"🛡️", title:"안심 중고", desc:"전 제품 점검 완료\n상태등급 투명 공개", bg:"var(--info-soft)" },
            { icon:"⚡", title:"당일 설치", desc:"오늘 신청하면\n오늘 설치 완료", bg:"var(--success-soft)" },
            { icon:"💰", title:"위약금 0원", desc:"중도해지해도\n추가 비용 없음", bg:"var(--warn-soft)" },
            { icon:"🔄", title:"인수 가능", desc:"쓰다가 마음에 들면\n내 것으로 인수", bg:"var(--purple-soft)" },
          ].map(item => (
            <div key={item.title} className="rounded-[var(--radius-lg)] p-5 text-center border-none" style={{ backgroundColor: item.bg }}>
              <div className="text-[28px] mb-2.5 w-[48px] h-[48px] rounded-full flex items-center justify-center mx-auto bg-white/60 shadow-sm">{item.icon}</div>
              <p className="text-[13.5px] font-black text-[var(--text-dark)] mb-1.5">{item.title}</p>
              <p className="text-[11px] text-[var(--text-light)] whitespace-pre-line leading-[1.5]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ━━━━━━━━━━ 7. 이용 방법 ━━━━━━━━━━ */}
      <section className="px-5 py-8">
        <SectionHeader title="📋 이용 방법" sub="3단계로 간편하게" />
        <div className="mt-7 flex flex-col gap-1.5">
          {[
            { n:"01", icon:"🔍", t:"원하는 가전 검색", d:"카테고리에서 필요한 가전을 찾아보세요" },
            { n:"02", icon:"📊", t:"견적 비교 · 매장 선택", d:"여러 매장의 가격과 조건을 한눈에 비교" },
            { n:"03", icon:"🚛", t:"당일 배송 · 설치 완료", d:"전문 기사가 당일 방문 설치까지 완료" },
          ].map((s, i) => (
            <div key={s.n} className="flex items-start gap-4 relative">
              {i < 2 && <div className="absolute left-[18px] top-[40px] w-[2px] h-[calc(100%-25px)] bg-[var(--border)]" />}
              <div className="w-[38px] h-[38px] rounded-full bg-[var(--accent)] text-white text-[12px] font-black flex items-center justify-center flex-shrink-0 relative z-10 shadow-sm">{s.n}</div>
              <div className="flex-1 pb-7">
                <p className="text-[15px] font-bold text-[var(--text-dark)]">{s.icon} {s.t}</p>
                <p className="text-[12.5px] text-[var(--text-light)] mt-1 leading-relaxed">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ━━━━━━━━━━ 8. 매장 입점 CTA ━━━━━━━━━━ */}
      <section className="px-5 py-10">
        <div className="bg-gradient-to-br from-[#F8F2EB] to-[#EFE7DD] rounded-[var(--radius-xl)] p-7 border border-[#E4D9CC] relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-[11px] font-bold text-[var(--accent)] bg-[var(--accent-soft)] px-3 py-1 rounded-full">매장 사장님을 위한</span>
            <h3 className="text-[18px] font-black text-[var(--primary)] leading-tight mt-4 mb-3">
              안 팔리는 재고,<br/>저희가 렌탈로 돌려드립니다
            </h3>
            <p className="text-[12px] text-[var(--text-light)] mb-4 leading-relaxed">
              입점 무료 · 상품 등록 대행 · 부산 전역 방문 매입
            </p>
            <Link href="/partner" className="inline-flex items-center text-[12px] font-bold bg-white text-[var(--primary)] px-4 py-2.5 rounded-full shadow-card hover:shadow-float transition-all active:scale-95">
              무료 입점 신청 →
            </Link>
          </div>
          <div className="absolute -right-4 -bottom-4 text-[90px] opacity-30 transform rotate-[-10deg]">📦</div>
        </div>
      </section>

      {/* ━━━━━━━━━━ 9. 하단 정보 ━━━━━━━━━━ */}
      <footer className="bg-[var(--bg-sub)] px-5 py-10 text-[11px] text-[var(--text-light)] leading-relaxed">
        <p className="font-bold text-[var(--text)] mb-2">빌리드림 (believedream.co.kr)</p>
        <p>부산광역시 | 중고가전 렌탈 중개 플랫폼</p>
        <p className="mt-1">고객센터: 카카오톡 @빌리드림</p>
        <div className="flex gap-3 mt-3 text-[var(--text-lighter)]">
          <span>이용약관</span>
          <span>개인정보처리방침</span>
          <span>사업자정보</span>
        </div>
        <p className="mt-3 text-[var(--text-lighter)]">© 2026 빌리드림. All rights reserved.</p>
      </footer>

    </div>
  );
}

/* ── 공통 컴포넌트 ── */
function Divider() {
  return <div className="h-2.5 bg-[var(--bg-sub)]" />;
}

function SectionHeader({ title, sub, link }) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <h2 className="text-[17px] font-black text-[var(--text-dark)]">{title}</h2>
        {sub && <p className="text-[11px] text-[var(--text-light)] mt-0.5">{sub}</p>}
      </div>
      {link && <Link href={link} className="text-[11px] font-bold text-[var(--accent)]">전체보기 →</Link>}
    </div>
  );
}

function Badge({ children, className }) {
  return <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${className}`}>{children}</span>;
}
