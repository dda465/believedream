"use client";
import { use, useState, useEffect } from "react";
import Link from "next/link";
import { getProducts } from "@/app/lib/db";

const categoryMap = {
  "dehumidifier": { name: "제습기", icon: "💧" },
  "air-purifier": { name: "공기청정기", icon: "🌿" },
  "dryer": { name: "건조기", icon: "👕" },
  "food-processor": { name: "음식물처리기", icon: "🗑️" },
  "robot-cleaner": { name: "로봇청소기", icon: "🤖" },
  "water-purifier": { name: "정수기", icon: "💦" },
  "washer": { name: "세탁기", icon: "🧺" },
  "all": { name: "전체 상품", icon: "📦" },
};

const condStyle = { "S급": "bg-emerald-50 text-emerald-700 border border-emerald-100", "A급": "bg-sky-50 text-sky-700 border border-sky-100", "B급": "bg-amber-50 text-amber-700 border border-amber-100" };
const districts = ["전체", "부산진구", "해운대구", "수영구", "남구", "동래구", "연제구", "사하구", "사상구", "강서구", "북구", "금정구", "중구", "동구", "서구", "영도구", "기장군"];

export default function CategoryPage({ params }) {
  const { slug } = use(params);
  const cat = categoryMap[slug] || categoryMap["all"];
  const [filter, setFilter] = useState("전체");
  const [sort, setSort] = useState("default");
  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getProducts().then((data) => {
      setProductList(data);
      setIsLoading(false);
    });
  }, []);

  const filtered = productList
    .filter(p => slug === "all" || p.category === slug)
    .filter(p => filter === "전체" || p.district === filter)
    .sort((a, b) => {
      const priceA = parseInt((a.price12 || "0").replace(",",""));
      const priceB = parseInt((b.price12 || "0").replace(",",""));
      if (sort === "low") return priceA - priceB;
      if (sort === "high") return priceB - priceA;
      return 0;
    });

  return (
    <div className="w-full bg-[var(--bg-main)] pb-[80px]">
      {/* 서브 헤더 */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[var(--border-light)] shadow-sm">
        <div className="flex items-center gap-2 px-4 h-[48px]">
          <Link href="/" className="w-[44px] h-[44px] flex items-center justify-center rounded-full hover:bg-[var(--bg-sub)] transition-colors active:bg-[var(--border-light)]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </Link>
          <h1 className="text-[16px] font-black text-[var(--text-dark)] flex items-center gap-2">
            <span>{cat.icon}</span> {cat.name}
          </h1>
        </div>
      </div>

      {/* 필터 바 */}
      <div className="px-5 py-3 flex w-full gap-2 overflow-x-auto hide-scrollbar border-b border-[var(--border-light)] bg-white">
        {/* 지역 필터 */}
        <div className="flex gap-2 flex-shrink-0 items-center">
          {districts.map(d => (
            <button key={d} onClick={() => setFilter(d)}
              className={`text-[12px] font-bold px-4 h-[40px] rounded-full whitespace-nowrap transition-all flex items-center justify-center ${
                filter === d
                  ? 'bg-[var(--primary)] text-white shadow-md'
                  : 'bg-white border border-[var(--border)] text-[var(--text)] hover:border-[var(--text-light)]'
              }`}>{d}</button>
          ))}
        </div>
      </div>

      {/* 정렬 옵션 */}
      <div className="px-5 flex items-center justify-between bg-white border-b border-[var(--border-light)]">
        <p className="text-[12px] text-[var(--text-light)]">
          총 <span className="font-bold text-[var(--primary)]">{filtered.length}</span>개
        </p>
        <div className="flex gap-1">
          {[
            { v: "default", l: "기본순" },
            { v: "low", l: "낮은가격" },
            { v: "high", l: "높은가격" },
          ].map((s, idx) => (
            <div key={s.v} className="flex items-center gap-1">
              <button onClick={() => setSort(s.v)}
                className={`text-[12px] font-bold transition-colors h-[40px] px-2 flex items-center justify-center ${
                  sort === s.v ? 'text-[var(--text-dark)]' : 'text-[var(--text-lighter)] hover:text-[var(--text-light)]'
                }`}>{s.l}</button>
              {idx < 2 && <div className="w-[1px] h-[10px] bg-[var(--border)] mx-1" />}
            </div>
          ))}
        </div>
      </div>

      {/* 상품 리스트 */}
      <div className="px-5 bg-white">
        {isLoading ? (
          /* 로딩 스켈레톤 */
          <div className="flex flex-col">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-4 border-b border-[var(--border-light)] last:border-b-0 animate-pulse">
                <div className="w-[60px] h-[60px] bg-gray-100 rounded-[var(--radius-lg)] flex-shrink-0" />
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="h-[15px] bg-gray-200 rounded w-2/3" />
                  <div className="flex gap-1.5">
                    <div className="h-[18px] w-[36px] bg-gray-100 rounded-md" />
                    <div className="h-[18px] w-[56px] bg-gray-100 rounded-md" />
                  </div>
                  <div className="h-[13px] bg-gray-100 rounded w-1/2" />
                </div>
                <div className="text-right flex-shrink-0 pl-1.5 space-y-1">
                  <div className="h-[20px] w-[64px] bg-gray-200 rounded ml-auto" />
                  <div className="h-[13px] w-[32px] bg-gray-100 rounded ml-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white">
            <span className="text-5xl block mb-4 opacity-80">🔍</span>
            <p className="text-[15px] font-bold text-[var(--text-dark)]">해당 조건의 상품이 없습니다</p>
            <p className="text-[13px] text-[var(--text-light)] mt-1.5">다른 지역이나 조건을 선택해보세요</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {filtered.map(p => (
              <Link href={`/product/${p.id}`} key={p.id}
                className="flex items-center gap-4 py-4 border-b border-[var(--border-light)] last:border-b-0 hover:bg-[var(--bg-main)] transition-colors active:bg-[var(--bg-sub)] group">
                {/* 이모지 */}
                <div className="w-[60px] h-[60px] bg-gradient-to-br from-[var(--bg-sub)] to-white border border-[var(--border-light)] shadow-sm rounded-[var(--radius-lg)] flex items-center justify-center text-[28px] flex-shrink-0 transition-transform group-hover:scale-105">
                  {p.emoji}
                </div>
                {/* 정보 */}
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-[var(--text-dark)] truncate">{p.name}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${condStyle[p.condition]}`}>{p.condition}</span>
                    {p.todayInstall && <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[var(--primary)] text-white shadow-sm">⚡당일설치</span>}
                  </div>
                  <p className="text-[12px] text-[var(--text-light)] mt-1.5 truncate flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    {p.district} · {p.store}
                  </p>
                </div>
                {/* 가격 */}
                <div className="text-right flex-shrink-0 pl-1.5">
                  <p className="text-[17px] font-black text-[var(--accent)] leading-tight">{p.price12}</p>
                  <p className="text-[11px] text-[var(--text-lighter)] font-medium">원/월</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
