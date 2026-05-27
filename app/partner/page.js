"use client";
import { useState } from "react";
import Link from "next/link";
import { createPartnerApplication } from "@/app/lib/db";

const districts = ["부산진구","해운대구","수영구","남구","동래구","연제구","사하구","사상구","강서구","북구","금정구","중구","동구","서구","영도구","기장군"];
const cats = ["제습기","공기청정기","건조기","음식물처리기","로봇청소기","정수기","세탁기","기타"];

function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export default function PartnerPage() {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ storeName:"", owner:"", phone:"", district:"", categories:[], businessType:"", buyrent:"" });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const update = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(prev => ({ ...prev, [k]: "" }));
    if (submitError) setSubmitError("");
  };

  const handlePhoneChange = (value) => {
    const formatted = formatPhone(value);
    setForm(p => ({ ...p, phone: formatted }));
    if (errors.phone) setErrors(prev => ({ ...prev, phone: "" }));
    if (submitError) setSubmitError("");
  };

  const toggleCat = c => {
    setForm(p => ({ ...p, categories: p.categories.includes(c) ? p.categories.filter(x => x !== c) : [...p.categories, c] }));
    if (errors.categories) setErrors(prev => ({ ...prev, categories: "" }));
  };

  const handleSubmit = async () => {
    const newErrors = {};

    if (!form.storeName.trim()) newErrors.storeName = "매장명을 입력해주세요.";
    if (!form.owner.trim()) newErrors.owner = "대표자명을 입력해주세요.";
    if (!form.phone.trim()) {
      newErrors.phone = "연락처를 입력해주세요.";
    } else if (form.phone.replace(/\D/g, "").length < 10) {
      newErrors.phone = "올바른 연락처를 입력해주세요.";
    }
    if (!form.district) newErrors.district = "매장 위치(구)를 선택해주세요.";
    if (form.categories.length === 0) newErrors.categories = "취급 품목을 하나 이상 선택해주세요.";
    if (!form.businessType) newErrors.businessType = "사업 형태를 선택해주세요.";
    if (!form.buyrent) newErrors.buyrent = "재고 매입 서비스 관심 여부를 선택해주세요.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitError("");
    setIsSubmitting(true);
    try {
      const res = await createPartnerApplication(form);
      if (res.success) {
        setApplicationId(res.id);
        setSubmitted(true);
      } else {
        setSubmitError("입점 신청서 제출에 실패했습니다. 다시 시도해 주세요.");
      }
    } catch (error) {
      console.error(error);
      setSubmitError("오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    const displayId = applicationId.startsWith("BD-2026-") ? applicationId : `BD-2026-${applicationId.replace(/^(mock-|fallback-)?partner-/, "")}`;
    return (
      <div className="text-center py-16 px-5 bg-[var(--bg-main)] min-h-[calc(100vh-140px)] flex flex-col justify-between pb-[80px]">
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="w-16 h-16 bg-[var(--accent-soft)] rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
            <span className="text-3xl">🎉</span>
          </div>
          <h2 className="text-[20px] font-black text-[var(--text-dark)] mb-2">입점 신청 완료!</h2>
          <p className="text-[13px] text-[var(--text-light)] leading-relaxed mb-6">
            담당자가 1~2일 내 연락드리겠습니다.<br/>
            매장을 직접 방문해서 상품 등록을 도와드립니다.
          </p>
          
          <div className="bg-white border border-[var(--border-light)] rounded-[var(--radius-md)] p-4 max-w-sm w-full mb-8 shadow-sm">
            <p className="text-[11px] text-[var(--text-lighter)] font-bold uppercase tracking-wider">신청 ID (접수번호)</p>
            <p className="text-[14px] font-black text-[var(--accent)] mt-1.5">{displayId}</p>
          </div>
        </div>
        
        <div className="w-full">
          <Link href="/" className="block w-full min-h-[48px] py-3.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold rounded-[var(--radius-md)] text-[14px] text-center transition-all active:scale-[0.98] shadow-md flex items-center justify-center">
            홈으로
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[var(--bg-main)] pb-[80px]">
      <div className="sticky top-[52px] z-40 bg-white/95 backdrop-blur-md border-b border-[var(--border-light)]">
        <div className="flex items-center gap-3 px-5 h-[48px]">
          <Link href="/" className="w-11 h-11 -ml-1.5 flex items-center justify-center rounded-full hover:bg-[var(--bg-sub)] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </Link>
          <h1 className="text-[15px] font-black text-[var(--text-dark)]">매장 입점 안내</h1>
        </div>
      </div>

      {!showForm ? (
        <>
          {/* 히어로 */}
          <section className="px-5 pt-8 pb-6 text-center bg-white">
            <div className="text-[40px] mb-3">🏪</div>
            <h2 className="text-[22px] font-black text-[var(--text-dark)] leading-snug">사장님 매장,<br/>더 많은 고객에게<br/>보여드릴게요</h2>
            <p className="text-[13px] text-[var(--text-light)] mt-2">입점 무료 · 거래 성사 시에만 수수료</p>
            <button onClick={()=>setShowForm(true)} className="mt-5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold px-7 min-h-[48px] rounded-full text-[14px] transition-all active:scale-95 shadow-[0_4px_16px_var(--accent-soft)]">무료 입점 신청 →</button>
          </section>

          <div className="h-2 bg-[var(--bg-sub)]" />

          {/* 혜택 */}
          <section className="px-5 py-6 bg-white">
            <h3 className="text-[16px] font-black text-[var(--text-dark)] mb-4">🎁 입점 혜택</h3>
            <div className="flex flex-col gap-2.5">
              {[
                {icon:"📱",title:"온라인 노출",desc:"동네 고객이 사장님 상품을 바로 볼 수 있어요",color:"var(--info-soft)"},
                {icon:"💰",title:"비용 0원",desc:"입점·등록 무료. 거래 될 때만 소정의 수수료",color:"var(--warn-soft)"},
                {icon:"🙌",title:"등록 대행",desc:"저희가 직접 방문해서 사진·가격·설명 다 올려드려요",color:"var(--success-soft)"},
                {icon:"📦",title:"재고 매입",desc:"안 팔리는 재고 → 저희가 매입 후 렌탈로 돌려드려요",color:"var(--purple-soft)"},
              ].map(item=>(
                <div key={item.title} className="flex items-start gap-3.5 rounded-[var(--radius-md)] p-4" style={{backgroundColor:item.color}}>
                  <div className="text-[22px] flex-shrink-0">{item.icon}</div>
                  <div>
                    <p className="text-[13px] font-bold text-[var(--text-dark)]">{item.title}</p>
                    <p className="text-[12px] text-[var(--text-light)] mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="h-2 bg-[var(--bg-sub)]" />

          {/* 수수료 */}
          <section className="px-5 py-6 bg-white">
            <h3 className="text-[16px] font-black text-[var(--text-dark)] mb-3">💳 수수료</h3>
            <div className="space-y-0">
              {[["입점 비용","무료",true],["상품 등록","무료",true],["거래 수수료","3~5%",false]].map(([k,v,free])=>(
                <div key={k} className="flex justify-between py-3 border-b border-[var(--border-light)] last:border-0">
                  <span className="text-[13px] text-[var(--text-light)]">{k}</span>
                  <span className={`text-[13px] font-bold ${free?'text-[var(--success)]':'text-[var(--primary)]'}`}>{v}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-[var(--text-lighter)] mt-2">※ 거래가 성사될 때만 수수료가 발생합니다</p>
          </section>

          <div className="h-2 bg-[var(--bg-sub)]" />

          {/* 절차 */}
          <section className="px-5 py-6 bg-white">
            <h3 className="text-[16px] font-black text-[var(--text-dark)] mb-4">📋 입점 절차</h3>
            <div className="flex flex-col gap-0">
              {[
                {n:"1",t:"입점 신청",d:"간단히 정보 입력"},
                {n:"2",t:"담당자 방문",d:"1~2일 내 매장 직접 방문"},
                {n:"3",t:"상품 등록",d:"사진·가격 저희가 등록"},
                {n:"4",t:"고객 매칭",d:"동네 고객에게 노출!"},
              ].map((s,i)=>(
                <div key={s.n} className="flex items-start gap-3.5 relative">
                  {i < 3 && <div className="absolute left-[15px] top-[32px] w-[2px] h-[calc(100%-16px)] bg-[var(--border)]" />}
                  <div className="w-[32px] h-[32px] bg-[var(--accent)] text-white rounded-full flex items-center justify-center text-[12px] font-black flex-shrink-0 relative z-10 shadow-sm">{s.n}</div>
                  <div className="flex-1 pb-4">
                    <p className="text-[13px] font-bold text-[var(--text-dark)]">{s.t}</p>
                    <p className="text-[12px] text-[var(--text-light)] mt-0.5">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="px-5 py-6 pb-8">
            <button onClick={()=>setShowForm(true)} className="w-full min-h-[48px] py-3.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold rounded-[var(--radius-md)] text-[15px] transition-all active:scale-[0.98] shadow-[0_4px_16px_var(--accent-soft)]">무료 입점 신청하기 →</button>
          </div>
        </>
      ) : (
        <div className="px-5 py-5 space-y-6">
          <div className="bg-[var(--accent-soft)] rounded-[var(--radius-md)] p-4 text-center">
            <p className="text-[14px] font-bold text-[var(--accent)]">🏪 무료 입점 신청</p>
            <p className="text-[12px] text-[var(--text-light)] mt-1">작성 후 담당자가 직접 방문합니다</p>
          </div>

          {/* 매장명 */}
          <div>
            <label className="text-[13px] font-bold text-[var(--text-dark)] mb-2 block">매장명</label>
            <input
              type="text"
              value={form.storeName}
              onChange={e => update("storeName", e.target.value)}
              placeholder="예: 서면 가전마트"
              className={`w-full min-h-[48px] px-4 bg-white border rounded-[var(--radius-md)] text-[14px] outline-none focus:ring-2 focus:ring-[var(--accent-soft)] focus:border-[var(--accent)] transition-all ${errors.storeName ? 'border-red-400' : 'border-[var(--border)]'}`}
            />
            {errors.storeName && <p className="text-[11px] text-red-500 mt-1.5 pl-1">{errors.storeName}</p>}
          </div>

          {/* 대표자명 */}
          <div>
            <label className="text-[13px] font-bold text-[var(--text-dark)] mb-2 block">대표자명</label>
            <input
              type="text"
              value={form.owner}
              onChange={e => update("owner", e.target.value)}
              placeholder="홍길동"
              className={`w-full min-h-[48px] px-4 bg-white border rounded-[var(--radius-md)] text-[14px] outline-none focus:ring-2 focus:ring-[var(--accent-soft)] focus:border-[var(--accent)] transition-all ${errors.owner ? 'border-red-400' : 'border-[var(--border)]'}`}
            />
            {errors.owner && <p className="text-[11px] text-red-500 mt-1.5 pl-1">{errors.owner}</p>}
          </div>

          {/* 연락처 */}
          <div>
            <label className="text-[13px] font-bold text-[var(--text-dark)] mb-2 block">연락처</label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => handlePhoneChange(e.target.value)}
              placeholder="010-0000-0000"
              className={`w-full min-h-[48px] px-4 bg-white border rounded-[var(--radius-md)] text-[14px] outline-none focus:ring-2 focus:ring-[var(--accent-soft)] focus:border-[var(--accent)] transition-all ${errors.phone ? 'border-red-400' : 'border-[var(--border)]'}`}
            />
            {errors.phone && <p className="text-[11px] text-red-500 mt-1.5 pl-1">{errors.phone}</p>}
          </div>

          {/* 매장 위치 */}
          <div>
            <label className="text-[13px] font-bold text-[var(--text-dark)] mb-2 block">매장 위치</label>
            <select
              value={form.district}
              onChange={e => update("district", e.target.value)}
              className={`w-full min-h-[48px] px-4 bg-white border rounded-[var(--radius-md)] text-[14px] outline-none focus:ring-2 focus:ring-[var(--accent-soft)] focus:border-[var(--accent)] transition-all ${errors.district ? 'border-red-400' : 'border-[var(--border)]'}`}
            >
              <option value="">구를 선택하세요</option>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            {errors.district && <p className="text-[11px] text-red-500 mt-1.5 pl-1">{errors.district}</p>}
          </div>

          {/* 취급 품목 */}
          <div>
            <label className="text-[13px] font-bold text-[var(--text-dark)] mb-2 block">취급 품목</label>
            <div className="grid grid-cols-3 gap-2">
              {cats.map(c=>(
                <button 
                  key={c} 
                  onClick={()=>toggleCat(c)} 
                  className={`min-h-[44px] py-2.5 rounded-[var(--radius-sm)] border text-[13px] font-bold transition-all ${form.categories.includes(c) ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] shadow-sm' : 'border-[var(--border)] bg-white text-[var(--text)]'}`}
                >
                  {c}
                </button>
              ))}
            </div>
            {errors.categories && <p className="text-[11px] text-red-500 mt-1.5 pl-1">{errors.categories}</p>}
          </div>

          {/* 사업 형태 */}
          <div>
            <label className="text-[13px] font-bold text-[var(--text-dark)] mb-2 block">사업 형태</label>
            <div className="grid grid-cols-2 gap-2">
              {["중고가전 판매","렌탈","리퍼/수리","기타"].map(t=>(
                <button 
                  key={t} 
                  onClick={()=>update("businessType",t)} 
                  className={`min-h-[44px] py-2.5 rounded-[var(--radius-sm)] border text-[13px] font-bold transition-all ${form.businessType===t ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] shadow-sm' : 'border-[var(--border)] bg-white text-[var(--text)]'}`}
                >
                  {t}
                </button>
              ))}
            </div>
            {errors.businessType && <p className="text-[11px] text-red-500 mt-1.5 pl-1">{errors.businessType}</p>}
          </div>

          {/* 재고 매입 서비스 */}
          <div>
            <label className="text-[13px] font-bold text-[var(--text-dark)] mb-2 block">재고 매입 서비스 관심</label>
            <div className="grid grid-cols-3 gap-2">
              {["관심있음","아직 모름","관심없음"].map(o=>(
                <button 
                  key={o} 
                  onClick={()=>update("buyrent",o)} 
                  className={`min-h-[44px] py-2.5 rounded-[var(--radius-sm)] border text-[13px] font-bold transition-all ${form.buyrent===o ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] shadow-sm' : 'border-[var(--border)] bg-white text-[var(--text)]'}`}
                >
                  {o}
                </button>
              ))}
            </div>
            {errors.buyrent && <p className="text-[11px] text-red-500 mt-1.5 pl-1">{errors.buyrent}</p>}
          </div>

          {/* 제출 에러 메시지 */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-[var(--radius-md)] p-3 text-center">
              <p className="text-[12px] text-red-600 font-medium">{submitError}</p>
            </div>
          )}

          <div className="pt-2">
            <button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="w-full min-h-[52px] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold rounded-[var(--radius-md)] text-[15px] transition-all active:scale-[0.98] shadow-[0_4px_16px_var(--accent-soft)] disabled:bg-[var(--text-lighter)] disabled:shadow-none flex items-center justify-center"
            >
              {isSubmitting ? "신청서 제출 중..." : "입점 신청 완료하기"}
            </button>
            <button
              onClick={()=>setShowForm(false)}
              className="w-full min-h-[44px] text-[13px] text-[var(--text-lighter)] mt-2 rounded-[var(--radius-sm)] transition-colors hover:text-[var(--text)] hover:bg-[var(--bg-sub)] flex items-center justify-center"
            >
              ← 입점 안내로 돌아가기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
