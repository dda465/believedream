"use client";

import { useState } from "react";
import { Package, Bell, DollarSign, Store, Menu, Search, CheckCircle } from "lucide-react";

export default function PartnerDashboard() {
  const [activeTab, setActiveTab] = useState("orders");

  // Mock data
  const stats = {
    newOrders: 3,
    activeRentals: 12,
    thisMonthRevenue: 345000,
  };

  const mockOrders = [
    { id: "ORD-1001", product: "LG 제습기 20L", customer: "김부산", date: "2026.05.28", status: "대기중" },
    { id: "ORD-1002", product: "삼성 비스포크 청소기", customer: "이서면", date: "2026.05.27", status: "배송중" },
    { id: "ORD-1003", product: "다이슨 에어랩", customer: "박해운", date: "2026.05.25", status: "이용중" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar (Desktop) / Bottom Nav (Mobile) */}
      <aside className="bg-[var(--primary)] text-white w-full md:w-64 flex-shrink-0 md:min-h-screen p-4 flex flex-col md:fixed left-0 top-0 bottom-0 z-20">
        <div className="hidden md:flex items-center gap-2 mb-8 p-2">
          <Store size={24} className="text-[var(--accent)]" />
          <h1 className="font-extrabold text-xl tracking-tight">빌리드림 파트너</h1>
        </div>
        
        <nav className="flex md:flex-col gap-2 overflow-x-auto hide-scrollbar pb-2 md:pb-0">
          <button 
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-3 p-3 rounded-xl transition-colors whitespace-nowrap ${activeTab === 'orders' ? 'bg-white/10 text-white font-bold' : 'text-white/70 hover:bg-white/5'}`}
          >
            <Bell size={20} />
            주문 현황
            {stats.newOrders > 0 && (
              <span className="ml-auto bg-[var(--accent)] text-xs text-white px-2 py-0.5 rounded-full font-bold">
                {stats.newOrders}
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-3 p-3 rounded-xl transition-colors whitespace-nowrap ${activeTab === 'products' ? 'bg-white/10 text-white font-bold' : 'text-white/70 hover:bg-white/5'}`}
          >
            <Package size={20} />
            내 상품 관리
          </button>
          <button 
            onClick={() => setActiveTab("settlement")}
            className={`flex items-center gap-3 p-3 rounded-xl transition-colors whitespace-nowrap ${activeTab === 'settlement' ? 'bg-white/10 text-white font-bold' : 'text-white/70 hover:bg-white/5'}`}
          >
            <DollarSign size={20} />
            정산 내역
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-4">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-2 text-[var(--primary)]">
            <Store size={24} />
            <h1 className="font-extrabold text-lg">빌리드림 파트너</h1>
          </div>
          <button className="p-2 text-gray-500"><Menu size={24}/></button>
        </header>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">신규 렌탈 요청</p>
              <h2 className="text-3xl font-extrabold text-[var(--text-dark)]">{stats.newOrders}건</h2>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <Bell size={24} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">이용중인 렌탈</p>
              <h2 className="text-3xl font-extrabold text-[var(--text-dark)]">{stats.activeRentals}건</h2>
            </div>
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
              <CheckCircle size={24} />
            </div>
          </div>
          <div className="bg-[var(--primary)] p-6 rounded-2xl shadow-sm text-white flex items-center justify-between relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-sm font-semibold text-white/80 mb-1">이번 달 예상 정산금</p>
              <h2 className="text-3xl font-extrabold">{stats.thisMonthRevenue.toLocaleString()}원</h2>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
              <DollarSign size={100} />
            </div>
          </div>
        </div>

        {/* Content Area based on Tab */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-bold text-[var(--text-dark)]">
              {activeTab === 'orders' && '최근 주문 내역'}
              {activeTab === 'products' && '등록된 상품'}
              {activeTab === 'settlement' && '최근 정산 내역'}
            </h2>
            
            {activeTab === 'orders' && (
              <div className="relative w-full sm:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="주문번호 또는 고객명 검색" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:border-[var(--primary)] outline-none"
                />
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            {activeTab === 'orders' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                    <th className="p-4 font-semibold whitespace-nowrap">주문번호</th>
                    <th className="p-4 font-semibold">상품명</th>
                    <th className="p-4 font-semibold whitespace-nowrap">고객명</th>
                    <th className="p-4 font-semibold whitespace-nowrap">신청일</th>
                    <th className="p-4 font-semibold whitespace-nowrap">상태</th>
                    <th className="p-4 font-semibold whitespace-nowrap text-center">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {mockOrders.map((order, idx) => (
                    <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50 transition-colors text-sm">
                      <td className="p-4 text-gray-500 font-medium whitespace-nowrap">{order.id}</td>
                      <td className="p-4 font-bold text-[var(--text-dark)] whitespace-nowrap">{order.product}</td>
                      <td className="p-4 whitespace-nowrap">{order.customer}</td>
                      <td className="p-4 text-gray-500 whitespace-nowrap">{order.date}</td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          order.status === '대기중' ? 'bg-amber-100 text-amber-700' :
                          order.status === '배송중' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <button className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-colors">
                          상세보기
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            
            {activeTab !== 'orders' && (
              <div className="p-12 text-center text-gray-400 flex flex-col items-center">
                <Package size={48} className="mb-4 opacity-20" />
                <p>아직 준비 중인 기능입니다.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
