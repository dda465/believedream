"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DaumPostcode from "react-daum-postcode";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Store, Upload, ChevronLeft, CheckCircle2 } from "lucide-react";

export default function PartnerApplyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    storeName: "",
    representativeName: "",
    phone: "",
    zipcode: "",
    address: "",
    detailAddress: "",
  });
  
  const [showPostcode, setShowPostcode] = useState(false);
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setFormData({
      ...formData,
      zipcode: data.zonecode,
      address: fullAddress,
    });
    setShowPostcode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.storeName || !formData.representativeName || !formData.phone || !formData.address) {
      alert("필수 정보를 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 가상(Mock) 파일 업로드 처리 (Firebase Storage 연동 전)
      let businessRegistrationUrl = "mock-url-12345";
      
      /* 주석 처리된 실제 파일 업로드 로직 (향후 Storage 활성화 시 사용)
      if (file) {
        const fileRef = ref(storage, `business_registrations/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(fileRef, file);
        businessRegistrationUrl = await getDownloadURL(snapshot.ref);
      }
      */

      // Firebase Firestore에 파트너 입점 정보 저장
      const partnerData = {
        userId: "mock-partner-user-123", // 실제로는 현재 로그인된 파트너의 Auth UID
        ...formData,
        businessRegistrationUrl,
        status: "pending", // 심사 대기중
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "partners"), partnerData);
      
      setStep(3); // 성공 화면으로 이동
    } catch (error) {
      console.error("Partner Application Error:", error);
      alert("입점 신청 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      {/* Header */}
      <header className="bg-[var(--bg-card)] shadow-sm p-4 flex items-center border-b border-[var(--border)]">
        {step < 3 && (
          <button onClick={() => router.back()} className="p-2 -ml-2 text-[var(--text)]">
            <ChevronLeft size={24} />
          </button>
        )}
        <h1 className="text-lg font-bold ml-2">빌리드림 파트너 입점 신청</h1>
      </header>

      <main className="max-w-2xl mx-auto p-6">
        {step === 1 && (
          <form onSubmit={() => setStep(2)} className="space-y-6 anim-fade-in">
            <div className="text-center mb-8">
              <Store size={48} className="text-[var(--primary)] mx-auto mb-4" />
              <h2 className="text-2xl font-extrabold text-[var(--text-dark)]">사장님, 환영합니다!</h2>
              <p className="text-[var(--text-light)] mt-2">빌리드림과 함께 중고 렌탈 시장을 열어보세요.</p>
            </div>

            <div className="bg-[var(--bg-card)] p-6 rounded-2xl shadow-card space-y-4">
              <div>
                <label className="block text-sm font-bold text-[var(--text-dark)] mb-2">상호명 (매장명)</label>
                <input
                  type="text"
                  required
                  placeholder="예: 부산중고가전"
                  className="w-full border border-[var(--border)] rounded-xl p-4 text-sm focus:border-[var(--primary)] outline-none transition-colors"
                  value={formData.storeName}
                  onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-[var(--text-dark)] mb-2">대표자명</label>
                <input
                  type="text"
                  required
                  placeholder="대표자 이름"
                  className="w-full border border-[var(--border)] rounded-xl p-4 text-sm focus:border-[var(--primary)] outline-none transition-colors"
                  value={formData.representativeName}
                  onChange={(e) => setFormData({...formData, representativeName: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--text-dark)] mb-2">연락처 (휴대폰)</label>
                <input
                  type="tel"
                  required
                  placeholder="010-0000-0000"
                  className="w-full border border-[var(--border)] rounded-xl p-4 text-sm focus:border-[var(--primary)] outline-none transition-colors"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--text-dark)] mb-2">매장 주소</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    readOnly
                    required
                    placeholder="우편번호"
                    className="flex-1 border border-[var(--border)] bg-gray-50 rounded-xl p-4 text-sm outline-none"
                    value={formData.zipcode}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPostcode(true)}
                    className="bg-[var(--primary)] text-white px-6 rounded-xl text-sm font-bold hover:bg-[var(--banner-via)] transition-colors"
                  >
                    주소 찾기
                  </button>
                </div>
                <input
                  type="text"
                  readOnly
                  placeholder="기본 주소"
                  className="w-full border border-[var(--border)] bg-gray-50 rounded-xl p-4 text-sm mb-2 outline-none"
                  value={formData.address}
                />
                <input
                  type="text"
                  placeholder="상세 주소 입력"
                  className="w-full border border-[var(--border)] rounded-xl p-4 text-sm focus:border-[var(--primary)] outline-none transition-colors"
                  value={formData.detailAddress}
                  onChange={(e) => setFormData({...formData, detailAddress: e.target.value})}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[var(--primary)] text-white font-bold py-4 rounded-xl text-lg hover:bg-[var(--banner-via)] transition-colors shadow-float"
            >
              다음 단계로
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-6 anim-fade-in">
            <div className="bg-[var(--bg-card)] p-6 rounded-2xl shadow-card">
              <h3 className="text-lg font-bold text-[var(--text-dark)] mb-4">사업자등록증 첨부 (선택)</h3>
              <p className="text-sm text-[var(--text-light)] mb-6">
                사업자등록증을 첨부하시면 심사가 훨씬 빠르게 진행됩니다.<br/>
                (나중에 관리자 페이지에서도 등록 가능합니다.)
              </p>
              
              <div className="border-2 border-dashed border-[var(--border)] rounded-2xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  accept="image/*,.pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <Upload size={32} className="text-[var(--text-light)] mx-auto mb-3" />
                <p className="text-sm font-bold text-[var(--text)]">
                  {file ? file.name : "여기를 눌러 파일을 업로드하세요"}
                </p>
                {!file && <p className="text-xs text-[var(--text-lighter)] mt-1">JPG, PNG, PDF 형식 지원</p>}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 bg-white text-[var(--text)] font-bold py-4 rounded-xl border border-[var(--border)] hover:bg-gray-50 transition-colors"
              >
                이전
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-2/3 bg-[var(--accent)] text-white font-bold py-4 rounded-xl text-lg hover:bg-[var(--accent-hover)] transition-colors shadow-glow disabled:opacity-50"
              >
                {isSubmitting ? "제출 중..." : "입점 신청 완료하기"}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="text-center py-12 anim-fade-in">
            <div className="w-24 h-24 bg-[var(--success-soft)] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={48} className="text-[var(--success)]" />
            </div>
            <h2 className="text-2xl font-extrabold text-[var(--text-dark)] mb-4">입점 신청이 완료되었습니다!</h2>
            <p className="text-[var(--text)] mb-8 leading-relaxed">
              빌리드림 파트너가 되신 것을 환영합니다.<br/>
              관리자 심사 후 카카오톡으로 승인 안내를 보내드리겠습니다.<br/>
              (영업일 기준 1~3일 소요)
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-[var(--primary)] text-white font-bold py-4 px-8 rounded-xl hover:opacity-90 transition-opacity"
            >
              홈으로 돌아가기
            </button>
          </div>
        )}

        {/* Postcode Modal */}
        {showPostcode && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative">
              <div className="p-4 bg-[var(--primary)] flex justify-between items-center text-white">
                <h3 className="font-bold">주소 검색</h3>
                <button onClick={() => setShowPostcode(false)} className="text-white hover:opacity-70">닫기</button>
              </div>
              <div className="h-[400px] overflow-y-auto">
                <DaumPostcode onComplete={handlePostcodeComplete} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
