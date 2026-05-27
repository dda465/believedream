"use client";
import { useState, useEffect } from "react";
import { getProducts, createProduct, deleteProduct } from "@/app/lib/db";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 새 기기 등록 폼 상태
  const [form, setForm] = useState({
    name: "", category: "refrigerator", condition: "S급",
    buyoutPrice: "", price1: "", price3: "", price6: "", price12: "", price24: "",
    desc: "", store: "빌리드림 직영", area: "전역", district: "전체",
    todayInstall: true, buyout: true, onlinePay: true, emoji: "📦"
  });

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    const data = await getProducts();
    setProducts(data.sort((a,b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)));
    setLoading(false);
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 이모지 자동 매핑 (간단하게)
    let autoEmoji = "📦";
    if (form.category.includes("purifier")) autoEmoji = "🌿";
    if (form.category.includes("washer") || form.category.includes("dryer")) autoEmoji = "👕";
    if (form.category.includes("cleaner")) autoEmoji = "🤖";
    if (form.category.includes("dehumidifier")) autoEmoji = "💧";
    
    const newProduct = {
      ...form,
      emoji: autoEmoji,
      // 가격 포맷팅 (콤마 추가)
      price1: form.price1?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "",
      price3: form.price3?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "",
      price6: form.price6?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "",
      price12: form.price12?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "",
      price24: form.price24?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "",
      buyoutPrice: form.buyoutPrice?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || ""
    };

    const res = await createProduct(newProduct);
    if (res.success) {
      alert("성공적으로 등록되었습니다!");
      setShowAddForm(false);
      setForm({
        name: "", category: "refrigerator", condition: "S급",
        buyoutPrice: "", price1: "", price3: "", price6: "", price12: "", price24: "",
        desc: "", store: "빌리드림 직영", area: "전역", district: "전체",
        todayInstall: true, buyout: true, onlinePay: true, emoji: "📦"
      });
      loadProducts();
    } else {
      alert("등록에 실패했습니다.");
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (confirm("정말 이 기기를 삭제하시겠습니까?")) {
      await deleteProduct(id);
      loadProducts();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[var(--border-light)] pb-5">
        <div>
          <h1 className="text-[24px] font-black text-[var(--text-dark)]">매입 기기 (상품) 관리</h1>
          <p className="text-[13px] text-[var(--text-light)] mt-1">영업해서 매입한 10만 원 미만의 기기들을 등록하고 관리하세요.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[var(--primary)] hover:bg-[#1a1210] text-white px-5 py-2.5 rounded-xl text-[14px] font-bold shadow-md transition-all active:scale-95"
        >
          {showAddForm ? "목록으로 돌아가기" : "+ 새 기기 등록"}
        </button>
      </div>

      {showAddForm ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-[var(--border-light)] shadow-sm max-w-3xl space-y-5">
          <h2 className="text-[18px] font-bold text-[var(--text-dark)] border-b pb-3 mb-5">신규 매입 기기 등록</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[13px] font-bold mb-1.5">기기명 (모델명)</label>
              <input required type="text" name="name" value={form.name} onChange={handleInputChange} placeholder="예: LG 통돌이 세탁기 10kg" className="w-full p-2.5 bg-[#F8F9FA] border border-[var(--border)] rounded-lg text-[14px] outline-none focus:border-[var(--primary)]" />
            </div>
            <div>
              <label className="block text-[13px] font-bold mb-1.5">카테고리</label>
              <select name="category" value={form.category} onChange={handleInputChange} className="w-full p-2.5 bg-[#F8F9FA] border border-[var(--border)] rounded-lg text-[14px] outline-none focus:border-[var(--primary)]">
                <option value="washer">세탁기</option>
                <option value="refrigerator">냉장고</option>
                <option value="microwave">전자레인지</option>
                <option value="air-purifier">공기청정기</option>
                <option value="dehumidifier">제습기</option>
                <option value="cleaner">청소기</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[13px] font-bold mb-1.5">기기 상태 (영업용 명칭)</label>
              <input required type="text" name="condition" value={form.condition} onChange={handleInputChange} placeholder="예: S급, 새상품, 특A급" className="w-full p-2.5 bg-[#F8F9FA] border border-[var(--border)] rounded-lg text-[14px] outline-none focus:border-[var(--primary)]" />
            </div>
            <div>
              <label className="block text-[13px] font-bold mb-1.5">일시불 구매가 (원)</label>
              <input required type="number" name="buyoutPrice" value={form.buyoutPrice} onChange={handleInputChange} placeholder="예: 90000" className="w-full p-2.5 bg-[#F8F9FA] border border-[var(--border)] rounded-lg text-[14px] outline-none focus:border-[var(--primary)]" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
            <div>
              <label className="block text-[12px] font-bold mb-1 text-[var(--primary)]">1개월 단기 (월)</label>
              <input type="number" name="price1" value={form.price1} onChange={handleInputChange} placeholder="예: 45000" className="w-full p-2 bg-[#F8F9FA] border border-[var(--border)] rounded-lg text-[13px] outline-none focus:border-[var(--primary)]" />
            </div>
            <div>
              <label className="block text-[12px] font-bold mb-1 text-[var(--primary)]">3개월 약정 (월)</label>
              <input type="number" name="price3" value={form.price3} onChange={handleInputChange} placeholder="예: 35000" className="w-full p-2 bg-[#F8F9FA] border border-[var(--border)] rounded-lg text-[13px] outline-none focus:border-[var(--primary)]" />
            </div>
            <div>
              <label className="block text-[12px] font-bold mb-1 text-[var(--primary)]">6개월 약정 (월)</label>
              <input type="number" name="price6" value={form.price6} onChange={handleInputChange} placeholder="예: 19000" className="w-full p-2 bg-[#F8F9FA] border border-[var(--border)] rounded-lg text-[13px] outline-none focus:border-[var(--primary)]" />
            </div>
            <div>
              <label className="block text-[12px] font-bold mb-1 text-[var(--primary)]">12개월 약정 (월)</label>
              <input type="number" name="price12" value={form.price12} onChange={handleInputChange} placeholder="예: 9900" className="w-full p-2 bg-[#F8F9FA] border border-[var(--border)] rounded-lg text-[13px] outline-none focus:border-[var(--primary)]" />
            </div>
            <div>
              <label className="block text-[12px] font-bold mb-1 text-[var(--primary)]">24개월 장기 (월)</label>
              <input type="number" name="price24" value={form.price24} onChange={handleInputChange} placeholder="예: 5900" className="w-full p-2 bg-[#F8F9FA] border border-[var(--border)] rounded-lg text-[13px] outline-none focus:border-[var(--primary)]" />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold mb-1.5">상세 설명</label>
            <textarea name="desc" value={form.desc} onChange={handleInputChange} placeholder="기기의 장점, 매입 시 상태 등을 적어주세요." rows={3} className="w-full p-3 bg-[#F8F9FA] border border-[var(--border)] rounded-lg text-[14px] outline-none focus:border-[var(--primary)] resize-none" />
          </div>

          <div className="flex gap-4 pt-2 border-t border-[var(--border-light)] mt-4">
            <label className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="checkbox" name="todayInstall" checked={form.todayInstall} onChange={handleInputChange} className="w-4 h-4 accent-[var(--primary)]" />
              당일 설치 가능
            </label>
            <label className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="checkbox" name="buyout" checked={form.buyout} onChange={handleInputChange} className="w-4 h-4 accent-[var(--primary)]" />
              일시불 구매 허용
            </label>
          </div>

          <div className="pt-4 flex justify-end">
            <button disabled={isSubmitting} type="submit" className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-8 py-3 rounded-xl font-bold text-[15px] shadow-[0_4px_16px_var(--accent-soft)] transition-all active:scale-95 disabled:opacity-50">
              {isSubmitting ? "등록 중..." : "홈페이지에 즉시 등록하기"}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-2xl border border-[var(--border-light)] shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-[var(--text-light)]">데이터를 불러오는 중...</div>
          ) : products.length === 0 ? (
            <div className="p-10 text-center">
              <div className="text-[40px] mb-3">📭</div>
              <p className="text-[15px] font-bold text-[var(--text-dark)]">등록된 기기가 없습니다.</p>
              <p className="text-[13px] text-[var(--text-light)] mt-1">새 기기 등록 버튼을 눌러 첫 상품을 올려보세요.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-[#F8F9FA] border-b border-[var(--border-light)] text-[12px] text-[var(--text-light)] uppercase tracking-wider">
                    <th className="p-4 font-bold">기기명 / 상태</th>
                    <th className="p-4 font-bold">카테고리</th>
                    <th className="p-4 font-bold">월 렌탈가 (12개월 기준)</th>
                    <th className="p-4 font-bold">당일설치</th>
                    <th className="p-4 font-bold text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-light)]">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-[#F8F9FA] transition-colors">
                      <td className="p-4">
                        <p className="text-[14px] font-bold text-[var(--text-dark)]">{p.name}</p>
                        <p className="text-[12px] text-[var(--primary)] mt-0.5">{p.condition}</p>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--bg-sub)] text-[12px] font-bold text-[var(--text)]">
                          {p.emoji} {p.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="text-[14px] font-black">{p.price12}원</p>
                        {p.buyout && <p className="text-[11px] text-[var(--text-lighter)]">일시불: {p.buyoutPrice}원</p>}
                      </td>
                      <td className="p-4">
                        {p.todayInstall ? (
                          <span className="text-[11px] font-bold text-white bg-[var(--success)] px-2 py-1 rounded-full">가능</span>
                        ) : (
                          <span className="text-[11px] text-[var(--text-lighter)]">불가</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleDelete(p.id)} className="text-[12px] text-red-500 hover:text-red-700 font-bold px-3 py-1.5 border border-red-200 hover:bg-red-50 rounded-lg transition-colors">
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
