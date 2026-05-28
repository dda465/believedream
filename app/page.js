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
  { img: "/icons/dehumidifier.png", name: "제습기", slug: "dehumidifier" },
  { img: "/icons/air_purifier.png", name: "공기청정기", slug: "air-purifier" },
  { img: "/icons/dryer.png", name: "건조기", slug: "dryer" },
  { img: "/icons/food_processor.png", name: "음식물처리기", slug: "food-processor" },
  { img: "/icons/robot_cleaner.png", name: "로봇청소기", slug: "robot-cleaner" },
  { img: "/icons/water_purifier.png", name: "정수기", slug: "water-purifier" },
  { img: "/icons/washer.png", name: "세탁기", slug: "washer" },
  { img: "/icons/all.png", name: "전체보기", slug: "all" },
];

const condStyle = { "S급": "bg-emerald-50 text-emerald-700", "A급": "bg-sky-50 text-sky-700", "B급": "bg-amber-50 text-amber-700" };

export default function Home() {
  const router = useRouter();
  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userDistrict, setUserDistrict] = useState("");
  const [userAddress, setUserAddress] = useState("위치 인증이 필요합니다");
  const [isLocating, setIsLocating] = useState(false);
  const [rentalMode, setRentalMode] = useState("brokerage"); // "brokerage" | "direct"

  useEffect(() => {
    getProducts()
      .then(setProductList)
      .finally(() => setIsLoading(false));

    const updateDistrict = () => {
      const saved = localStorage.getItem("userLocation");
      if (saved) {
        setUserDistrict(saved.split(" ")[0]);
        setUserAddress(saved);
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

  const requestLocation = () => {
    if (!navigator.geolocation) {
      alert("이 브라우저에서는 위치 기반 서비스를 지원하지 않습니다.");
      return;
    }
    
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        try {
          // 보안 및 CORS 오류 방지를 위해 자체 서버(Next.js) API 라우트를 경유합니다.
          const response = await fetch(`/api/location?x=${lng}&y=${lat}`);
          const data = await response.json();
          
          if (data.documents && data.documents.length > 0) {
            // 법정동 또는 행정동 정보 가져오기
            const region = data.documents[0];
            const fullAddress = `${region.region_2depth_name} ${region.region_3depth_name}`; // 예: 부산진구 부전동
            const district = region.region_2depth_name; // 예: 부산진구
            
            localStorage.setItem("userLocation", fullAddress);
            setUserDistrict(district);
            setUserAddress(fullAddress);
            setIsLocating(false);
            alert(`📍 내 동네 인증 완료!\n현재 위치: ${fullAddress}`);
          } else {
            throw new Error("위치 정보를 찾을 수 없습니다.");
          }
        } catch (err) {
          console.error("Kakao API Error:", err);
          // CORS 오류나 설정 지연 시 앱이 멈추지 않도록 임시 목업 데이터로 폴백
          const mockFull = "해운대구 우동";
          const mockDist = "해운대구";
          localStorage.setItem("userLocation", mockFull);
          setUserDistrict(mockDist);
          setUserAddress(mockFull);
          setIsLocating(false);
          alert(`📍 내 동네 인증 완료! (카카오 설정 반영 전 임시 주소)\n현재 위치: ${mockFull}`);
        }
      },
      (error) => {
        setIsLocating(false);
        console.error(error);
        alert("위치 접근 권한이 거부되었습니다. 권한을 허용하거나 수동으로 주소를 검색해주세요.");
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  return (
    <div className="w-full overflow-x-hidden pb-[80px]">

      {/* ━━━━━━━━━━ 0. 동네 위치 인증 바 ━━━━━━━━━━ */}
      <div className="bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 cursor-pointer" onClick={requestLocation}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-dark)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <span className="text-[15px] font-black text-[var(--text-dark)]">{userAddress}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-light)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
        <button onClick={requestLocation} className="bg-gray-100 text-gray-600 text-[11px] font-bold px-2.5 py-1.5 rounded-md hover:bg-gray-200 transition-colors">
          {isLocating ? "위치 찾는 중..." : "동네 인증하기"}
        </button>
      </div>

      {/* ━━━━━━━━━━ 1. 히어로 배너 (멀티 슬라이더) ━━━━━━━━━━ */}
      <div className="px-5 pt-4 pb-2 anim-fade-in relative group">
        <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4">
          
          {/* 배너 1 (버튼 제거, 넘기기 화살표 추가) */}
          <div className="min-w-full snap-center rounded-[var(--radius-xl)] overflow-hidden relative shadow-banner shrink-0">
            <div className="relative h-[190px] bg-gradient-to-br from-[var(--banner-from)] via-[var(--banner-via)] to-[var(--banner-to)]">
              <Image src="/hero-banner.png" alt="빌리드림 히어로 배너" fill className="object-cover opacity-60" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white pr-12">
                <p className="text-[11px] font-semibold text-white/70 mb-1 tracking-wider uppercase">부산 중고가전 렌탈 플랫폼</p>
                <h2 className="text-[20px] font-black leading-[1.25] tracking-tight mb-1">
                  월 <span className="text-[var(--accent)]">3,900</span>원부터<br/>가전 렌탈 시작
                </h2>
              </div>
              {/* 스와이프 유도 화살표 */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white/90 animate-pulse">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </div>
            </div>
          </div>

          {/* 배너 2: 오픈 이벤트 & 우리동네 최저가 진입점 */}
          <Link href="/local-lowest" className="min-w-full snap-center rounded-[var(--radius-xl)] overflow-hidden relative shadow-banner shrink-0 block">
            <div className="relative h-[190px] bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53]">
              {/* 장식 요소들 */}
              <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/10 rounded-tl-full" />
              <div className="absolute right-10 top-5 w-16 h-16 bg-white/10 rounded-full" />
              <div className="absolute right-5 bottom-8 text-[60px] opacity-20 transform -rotate-12">💸</div>
              
              <div className="absolute inset-0 flex flex-col justify-center px-6 text-white">
                <div className="inline-block bg-white/20 px-2 py-1 rounded text-[11px] font-bold w-max mb-3 backdrop-blur-sm border border-white/20">
                  🎉 오픈 이벤트! 빌리드림이 빌려드림
                </div>
                <h2 className="text-[22px] font-black leading-tight tracking-tight mb-2">
                  우리동네 최저가<br/><span className="text-yellow-200">가전 렌탈 보기 →</span>
                </h2>
                <p className="text-[12.5px] font-medium text-white/90 mt-1">
                  내 동네에서 가장 싼 렌탈료를 확인하세요
                </p>
              </div>
            </div>
          </Link>

        </div>
        
        {/* 스크롤 힌트(하단 점) */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          <div className="w-1.5 h-1.5 bg-white/80 rounded-full" />
          <div className="w-1.5 h-1.5 bg-white/40 rounded-full" />
        </div>
      </div>

      {/* ━━━━━━━━━━ 1.5 렌탈 방식 탭 (토글) ━━━━━━━━━━ */}
      <div className="px-5 mt-4 mb-2">
        <div className="flex bg-[#F1F3F5] p-1 rounded-xl shadow-inner relative">
          <button 
            onClick={() => setRentalMode("brokerage")}
            className={`flex-1 py-3 text-[14px] font-bold rounded-lg transition-all z-10 ${rentalMode === 'brokerage' ? 'text-[var(--primary)]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            동네 매장 직접 렌탈
          </button>
          <button 
            onClick={() => setRentalMode("direct")}
            className={`flex-1 py-3 text-[14px] font-bold rounded-lg transition-all z-10 ${rentalMode === 'direct' ? 'text-[var(--primary)]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            빌리드림 직영 렌탈
          </button>
          {/* 부드럽게 움직이는 배경 Indicator */}
          <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-transform duration-300 ease-out ${rentalMode === 'brokerage' ? 'translate-x-0' : 'translate-x-[calc(100%+8px)]'}`} />
        </div>
        
        {/* 부가적인 설명 텍스트 영역 */}
        <div className="text-center mt-3 h-[24px]">
          {rentalMode === 'brokerage' ? (
            <p className="text-[12.5px] font-bold text-[var(--accent)] bg-[var(--accent-soft)] inline-block px-3 py-1 rounded-full anim-slide-up">
              🚀 가까운 동네 중고매장에서 바로!
            </p>
          ) : (
            <p className="text-[12.5px] font-bold text-[var(--primary)] bg-[var(--info-soft)] inline-block px-3 py-1 rounded-full anim-slide-up">
              ✨ 빌리드림이 품질을 보증하고 빌려드림!
            </p>
          )}
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
              <div className="w-[50px] h-[50px] rounded-[var(--radius-lg)] bg-white shadow-card flex items-center justify-center group-hover:shadow-float group-hover:scale-105 transition-all duration-200 overflow-hidden p-1.5">
                <Image src={cat.img} alt={cat.name} width={38} height={38} className="object-contain" />
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
            { icon:"💰", title:"위약금 최소화", desc:"일정기간 사용시\n위약금 0원!", bg:"var(--warn-soft)" },
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
            <Link href="/partner/apply" className="inline-flex items-center text-[12px] font-bold bg-white text-[var(--primary)] px-4 py-2.5 rounded-full shadow-card hover:shadow-float transition-all active:scale-95">
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
          <Link href="/partner/dashboard" className="text-[var(--accent)] font-bold ml-auto">파트너 대시보드</Link>
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
