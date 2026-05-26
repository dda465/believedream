"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/app/lib/db";

/* ═══════════════════════════════════════════════════════
   메인 v9 — 리포트 기반 전면 리디자인
   체크리스트: 배너(CTA) + 카테고리 + 상품카드 + 신뢰 + 이용방법
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
  const [activeTab, setActiveTab] = useState("중고가전");
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    getProducts().then(setProductList);
  }, []);

  return (
    <div className="w-full overflow-x-hidden">

      {/* ━━━━━━━━━━ 1. 탭 메뉴 ━━━━━━━━━━ */}
      <div className="flex w-full px-5 gap-5 border-b border-[var(--border-light)] overflow-x-auto hide-scrollbar bg-white">
        {["중고가전", "매입임대", "스토리", "이벤트", "매장안내"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`py-3 text-[13px] font-bold whitespace-nowrap relative transition-colors ${
              activeTab === tab ? "text-[var(--primary)]" : "text-[var(--text-muted)]"
            }`}>
            {tab}
            {activeTab === tab && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--primary)] rounded-full" />}
          </button>
        ))}
      </div>

      {/* ━━━━━━━━━━ 2. 히어로 배너 (이미지 + CTA) ━━━━━━━━━━ */}
      <div className="px-5 pt-4 pb-2 anim-fade-in">
        <div className="rounded-[var(--radius-xl)] overflow-hidden relative shadow-banner">
          {/* 배너 이미지 */}
          <div className="relative h-[190px] bg-gradient-to-br from-[var(--banner-from)] to-[var(--banner-to)]">
            <Image src="/hero-banner.png" alt="빌리드림 히어로 배너" fill className="object-cover opacity-60" priority />
            {/* 오버레이 그라데이션 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />
            {/* 텍스트 */}
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <p className="text-[10px] font-semibold text-white/70 mb-1 tracking-wider uppercase">부산 중고가전 렌탈 플랫폼</p>
              <h2 className="text-[20px] font-black leading-[1.25] tracking-tight mb-2.5">
                월 <span className="text-[var(--accent)]">9,900</span>원부터<br/>가전 렌탈 시작
              </h2>
              <button className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-[11px] font-bold px-4 py-2 rounded-full transition-all active:scale-95 shadow-lg">
                지금 견적 받기 →
              </button>
            </div>
            {/* 페이징 */}
            <div className="absolute top-4 right-4 flex gap-1.5">
              {[0,1,2,3].map(i => (
                <div key={i} className={`h-[3px] rounded-full transition-all ${i === 0 ? 'w-5 bg-white' : 'w-2 bg-white/40'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━ 3. 검색바 ━━━━━━━━━━ */}
      <div className="px-5 py-4">
        <div className="relative">
          <input type="text" placeholder="어떤 제품의 견적이 필요한가요?"
            style={{ paddingLeft: '44px' }}
            className="w-full h-[46px] pr-4 bg-white border border-[var(--border)] rounded-[var(--radius-md)] text-[13.5px] placeholder:text-[var(--text-lighter)] font-medium shadow-card focus:border-[var(--accent)] focus:shadow-float transition-all" />
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-lighter)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
      </div>

      {/* ━━━━━━━━━━ 4. 카테고리 그리드 (가운데 정렬) ━━━━━━━━━━ */}
      <div className="px-5 pb-7 anim-fade-in anim-delay-1">
        <div className="grid grid-cols-4 gap-y-5 gap-x-4">
          {categories.map((cat) => (
            <Link href={`/category/${cat.slug}`} key={cat.name} className="flex flex-col items-center gap-1.5 group">
              <div className="w-[50px] h-[50px] rounded-[var(--radius-lg)] bg-white border border-[var(--border-light)] shadow-card flex items-center justify-center text-[24px] group-hover:shadow-float group-hover:border-[var(--accent)] group-hover:scale-105 transition-all duration-200">
                {cat.icon}
              </div>
              <span className="text-[11px] font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors text-center leading-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <Divider />

      {/* ━━━━━━━━━━ 5. 인기 상품 리스트 (플랫 스타일 개편) ━━━━━━━━━━ */}
      <section className="px-5 py-6 anim-fade-in anim-delay-2">
        <SectionHeader title="🔥 인기 렌탈 TOP" sub="부산에서 지금 가장 인기있는 상품" link="/category/all" />
        <div className="flex flex-col mt-4">
          {productList.slice(0, 6).map((p, i) => (
            <Link href={`/product/${p.id}`} key={p.id}
              className="flex items-center gap-3.5 px-3 py-3.5 border-b border-[var(--border-light)] last:border-b-0 hover:opacity-85 transition-opacity active:scale-[0.99] group">
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
                <p className="text-[10px] text-[var(--text-light)] mt-0.5 truncate">📍 {p.district} · {p.store}</p>
              </div>
              {/* 가격 */}
              <div className="text-right flex-shrink-0 pl-2">
                <p className="text-[16px] font-black text-[var(--accent)] leading-tight">{p.price || p.price12}</p>
                <p className="text-[9px] text-[var(--text-lighter)] font-medium">원/월</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Divider />

      {/* ━━━━━━━━━━ 6. 오늘 설치 가능 (가로 스크롤 개선) ━━━━━━━━━━ */}
      <section className="py-6 anim-fade-in anim-delay-3">
        <div className="px-5">
          <SectionHeader title="⚡ 오늘 설치 가능" sub="지금 바로 배송·설치 가능한 상품" />
        </div>
        <div className="flex w-full gap-3 overflow-x-auto hide-scrollbar mt-5 pb-1">
          <div className="flex-shrink-0 w-5" />
          {productList.filter(p => p.todayInstall).map(p => (
            <Link href={`/product/${p.id}`} key={`today-${p.id}`}
              className="flex-shrink-0 w-[140px] bg-white border border-[var(--border-light)] rounded-[var(--radius-md)] overflow-hidden shadow-sm hover:shadow-card transition-all group">
              <div className="h-[95px] bg-[var(--bg-sub)] flex items-center justify-center text-[32px] relative group-hover:bg-[var(--accent-soft)] transition-colors">
                {p.emoji}
                <span className="absolute top-2 left-2 text-[8px] font-bold bg-[var(--success)] text-white px-1.5 py-0.5 rounded-full">당일설치</span>
              </div>
              <div className="p-3">
                <p className="text-[12px] font-bold text-[var(--text-dark)] line-clamp-2 leading-tight h-[34px]">{p.name}</p>
                <p className="text-[14px] font-black text-[var(--accent)] mt-1.5">월 {p.price || p.price12}원</p>
                <p className="text-[10px] text-[var(--text-light)] mt-0.5 truncate">📍 {p.district}</p>
              </div>
            </Link>
          ))}
          <div className="flex-shrink-0 w-5" />
        </div>
      </section>

      <Divider />

      {/* ━━━━━━━━━━ 7. 신뢰 요소 ━━━━━━━━━━ */}
      <section className="px-5 py-8">
        <SectionHeader title="✅ 왜 빌리드림인가요?" sub="안심하고 빌리세요" />
        <div className="grid grid-cols-2 gap-3 mt-6">
          {[
            { icon:"🛡️", title:"안심 중고", desc:"전 제품 점검 완료\n상태등급 투명 공개", bg:"var(--info-soft)", color:"var(--info)" },
            { icon:"⚡", title:"당일 설치", desc:"오늘 신청하면\n오늘 설치 완료", bg:"var(--success-soft)", color:"var(--success)" },
            { icon:"💰", title:"위약금 0원", desc:"중도해지해도\n추가 비용 없음", bg:"var(--warn-soft)", color:"var(--warn)" },
            { icon:"🔄", title:"인수 가능", desc:"쓰다가 마음에 들면\n내 것으로 인수", bg:"var(--purple-soft)", color:"var(--purple)" },
          ].map(item => (
            <div key={item.title} className="rounded-[var(--radius-lg)] p-5 text-center" style={{ backgroundColor: item.bg }}>
              <div className="text-[28px] mb-2.5">{item.icon}</div>
              <p className="text-[13.5px] font-black text-[var(--text-dark)] mb-1.5">{item.title}</p>
              <p className="text-[11px] text-[var(--text-light)] whitespace-pre-line leading-[1.5]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ━━━━━━━━━━ 8. 이용 방법 ━━━━━━━━━━ */}
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

      {/* ━━━━━━━━━━ 9. 매장 입점 CTA ━━━━━━━━━━ */}
      <section className="px-5 py-10">
        <div className="bg-gradient-to-br from-[#F8F2EB] to-[#EFE7DD] rounded-[var(--radius-xl)] p-7 border border-[#E4D9CC] relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-[10px] font-bold text-[var(--accent)] bg-[var(--accent-soft)] px-3 py-1 rounded-full">매장 사장님을 위한</span>
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

      {/* ━━━━━━━━━━ 10. 하단 정보 ━━━━━━━━━━ */}
      <footer className="bg-[var(--bg-sub)] px-5 py-10 text-[11px] text-[var(--text-light)] leading-relaxed">
        <p className="font-bold text-[var(--text)] mb-2">빌리드림 (believedream.co.kr)</p>
        <p>부산광역시 | 중고가전 렌탈 중개 플랫폼</p>
        <p className="mt-1">고객센터: 카카오톡 @빌리드림</p>
        <div className="flex gap-3 mt-3 text-[var(--text-lighter)]">
          <a href="#" className="hover:text-[var(--text)]">이용약관</a>
          <a href="#" className="hover:text-[var(--text)]">개인정보처리방침</a>
          <a href="#" className="hover:text-[var(--text)]">사업자정보</a>
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
  return <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${className}`}>{children}</span>;
}
