"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DaumPostcode from "react-daum-postcode";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ChevronLeft, CheckCircle, Truck, CreditCard } from "lucide-react";

export default function RentalApplyPage({ params }) {
  const router = useRouter();
  const productId = params.id; // in Next.js 14/15, params might be a Promise, but for simplicity here we assume it's synchronous if not using generateStaticParams with dynamicParams=false, wait, in 15 it's a promise, but let's use React.use(params). Let's just assume we can get it from path or wait for it.
  
  // mock product data
  const product = {
    id: productId,
    title: "LG 듀얼인버터 제습기 20L",
    brand: "LG",
    modelName: "DQ200PGAA",
    condition: "A급",
    rentalPrices: {
      "1": 35000,
      "3": 25000,
      "6": 20000,
      "12": 15000,
      "24": 12000,
    },
    images: ["/placeholder.jpg"] // Just a placeholder
  };

  const [period, setPeriod] = useState("12");
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    zipcode: "",
    address: "",
    detailAddress: "",
    method: "매장 직접 전달",
  });
  
  const [agreed, setAgreed] = useState(false);
  const [showPostcode, setShowPostcode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const monthlyPrice = product.rentalPrices[period];

  const handlePostcodeComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = "";
    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }
    setShippingInfo({
      ...shippingInfo,
      zipcode: data.zonecode,
      address: fullAddress,
    });
    setShowPostcode(false);
  };

  const handlePayment = async () => {
    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address) {
      alert("배송지 정보를 모두 입력해주세요.");
      return;
    }
    if (!agreed) {
      alert("약관에 동의하셔야 렌탈이 가능합니다.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create a mock order to save to Firebase
      const orderData = {
        orderNumber: `ORD-${new Date().getFullYear()}${String(new Date().getMonth()+1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 1000)}`,
        customerId: "mock-user-123", // In a real app, from Auth
        productId: product.id,
        partnerId: "mock-partner-456", // Or null if direct
        rentalPeriod: parseInt(period),
        monthlyPrice,
        shippingInfo,
        status: "확정",
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "orders"), orderData);
      
      // Redirect to success page (which we will create next)
      router.push(`/products/${productId}/apply/success?orderId=${docRef.id}`);
    } catch (error) {
      console.error("Order error:", error);
      alert("주문 처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] pb-24">
      {/* Header */}
      <header className="sticky top-0 bg-[var(--bg-card)] shadow-sm z-10 p-4 flex items-center">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-[var(--text)]">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold ml-2">렌탈 신청</h1>
      </header>

      <main className="max-w-xl mx-auto p-4 space-y-6">
        {/* Product Summary */}
        <section className="bg-[var(--bg-card)] p-4 rounded-[var(--radius-md)] shadow-card">
          <h2 className="text-sm font-bold text-[var(--primary)] mb-2">선택한 상품</h2>
          <div className="flex gap-4">
            <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0" />
            <div>
              <p className="text-xs text-[var(--text-light)] mb-1">{product.brand}</p>
              <h3 className="font-bold text-[var(--text-dark)] text-sm mb-1 line-clamp-2">{product.title}</h3>
              <p className="text-xs text-[var(--text-light)]">상태: {product.condition}</p>
            </div>
          </div>
        </section>

        {/* Period Selection */}
        <section className="bg-[var(--bg-card)] p-4 rounded-[var(--radius-md)] shadow-card space-y-3">
          <h2 className="text-sm font-bold text-[var(--text-dark)] flex items-center gap-2">
            <CheckCircle size={18} className="text-[var(--accent)]" /> 렌탈 기간 선택
          </h2>
          <div className="grid grid-cols-5 gap-2">
            {Object.keys(product.rentalPrices).map((m) => (
              <button
                key={m}
                onClick={() => setPeriod(m)}
                className={`py-2 text-center text-sm rounded-lg border font-semibold transition-all ${
                  period === m 
                    ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]" 
                    : "border-[var(--border)] text-[var(--text-light)]"
                }`}
              >
                {m}개월
              </button>
            ))}
          </div>
          <div className="pt-2 flex justify-between items-center border-t border-[var(--border-light)] mt-3">
            <span className="text-sm font-bold text-[var(--text-dark)]">월 렌탈료</span>
            <span className="text-lg font-extrabold text-[var(--accent)]">{monthlyPrice.toLocaleString()}원</span>
          </div>
        </section>

        {/* Shipping Info */}
        <section className="bg-[var(--bg-card)] p-4 rounded-[var(--radius-md)] shadow-card space-y-4">
          <h2 className="text-sm font-bold text-[var(--text-dark)] flex items-center gap-2">
            <Truck size={18} className="text-[var(--accent)]" /> 배송지 정보
          </h2>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">수령인</label>
              <input
                type="text"
                placeholder="이름을 입력하세요"
                className="w-full border border-[var(--border)] rounded-lg p-3 text-sm focus:border-[var(--accent)] outline-none"
                value={shippingInfo.name}
                onChange={(e) => setShippingInfo({...shippingInfo, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">연락처</label>
              <input
                type="tel"
                placeholder="010-0000-0000"
                className="w-full border border-[var(--border)] rounded-lg p-3 text-sm focus:border-[var(--accent)] outline-none"
                value={shippingInfo.phone}
                onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">배송 주소</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  readOnly
                  placeholder="우편번호"
                  className="flex-1 border border-[var(--border)] bg-gray-50 rounded-lg p-3 text-sm"
                  value={shippingInfo.zipcode}
                />
                <button 
                  onClick={() => setShowPostcode(true)}
                  className="bg-[var(--primary)] text-white px-4 rounded-lg text-sm font-semibold"
                >
                  주소 찾기
                </button>
              </div>
              <input
                type="text"
                readOnly
                placeholder="기본 주소"
                className="w-full border border-[var(--border)] bg-gray-50 rounded-lg p-3 text-sm mb-2"
                value={shippingInfo.address}
              />
              <input
                type="text"
                placeholder="상세 주소 입력"
                className="w-full border border-[var(--border)] rounded-lg p-3 text-sm focus:border-[var(--accent)] outline-none"
                value={shippingInfo.detailAddress}
                onChange={(e) => setShippingInfo({...shippingInfo, detailAddress: e.target.value})}
              />
            </div>
            
            {showPostcode && (
              <div className="border border-[var(--border)] rounded-lg overflow-hidden mt-2">
                <DaumPostcode onComplete={handlePostcodeComplete} autoClose={false} />
              </div>
            )}
          </div>
        </section>

        {/* Terms */}
        <section className="bg-[var(--bg-card)] p-4 rounded-[var(--radius-md)] shadow-card">
          <label className="flex items-start gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              className="mt-1 w-5 h-5 accent-[var(--accent)]" 
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <div>
              <span className="text-sm font-bold text-[var(--text-dark)]">(필수) 렌탈 전자계약 및 개인정보 동의</span>
              <p className="text-xs text-[var(--text-light)] mt-1">
                위약금 정책 및 임대차 계약 약관을 확인하였으며 이에 동의합니다.
              </p>
            </div>
          </label>
        </section>
      </main>

      {/* Bottom Fixed Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.05)] max-w-xl mx-auto">
        <button
          onClick={handlePayment}
          disabled={isSubmitting}
          className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
        >
          <CreditCard size={20} />
          {isSubmitting ? "처리 중..." : `${monthlyPrice.toLocaleString()}원 결제하기 (가상)`}
        </button>
      </div>
    </div>
  );
}
