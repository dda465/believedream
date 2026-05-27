"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getProducts } from "../lib/db";

export default function LocalLowestPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userDistrict, setUserDistrict] = useState("");

  useEffect(() => {
    // 로컬 스토리지에서 유저 지역 가져오기 (기본값 부산진구)
    const stored = localStorage.getItem("userLocation");
    const district = stored ? stored.split(" ")[0] : "부산진구";
    setUserDistrict(district);

    getProducts()
      .then(data => {
        // 1. 해당 동네(구)의 상품만 필터링
        const localProducts = data.filter(p => p.district === district);
        
        // 2. 월 렌탈료(price12) 기준 오름차순(최저가 우선) 정렬
        // 가격 문자열(예: "18,000")을 숫자로 변환하여 비교
        localProducts.sort((a, b) => {
          const priceA = parseInt(a.price12.replace(/,/g, ''), 10) || 0;
          const priceB = parseInt(b.price12.replace(/,/g, ''), 10) || 0;
          return priceA - priceB;
        });

        setProducts(localProducts);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#F5F7FA] pb-[100px]">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded-full text-gray-600 hover:bg-gray-100 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </Link>
          <h1 className="text-[17px] font-black text-[var(--text-dark)] tracking-tight">우리동네 최저가</h1>
        </div>
      </header>

      <div className="px-5 pt-6 pb-2">
        <h2 className="text-[22px] font-black leading-tight">
          <span className="text-[var(--accent)]">{userDistrict}</span><br/>
          최저가 렌탈 모아보기 💸
        </h2>
        <p className="text-[13px] text-gray-500 mt-2">
          가장 저렴한 월 렌탈료 순서대로 보여드려요.
        </p>
      </div>

      <div className="px-5 mt-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-[var(--primary-soft)] border-t-[var(--primary)] rounded-full animate-spin"></div>
            <p className="mt-4 text-[13px] text-[var(--text-light)] font-medium animate-pulse">최저가를 찾고 있습니다...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="flex flex-col gap-3">
            {products.map((p, idx) => (
              <Link href={`/product/${p.id}`} key={p.id} className="bg-white rounded-[var(--radius-xl)] p-4 shadow-card hover:shadow-float transition-all group flex gap-4">
                
                {/* 랭킹 뱃지 & 아이콘 */}
                <div className="w-[90px] h-[90px] bg-[#F8F9FA] rounded-[var(--radius-lg)] flex flex-col items-center justify-center text-[36px] flex-shrink-0 relative group-hover:bg-[#FFF5F0] transition-colors">
                  {idx < 3 && (
                    <div className="absolute -top-2 -left-2 w-7 h-7 bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] rounded-full flex items-center justify-center text-white text-[12px] font-bold shadow-sm border-2 border-white z-10">
                      {idx + 1}
                    </div>
                  )}
                  {p.emoji}
                </div>
                
                <div className="flex flex-col justify-center flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{p.brand}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600">{p.condition}</span>
                    <span className="text-[10px] text-gray-400 font-medium truncate">{p.store}</span>
                  </div>
                  <h3 className="text-[14px] font-bold text-[var(--text-dark)] leading-tight mb-2 truncate group-hover:text-[var(--primary)] transition-colors">{p.name}</h3>
                  <div className="flex items-baseline gap-1 mt-auto">
                    <span className="text-[18px] font-black text-[var(--accent)]">{p.price12}</span>
                    <span className="text-[12px] text-gray-500 font-medium">원/월</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4 text-[24px]">😥</div>
            <p className="text-[14px] font-bold text-gray-700">현재 {userDistrict}에 등록된 상품이 없습니다.</p>
            <p className="text-[12px] text-gray-500 mt-1">다른 동네를 선택하거나 잠시 후 다시 확인해주세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}
