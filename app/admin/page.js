"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getProducts, getAllRentalRequests, getAllPartnerApplications } from "@/app/lib/db";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, rentals: 0, partners: 0 });
  const [loading, setLoading] = useState(true);
  const [recentRentals, setRecentRentals] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [prods, rents, parts] = await Promise.all([
          getProducts(),
          getAllRentalRequests(),
          getAllPartnerApplications()
        ]);
        
        setStats({
          products: prods.length,
          rentals: rents.length,
          partners: parts.length
        });
        
        setRecentRentals(rents.slice(0, 5));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] md:text-[28px] font-black text-[var(--text-dark)] tracking-tight">대시보드 요약</h1>
        <div className="text-[13px] text-[var(--text-light)] bg-white px-3 py-1.5 rounded-lg border border-[var(--border-light)] shadow-sm">
          업데이트: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 통계 카드 */}
        <div className="bg-white p-5 md:p-6 rounded-2xl border border-[var(--border-light)] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[14px] text-[var(--text-light)] font-bold mb-1">등록된 총 상품</p>
            <p className="text-[32px] font-black text-[var(--text-dark)]">{stats.products}개</p>
          </div>
          <div className="w-14 h-14 bg-[var(--bg-sub)] rounded-2xl flex items-center justify-center text-[24px]">📦</div>
        </div>
        
        <div className="bg-white p-5 md:p-6 rounded-2xl border border-[var(--border-light)] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[14px] text-[var(--text-light)] font-bold mb-1">총 렌탈 신청서</p>
            <p className="text-[32px] font-black text-[var(--primary)]">{stats.rentals}건</p>
          </div>
          <div className="w-14 h-14 bg-[var(--info-soft)] rounded-2xl flex items-center justify-center text-[24px]">📝</div>
        </div>
        
        <div className="bg-white p-5 md:p-6 rounded-2xl border border-[var(--border-light)] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[14px] text-[var(--text-light)] font-bold mb-1">입점 제휴 신청</p>
            <p className="text-[32px] font-black text-[var(--accent)]">{stats.partners}건</p>
          </div>
          <div className="w-14 h-14 bg-[var(--warn-soft)] rounded-2xl flex items-center justify-center text-[24px]">🏪</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* 최근 신청 내역 */}
        <div className="bg-white rounded-2xl border border-[var(--border-light)] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[var(--border-light)] flex justify-between items-center">
            <h2 className="text-[18px] font-bold text-[var(--text-dark)]">최근 렌탈 신청서</h2>
            <Link href="/admin/orders" className="text-[13px] font-bold text-[var(--primary)] hover:underline">
              전체 보기 →
            </Link>
          </div>
          <div className="divide-y divide-[var(--border-light)]">
            {recentRentals.length === 0 ? (
              <div className="p-10 text-center text-[var(--text-light)] text-[14px]">
                아직 신청 내역이 없습니다.
              </div>
            ) : (
              recentRentals.map(r => (
                <div key={r.id} className="p-4 hover:bg-[var(--bg-main)] transition-colors flex justify-between items-center">
                  <div>
                    <p className="text-[14px] font-bold text-[var(--text-dark)] mb-1">{r.name}님</p>
                    <p className="text-[12px] text-[var(--text-light)] truncate max-w-[200px]">{r.productName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[12px] font-bold text-[var(--primary)]">{r.period}개월</p>
                    <p className="text-[11px] text-[var(--text-lighter)] mt-0.5">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 퀵 액션 */}
        <div className="bg-white rounded-2xl border border-[var(--border-light)] shadow-sm p-5">
          <h2 className="text-[18px] font-bold text-[var(--text-dark)] mb-4">빠른 실행 (바로가기)</h2>
          <div className="space-y-3">
            <Link href="/admin/products" className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--bg-main)] transition-all group">
              <div className="w-10 h-10 bg-[var(--bg-sub)] rounded-lg flex items-center justify-center text-[20px] group-hover:bg-white">➕</div>
              <div>
                <p className="text-[14px] font-bold text-[var(--text-dark)]">새 기기 등록하기</p>
                <p className="text-[12px] text-[var(--text-light)] mt-0.5">매입한 10만 원 미만 기기를 즉시 등록하세요.</p>
              </div>
            </Link>
            <Link href="/admin/partners" className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] transition-all group">
              <div className="w-10 h-10 bg-[var(--bg-sub)] rounded-lg flex items-center justify-center text-[20px] group-hover:bg-white">🤝</div>
              <div>
                <p className="text-[14px] font-bold text-[var(--text-dark)]">영업처 연락처 보기</p>
                <p className="text-[12px] text-[var(--text-light)] mt-0.5">입점 신청을 남긴 사장님들께 연락해보세요.</p>
              </div>
            </Link>
            <button className="w-full flex items-center gap-4 p-4 rounded-xl border border-[var(--border)] hover:border-[var(--success)] hover:bg-[var(--success-soft)] transition-all group text-left">
              <div className="w-10 h-10 bg-[var(--bg-sub)] rounded-lg flex items-center justify-center text-[20px] group-hover:bg-white">📈</div>
              <div>
                <p className="text-[14px] font-bold text-[var(--text-dark)]">엑셀 다운로드 (준비중)</p>
                <p className="text-[12px] text-[var(--text-light)] mt-0.5">전체 렌탈 내역을 엑셀로 뽑아 정산에 활용하세요.</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
