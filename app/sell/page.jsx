"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Camera, ChevronLeft, Check, AlertCircle, Calendar, 
  MapPin, Phone, User, TrendingUp, Landmark, ShieldAlert,
  ArrowRight, Store, X, Info
} from "lucide-react";

export default function SellPage() {
  const router = useRouter();
  const [step, setStep] = useState("form"); // "form" | "loading" | "board"
  
  // 폼 입력 상태
  const [category, setCategory] = useState("dehumidifier");
  const [brand, setBrand] = useState("위닉스");
  const [modelName, setModelName] = useState("");
  const [purchaseYear, setPurchaseYear] = useState("2024");
  const [condition, setCondition] = useState("A"); // S | A | B
  const [quoteType, setQuoteType] = useState("sell"); // "sell" (견적+판매) | "estimate" (견적만)
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [name, setName] = useState("김부산");
  const [phone, setPhone] = useState("010-1234-5678");
  const [district, setDistrict] = useState("부산진구");

  // 모달 및 수거 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);
  const [pickupDate, setPickupDate] = useState("");
  const [pickupAddress, setPickupAddress] = useState("부산진구 부전동 123-45");
  
  // 입찰 매장 리스트 상태
  const [bids, setBids] = useState([
    { id: 1, storeName: "빌리드림 직영 매입", logo: "✨", price: 150000, status: "pending", speed: "⚡ 당일 수거 가능" },
    { id: 2, storeName: "부산진구 가전스토어", logo: "🏪", price: 138000, status: "pending", speed: "내일 수거 가능" },
    { id: 3, storeName: "서면 알뜰가전샵", logo: "🔌", price: 120000, status: "pending", speed: "3일 내 수거 가능" }
  ]);

  // 로딩에서 보드로 넘어가는 지연 타이머
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!modelName.trim()) {
      alert("모델명 또는 제품명을 입력해주세요.");
      return;
    }
    setStep("loading");
  };

  useEffect(() => {
    if (step === "loading") {
      const timer = setTimeout(() => {
        setStep("board");
        // 기본 수거일 설정 (내일 모레)
        const dayAfterTomorrow = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
        setPickupDate(dayAfterTomorrow);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // 사진 업로드 시뮬레이션
  const handlePhotoUpload = () => {
    setPhotoUploaded(true);
  };

  // 판매 수락 모달 열기
  const openConfirmModal = (bid) => {
    setSelectedBid(bid);
    setIsModalOpen(true);
  };

  // 최종 판매 및 수거 예약 확정
  const handleConfirmPickup = () => {
    setBids(prev => prev.map(b => {
      if (b.id === selectedBid.id) {
        return { ...b, status: "accepted" };
      }
      return { ...b, status: "declined" };
    }));
    setIsModalOpen(false);
    alert(`🎉 중고 매입 수거 예약이 완료되었습니다!\n확정일자(${pickupDate})에 기사님이 수거 후 검수를 거쳐 현장에서 즉시 송금해 드립니다.`);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] pb-24 relative">
      {/* ── 1단계: 견적 신청 폼 ── */}
      {step === "form" && (
        <div>
          <header className="sticky top-0 bg-white shadow-sm z-30 p-4 border-b border-[var(--border-light)] flex items-center justify-between">
            <h1 className="text-[17px] font-black text-[var(--text-dark)]">중고 가전 견적·판매 신청</h1>
          </header>

          <main className="p-5 space-y-6 max-w-md mx-auto">
            {/* 상단 기획 배너 */}
            <div className="bg-gradient-to-r from-[var(--primary)] to-[#4A3A2F] text-white p-5 rounded-2xl shadow-sm relative overflow-hidden">
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-bold">내 가전 최고가 처분</span>
              <h2 className="text-[16px] font-black mt-2 leading-snug">쓰던 가전 사진 찍어 올리면<br/>동네 매장들이 견적을 보내드려요</h2>
              <p className="text-[11px] text-white/80 mt-1">시세 조회만 해보는 것도 가능합니다.</p>
              <div className="absolute right-4 bottom-2 text-[50px] opacity-15">💸</div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 카테고리 선택 */}
              <div>
                <label className="text-[13px] font-black text-[var(--text-dark)] mb-2 block">가전 품목</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { v: "dehumidifier", l: "제습기", e: "💧" },
                    { v: "air-purifier", l: "공기청정", e: "🌬️" },
                    { v: "dryer", l: "건조기", e: "👕" },
                    { v: "washer", l: "세탁기", e: "🌀" }
                  ].map(cat => (
                    <button
                      type="button"
                      key={cat.v}
                      onClick={() => setCategory(cat.v)}
                      className={`py-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center min-h-[64px] shadow-sm ${
                        category === cat.v 
                          ? 'border-[var(--accent)] bg-[var(--accent-soft)]' 
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <span className="text-[20px]">{cat.e}</span>
                      <span className={`text-[11px] font-bold mt-1 ${category === cat.v ? 'text-[var(--accent)]' : 'text-[var(--text-dark)]'}`}>{cat.l}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 브랜드 선택 */}
              <div>
                <label className="text-[13px] font-black text-[var(--text-dark)] mb-2 block">제조사 (브랜드)</label>
                <div className="grid grid-cols-4 gap-2">
                  {["삼성전자", "LG전자", "위닉스", "캐리어"].map(br => (
                    <button
                      type="button"
                      key={br}
                      onClick={() => setBrand(br)}
                      className={`py-2 rounded-lg border text-[12px] font-bold transition-all shadow-sm ${
                        brand === br 
                          ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]' 
                          : 'border-gray-200 bg-white text-[var(--text)]'
                      }`}
                    >
                      {br}
                    </button>
                  ))}
                </div>
              </div>

              {/* 모델명 / 기기 정보 */}
              <div>
                <label className="text-[13px] font-black text-[var(--text-dark)] mb-2 block">모델명 또는 제품명</label>
                <input
                  type="text"
                  required
                  placeholder="예: 위닉스 뽀송 10L, 삼성 비스포크 공기청정기"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl text-[13.5px] placeholder:text-[var(--text-lighter)] outline-none focus:ring-2 focus:ring-[var(--accent-soft)] focus:border-[var(--accent)] transition-all shadow-sm"
                />
              </div>

              {/* 구입년도 / 상태 선택 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[13px] font-black text-[var(--text-dark)] mb-2 block">구입 연도</label>
                  <select
                    value={purchaseYear}
                    onChange={(e) => setPurchaseYear(e.target.value)}
                    className="w-full h-12 px-3 bg-white border border-gray-200 rounded-xl text-[13.5px] outline-none shadow-sm"
                  >
                    {["2026", "2025", "2024", "2023", "2022", "2021", "2020 이전"].map(y => (
                      <option key={y} value={y}>{y}년</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[13px] font-black text-[var(--text-dark)] mb-2 block">제품 상태</label>
                  <div className="grid grid-cols-3 gap-1 h-12 bg-gray-100 p-1 rounded-xl">
                    {[
                      { v: "S", l: "S급", desc: "기스 없음" },
                      { v: "A", l: "A급", desc: "미세 기스" },
                      { v: "B", l: "B급", desc: "생활 흔적" }
                    ].map(cond => (
                      <button
                        type="button"
                        key={cond.v}
                        onClick={() => setCondition(cond.v)}
                        className={`rounded-lg text-[12px] font-bold transition-all ${
                          condition === cond.v 
                            ? 'bg-white text-[var(--accent)] shadow-sm' 
                            : 'text-[var(--text-light)] hover:text-[var(--text-dark)]'
                        }`}
                      >
                        {cond.l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 신청 유형 토글 */}
              <div>
                <label className="text-[13px] font-black text-[var(--text-dark)] mb-2 block">신청 목적</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setQuoteType("sell")}
                    className={`py-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center shadow-sm ${
                      quoteType === "sell" 
                        ? 'border-[var(--accent)] bg-[var(--accent-soft)]' 
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <span className={`text-[13px] font-bold ${quoteType === "sell" ? 'text-[var(--accent)]' : 'text-[var(--text-dark)]'}`}>견적 후 즉시 판매</span>
                    <span className="text-[10px] text-[var(--text-light)] mt-0.5">최고가 업체 매칭</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuoteType("estimate")}
                    className={`py-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center shadow-sm ${
                      quoteType === "estimate" 
                        ? 'border-[var(--accent)] bg-[var(--accent-soft)]' 
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <span className={`text-[13px] font-bold ${quoteType === "estimate" ? 'text-[var(--accent)]' : 'text-[var(--text-dark)]'}`}>단순 시세 견적만 조회</span>
                    <span className="text-[10px] text-[var(--text-light)] mt-0.5">팔지 않고 가치만 감정</span>
                  </button>
                </div>
              </div>

              {/* 사진 등록 시뮬레이터 */}
              <div>
                <label className="text-[13px] font-black text-[var(--text-dark)] mb-2 block">제품 사진</label>
                {!photoUploaded ? (
                  <button
                    type="button"
                    onClick={handlePhotoUpload}
                    className="w-full h-32 bg-white border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-1.5 hover:border-[var(--accent)] transition-colors group shadow-sm"
                  >
                    <Camera size={26} className="text-gray-400 group-hover:text-[var(--accent)] transition-colors" />
                    <span className="text-[12.5px] font-bold text-[var(--text-light)] group-hover:text-[var(--text-dark)]">기기 정면 사진 첨부하기</span>
                    <span className="text-[10.5px] text-[var(--text-lighter)]">매입 검수를 위해 1장 이상 등록</span>
                  </button>
                ) : (
                  <div className="relative w-full h-32 bg-gray-100 rounded-2xl border border-[var(--border-light)] overflow-hidden flex items-center justify-center">
                    {/* 가상 업로드 완료 표시 */}
                    <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1 shadow-md">
                      <Check size={14} />
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <span className="text-[44px]">💧</span>
                      <span className="text-[12px] font-bold text-gray-700 mt-1">업로드된 가전_정면.jpg</span>
                      <button 
                        type="button" 
                        onClick={() => setPhotoUploaded(false)}
                        className="text-[10.5px] text-red-500 font-bold underline mt-1"
                      >
                        사진 지우기
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 기본 정보 등록 */}
              <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-[12px] font-black text-[var(--text-dark)] flex items-center gap-1">
                  <Info size={14} className="text-gray-400" /> 신청자 연락처 정보
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="이름"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-10 px-3 bg-white border border-gray-200 rounded-xl text-[12.5px] outline-none"
                  />
                  <input
                    type="text"
                    required
                    placeholder="지역 (예: 부산진구)"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="h-10 px-3 bg-white border border-gray-200 rounded-xl text-[12.5px] outline-none"
                  />
                </div>
                <input
                  type="tel"
                  required
                  placeholder="연락처 (010-0000-0000)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-gray-200 rounded-xl text-[12.5px] outline-none"
                />
              </div>

              {/* 제출 버튼 */}
              <button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-[var(--accent)] to-[var(--primary)] text-white font-bold rounded-2xl text-[14.5px] shadow-glow active:scale-[0.98] transition-all"
              >
                {quoteType === "sell" ? "🔥 최고가 견적 받아보기" : "🔍 예상 중고 시세 조회하기"}
              </button>
            </form>
          </main>
        </div>
      )}

      {/* ── 2단계: 실시간 견적 입찰중 로딩 화면 ── */}
      {step === "loading" && (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mb-6" />
          <h2 className="text-[18px] font-black text-[var(--text-dark)]">🔍 빌리드림 감정 위원회 평가 중...</h2>
          <p className="text-[13px] text-[var(--text-light)] mt-2 leading-relaxed">
            업로드하신 중고 {brand} 제품 상태 등급({condition}급)을 기반으로<br/>
            빌리드림 직영점 및 근처 제휴 업체들의 견적 가격을 취합하고 있습니다.
          </p>
          <span className="text-[11px] text-[var(--text-lighter)] mt-8">잠시만 기다려주세요 (평균 1.5초 소요)</span>
        </div>
      )}

      {/* ── 3단계: 견적 확인 및 판매 입찰 대시보드 ── */}
      {step === "board" && (
        <div>
          <header className="sticky top-0 bg-white shadow-sm z-30 p-4 border-b border-[var(--border-light)] flex items-center justify-between">
            <button onClick={() => setStep("form")} className="p-1 -ml-1 text-gray-400 hover:text-gray-600">
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-[15px] font-black text-[var(--text-dark)]">중고 가전 견적 분석 결과</h1>
            <div className="w-6" /> {/* 정렬 균형용 */}
          </header>

          <main className="p-5 space-y-5 max-w-md mx-auto">
            {/* 제출 요약 정보 카드 */}
            <div className="bg-white rounded-2xl p-4 border border-[var(--border-light)] shadow-sm flex items-center gap-3">
              <div className="w-12 h-12 bg-[var(--bg-sub)] rounded-xl flex items-center justify-center text-[24px]">
                {category === "dehumidifier" ? "💧" : category === "air-purifier" ? "🌬️" : category === "dryer" ? "👕" : "🌀"}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-gray-500">{brand} · {purchaseYear}년 구매 · {condition}급</span>
                <h3 className="text-[13.5px] font-bold text-[var(--text-dark)] truncate leading-tight mt-0.5">{modelName || `${brand} 중고 가전`}</h3>
                <span className="text-[10px] text-[var(--text-light)]">📍 접수지: {district}</span>
              </div>
              <span className="text-[11px] font-bold bg-[var(--success-soft)] text-[var(--success)] px-2 py-1 rounded-full">감정완료</span>
            </div>

            {/* A. 견적조회 전용 뷰 */}
            {quoteType === "estimate" ? (
              <div className="space-y-4">
                {/* 시세 요약 카드 */}
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-2xl p-5 text-center shadow-sm">
                  <TrendingUp size={28} className="mx-auto text-emerald-600 mb-2" />
                  <p className="text-[12px] font-bold text-emerald-800">감정된 예상 중고 시세 범위</p>
                  <h2 className="text-[24px] font-black text-emerald-900 mt-1">125,000원 ~ 148,000원</h2>
                  <p className="text-[10.5px] text-emerald-700 mt-2">※ 기기 내부 기능 상태 및 실물 훼손 수준에 따라 변동 가능합니다.</p>
                </div>

                {/* 최고가 처분 제안 배너 */}
                <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-3">
                  <h4 className="text-[13px] font-black text-gray-700 flex items-center gap-1">
                    🌟 지금 바로 최고가에 매각하고 싶으시다면?
                  </h4>
                  <p className="text-[12px] text-gray-500 leading-normal">
                    현재 빌리드림에서 보장하는 **최고가 매입 제안 가격은 150,000원**입니다. 방문 수거 일정을 지정하시면 바로 현장에서 수거 및 이체해 드립니다.
                  </p>
                  <button
                    onClick={() => setQuoteType("sell")}
                    className="w-full py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-[13px] font-bold rounded-xl shadow transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                  >
                    이 가격에 판매 신청하기 <ArrowRight size={15}/>
                  </button>
                </div>
              </div>
            ) : (
              // B. 입찰/판매 제안 뷰
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3 text-blue-800">
                  <AlertCircle size={18} className="flex-shrink-0 mt-0.5 text-blue-600" />
                  <div className="text-[12px] leading-relaxed">
                    <p className="font-bold">업체별 실시간 견적 입찰 결과</p>
                    <p className="text-blue-700 mt-0.5">매장을 선택하시면 직접 찾아와 무료 수거 후 정산금을 즉시 입금해 드립니다.</p>
                  </div>
                </div>

                {/* 매장 입찰 리스트 */}
                <div className="space-y-3">
                  {bids.map((bid) => {
                    const isAccepted = bid.status === "accepted";
                    const isDeclined = bid.status === "declined";

                    return (
                      <div 
                        key={bid.id} 
                        className={`bg-white rounded-2xl p-4 border transition-all ${
                          isAccepted ? 'border-emerald-500 ring-2 ring-emerald-50 shadow-md' :
                          isDeclined ? 'opacity-40 border-gray-200 scale-98 pointer-events-none' :
                          'border-[var(--border-light)] hover:border-gray-300 shadow-sm'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-[20px]">{bid.logo}</span>
                            <div>
                              <span className="text-[13px] font-black text-[var(--text-dark)]">{bid.storeName}</span>
                              <span className="text-[10px] block text-[var(--text-lighter)]">{bid.speed}</span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <span className="text-[16px] font-black text-[var(--accent)]">{bid.price.toLocaleString()}원</span>
                            <span className="text-[10px] block text-[var(--text-light)]">최종 제시가</span>
                          </div>
                        </div>

                        {/* 조작 액션 영역 */}
                        <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between items-center">
                          <span className="text-[10.5px] text-[var(--text-lighter)]">
                            {isAccepted ? `📅 ${pickupDate} 수거 방문 예약됨` : "왕복 출장/수거비 전액 무료"}
                          </span>

                          {isAccepted ? (
                            <span className="text-[12px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg flex items-center gap-1">
                              <Check size={14} /> 판매 승인 완료
                            </span>
                          ) : isDeclined ? (
                            <span className="text-[11px] text-gray-400">계약 종료</span>
                          ) : (
                            <button
                              onClick={() => openConfirmModal(bid)}
                              className="bg-[var(--primary)] hover:bg-[#4A3A2F] text-white text-[11.5px] font-bold px-4 py-2 rounded-lg transition-colors shadow-sm active:scale-95"
                            >
                              이 가격에 팔기
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 하단 신뢰 안내 피드 */}
            <div className="bg-gray-100 rounded-2xl p-4 space-y-2 text-[11px] text-[var(--text-light)]">
              <p className="font-bold text-[var(--text-dark)]">🛡️ 빌리드림 안심 매입 보장</p>
              <p className="leading-relaxed">
                빌리드림 매입 서비스는 수거 방문 시 허위 감정 및 부당 감가를 엄격하게 제약합니다. 올리신 사진과 기기 상태 정보가 동일할 경우, 제안된 견적 금액 100%를 현장 입금 보증합니다.
              </p>
            </div>
          </main>
        </div>
      )}

      {/* ── 판매 수락 및 수거 예약 Bottom Sheet 모달 ── */}
      {isModalOpen && selectedBid && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 anim-fade-in">
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white w-full max-w-[480px] rounded-t-3xl p-5 shadow-2xl relative z-10 safe-bottom max-h-[90vh] overflow-y-auto">
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[16px] font-black text-[var(--text-dark)]">🚚 매입 기사 방문 수거 예약</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            
            <p className="text-[12.5px] text-[var(--text-light)] mb-4 leading-relaxed">
              **{selectedBid.storeName}**에 판매를 승인합니다. 현장 기사가 방문하여 간단한 전원 검수 후 현장에서 **{selectedBid.price.toLocaleString()}원**을 이체해 드립니다.
            </p>

            <div className="space-y-4 mb-6">
              {/* 날짜 선택 */}
              <div>
                <label className="text-[12.5px] font-bold text-[var(--text-dark)] mb-1.5 block">수거 방문 희망일</label>
                <div className="relative">
                  <input 
                    type="date" 
                    value={pickupDate}
                    onChange={e => setPickupDate(e.target.value)}
                    min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // 내일부터 선택 가능
                    className="w-full border border-gray-200 bg-white rounded-xl p-3 pl-10 text-[13px] outline-none"
                  />
                  <Calendar size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                </div>
              </div>

              {/* 수거지 상세 주소 */}
              <div>
                <label className="text-[12.5px] font-bold text-[var(--text-dark)] mb-1.5 block">수거지 상세 주소</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={pickupAddress}
                    onChange={e => setPickupAddress(e.target.value)}
                    placeholder="상세 호수 및 아파트명을 적어주세요"
                    className="w-full border border-gray-200 bg-white rounded-xl p-3 pl-10 text-[13px] outline-none"
                  />
                  <MapPin size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                </div>
              </div>

              {/* 최종 정산가 안내 */}
              <div className="bg-gray-50 border border-gray-150 rounded-2xl p-4 text-[12.5px]">
                <div className="flex justify-between font-bold text-gray-700">
                  <span>방문 수거비</span>
                  <span className="text-[var(--success)]">0원 무료</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2.5 mt-2.5 text-[14px]">
                  <span className="font-bold text-[var(--text-dark)]">최종 현장 송금액</span>
                  <span className="font-black text-[var(--accent)]">{selectedBid.price.toLocaleString()}원</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleConfirmPickup}
              className="w-full bg-[var(--primary)] text-white font-bold py-4 rounded-xl text-[14px] hover:bg-[#4A3A2F] transition-all active:scale-[0.98] shadow-md"
            >
              방문 수거 예약 및 계약 승인하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
