import { db } from "./firebase";
import { collection, getDocs, getDoc, doc, setDoc, addDoc } from "firebase/firestore";

// 로컬 Fallback 및 Seeding 용 Mock 데이터
export const fallbackProducts = [
  { id:"1", name:"LG 듀얼인버터 제습기 20L", brand:"LG", model:"DQ200PGAA", price6:"18,000", price12:"15,000", price24:"13,000", condition:"A급", usedYears:"2년", desc:"사용감 적음, 필터 교체 완료. 20L 대용량으로 넓은 원룸도 커버. 인버터 방식으로 소음 적고 전기세 절약.", store:"서면 가전마트", area:"서면", district:"부산진구", todayInstall:true, buyout:true, buyoutPrice:"180,000", onlinePay:true, emoji:"💧", category:"dehumidifier" },
  { id:"2", name:"위닉스 제습기 16L", brand:"위닉스", model:"DN-16LWIE", price6:"12,000", price12:"10,000", price24:"8,500", condition:"B급", usedYears:"3년", desc:"외관 사용감 있으나 기능 이상 없음. 16L 적정 용량.", store:"센텀 가전할인", area:"센텀", district:"해운대구", todayInstall:true, buyout:false, onlinePay:false, emoji:"💧", category:"dehumidifier" },
  { id:"3", name:"삼성 제습기 AY300", brand:"삼성", model:"AY300CGANWK", price6:"16,000", price12:"13,000", price24:"11,000", condition:"S급", usedYears:"1년", desc:"거의 새제품 수준. 1년 사용, 풀박스 보관.", store:"해운대 중고가전", area:"해운대", district:"해운대구", todayInstall:false, buyout:true, buyoutPrice:"210,000", onlinePay:true, emoji:"💧", category:"dehumidifier" },
  { id:"4", name:"다이슨 퓨어쿨 공기청정기 TP07", brand:"다이슨", model:"TP07", price6:"27,000", price12:"22,000", price24:"19,000", condition:"S급", usedYears:"1년", desc:"필터 신품 교체. 다이슨 특유의 디자인과 성능.", store:"해운대 중고가전", area:"해운대", district:"해운대구", todayInstall:true, buyout:true, buyoutPrice:"350,000", onlinePay:true, emoji:"🌿", category:"air-purifier" },
  { id:"5", name:"위닉스 타워 공기청정기", brand:"위닉스", model:"ATXH500", price6:"19,000", price12:"16,000", price24:"14,000", condition:"B급", usedYears:"2년", desc:"필터 교체 완료. 30평대 커버.", store:"서면 가전마트", area:"서면", district:"부산진구", todayInstall:true, buyout:false, onlinePay:true, emoji:"🌿", category:"air-purifier" },
  { id:"6", name:"LG 퓨리케어 360", brand:"LG", model:"AS300DWFA", price6:"22,000", price12:"18,000", price24:"15,000", condition:"A급", usedYears:"2년", desc:"360도 청정. 필터 교체 완료. 정상 작동.", store:"동래 가전센터", area:"동래", district:"동래구", todayInstall:true, buyout:true, buyoutPrice:"280,000", onlinePay:false, emoji:"🌿", category:"air-purifier" },
  { id:"7", name:"삼성 그랑데 건조기 9kg", brand:"삼성", model:"DV90T5540BW", price6:"33,000", price12:"28,000", price24:"24,000", condition:"A급", usedYears:"2년", desc:"9kg 대용량. AI 건조 기능. 정상 작동.", store:"사상 중고가전", area:"사상", district:"사상구", todayInstall:false, buyout:true, buyoutPrice:"420,000", onlinePay:false, emoji:"👕", category:"dryer" },
  { id:"8", name:"LG 트롬 건조기 9kg", brand:"LG", model:"RH9WI", price6:"30,000", price12:"25,000", price24:"21,000", condition:"A급", usedYears:"2년", desc:"듀얼인버터 히트펌프. 의류 손상 최소화.", store:"서면 가전마트", area:"서면", district:"부산진구", todayInstall:true, buyout:true, buyoutPrice:"380,000", onlinePay:true, emoji:"👕", category:"dryer" },
  { id:"9", name:"스마트카라 음식물처리기 PCS-400", brand:"스마트카라", model:"PCS-400", price6:"17,000", price12:"14,000", price24:"12,000", condition:"A급", usedYears:"1년", desc:"음식물 처리 1인가구 필수. 냄새 없음.", store:"남포 가전나라", area:"남포동", district:"중구", todayInstall:true, buyout:true, buyoutPrice:"200,000", onlinePay:true, emoji:"🗑️", category:"food-processor" },
  { id:"10", name:"린클 음식물처리기 FW-300", brand:"린클", model:"FW-300", price6:"15,000", price12:"12,000", price24:"10,000", condition:"B급", usedYears:"2년", desc:"컴팩트 사이즈. 건조 방식.", store:"서면 가전마트", area:"서면", district:"부산진구", todayInstall:true, buyout:false, onlinePay:true, emoji:"🗑️", category:"food-processor" },
  { id:"11", name:"로보락 S7 로봇청소기", brand:"로보락", model:"S7", price6:"15,000", price12:"12,000", price24:"10,000", condition:"S급", usedYears:"1년", desc:"물걸레+흡입 동시. 앱 연동 가능.", store:"동래 가전센터", area:"동래", district:"동래구", todayInstall:true, buyout:true, buyoutPrice:"280,000", onlinePay:false, emoji:"🤖", category:"robot-cleaner" },
  { id:"12", name:"삼성 비스포크 제트봇", brand:"삼성", model:"VR50T", price6:"18,000", price12:"15,000", price24:"13,000", condition:"A급", usedYears:"2년", desc:"LiDAR 센서 매핑. 자동 충전.", store:"센텀 가전할인", area:"센텀", district:"해운대구", todayInstall:false, buyout:true, buyoutPrice:"320,000", onlinePay:false, emoji:"🤖", category:"robot-cleaner" },
];

// Firebase 설정값이 dummy 상태인지 검증하는 함수
const isFirebaseDummy = () => {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  return !apiKey || apiKey === "your_api_key_here";
};

// Firestore가 비어 있을 시 데이터 시딩
export async function seedProductsIfNeeded() {
  if (isFirebaseDummy()) return;
  try {
    const productsCol = collection(db, "products");
    const snapshot = await getDocs(productsCol);
    if (snapshot.empty) {
      console.log("Firestore 'products' collection is empty. Seeding fallback products...");
      for (const product of fallbackProducts) {
        await setDoc(doc(db, "products", product.id), product);
      }
      console.log("Seeding complete!");
    }
  } catch (error) {
    console.error("Failed to seed products to Firestore:", error);
  }
}

// 1. 상품 전체 목록 불러오기
export async function getProducts() {
  if (isFirebaseDummy()) {
    console.log("Using fallback mock products (Firebase config is empty/dummy)");
    return fallbackProducts;
  }
  try {
    await seedProductsIfNeeded();
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
