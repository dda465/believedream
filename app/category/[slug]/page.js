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

const condStyle = { "S급": "bg-emerald-50 text-emerald-700", "A급": "bg-sky-50 text-sky-700", "B급": "bg-amber-50 text-amber-700" };
const districts = ["전체", "부산진구", "해운대구", "동래구", "사상구", "중구", "수영구", "남구", "사하구"];

export default function CategoryPage({ params }) {
  const { slug } = use(params);
  const cat = categoryMap[slug] || categoryMap["all"];
  const [filter, setFilter] = useState("전체");
  const [sort, setSort] = useState("popular");
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    getProducts().then(setProductList);
  }, []);

  const filtered = productList
    .filter(p => slug === "all" || p.category === slug)
    .filter(p => filter === "전체" || p.district === filter)
    .sort((a, b) => {
      const priceA = parseInt((a.price || a.price12 || "0").replace(",",""));
      const priceB = parseInt((b.price || b.price12 || "0").replace(",",""));
      if (sort === "low") return priceA - priceB;
      if (sort === "high") return priceB - priceA;
      return 0;
    });

  return (
    <div className="w-full bg-[var(--bg-main)]">
      {/* 서브 헤더 */}
      <div className="sticky top-[52px] z-40 bg-white/95 backdrop-blur-md border-b border-[var(--border-light)]">
        <div className="flex items-center gap-3 px-5 h-[48px]">
          <Link href="/" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-sub)] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </Link>
          <h1 className="text-[16px] font-black text-[var(--text-dark)] flex items-center gap-2">
            <span>{cat.icon}</span> {cat.name}
          </h1>
          <span className="text-[12px] text-[var(--text-light)] font-medium ml-1">{filtered.length}건</span>
        </div>
      </div>

      {/* 필터 바 */}
      <div className="px-5 py-3 flex w-full gap-2 overflow-x-auto hide-scrollbar border-b border-[var(--border-light)] bg-white">
        {/* 지역 필터 */}
        <div className="flex gap-1.5 flex-shrink-0">
          {districts.map(d => (
            <button key={d} onClick={() => setFilter(d)}
              className={`text-[11px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
                filter === d
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--bg-sub)] text-[var(--text-light)] hover:bg-[var(--border)]'
              }`}>{d}</button>
          ))}
        </div>
      </div>

      {/* 정렬 옵션 */}
      <div className="px-5 py-2.5 flex items-center justify-between bg-[var(--bg-main)]">
        <p className="text-[11px] text-[var(--text-light)]">
          총 <span className="font-bold text-[var(--text-dark)]">{filtered.length}</span>개 상품
        </p>
        <div className="flex gap-2">
          {[
            { v: "popular", l: "인기순" },
            { v: "low", l: "낮은가격" },
            { v: "high", l: "높은가격" },
          ].map(s => (
            <button key={s.v} onClick={() => setSort(s.v)}
              className={`text-[11px] font-bold transition-colors ${
                sort === s.v ? 'text-[var(--text-dark)]' : 'text-[var(--text-lighter)]'
              }`}>{s.l}</button>
          ))}
        </div>
      </div>

      {/* 상품 리스트 */}
      <div className="px-5 pb-8">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-4xl block mb-3">🔍</span>
            <p className="text-[14px] font-bold text-[var(--text-dark)]">해당 조건의 상품이 없습니다</p>
            <p className="text-[12px] text-[var(--text-light)] mt-1">다른 지역을 선택해보세요</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {filtered.map(p => (
              <Link href={`/product/${p.id}`} key={p.id}
                className="flex items-center gap-3.5 px-3 py-4 border-b border-[var(--border-light)] last:border-b-0 hover:opacity-85 transition-opacity active:scale-[0.99] group">
                {/* 이모지 */}
                <div className="w-[50px] h-[50px] bg-[var(--bg-sub)] rounded-[var(--radius-sm)] flex items-center justify-center text-[24px] flex-shrink-0 group-hover:bg-[var(--accent-soft)] transition-colors">
                  {p.emoji}
                </div>
                {/* 정보 */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-[var(--text-dark)] truncate">{p.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${condStyle[p.condition]}`}>{p.condition}</span>
                    {p.todayInstall && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[var(--success-soft)] text-[var(--success)]">⚡당일설치</span>}
                  </div>
                  <p className="text-[10px] text-[var(--text-light)] mt-0.5 truncate">📍 {p.district} · {p.store}</p>
                </div>
                {/* 가격 */}
                <div className="text-right flex-shrink-0 pl-1.5">
                  <p className="text-[16px] font-black text-[var(--accent)] leading-tight">{p.price || p.price12}</p>
                  <p className="text-[9px] text-[var(--text-lighter)] font-medium">원/월</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
