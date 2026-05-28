import { db } from "./firebase";
import { collection, getDocs, getDoc, doc, setDoc, addDoc } from "firebase/firestore";

// 로컬 Fallback 및 Seeding 용 Mock 데이터 (새로운 DB 아키텍처 반영)
export const fallbackUsers = [
  { uid: "mock-user-1", name: "김부산", phone: "010-1234-5678", address: "부산광역시 부산진구 서면로 123", createdAt: new Date().toISOString() }
];

export const fallbackPartners = [
  { partnerId: "p1", type: "USED_LOCAL", storeName: "빌리드림 직영", businessNumber: "123-45-67890", location: "부산진구 부전동", status: "ACTIVE", createdAt: new Date().toISOString() },
  { partnerId: "p2", type: "USED_LOCAL", storeName: "해운대 중고가전", businessNumber: "234-56-78901", location: "해운대구 우동", status: "ACTIVE", createdAt: new Date().toISOString() },
  { partnerId: "p3", type: "NEW_NATIONAL", storeName: "LG전자 공식렌탈", businessNumber: "345-67-89012", location: "전국", status: "ACTIVE", createdAt: new Date().toISOString() }
];

export const fallbackProducts = [
  { id:"1", partnerId:"p1", productType:"USED", name:"LG 듀얼인버터 제습기 20L", brand:"LG", model:"DQ200PGAA", prices: { price6:"18000", price12:"15000", price24:"13000" }, condition:"A급", usedYears:"2년", desc:"사용감 적음, 필터 교체 완료. 20L 대용량으로 넓은 원룸도 커버. 인버터 방식으로 소음 적고 전기세 절약.", store:"빌리드림 직영", area:"직영점", district:"부산진구", todayInstall:true, buyout:true, buyoutPrice:"180,000", onlinePay:true, emoji:"💧", category:"dehumidifier" },
  { id:"2", partnerId:"p1", productType:"USED", name:"위닉스 제습기 16L", brand:"위닉스", model:"DN-16LWIE", prices: { price6:"12000", price12:"10000", price24:"8500" }, condition:"B급", usedYears:"3년", desc:"외관 사용감 있으나 기능 이상 없음. 16L 적정 용량.", store:"빌리드림 직영", area:"직영점", district:"부산진구", todayInstall:true, buyout:true, buyoutPrice:"120,000", onlinePay:true, emoji:"💧", category:"dehumidifier" },
  { id:"3", partnerId:"p2", productType:"USED", name:"삼성 제습기 AY300", brand:"삼성", model:"AY300CGANWK", prices: { price6:"16000", price12:"13000", price24:"11000" }, condition:"S급", usedYears:"1년", desc:"거의 새제품 수준. 1년 사용, 풀박스 보관.", store:"해운대 중고가전", area:"해운대", district:"해운대구", todayInstall:false, buyout:true, buyoutPrice:"210,000", onlinePay:true, emoji:"💧", category:"dehumidifier" },
  { id:"4", partnerId:"p3", productType:"NEW", name:"[신품] LG 디오스 오브제컬렉션", brand:"LG", model:"M873MWW031", prices: { price36:"35000", price60:"28000" }, condition:"NEW", usedYears:"0년", desc:"LG 공식 신품 렌탈. 전국 무료 배송 설치.", store:"LG전자 공식렌탈", area:"전국", district:"전국", todayInstall:false, buyout:true, buyoutPrice:"0", onlinePay:true, emoji:"❄️", category:"refrigerator" },
];

export const fallbackOrders = [
  { orderId: "ORD-20260528-123", userId: "mock-user-1", productId: "1", partnerId: "p1", status: "INSTALLING", period: 12, monthlyPrice: 15000, startDate: "2026-06-01", endDate: "2027-05-31", createdAt: new Date().toISOString() }
];

// Firebase 설정값이 dummy 상태인지 검증하는 함수
const isFirebaseDummy = () => {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  return !apiKey || apiKey === "your_api_key_here";
};

// Firestore가 비어 있을 시 모든 4대 핵심 컬렉션 데이터 시딩
export async function seedDatabaseIfNeeded() {
  if (isFirebaseDummy()) return;
  try {
    const productsCol = collection(db, "products");
    const snapshot = await getDocs(productsCol);
    if (snapshot.empty) {
      console.log("Firestore collections are empty. Seeding all fallback data...");
      
      for (const p of fallbackProducts) await setDoc(doc(db, "products", p.id), p);
      for (const p of fallbackPartners) await setDoc(doc(db, "partners", p.partnerId), p);
      for (const u of fallbackUsers) await setDoc(doc(db, "users", u.uid), u);
      for (const o of fallbackOrders) await setDoc(doc(db, "orders", o.orderId), o);
      
      console.log("Database seeding complete!");
    }
  } catch (error) {
    console.error("Failed to seed database to Firestore:", error);
  }
}

// 1. 상품 전체 목록 불러오기
export async function getProducts() {
  if (isFirebaseDummy()) {
    console.log("Using fallback mock products (Firebase config is empty/dummy)");
    return fallbackProducts;
  }
  try {
    await seedDatabaseIfNeeded();
    const productsCol = collection(db, "products");
    const snapshot = await getDocs(productsCol);
    if (snapshot.empty) {
      return fallbackProducts;
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching products from Firestore, using fallback:", error);
    return fallbackProducts;
  }
}

// 2. 특정 ID의 상품 불러오기
export async function getProductById(id) {
  if (isFirebaseDummy()) {
    return fallbackProducts.find(p => p.id === id) || null;
  }
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return fallbackProducts.find(p => p.id === id) || null;
  } catch (error) {
    console.error(`Error fetching product ID ${id} from Firestore, using fallback:`, error);
    return fallbackProducts.find(p => p.id === id) || null;
  }
}

// 3. 렌탈 신청서 작성
export async function createRentalRequest(requestData) {
  const data = {
    ...requestData,
    createdAt: new Date().toISOString(),
  };
  if (isFirebaseDummy()) {
    console.log("Mock Submit Rental Request:", data);
    return { success: true, id: `mock-rental-${Math.floor(Math.random() * 90000 + 10000)}` };
  }
  try {
    const colRef = collection(db, "rental_requests");
    const docRef = await addDoc(colRef, data);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error submitting rental request to Firestore:", error);
    return { success: false, id: null, error: "신청서 저장에 실패했습니다. 다시 시도해 주세요." };
  }
}

// 4. 입점 신청서 작성
export async function createPartnerApplication(applicationData) {
  const data = {
    ...applicationData,
    createdAt: new Date().toISOString(),
  };
  if (isFirebaseDummy()) {
    console.log("Mock Submit Partner Application:", data);
    return { success: true, id: `mock-partner-${Math.floor(Math.random() * 90000 + 10000)}` };
  }
  try {
    const colRef = collection(db, "partner_applications");
    const docRef = await addDoc(colRef, data);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error submitting partner application to Firestore:", error);
    return { success: false, id: null, error: "입점 신청서 저장에 실패했습니다. 다시 시도해 주세요." };
  }
}

// ----------------------------------------------------
// Admin 통계 및 관리용 함수 모음
// ----------------------------------------------------

// 5. 상품 등록 (Admin)
export async function createProduct(productData) {
  if (isFirebaseDummy()) return { success: true, id: `mock-prod-${Date.now()}` };
  try {
    const colRef = collection(db, "products");
    const docRef = await addDoc(colRef, { ...productData, createdAt: new Date().toISOString() });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error };
  }
}

// 6. 상품 수정 (Admin)
export async function updateProduct(id, productData) {
  if (isFirebaseDummy()) return { success: true };
  try {
    const docRef = doc(db, "products", id);
    await setDoc(docRef, productData, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error };
  }
}

// 7. 상품 삭제 (Admin)
import { deleteDoc } from "firebase/firestore";
export async function deleteProduct(id) {
  if (isFirebaseDummy()) return { success: true };
  try {
    const docRef = doc(db, "products", id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error };
  }
}

// 8. 모든 렌탈 신청서 조회 (Admin)
export async function getAllRentalRequests() {
  if (isFirebaseDummy()) return [];
  try {
    const colRef = collection(db, "rental_requests");
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error("Error fetching rental requests:", error);
    return [];
  }
}

// 9. 모든 입점 신청서 조회 (Admin)
export async function getAllPartnerApplications() {
  if (isFirebaseDummy()) return [];
  try {
    const colRef = collection(db, "partner_applications");
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error("Error fetching partner applications:", error);
    return [];
  }
}
