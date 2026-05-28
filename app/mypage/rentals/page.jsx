"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Package, Clock, ShieldCheck, RefreshCw, HandCoins, AlertCircle } from "lucide-react";

export default function MyRentalsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("active");

  // 가상의 렌탈 내역 데이터
  const mockRentals = [
    {
      id: "ORD-20260528-123",
      productName: "LG 듀얼인버터 제습기 20L",
      brand: "LG",
      emoji: "💧",
      status: "이용중", // 대기중, 배송중, 이용중, 반납완료, 인수완료
      monthlyPrice: 15000,
      period: 12,
      startDate: "2026.06.01",
      endDate: "2027.05.31",
      nextPaymentDate: "2026.06.28",
      store: "부산진구 가전스토어",
      buyoutPrice: 120000,
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
    }
  ];

  const handleAction = (actionName) => {
    alert(`[${actionName}] 신청이 접수되었습니다.\n담당자가 확인 후 연락드리겠습니다.`);
  };

  const filteredRentals = mockRentals.filter(r => 
    activeTab === "active" ? ["대기중", "배송중", "이용중"].includes(r.status) : ["반납완료", "인수완료"].includes(r.status)
  );

  return (
    <div className="min-h-screen bg-[var(--bg-main)] pb-24">
      {/* ── 헤더 ── */}
      <header className="sticky top-0 bg-[var(--bg-card)] shadow-sm z-10 p-4 flex items-center border-b border-[var(--border-light)]">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-[var(--text)]">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-[16px] font-bold ml-2 text-[var(--text-dark)]">렌탈 내역 상세</h1>
      </header>

      {/* ── 탭 메뉴 ── */}
      <div className="flex bg-[var(--bg-card)] border-b border-[var(--border-light)] sticky top-[60px] z-10">
        <button 
          onClick={() => setActiveTab("active")}
          className={`flex-1 py-3 text-[14px] font-bold transition-colors relative ${activeTab === "active" ? "text-[var(--primary)]" : "text-[var(--text-light)]"}`}
        >
          진행 중
          {activeTab === "active" && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[var(--primary)] rounded-t-full" />}
        </button>
        <button 
          onClick={() => setActiveTab("past")}
          className={`flex-1 py-3 text-[14px] font-bold transition-colors relative ${activeTab === "past" ? "text-[var(--primary)]" : "text-[var(--text-light)]"}`}
        >
          완료/해지
          {activeTab === "past" && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[var(--primary)] rounded-t-full" />}
        </button>
      </div>

      {/* ── 렌탈 리스트 ── */}
      <main className="p-4 space-y-4">
        {filteredRentals.length === 0 ? (
          <div className="text-center py-20">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-[14px] font-medium text-[var(--text-light)]">해당하는 렌탈 내역이 없습니다.</p>
          </div>
        ) : (
          filteredRentals.map(rental => (
            <div key={rental.id} className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] shadow-sm border border-[var(--border-light)] overflow-hidden">
              {/* 카드 헤더 (주문 상태 및 날짜) */}
              <div className="px-4 py-3 border-b border-[var(--border-light)] flex justify-between items-center bg-gray-50/50">
                <span className="text-[12px] font-medium text-[var(--text-light)]">
                  주문 {rental.id}
                </span>
                <span className={`text-[12px] font-black px-2 py-1 rounded-md ${
                  rental.status === "이용중" ? "bg-[var(--success-soft)] text-[var(--success)]" :
                  rental.status === "배송중" ? "bg-blue-50 text-blue-600" :
                  "bg-[var(--bg-sub)] text-[var(--text)]"
                }`}>
                  {rental.status}
                </span>
              </div>

              {/* 상품 정보 */}
              <div className="p-4 flex gap-4">
                <div className="w-[72px] h-[72px] bg-[var(--bg-sub)] rounded-[var(--radius-md)] flex items-center justify-center text-[36px] flex-shrink-0">
                  {rental.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-[var(--text-light)]">{rental.brand} · {rental.store}</p>
                  <h3 className="text-[15px] font-bold text-[var(--text-dark)] leading-tight mt-0.5 truncate">{rental.productName}</h3>
                  <p className="text-[14px] font-black text-[var(--accent)] mt-1.5">{rental.monthlyPrice.toLocaleString()}원 <span className="text-[11px] font-normal text-[var(--text-light)]">/월 ({rental.period}개월)</span></p>
                </div>
              </div>

              {/* 계약 기간 및 결제 정보 */}
              <div className="px-4 py-3 mx-4 mb-4 bg-[#F8F9FB] rounded-lg">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[12px] font-medium text-[var(--text-light)] flex items-center gap-1"><Clock size={14}/> 계약 기간</span>
                  <span className="text-[12px] font-bold text-[var(--text-dark)]">{rental.startDate} ~ {rental.endDate}</span>
                </div>
                {rental.status === "이용중" && (
                  <div className="flex justify-between items-center border-t border-[var(--border)] pt-1.5 mt-1.5">
                    <span className="text-[12px] font-medium text-[var(--text-light)] flex items-center gap-1"><ShieldCheck size={14}/> 다음 결제일</span>
                    <span className="text-[12px] font-bold text-[var(--primary)]">{rental.nextPaymentDate}</span>
                  </div>
                )}
              </div>

              {/* 관리 버튼 영역 (이용중일 때만 노출) */}
              {rental.status === "이용중" && (
                <div className="grid grid-cols-3 border-t border-[var(--border-light)] divide-x divide-[var(--border-light)]">
                  <button onClick={() => handleAction("연장")} className="py-3.5 flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors active:bg-gray-100">
                    <RefreshCw size={18} className="text-[var(--text-light)]" />
                    <span className="text-[12px] font-bold text-[var(--text-dark)]">기간 연장</span>
                  </button>
                  <button onClick={() => handleAction("반납")} className="py-3.5 flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors active:bg-gray-100">
                    <AlertCircle size={18} className="text-[var(--text-light)]" />
                    <span className="text-[12px] font-bold text-[var(--text-dark)]">반납 신청</span>
                  </button>
                  {rental.buyoutPrice ? (
                    <button onClick={() => handleAction("인수")} className="py-3.5 flex flex-col items-center justify-center gap-1 hover:bg-purple-50 transition-colors active:bg-purple-100">
                      <HandCoins size={18} className="text-purple-500" />
                      <span className="text-[12px] font-bold text-purple-700">인수하기</span>
                    </button>
                  ) : (
                    <div className="py-3.5 flex flex-col items-center justify-center gap-1 opacity-40 cursor-not-allowed bg-gray-50">
                      <HandCoins size={18} className="text-gray-400" />
                      <span className="text-[12px] font-bold text-gray-500">인수 불가</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </main>
    </div>
  );
}
