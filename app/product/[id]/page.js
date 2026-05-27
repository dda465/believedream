"use client";
import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getProductById } from "@/app/lib/db";

const condStyle = { "S급": "bg-emerald-50 text-emerald-700", "A급": "bg-sky-50 text-sky-700", "B급": "bg-amber-50 text-amber-700" };

export default function ProductDetail({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductById(id)
      .then(res => { setP(res); setLoading(false); })
      .catch(() => { setP(null); setLoading(false); });
  }, [id]);

  if (loading) return (
    <div className="text-center py-20 px-5 text-[var(--text-light)]">
      로딩 중...
    </div>
  );

  if (!p) return (
    <div className="text-center py-20 px-5">
      <span className="text-5xl block mb-4">😢</span>
      <p className="text-[15px] font-bold text-[var(--text-dark)]">상품을 찾을 수 없습니다</p>
      <button
        onClick={() => { setLoading(true); getProductById(id).then(res => { setP(res); setLoading(false); }).catch(() => { setP(null); setLoading(false); }); }}
        className="text-[13px] text-white bg-[var(--accent)] font-bold mt-4 px-5 py-2.5 rounded-[var(--radius-md)] inline-block min-h-[44px] hover:bg-[var(--accent-hover)] transition-colors active:scale-[0.97]"
      >
        다시 시도
      </button>
      <Link href="/" className="text-[13px] text-[var(--accent)] font-bold mt-3 inline-flex items-center min-h-[44px] ml-3">← 홈으로</Link>
    </div>
  );

  return (
    <div className="w-full bg-[var(--bg-main)] pb-[90px]">
      {/* ── 서브 헤더 ── */}
      <div className="sticky top-[52px] z-40 bg-white/95 backdrop-blur-md border-b border-[var(--border-light)]">
        <div className="flex items-center gap-3 px-5 h-[48px]">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--bg-sub)] transition-colors"
            aria-label="뒤로 가기"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <h1 className="text-[14px] font-bold text-[var(--text-dark)] truncate flex-1">{p.name}</h1>
        </div>
      </div>

      {/* 이미지 영역 */}
      <div className="bg-gradient-to-br from-[var(--bg-sub)] to-[var(--bg-main)] h-[240px] flex items-center justify-center relative p-8">
        <span className="text-[90px] drop-shadow-md">{p.emoji}</span>
        {p.todayInstall && (
          <span className="absolute top-3 right-3 text-[11px] font-bold bg-[var(--success)] text-white px-3 py-1 rounded-full shadow-sm">⚡ 당일 설치 가능</span>
        )}
      </div>

      {/* 기본 정보 */}
      <div className="px-5 py-5 bg-white">
        <div className="flex items-center gap-1.5 mb-2">
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${condStyle[p.condition]}`}>중고 {p.condition}</span>
          {p.buyout && <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[var(--purple-soft)] text-[var(--purple)]">인수가능</span>}
        </div>
        <h1 className="text-[20px] font-black text-[var(--text-dark)] leading-tight">{p.name}</h1>
        <p className="text-[12px] text-[var(--text-light)] mt-1">{p.brand} · {p.model} · 사용 {p.usedYears}</p>
      </div>

      <div className="h-2 bg-[var(--bg-sub)]" />

      {/* 가격 */}
      <div className="px-5 py-5 bg-white">
        <h3 className="text-[14px] font-black text-[var(--text-dark)] mb-3">💰 렌탈 가격</h3>
        <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar snap-x">
          {[
            { period:"1개월", price:p.price1 || "-", active:false },
            { period:"3개월", price:p.price3 || p.price6, active:false },
            { period:"6개월", price:p.price6 || p.price12, active:true },
            { period:"12개월", price:p.price12 || p.price24, active:false },
            { period:"24개월", price:p.price24 || "-", active:false },
          ].map(opt => (
            <div key={opt.period} className={`relative flex-shrink-0 w-[100px] snap-center text-center py-3 rounded-[var(--radius-md)] transition-all ${
              opt.active ? 'border-2 border-[var(--accent)] bg-[var(--accent-soft)] shadow-glow' : 'shadow-sm border border-[var(--border-light)] bg-white'
            }`}>
              {opt.active && <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-[var(--accent)] text-white px-2 py-0.5 rounded-full">추천</span>}
              <p className="text-[12px] text-[var(--text-light)]">{opt.period}</p>
              <p className={`text-[16px] font-black mt-0.5 ${opt.active ? 'text-[var(--accent)]' : 'text-[var(--text-dark)]'}`}>{opt.price}</p>
              <p className="text-[11px] text-[var(--text-lighter)] font-medium">원/월</p>
            </div>
          ))}
        </div>
        {p.buyout && (
          <div className="mt-3 bg-[var(--bg-sub)] rounded-[var(--radius-md)] p-3.5 flex items-center justify-between">
            <div>
              <p className="text-[12px] font-bold text-[var(--primary)]">🔄 인수 시</p>
              <p className="text-[11px] text-[var(--text-light)]">약정 후 잔여가만 납부</p>
            </div>
            <span className="text-[17px] font-black text-[var(--primary)]">{p.buyoutPrice}원</span>
          </div>
        )}
      </div>

      <div className="h-2 bg-[var(--bg-sub)]" />

      {/* 상태 */}
      <div className="px-5 py-5 bg-white">
        <h3 className="text-[14px] font-black text-[var(--text-dark)] mb-3">📋 상품 상태</h3>
        <div className="bg-white shadow-card rounded-[var(--radius-lg)] p-4">
          <p className="text-[13px] text-[var(--text)] leading-relaxed">{p.desc}</p>
        </div>
      </div>

      <div className="h-2 bg-[var(--bg-sub)]" />

      {/* 매장 */}
      <div className="px-5 py-5 bg-white">
        <h3 className="text-[14px] font-black text-[var(--text-dark)] mb-3">🏪 매장 정보</h3>
        <div className="bg-white shadow-card rounded-[var(--radius-lg)] p-4">
          <p className="text-[14px] font-bold text-[var(--text-dark)]">{p.store}</p>
          <p className="text-[12px] text-[var(--text-light)] mt-0.5">📍 {p.district} {p.area}</p>
          <div className="flex items-center gap-3 mt-2.5 pt-2.5 border-t border-[var(--border-light)]/50">
            <span className="text-[12px] text-[var(--text-light)]">{p.todayInstall ? '⚡ 당일 설치' : '📅 예약 설치'}</span>
            <span className="text-[12px] text-[var(--text-light)]">{p.onlinePay ? '💳 온라인 결제' : '🏪 현장 결제'}</span>
          </div>
        </div>
      </div>

      <div className="h-2 bg-[var(--bg-sub)]" />

      {/* 렌탈 조건 */}
      <div className="px-5 py-5 bg-white">
        <h3 className="text-[14px] font-black text-[var(--text-dark)] mb-3">📝 렌탈 조건</h3>
        <div className="bg-white shadow-card rounded-[var(--radius-lg)] p-4">
          <div className="space-y-0">
            {[
              ["렌탈 기간", "1 / 3 / 6 / 12 / 24개월"],
              ["설치비", "무료"],
              ["인수", p.buyout ? "가능 (잔여가 납부)" : "불가"],
              ["중도 해지", "위약금 없음"],
              ["AS", "매장 직접 대응"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2.5 border-b border-[var(--border-light)]/50 last:border-0">
                <span className="text-[13px] text-[var(--text-light)]">{k}</span>
                <span className="text-[13px] font-bold text-[var(--text-dark)]">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 max-w-[480px] w-full z-50 bg-white border-t border-[var(--border-light)] px-5 py-3 shadow-nav">
        <div className="flex gap-2">
          <button
            onClick={() => alert("카카오톡 상담 기능이 준비 중입니다. 빠른 시일 내에 오픈 예정입니다!")}
            aria-label="카카오톡 상담"
            className="w-[48px] h-[48px] min-w-[44px] min-h-[44px] border border-[var(--border)] rounded-[var(--radius-md)] flex items-center justify-center hover:bg-[var(--bg-sub)] transition-colors text-[18px] flex-shrink-0"
          >💬</button>
          <Link href={`/apply?product=${p.id}`}
            className="flex-1 h-[48px] min-h-[44px] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold rounded-[var(--radius-md)] text-[14px] flex items-center justify-center transition-all active:scale-[0.98] shadow-glow">
            렌탈 신청하기
          </Link>
        </div>
      </div>
    </div>
  );
}
