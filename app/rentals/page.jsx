"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, Package, Clock, ShieldCheck, RefreshCw, 
  HandCoins, AlertCircle, Calendar, CreditCard, MapPin, 
  CheckCircle2, X 
} from "lucide-react";

export default function RentalsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("active");
  const [activeModal, setActiveModal] = useState(null); // null | 'extend' | 'buyout' | 'terminate'
  const [selectedRental, setSelectedRental] = useState(null);
  
  // 모달 입력용 상태들
  const [extendPeriod, setExtendPeriod] = useState("6");
  const [terminateReason, setTerminateReason] = useState("단순 변심");
  const [terminateDate, setTerminateDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");

  // 상호작용 가능한 상태성 렌탈 내역 데이터
  const [rentals, setRentals] = useState([
    {
      id: "ORD-20260528-123",
      productName: "LG 듀얼인버터 제습기 20L",
      brand: "LG",
      emoji: "💧",
      status: "이용중", // 대기중 | 배송중 | 이용중 | 반납대기 | 반납완료 | 인수완료
      monthlyPrice: 15000,
      period: 12,
      startDate: "2026.06.01",
      endDate: "2027.05.31",
      nextPaymentDate: "2026.06.28",
      store: "부산진구 가전스토어",
      buyoutPrice: 120000,
      address: "부산진구 부전동 123-45",
      phone: "010-1234-5678",
      recipient: "김부산"
    },
    {
      id: "ORD-20260527-456",
      productName: "삼성 비스포크 공기청정기",
      brand: "삼성",
      emoji: "🌬️",
      status: "배송중",
      monthlyPrice: 22000,
      period: 6,
      startDate: "2026.05.29",
      endDate: "2026.11.28",
      nextPaymentDate: "2026.06.27",
      store: "빌리드림 직영",
      buyoutPrice: null, // 인수 불가 상품
      address: "부산진구 부전동 123-45",
      phone: "010-1234-5678",
      recipient: "김부산"
    }
  ]);

  // 진행중 탭과 완료 탭 필터링
  const filteredRentals = rentals.filter(r => 
    activeTab === "active" 
      ? ["대기중", "배송중", "이용중", "반납대기"].includes(r.status) 
      : ["반납완료", "인수완료"].includes(r.status)
  );

  // 모달 열기
  const openActionModal = (rental, type) => {
    setSelectedRental(rental);
    setActiveModal(type);
    // 기본값 초기화
    setExtendPeriod("6");
    setTerminateReason("단순 변심");
    setTerminateDate(new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]); // 기본 2일 뒤 수거
  };

  // 모달 닫기
  const closeModal = () => {
    setActiveModal(null);
    setSelectedRental(null);
  };

  // 1. 기간 연장 처리
  const handleExtendConfirm = () => {
    setRentals(prev => prev.map(r => {
      if (r.id === selectedRental.id) {
        // 기존 만료일에 선택 개월 수 더하기
        const currentEnd = new Date(r.endDate.replace(/\./g, '/'));
        currentEnd.setMonth(currentEnd.getMonth() + parseInt(extendPeriod));
        
        // 연장에 따른 월 렌탈료 추가 할인 (예: 12개월 연장 시 15% 할인, 6개월 연장 시 10% 할인)
        let discountRate = 0.05;
        if (extendPeriod === "12") discountRate = 0.15;
        else if (extendPeriod === "6") discountRate = 0.10;
        
        const newMonthly = Math.round((r.monthlyPrice * (1 - discountRate)) / 100) * 100;
        
        return {
          ...r,
          period: r.period + parseInt(extendPeriod),
          endDate: currentEnd.toISOString().split('T')[0].replace(/-/g, '.'),
          monthlyPrice: newMonthly
        };
      }
      return r;
    }));
    alert(`🎉 연장 신청이 완료되었습니다!\n월 렌탈료가 할인 조정되어 다음 달부터 적용됩니다.`);
    closeModal();
  };

  // 2. 인수하기 처리
  const handleBuyoutConfirm = () => {
    setRentals(prev => prev.map(r => {
      if (r.id === selectedRental.id) {
        return {
          ...r,
          status: "인수완료",
          endDate: new Date().toISOString().split('T')[0].replace(/-/g, '.')
        };
      }
      return r;
    }));
    alert(`🎉 일시불 인수가 완료되었습니다!\n이제 해당 제품의 소유권은 고객님께 이전되며 더 이상 렌탈료가 청구되지 않습니다.`);
    closeModal();
    setActiveTab("past"); // 완료 탭으로 이동해서 확인하게 유도
  };

  // 3. 반납/해지 처리
  const handleTerminateConfirm = () => {
    setRentals(prev => prev.map(r => {
      if (r.id === selectedRental.id) {
        return {
          ...r,
          status: "반납대기",
          endDate: terminateDate.replace(/-/g, '.')
        };
      }
      return r;
    }));
    alert(`🚛 반납 신청이 완료되었습니다!\n지정하신 날짜(${terminateDate})에 기사님이 수거를 위해 방문할 예정입니다.`);
    closeModal();
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] pb-24 relative">
      {/* ── 헤더 (대시보드형 헤더로 변경) ── */}
      <header className="sticky top-0 bg-white shadow-sm z-30 p-4 border-b border-[var(--border-light)] flex items-center justify-between">
        <h1 className="text-[17px] font-black text-[var(--text-dark)]">나의 렌탈 관리</h1>
      </header>

      {/* ── 탭 메뉴 ── */}
      <div className="flex bg-white border-b border-[var(--border-light)] sticky top-[56px] z-30 shadow-sm">
        <button 
          onClick={() => setActiveTab("active")}
          className={`flex-1 py-3.5 text-[14px] font-bold transition-colors relative ${activeTab === "active" ? "text-[var(--accent)]" : "text-[var(--text-light)]"}`}
        >
          이용/진행 중 ({rentals.filter(r => ["대기중", "배송중", "이용중", "반납대기"].includes(r.status)).length})
          {activeTab === "active" && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[var(--accent)] rounded-t-full" />}
        </button>
        <button 
          onClick={() => setActiveTab("past")}
          className={`flex-1 py-3.5 text-[14px] font-bold transition-colors relative ${activeTab === "past" ? "text-[var(--accent)]" : "text-[var(--text-light)]"}`}
        >
          해지/반납 완료 ({rentals.filter(r => ["반납완료", "인수완료"].includes(r.status)).length})
          {activeTab === "past" && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[var(--accent)] rounded-t-full" />}
        </button>
      </div>

      {/* ── 렌탈 리스트 ── */}
      <main className="p-4 space-y-4">
        {filteredRentals.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-[var(--border-light)]">
            <Package size={44} className="mx-auto text-[var(--text-lighter)] mb-3" />
            <p className="text-[13px] font-bold text-[var(--text-light)]">해당하는 렌탈 신청 내역이 없습니다.</p>
          </div>
        ) : (
          filteredRentals.map(rental => (
            <div key={rental.id} className="bg-white rounded-[var(--radius-lg)] shadow-card border border-[var(--border-light)] overflow-hidden anim-fade-in">
              {/* 카드 헤더 (주문 상태 및 날짜) */}
              <div className="px-4 py-3 border-b border-[var(--border-light)] flex justify-between items-center bg-gray-50/50">
                <span className="text-[11px] font-bold text-[var(--text-lighter)] tracking-wider">
                  계약번호 {rental.id}
                </span>
                <span className={`text-[11px] font-black px-2 py-0.5 rounded ${
                  rental.status === "이용중" ? "bg-[var(--success-soft)] text-[var(--success)]" :
                  rental.status === "배송중" ? "bg-blue-50 text-blue-600" :
                  rental.status === "반납대기" ? "bg-amber-50 text-amber-600" :
                  rental.status === "인수완료" ? "bg-purple-50 text-purple-600" :
                  "bg-[var(--bg-sub)] text-[var(--text)]"
                }`}>
                  {rental.status}
                </span>
              </div>

              {/* 상품 정보 */}
              <div className="p-4 flex gap-4">
                <div className="w-[64px] h-[64px] bg-[var(--bg-sub)] rounded-[var(--radius-md)] flex items-center justify-center text-[32px] flex-shrink-0">
                  {rental.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-[var(--text-light)] font-medium">{rental.brand} · {rental.store}</p>
                  <h3 className="text-[14px] font-bold text-[var(--text-dark)] leading-tight mt-0.5 truncate">{rental.productName}</h3>
                  <p className="text-[14px] font-black text-[var(--accent)] mt-1.5">{rental.monthlyPrice.toLocaleString()}원 <span className="text-[11px] font-normal text-[var(--text-light)]">/월 ({rental.period}개월 약정)</span></p>
                </div>
              </div>

              {/* 상세 계약 데이터 */}
              <div className="px-4 py-3 mx-4 mb-4 bg-gray-50 rounded-xl space-y-2 text-[12px]">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-light)] font-medium flex items-center gap-1"><Clock size={13}/> 렌탈 기간</span>
                  <span className="font-bold text-[var(--text-dark)]">{rental.startDate} ~ {rental.endDate}</span>
                </div>
                {rental.status === "이용중" && (
                  <div className="flex justify-between items-center border-t border-gray-200/50 pt-2">
                    <span className="text-[var(--text-light)] font-medium flex items-center gap-1"><ShieldCheck size={13}/> 다음 결제일</span>
                    <span className="font-bold text-[var(--primary)]">{rental.nextPaymentDate} (결제예정)</span>
                  </div>
                )}
                {rental.status === "반납대기" && (
                  <div className="flex justify-between items-center border-t border-gray-200/50 pt-2 text-amber-600">
                    <span className="font-medium flex items-center gap-1"><AlertCircle size={13}/> 반납 수거일</span>
                    <span className="font-bold">{rental.endDate} (수거 대기)</span>
                  </div>
                )}
              </div>

              {/* 관리 액션 버튼 영역 (이용중일 때만 활성화) */}
              {rental.status === "이용중" && (
                <div className="grid grid-cols-3 border-t border-[var(--border-light)] divide-x divide-[var(--border-light)] bg-white">
                  <button 
                    onClick={() => openActionModal(rental, "extend")} 
                    className="py-3 flex flex-col items-center justify-center gap-0.5 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  >
                    <RefreshCw size={16} className="text-[var(--text-light)]" />
                    <span className="text-[11px] font-bold text-[var(--text-dark)]">기간 연장</span>
                  </button>
                  <button 
                    onClick={() => openActionModal(rental, "terminate")} 
                    className="py-3 flex flex-col items-center justify-center gap-0.5 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  >
                    <AlertCircle size={16} className="text-[var(--text-light)]" />
                    <span className="text-[11px] font-bold text-[var(--text-dark)]">반납/해지</span>
                  </button>
                  {rental.buyoutPrice ? (
                    <button 
                      onClick={() => openActionModal(rental, "buyout")} 
                      className="py-3 flex flex-col items-center justify-center gap-0.5 hover:bg-purple-50 active:bg-purple-100 transition-colors"
                    >
                      <HandCoins size={16} className="text-purple-500" />
                      <span className="text-[11px] font-bold text-purple-700">인수하기</span>
                    </button>
                  ) : (
                    <div className="py-3 flex flex-col items-center justify-center gap-0.5 bg-gray-50/50 opacity-40 cursor-not-allowed">
                      <HandCoins size={16} className="text-gray-400" />
                      <span className="text-[11px] font-bold text-gray-500">인수 불가</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </main>

      {/* ── 1. 기간 연장 모달 (Bottom Sheet 스타일) ── */}
      {activeModal === "extend" && selectedRental && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 anim-fade-in">
          <div className="absolute inset-0" onClick={closeModal} />
          <div className="bg-white w-full max-w-[480px] rounded-t-3xl p-5 shadow-2xl relative z-10 safe-bottom max-h-[90vh] overflow-y-auto">
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[16px] font-black text-[var(--text-dark)]">📆 렌탈 약정 기간 연장</h3>
              <button onClick={closeModal} className="p-1 text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            
            <p className="text-[12.5px] text-[var(--text-light)] mb-4 leading-relaxed">
              약정을 연장하시면 월 렌탈료가 자동으로 할인되며, 계약 만료일까지 계속 할인된 요금이 적용됩니다.
            </p>

            {/* 연장 옵션 선택 */}
            <div className="grid grid-cols-3 gap-2.5 mb-5">
              {[
                { v: "3", l: "3개월 연장", d: "월 5% 할인" },
                { v: "6", l: "6개월 연장", d: "월 10% 할인" },
                { v: "12", l: "12개월 연장", d: "월 15% 할인" },
              ].map(opt => (
                <button 
                  key={opt.v} 
                  onClick={() => setExtendPeriod(opt.v)}
                  className={`py-3 px-1.5 rounded-xl border text-center transition-all ${
                    extendPeriod === opt.v 
                      ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] shadow-sm' 
                      : 'border-gray-200 bg-white hover:border-[var(--accent-soft)]'
                  }`}
                >
                  <span className="text-[12.5px] font-bold block">{opt.l}</span>
                  <span className="text-[10px] text-[var(--text-light)] mt-0.5 block">{opt.d}</span>
                </button>
              ))}
            </div>

            {/* 요금 변동 시뮬레이션 */}
            <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-[12.5px] mb-6">
              <div className="flex justify-between">
                <span className="text-[var(--text-light)]">현재 월 렌탈료</span>
                <span className="font-bold text-[var(--text-dark)]">{selectedRental.monthlyPrice.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-[var(--accent)] font-bold">
                <span>연장 후 월 렌탈료</span>
                <span>
                  {Math.round((selectedRental.monthlyPrice * (1 - (extendPeriod === "12" ? 0.15 : extendPeriod === "6" ? 0.10 : 0.05))) / 100 * 100).toLocaleString()}원
                  <span className="text-[10px] font-normal ml-0.5 text-gray-500">
                    ({extendPeriod === "12" ? "15%" : extendPeriod === "6" ? "10%" : "5%"} 자동 인하)
                  </span>
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200/50 pt-2 mt-2">
                <span className="text-[var(--text-light)]">연장 후 약정 종료일</span>
                <span className="font-bold text-[var(--primary)]">
                  {(() => {
                    const d = new Date(selectedRental.endDate.replace(/\./g, '/'));
                    d.setMonth(d.getMonth() + parseInt(extendPeriod));
                    return d.toISOString().split('T')[0].replace(/-/g, '.');
                  })()}
                </span>
              </div>
            </div>

            <button 
              onClick={handleExtendConfirm}
              className="w-full bg-[var(--accent)] text-white font-bold py-4 rounded-xl text-[14px] hover:bg-[var(--accent-hover)] transition-all active:scale-[0.98] shadow-md"
            >
              연장 신청 완료하기
            </button>
          </div>
        </div>
      )}

      {/* ── 2. 인수하기 모달 (Bottom Sheet 스타일) ── */}
      {activeModal === "buyout" && selectedRental && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 anim-fade-in">
          <div className="absolute inset-0" onClick={closeModal} />
          <div className="bg-white w-full max-w-[480px] rounded-t-3xl p-5 shadow-2xl relative z-10 safe-bottom max-h-[90vh] overflow-y-auto">
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[16px] font-black text-[var(--text-dark)]">🔄 제품 일시불 인수</h3>
              <button onClick={closeModal} className="p-1 text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            
            <p className="text-[12.5px] text-[var(--text-light)] mb-4 leading-relaxed">
              해당 기기를 완전히 본인 소유로 인수할 수 있습니다. 남은 약정 기간에 비례해 계산된 인수 정산금을 결제하시면 소유권이 영구 이전됩니다.
            </p>

            {/* 인수 정산금 계산 */}
            <div className="bg-gray-50 rounded-2xl p-4 space-y-2.5 text-[12.5px] mb-5">
              <div className="flex justify-between">
                <span className="text-[var(--text-light)]">잔여 의무 사용 기간</span>
                <span className="font-bold text-[var(--text-dark)]">6개월 남음</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-light)]">약정 소유권 이전 가격</span>
                <span className="font-bold text-[var(--text-dark)]">120,000원</span>
              </div>
              <div className="flex justify-between border-t border-gray-200/50 pt-2.5 mt-2.5 text-[14px]">
                <span className="font-bold text-[var(--text-dark)]">최종 인수 정산금</span>
                <span className="font-black text-purple-600">{selectedRental.buyoutPrice.toLocaleString()}원</span>
              </div>
            </div>

            {/* 결제 수단 선택 */}
            <div className="mb-6">
              <span className="text-[13px] font-bold text-[var(--text-dark)] mb-2 block">결제 수단 선택</span>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setPaymentMethod("card")}
                  className={`py-3 px-3 rounded-xl border text-center transition-all flex items-center justify-center gap-2 text-[12.5px] font-bold ${
                    paymentMethod === "card" ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]' : 'border-gray-200 bg-white'
                  }`}
                >
                  <CreditCard size={16}/> 등록된 카드로 결제
                </button>
                <button 
                  onClick={() => setPaymentMethod("kakao")}
                  className={`py-3 px-3 rounded-xl border text-center transition-all flex items-center justify-center gap-2 text-[12.5px] font-bold ${
                    paymentMethod === "kakao" ? 'border-yellow-400 bg-yellow-50 text-yellow-800' : 'border-gray-200 bg-white'
                  }`}
                >
                  💬 카카오페이 결제
                </button>
              </div>
            </div>

            <button 
              onClick={handleBuyoutConfirm}
              className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl text-[14px] hover:bg-purple-700 transition-all active:scale-[0.98] shadow-md"
            >
              정산금 결제 및 인수 완료하기
            </button>
          </div>
        </div>
      )}

      {/* ── 3. 반납/해지 모달 (Bottom Sheet 스타일) ── */}
      {activeModal === "terminate" && selectedRental && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 anim-fade-in">
          <div className="absolute inset-0" onClick={closeModal} />
          <div className="bg-white w-full max-w-[480px] rounded-t-3xl p-5 shadow-2xl relative z-10 safe-bottom max-h-[90vh] overflow-y-auto">
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[16px] font-black text-[var(--text-dark)]">🚛 렌탈 반납/해지 신청</h3>
              <button onClick={closeModal} className="p-1 text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            
            <p className="text-[12.5px] text-[var(--text-light)] mb-4 leading-relaxed">
              약정 기간 내에 중도 반납 시 위약금이 발생할 수 있습니다. 아래 내용을 확인 후 신청해 주시기 바랍니다.
            </p>

            {/* 반납 사유 선택 */}
            <div className="mb-4">
              <span className="text-[13px] font-bold text-[var(--text-dark)] mb-2 block">반납 사유</span>
              <select 
                value={terminateReason}
                onChange={e => setTerminateReason(e.target.value)}
                className="w-full border border-gray-200 bg-white rounded-xl p-3 text-[13px] outline-none"
              >
                <option value="단순 변심">단순 변심 (타제품 사용 등)</option>
                <option value="이사/이전">이사 / 거주지 이전</option>
                <option value="제품 불만족">제품 상태 또는 서비스 불만족</option>
                <option value="기타">기타 사유</option>
              </select>
            </div>

            {/* 해지 위약금 안내 */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 space-y-2 text-[12px] text-amber-800 mb-5">
              <div className="flex justify-between font-bold">
                <span>해지 위약금 안내</span>
                <span>위약금 0원 (안심 중고 특화 혜택)</span>
              </div>
              <p className="text-[10.5px] text-amber-700 leading-normal">
                ※ 빌리드림은 사장님 매장 직접 중고 렌탈 서비스로, 약정 6개월 이상 유지 시 중도 해지 위약금 전면 면제 혜택이 적용되어 위약금 없이 반납이 가능합니다. (왕복 회수비 20,000원만 청구)
              </p>
            </div>

            {/* 수거 정보 입력 */}
            <div className="space-y-3 mb-6">
              <div>
                <span className="text-[13px] font-bold text-[var(--text-dark)] mb-1.5 block">반납/수거 희망일</span>
                <div className="relative">
                  <input 
                    type="date" 
                    value={terminateDate}
                    onChange={e => setTerminateDate(e.target.value)}
                    min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // 내일부터 선택 가능
                    className="w-full border border-gray-200 bg-white rounded-xl p-3 pl-10 text-[13px] outline-none"
                  />
                  <Calendar size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                </div>
              </div>
              <div>
                <span className="text-[13px] font-bold text-[var(--text-dark)] mb-1.5 block">수거지 주소</span>
                <div className="bg-gray-50 border border-gray-200/50 rounded-xl p-3 text-[12.5px] text-[var(--text-light)] flex items-start gap-2">
                  <MapPin size={16} className="mt-0.5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-[var(--text-dark)]">{selectedRental.recipient}</p>
                    <p className="mt-0.5">{selectedRental.address}</p>
                    <p className="text-[11px] mt-0.5">{selectedRental.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleTerminateConfirm}
              className="w-full bg-[var(--primary)] text-white font-bold py-4 rounded-xl text-[14px] hover:bg-[#4A3A2F] transition-all active:scale-[0.98] shadow-md"
            >
              반납 신청서 제출하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
