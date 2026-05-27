"use client";
import { useState, useEffect } from "react";
import { getAllRentalRequests } from "@/app/lib/db";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getAllRentalRequests();
      setOrders(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--border-light)] pb-5">
        <h1 className="text-[24px] font-black text-[var(--text-dark)]">렌탈 신청 내역</h1>
        <p className="text-[13px] text-[var(--text-light)] mt-1">고객들이 신청한 렌탈 내역을 확인하고 고객에게 연락하세요.</p>
      </div>

      <div className="bg-white rounded-2xl border border-[var(--border-light)] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-[var(--text-light)]">데이터를 불러오는 중...</div>
        ) : orders.length === 0 ? (
          <div className="p-10 text-center">
            <div className="text-[40px] mb-3">📝</div>
            <p className="text-[15px] font-bold text-[var(--text-dark)]">신청 내역이 없습니다.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-[#F8F9FA] border-b border-[var(--border-light)] text-[12px] text-[var(--text-light)] uppercase tracking-wider">
                  <th className="p-4 font-bold">접수일</th>
                  <th className="p-4 font-bold">신청자 정보</th>
                  <th className="p-4 font-bold">신청 상품</th>
                  <th className="p-4 font-bold">조건</th>
                  <th className="p-4 font-bold">설치 희망 지역/일자</th>
                  <th className="p-4 font-bold">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-light)]">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-[#F8F9FA] transition-colors">
                    <td className="p-4 align-top">
                      <p className="text-[13px] font-bold">{new Date(o.createdAt).toLocaleDateString()}</p>
                      <p className="text-[11px] text-[var(--text-lighter)] mt-0.5">{new Date(o.createdAt).toLocaleTimeString()}</p>
                    </td>
                    <td className="p-4 align-top">
                      <p className="text-[14px] font-bold text-[var(--primary)]">{o.name}</p>
                      <p className="text-[13px] font-mono mt-1">{o.phone}</p>
                    </td>
                    <td className="p-4 align-top">
                      <p className="text-[13px] font-bold">{o.productName}</p>
                    </td>
                    <td className="p-4 align-top">
                      <span className="inline-block bg-[var(--bg-sub)] px-2 py-1 rounded text-[12px] font-bold mb-1">{o.type === 'rental' ? '렌탈' : '일시불 구매'}</span>
                      {o.type === 'rental' && <p className="text-[12px]">{o.period}개월 약정</p>}
                    </td>
                    <td className="p-4 align-top">
                      <p className="text-[13px] font-bold">{o.address}</p>
                      <p className="text-[12px] text-[var(--accent)] mt-1">{o.date}</p>
                    </td>
                    <td className="p-4 align-top">
                      <button className="text-[12px] text-white bg-[var(--success)] font-bold px-3 py-1.5 rounded-lg shadow-sm active:scale-95 transition-transform w-full mb-2">
                        카톡 알림톡 보내기
                      </button>
                      <p className="text-[10px] text-center text-[var(--text-lighter)]">상태 변경(준비중)</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
