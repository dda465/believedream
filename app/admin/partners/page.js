"use client";
import { useState, useEffect } from "react";
import { getAllPartnerApplications } from "@/app/lib/db";

export default function AdminPartners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getAllPartnerApplications();
      setPartners(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--border-light)] pb-5">
        <h1 className="text-[24px] font-black text-[var(--text-dark)]">입점 신청 내역</h1>
        <p className="text-[13px] text-[var(--text-light)] mt-1">플랫폼에 입점 및 기기를 판매하고 싶어하는 사장님들의 연락처입니다.</p>
      </div>

      <div className="bg-white rounded-2xl border border-[var(--border-light)] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-[var(--text-light)]">데이터를 불러오는 중...</div>
        ) : partners.length === 0 ? (
          <div className="p-10 text-center">
            <div className="text-[40px] mb-3">🏪</div>
            <p className="text-[15px] font-bold text-[var(--text-dark)]">입점 신청 내역이 없습니다.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#F8F9FA] border-b border-[var(--border-light)] text-[12px] text-[var(--text-light)] uppercase tracking-wider">
                  <th className="p-4 font-bold">접수일</th>
                  <th className="p-4 font-bold">매장 및 대표자</th>
                  <th className="p-4 font-bold">연락처</th>
                  <th className="p-4 font-bold">매장 위치</th>
                  <th className="p-4 font-bold">취급 품목 및 사업형태</th>
                  <th className="p-4 font-bold">재고 매입 관심</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-light)]">
                {partners.map(p => (
                  <tr key={p.id} className="hover:bg-[#F8F9FA] transition-colors">
                    <td className="p-4 align-top">
                      <p className="text-[13px] font-bold">{new Date(p.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="p-4 align-top">
                      <p className="text-[15px] font-black text-[var(--primary)]">{p.storeName}</p>
                      <p className="text-[13px] mt-0.5">{p.owner} 대표님</p>
                    </td>
                    <td className="p-4 align-top">
                      <a href={`tel:${p.phone}`} className="text-[13px] font-bold text-blue-600 hover:underline">{p.phone}</a>
                    </td>
                    <td className="p-4 align-top">
                      <span className="bg-gray-100 px-2 py-1 rounded text-[12px] font-bold">{p.district}</span>
                    </td>
                    <td className="p-4 align-top">
                      <div className="flex flex-wrap gap-1 mb-1">
                        {p.categories?.map(c => <span key={c} className="bg-blue-50 text-blue-700 px-2 py-0.5 text-[11px] rounded">{c}</span>)}
                      </div>
                      <p className="text-[12px] text-[var(--text-light)]">형태: {p.businessType}</p>
                    </td>
                    <td className="p-4 align-top">
                      <span className={`text-[12px] font-bold px-2 py-1 rounded-full ${p.buyrent === '관심있음' ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : 'bg-gray-100 text-gray-500'}`}>
                        {p.buyrent}
                      </span>
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
