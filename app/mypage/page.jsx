"use client";

import Link from "next/link";
import { User, Package, ChevronRight, CreditCard, HeadphonesIcon, Settings, MessageCircle, Gift, ArrowRight, Truck, CheckCircle2, ClipboardList, ShieldCheck } from "lucide-react";

export default function MyPageHome() {
  // 가상의 로그인 고객 데이터
  const user = {
    name: "김부산",
    phone: "010-1234-5678",
  };

  // 렌탈 상태 요약 (렌트리 스타일)
  const statusCounts = {
    consulting: 1, // 상담 중
    pending: 0,    // 계약 대기
    installing: 1, // 설치 예정
    active: 2,     // 이용 중
  };

  // 혜택 현황 (렌트리 스타일)
  const benefits = {
    totalExpected: 150000, // 받을 예정인 총 지원금/사은품 가치
    received: 0,
  };

  // 가장 최근 진행 중인 주문 (대표로 1개 노출)
  const recentOrder = {
    id: "ORD-20260528-123",
    product: "LG 듀얼인버터 제습기 20L",
    store: "부산진구 가전스토어",
    step: 3, // 1:상담, 2:계약대기, 3:설치예정, 4:이용중
    expectedDate: "내일 오후 2시 설치 예정",
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] pb-24">
      {/* ── 프로필 헤더 ── */}
      <header className="bg-white px-5 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-[var(--text-dark)] font-black text-[18px]">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-[18px] font-black text-[var(--text-dark)]">
              {user.name} <span className="text-[14px] font-normal text-[var(--text-light)]">님</span>
            </h1>
            <p className="text-[12px] text-[var(--text-light)] mt-0.5">{user.phone} · 내 정보 관리 {'>'}</p>
          </div>
        </div>
        <button className="p-2 text-[var(--text-light)]">
          <Settings size={22} />
        </button>
      </header>

      {/* ── 렌탈 진행 현황 (상단 카드) ── */}
      <section className="px-5 mt-[-10px] relative z-10">
        <div className="bg-white rounded-2xl shadow-card p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[15px] font-black text-[var(--text-dark)]">나의 렌탈 현황</h2>
            <Link href="/rentals" className="text-[12px] text-[var(--text-light)] flex items-center">전체보기 <ChevronRight size={14}/></Link>
          </div>
          
          <div className="flex justify-between items-center px-2">
            {[
              { label: "상담중", count: statusCounts.consulting, icon: <MessageCircle size={24}/> },
              { label: "계약대기", count: statusCounts.pending, icon: <ClipboardList size={24}/> },
              { label: "설치예정", count: statusCounts.installing, icon: <Truck size={24}/> },
              { label: "이용중", count: statusCounts.active, icon: <CheckCircle2 size={24}/> },
            ].map((step, idx) => (
              <div key={step.label} className="flex flex-col items-center relative">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-1.5 transition-colors ${
                  step.count > 0 ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : 'bg-gray-50 text-gray-300'
                }`}>
                  {step.icon}
                </div>
                <span className="text-[11px] font-bold text-[var(--text-dark)]">{step.label}</span>
                <span className={`text-[12px] font-black mt-0.5 ${step.count > 0 ? 'text-[var(--accent)]' : 'text-gray-300'}`}>
                  {step.count}
                </span>
                {idx < 3 && <div className="absolute top-6 left-[38px] w-[calc(100%+8px)] h-[2px] bg-gray-100 -z-10" />}
              </div>
            ))}
          </div>

          {/* 진행 중인 대표 건 요약 (렌트리 스타일) */}
          <div className="mt-5 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-sm">진행중</span>
              <p className="text-[12px] text-[var(--text-light)] truncate">{recentOrder.store}</p>
            </div>
            <p className="text-[14px] font-bold text-[var(--text-dark)] line-clamp-1">{recentOrder.product}</p>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-[13px] font-black text-[var(--primary)]">{recentOrder.expectedDate}</p>
              <button className="text-[12px] font-bold bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
                상세보기
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 빌리드림 안심 A/S 케어 (중고 특화) ── */}
      <section className="px-5 mt-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-5 border border-blue-200 relative overflow-hidden flex items-center justify-between">
          <div className="relative z-10">
            <p className="text-[12px] font-bold text-blue-800 mb-1 flex items-center gap-1">
              <ShieldCheck size={14} /> 빌리드림 안심 A/S 케어
            </p>
            <h3 className="text-[20px] font-black text-[var(--text-dark)] mt-2">
              무상 수리 보증 <span className="text-blue-600">30일</span> 남음
            </h3>
            <p className="text-[11px] text-blue-700 mt-1">이용 중인 제습기의 보증 기간이 진행 중입니다.</p>
          </div>
          <button className="relative z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-500 shadow-sm hover:scale-105 transition-transform">
            <ArrowRight size={20} />
          </button>
          <div className="absolute right-[-10px] bottom-[-15px] opacity-10 transform -rotate-12">
            <ShieldCheck size={100} className="text-blue-500" />
          </div>
        </div>
      </section>

      {/* ── 나의 상담 내역 / 채팅 ── */}
      <section className="px-5 mt-4">
        <div className="bg-white rounded-2xl shadow-sm border border-[var(--border-light)] overflow-hidden">
          <h2 className="text-[15px] font-black text-[var(--text-dark)] p-5 pb-3">상담 내역</h2>
          <div className="px-5 pb-5">
            <button className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <MessageCircle size={20} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-[13px] font-bold text-[var(--text-dark)]">매장과 진행 중인 채팅 <span className="text-[var(--accent)]">1</span></p>
                <p className="text-[11px] text-[var(--text-light)] mt-0.5">최근 메시지: "내일 방문 설치 가능할까요?"</p>
              </div>
              <ChevronRight size={18} className="text-[var(--text-light)]" />
            </button>
          </div>
        </div>
      </section>

      {/* ── 바로가기 메뉴 ── */}
      <section className="px-5 mt-4 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-[var(--border-light)] overflow-hidden">
          <Link href="/rentals" className="w-full flex items-center justify-between p-4 border-b border-[var(--border-light)] hover:bg-gray-50 flex">
            <div className="flex items-center gap-3">
              <Package size={18} className="text-[var(--text-light)]" />
              <span className="text-[14px] font-medium text-[var(--text-dark)]">나의 렌탈/계약 내역 관리</span>
            </div>
            <ChevronRight size={18} className="text-[var(--text-light)]" />
          </Link>
          <Link href="/partner" className="w-full flex items-center justify-between p-4 border-b border-[var(--border-light)] hover:bg-gray-50 flex">
            <div className="flex items-center gap-3">
              <Settings size={18} className="text-[var(--text-light)]" />
              <span className="text-[14px] font-medium text-[var(--text-dark)]">파트너 매장 입점 신청 (사장님용)</span>
            </div>
            <ChevronRight size={18} className="text-[var(--text-light)]" />
          </Link>
          <button onClick={() => alert("준비 중인 기능입니다.")} className="w-full flex items-center justify-between p-4 border-b border-[var(--border-light)] hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <CreditCard size={18} className="text-[var(--text-light)]" />
              <span className="text-[14px] font-medium text-[var(--text-dark)]">결제 수단 및 자동이체 관리</span>
            </div>
            <ChevronRight size={18} className="text-[var(--text-light)]" />
          </button>
          <button onClick={() => alert("카카오톡 @빌리드림 채널로 문의 바랍니다.")} className="w-full flex items-center justify-between p-4 hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <HeadphonesIcon size={18} className="text-[var(--text-light)]" />
              <span className="text-[14px] font-medium text-[var(--text-dark)]">고객센터 문의하기</span>
            </div>
            <ChevronRight size={18} className="text-[var(--text-light)]" />
          </button>
        </div>
      </section>
    </div>
  );
}
