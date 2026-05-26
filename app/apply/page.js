"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getProductById, createRentalRequest } from "@/app/lib/db";

const districts = ["부산진구 (서면)", "해운대구", "수영구", "남구", "동래구", "연제구", "사하구", "사상구", "강서구", "북구", "금정구", "중구", "동구", "서구", "영도구", "기장군"];

function ApplyForm() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("product");
  const [product, setProduct] = useState(null);

  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [form, setForm] = useState({ name:"", phone:"", district:"", address:"", period:"12", buyout:"미정", installDate:"today", message:"" });
  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => {
    if (productId) {
      getProductById(productId).then(setProduct);
    }
  }, [productId]);

  const handleSubmit = async () => {
    // 간단한 폼 유효성 검사
    if (!form.name || !form.phone || !form.district) {
      alert("이름, 연락처, 설치 지역은 필수 입력 항목입니다.");
      return;
    }
    const res = await createRentalRequest({
      ...form,
      productId: productId || "none",
      productName: product?.name || "일반 신청",
      storeName: product?.store || "본사 배칭",
      monthlyPrice: product?.price12 || "0",
    });
    if (res.success) {
      setRequestId(res.id);
      setSubmitted(true);
    }
  };

  if (submitted) {
    const displayId = requestId.startsWith("BD-2026-") ? requestId : `BD-2026-${requestId.replace(/^(mock-|fallback-)?rental-/, "")}`;
    return (
      <div className="text-center py-16 px-5 bg-[var(--bg-main)] min-h-[calc(100vh-140px)] flex flex-col justify-between">
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="w-16 h-16 bg-[var(--success-soft)] rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
            <span className="text-3xl">✅</span>
          </div>
          <h2 className="text-[20px] font-black text-[var(--text-dark)] mb-2">신청 완료!</h2>
          <p className="text-[13px] text-[var(--text-light)] mb-6">매장에서 곧 연락드립니다 (평균 30분)</p>
          
          <div className="bg-white border border-[var(--border-light)] rounded-[var(--radius-md)] p-4 max-w-sm w-full mb-8 shadow-sm">
            <p className="text-[11px] text-[var(--text-lighter)] font-bold uppercase tracking-wider">신청번호 (접수 ID)</p>
            <p className="text-[14px] font-black text-[var(--primary)] truncate mt-1.5">{displayId}</p>
          </div>
        </div>
        
        <div className="w-full">
          <Link href="/" className="block w-full py-3.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold rounded-[var(--radius-md)] text-[14px] text-center transition-all active:scale-[0.98] shadow-md">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[var(--bg-main)] pb-[90px]">
      <div className="sticky top-[52px] z-40 bg-white/95 backdrop-blur-md border-b border-[var(--border-light)]">
        <div className="flex items-center gap-3 px-5 h-[48px]">
          <Link href={product ? `/product/${productId}` : "/"} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-sub)] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </Link>
          <h1 className="text-[15px] font-black text-[var(--text-dark)]">렌탈 신청</h1>
        </div>
      </div>

      {product && (
        <div className="mx-5 mt-4 bg-white border border-[var(--border-light)] rounded-[var(--radius-md)] p-3.5 flex items-center gap-3 shadow-sm">
          <div className="w-11 h-11 bg-[var(--bg-sub)] rounded-[var(--radius-sm)] flex items-center justify-center text-[20px] flex-shrink-0">{product.emoji}</div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-[var(--text-dark)] truncate">{product.name}</p>
            <p className="text-[10px] text-[var(--text-lighter)]">{product.store}</p>
          </div>
          <span className="text-[15px] font-black text-[var(--accent)] flex-shrink-0">월 {product.price12}원</span>
        </div>
      )}

      <div className="px-5 mt-5 space-y-5">
        <Field label="렌탈 기간">
          <div className="grid grid-cols-3 gap-2">
            {[{v:"6",l:"6개월",s:"단기"},{v:"12",l:"12개월",s:"추천"},{v:"24",l:"24개월",s:"저렴"}].map(o=>(
              <button key={o.v} onClick={()=>update("period",o.v)} className={`py-3 rounded-[var(--radius-md)] border text-center transition-all ${form.period===o.v?'border-[var(--accent)] bg-[var(--accent-soft)]':'border-[var(--border)] hover:border-[var(--text-lighter)]'}`}>
                <span className={`text-[13px] font-bold block ${form.period===o.v?'text-[var(--accent)]':'text-[var(--text-dark)]'}`}>{o.l}</span>
                <span className="text-[10px] text-[var(--text-lighter)]">{o.s}</span>
              </button>
            ))}
          </div>
        </Field>
        <Field label="인수 의향">
          <div className="grid grid-cols-3 gap-2">
            {["인수 희망","미정","인수 안 함"].map(o=>(
              <button key={o} onClick={()=>update("buyout",o)} className={`py-2.5 rounded-[var(--radius-md)] border text-[12px] font-bold transition-all ${form.buyout===o?'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]':'border-[var(--border)] text-[var(--text)]'}`}>{o}</button>
            ))}
          </div>
        </Field>
        <Field label="이름">
          <input type="text" value={form.name} onChange={e=>update("name",e.target.value)} placeholder="홍길동" className="w-full h-12 px-4 border border-[var(--border)] rounded-[var(--radius-md)] text-[14px] bg-white" />
        </Field>
        <Field label="연락처">
          <input type="tel" value={form.phone} onChange={e=>update("phone",e.target.value)} placeholder="010-0000-0000" className="w-full h-12 px-4 border border-[var(--border)] rounded-[var(--radius-md)] text-[14px] bg-white" />
        </Field>
        <Field label="설치 지역">
          <select value={form.district} onChange={e=>update("district",e.target.value)} className="w-full h-12 px-4 border border-[var(--border)] rounded-[var(--radius-md)] text-[14px] bg-white">
            <option value="">지역을 선택하세요</option>
            {districts.map(d=><option key={d} value={d}>{d}</option>)}
          </select>
        </Field>
        <Field label="상세 주소">
          <input type="text" value={form.address} onChange={e=>update("address",e.target.value)} placeholder="아파트/빌라명, 동·호수" className="w-full h-12 px-4 border border-[var(--border)] rounded-[var(--radius-md)] text-[14px] bg-white" />
        </Field>
        <Field label="설치 희망일">
          <div className="grid grid-cols-2 gap-2">
            <button onClick={()=>update("installDate","today")} className={`py-3 rounded-[var(--radius-md)] border text-[13px] font-bold text-center transition-all ${form.installDate==="today"?'border-[var(--success)] bg-[var(--success-soft)] text-[var(--success)]':'border-[var(--border)]'}`}>⚡ 오늘 (당일)</button>
            <button onClick={()=>update("installDate","schedule")} className={`py-3 rounded-[var(--radius-md)] border text-[13px] font-bold text-center transition-all ${form.installDate==="schedule"?'border-[var(--info)] bg-[var(--info-soft)] text-[var(--info)]':'border-[var(--border)]'}`}>📅 날짜 선택</button>
          </div>
        </Field>
        <Field label="요청사항" optional>
          <textarea value={form.message} onChange={e=>update("message",e.target.value)} placeholder="추가 요청사항" rows={3} className="w-full px-4 py-3 border border-[var(--border)] rounded-[var(--radius-md)] text-[14px] resize-none bg-white" />
        </Field>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 max-w-[480px] w-full z-50 bg-white border-t border-[var(--border-light)] px-5 py-3 shadow-nav">
        <button onClick={handleSubmit} className="w-full py-3.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold rounded-[var(--radius-md)] text-[15px] transition-all active:scale-[0.98] shadow-lg">렌탈 신청 완료하기</button>
        <p className="text-center text-[10px] text-[var(--text-lighter)] mt-1.5">{product?.onlinePay ? '온라인 결제 또는 현장 결제 가능' : '현장 결제 (매장에서 연락드립니다)'}</p>
      </div>
    </div>
  );
}

function Field({ label, optional, children }) {
  return (
    <div>
      <label className="text-[13px] font-bold text-[var(--text-dark)] mb-2 block">{label} {optional && <span className="text-[11px] text-[var(--text-lighter)] font-normal">(선택)</span>}</label>
      {children}
    </div>
  );
}

export default function ApplyPage() {
  return <Suspense fallback={<div className="text-center py-20 text-[var(--text-lighter)]">로딩 중...</div>}><ApplyForm /></Suspense>;
}
