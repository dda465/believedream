"use client";

import { useState, useEffect } from "react";
import { Package, Bell, DollarSign, Store, Menu, Search, CheckCircle, User, Truck, XCircle } from "lucide-react";
import { getPartnerOrders, getPartnerProducts } from "@/app/lib/db";

export default function PartnerDashboard() {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 현재 로그인한 파트너 (실제로는 세션에서 가져와야 함)
  const currentPartnerId = "p1"; // 빌리드림 직영점(테스트용)

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const fetchedOrders = await getPartnerOrders(currentPartnerId);
      const fetchedProducts = await getPartnerProducts(currentPartnerId);
      setOrders(fetchedOrders);
      setProducts(fetchedProducts);
      setLoading(false);
    }
    loadData();
  }, [currentPartnerId]);

  // 통계 계산
  const stats = {
    newOrders: orders.filter(o => o.status === "PENDING" || o.status === "CONSULTING").length,
    activeRentals: orders.filter(o => o.status === "ACTIVE").length,
    // 정산금 로직: 월 렌탈료 총합 (이용중 + 설치중) - 수수료(5%) 가정
    thisMonthRevenue: orders
      .filter(o => o.status === "ACTIVE" || o.status === "INSTALLING")
      .reduce((sum, o) => sum + (o.monthlyPrice * 0.95), 0),
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "CONSULTING": return <span className="px-2 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700">상담중</span>;
      case "PENDING": return <span className="px-2 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700">승인대기</span>;
      case "INSTALLING": return <span className="px-2 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700">설치/배송중</span>;
      case "ACTIVE": return <span className="px-2 py-1 rounded-full text-[11px] font-bold bg-green-100 text-green-700">이용중</span>;
      case "COMPLETED": return <span className="px-2 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-700">완료</span>;
      default: return <span className="px-2 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex flex-col md:flex-row pb-20 md:pb-0">
      {/* Sidebar (Desktop) / Bottom Nav (Mobile) */}
      <aside className="bg-white border-r border-gray-200 w-full md:w-64 flex-shrink-0 md:min-h-screen p-4 flex flex-col md:fixed left-0 top-0 bottom-0 z-20 fixed bottom-0 md:static border-t md:border-t-0 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] md:shadow-none">
        <div className="hidden md:flex items-center gap-2 mb-8 p-2">
          <Store size={24} className="text-[var(--primary)]" />
          <h1 className="font-black text-[18px] text-[var(--text-dark)] tracking-tight">빌리드림 파트너</h1>
        </div>
        
        <nav className="flex justify-around md:flex-col gap-2 md:gap-3 w-full">
          <button 
            onClick={() => setActiveTab("orders")}
            className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 p-2 md:p-3 md:rounded-xl transition-colors whitespace-nowrap w-full ${activeTab === 'orders' ? 'text-[var(--primary)] md:bg-blue-50 font-bold' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            <div className="relative">
              <Bell size={24} className="md:w-5 md:h-5" />
              {stats.newOrders > 0 && (
                <span className="absolute -top-1 -right-1 md:static ml-auto bg-red-500 text-[10px] text-white px-1.5 py-0.5 rounded-full font-bold leading-none">
                  {stats.newOrders}
                </span>
              )}
            </div>
            <span className="text-[11px] md:text-[14px]">주문 현황</span>
          </button>
          <button 
            onClick={() => setActiveTab("products")}
            className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 p-2 md:p-3 md:rounded-xl transition-colors whitespace-nowrap w-full ${activeTab === 'products' ? 'text-[var(--primary)] md:bg-blue-50 font-bold' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            <Package size={24} className="md:w-5 md:h-5" />
            <span className="text-[11px] md:text-[14px]">내 상품 관리</span>
          </button>
          <button 
            onClick={() => setActiveTab("settlement")}
            className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 p-2 md:p-3 md:rounded-xl transition-colors whitespace-nowrap w-full ${activeTab === 'settlement' ? 'text-[var(--primary)] md:bg-blue-50 font-bold' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            <DollarSign size={24} className="md:w-5 md:h-5" />
            <span className="text-[11px] md:text-[14px]">정산 내역</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-5 md:p-8 pt-6">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-2 text-[var(--primary)]">
            <Store size={24} />
            <h1 className="font-black text-lg">빌리드림 파트너</h1>
          </div>
          <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
            직
          </button>
        </header>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 mb-6">
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-card border border-gray-100">
            <p className="text-[12px] md:text-sm font-bold text-gray-500 mb-1">신규 요청 (대기)</p>
            <div className="flex items-end justify-between">
              <h2 className="text-[24px] md:text-3xl font-black text-[var(--text-dark)]">{stats.newOrders}건</h2>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center"><Bell size={18} /></div>
            </div>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-card border border-gray-100">
            <p className="text-[12px] md:text-sm font-bold text-gray-500 mb-1">이용중인 렌탈</p>
            <div className="flex items-end justify-between">
              <h2 className="text-[24px] md:text-3xl font-black text-[var(--text-dark)]">{stats.activeRentals}건</h2>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-green-50 text-green-500 rounded-full flex items-center justify-center"><CheckCircle size={18} /></div>
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1 bg-gradient-to-r from-blue-600 to-indigo-600 p-4 md:p-6 rounded-2xl shadow-md text-white relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[12px] md:text-sm font-bold text-white/80 mb-1">이번 달 입금 예정액</p>
              <h2 className="text-[24px] md:text-3xl font-black">{stats.thisMonthRevenue.toLocaleString()}원</h2>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] opacity-20 transform -rotate-12">
              <DollarSign size={100} />
            </div>
          </div>
        </div>

        {/* Content Area based on Tab */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-gray-400">데이터를 불러오는 중입니다...</div>
          ) : (
            <>
              {/* 탭 1: 주문 현황 */}
              {activeTab === 'orders' && (
                <div>
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-[15px] font-black text-[var(--text-dark)]">고객 렌탈 현황</h2>
                    <button className="text-[12px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md">상태 업데이트 가이드</button>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {orders.length === 0 ? (
                      <div className="p-10 text-center text-gray-400 text-sm">아직 접수된 주문이 없습니다.</div>
                    ) : (
                      orders.map((order) => {
                        const product = products.find(p => p.id === order.productId);
                        return (
                          <div key={order.orderId} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-[11px] text-gray-400 font-medium">{order.orderId}</span>
                              {getStatusBadge(order.status)}
                            </div>
                            <h3 className="text-[14px] font-bold text-[var(--text-dark)] mb-1">
                              {product ? product.name : "상품 정보 없음"}
                            </h3>
                            <div className="flex items-center gap-3 text-[12px] text-gray-500 mb-3">
                              <span className="flex items-center gap-1"><User size={12}/> {order.userId.replace("mock-user-", "고객 ")}</span>
                              <span className="flex items-center gap-1"><DollarSign size={12}/> {order.period}개월 ({order.monthlyPrice.toLocaleString()}원/월)</span>
                            </div>
                            
                            {/* 상태별 액션 버튼 (모바일 친화적) */}
                            {order.status === "PENDING" && (
                              <div className="flex gap-2 mt-2">
                                <button className="flex-1 bg-[var(--primary)] text-white text-[12px] font-bold py-2 rounded-lg">렌탈 승인 (기사 배정)</button>
                                <button className="w-1/3 bg-gray-100 text-gray-600 text-[12px] font-bold py-2 rounded-lg">거절</button>
                              </div>
                            )}
                            {order.status === "INSTALLING" && (
                              <button className="w-full bg-green-500 text-white text-[12px] font-bold py-2 rounded-lg flex items-center justify-center gap-1">
                                <CheckCircle size={14}/> 설치 완료 처리
                              </button>
                            )}
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              )}

              {/* 탭 2: 내 상품 관리 (대행 등록 상태) */}
              {activeTab === 'products' && (
                <div>
                  <div className="p-4 border-b border-gray-100 bg-blue-50/50">
                    <p className="text-[12px] text-blue-700 font-medium">
                      💡 초기 입점 기간에는 품질 관리를 위해 <b>본사 대행 등록</b>으로 운영됩니다. 상품 추가/수정은 담당 매니저에게 문의해주세요.
                    </p>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {products.length === 0 ? (
                      <div className="p-10 text-center text-gray-400 text-sm">등록된 상품이 없습니다.</div>
                    ) : (
                      products.map((product) => (
                        <div key={product.id} className="p-4 flex gap-4 items-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                            {product.emoji}
                          </div>
                          <div className="flex-1">
                            <div className="flex gap-1 mb-1">
                              <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{product.brand}</span>
                              <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{product.condition}</span>
                            </div>
                            <h3 className="text-[14px] font-bold text-[var(--text-dark)]">{product.name}</h3>
                            <p className="text-[12px] text-[var(--primary)] font-bold mt-1">
                              월 {parseInt(product.prices?.price12 || 0).toLocaleString()}원 <span className="text-gray-400 font-normal">(12개월 기준)</span>
                            </p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-md text-center">노출중</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* 탭 3: 정산 내역 */}
              {activeTab === 'settlement' && (
                <div>
                  <div className="p-6 border-b border-gray-100 text-center">
                    <p className="text-[13px] text-gray-500 font-bold mb-2">5월 31일 정산 예정액 (수수료 5% 차감 후)</p>
                    <h2 className="text-3xl font-black text-[var(--primary)]">{stats.thisMonthRevenue.toLocaleString()}원</h2>
                  </div>
                  <div className="p-4">
                    <h3 className="text-[14px] font-bold text-[var(--text-dark)] mb-3">정산 상세 내역</h3>
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between text-[13px]">
                        <span className="text-gray-600">렌탈료 총 수입 (이용중 {stats.activeRentals}건)</span>
                        <span className="font-bold text-gray-800">+ {(stats.thisMonthRevenue / 0.95).toLocaleString()}원</span>
                      </div>
                      <div className="flex justify-between text-[13px]">
                        <span className="text-gray-600">플랫폼 수수료 (5%)</span>
                        <span className="font-bold text-red-500">- {((stats.thisMonthRevenue / 0.95) * 0.05).toLocaleString()}원</span>
                      </div>
                      <div className="flex justify-between text-[13px]">
                        <span className="text-gray-600">위약금 수입</span>
                        <span className="font-bold text-gray-800">0원</span>
                      </div>
                      <hr className="border-gray-200" />
                      <div className="flex justify-between text-[14px]">
                        <span className="font-black text-gray-800">실 입금액</span>
                        <span className="font-black text-[var(--primary)]">{stats.thisMonthRevenue.toLocaleString()}원</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
