"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, ChevronRight, Package, Home } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto w-full">
        <div className="w-20 h-20 bg-[var(--success-soft)] rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={40} className="text-[var(--success)]" />
        </div>
        
        <h1 className="text-2xl font-extrabold text-[var(--text-dark)] mb-2">렌탈 신청 완료!</h1>
        <p className="text-[var(--text)] mb-8">
          고객님의 렌탈 신청이 성공적으로 접수되었습니다.<br/>
          곧 카카오톡으로 안내 메시지를 보내드릴게요.
        </p>

        <div className="bg-[var(--bg-card)] p-5 rounded-2xl shadow-sm border border-[var(--border-light)] w-full mb-8 text-left space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-[var(--border-light)]">
            <span className="text-sm text-[var(--text-light)]">주문 번호</span>
            <span className="text-sm font-bold text-[var(--text-dark)]">{orderId || "ORD-TEST-1234"}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-[var(--border-light)]">
            <span className="text-sm text-[var(--text-light)]">배송 예정일</span>
            <span className="text-sm font-bold text-[var(--text-dark)]">영업일 기준 1~2일 내</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-[var(--text-light)]">결제 금액(가상)</span>
            <span className="text-sm font-bold text-[var(--accent)]">첫 달 렌탈료 결제 완료</span>
          </div>
        </div>

        <div className="w-full space-y-3">
          <Link href="/mypage/rentals" className="w-full bg-[var(--primary)] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
            <Package size={20} />
            내 렌탈 현황 보기
          </Link>
          <Link href="/" className="w-full bg-white text-[var(--text)] font-bold py-4 rounded-xl flex items-center justify-center gap-2 border border-[var(--border)] hover:bg-gray-50 transition-colors">
            <Home size={20} />
            홈으로 돌아가기
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function RentalSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
