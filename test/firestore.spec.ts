import * as fs from "fs";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  collection,
} from "firebase/firestore";
import { describe, it, beforeEach, afterAll, beforeAll } from "@jest/globals";

let testEnv: RulesTestEnvironment;

const getDB = () => {
  // ログイン情報つきのContextを作成し、そこから Firestore インスタンスを得る。
  // authenticatedContextは引数をUIDにもつ認証済みContextを返す。
  // const authenticatedContext = testEnv.authenticatedContext(uid)
  // const clientDB = authenticatedContext.firestore()

  // ゲストContextを作成し、そこから Firestore インスタンスを得る。
  // unauthenticatedContextは未認証Contextを返す。
  const unauthenticatedContext = testEnv.unauthenticatedContext();
  const guestClientDB = unauthenticatedContext.firestore();
  return { guestClientDB };
};

// グローバルで定義されたbeforeAllはテストの開始前に一回実行されます。
beforeAll(async () => {
  // テストプロジェクト環境の作成
  testEnv = await initializeTestEnvironment({
    projectId: "my-test-project",
    firestore: {
      rules: fs.readFileSync("firestore/firestore.rules", "utf8"),
      port: 8081,
      host: "localhost",
    },
  });
});

// グローバルで定義されたbeforeEachは各テストの開始前に一回実行されます。
beforeEach(async () => {
  // Firestore エミュレータ用に構成された Firebase プロジェクトの Firestore のデータをクリアします。
  await testEnv.clearFirestore();
});

// グローバルで定義されたafterAllはテストの終了後に一回実行されます。
afterAll(async () => {
  //テスト終了後テスト環境で作成されたすべての RulesTestContexts を破棄します。
  await testEnv.cleanup();
});

describe("Itineraries security rules", () => {
  it("get: Itineraries は無条件で get 可能", async () => {
    const { guestClientDB } = getDB();
    const collectionRef = collection(guestClientDB, "Itineraries");
    await assertSucceeds(getDoc(doc(collectionRef, "test")));
  });
  it("list: Itineraries は無条件で list 不可能", async () => {
    const { guestClientDB } = getDB();
    const collectionRef = collection(guestClientDB, "Itineraries");
    await assertFails(getDocs(collectionRef));
  });
  // TODO: Write tests for Itineraries security rules
});

describe("PlanGroups security rules", () => {
  // TODO: Write tests for PlanGroups security rules
});

describe("Plans security rules", () => {
  // TODO: Write tests for Plans security rules
});

describe("MPlace security rules", () => {
  it("get: MPlace は無条件で get 可能", async () => {
    const { guestClientDB } = getDB();
    const collectionRef = collection(guestClientDB, "MPlace");
    await assertSucceeds(getDoc(doc(collectionRef, "test")));
  });
  it("list: MPlace は無条件で list 可能", async () => {
    const { guestClientDB } = getDB();
    const collectionRef = collection(guestClientDB, "MPlace");
    await assertSucceeds(getDocs(collectionRef));
  });
  it("create: MPlace は無条件で create 不可能", async () => {
    const { guestClientDB } = getDB();
    const collectionRef = collection(guestClientDB, "MPlace");
    await assertFails(addDoc(collectionRef, { test: "test" }));
  });
  it("update: MPlace は無条件で update 不可能", async () => {
    const { guestClientDB } = getDB();
    const collectionRef = collection(guestClientDB, "MPlace");
    await assertFails(updateDoc(doc(collectionRef, "test"), { test: "test" }));
  });
  it("delete: MPlace は無条件で delete 不可能", async () => {
    const { guestClientDB } = getDB();
    const collectionRef = collection(guestClientDB, "MPlace");
    await assertFails(deleteDoc(doc(collectionRef, "test")));
  });
});

describe("MThumbnail security rules", () => {
  it("get: MThumbnail は無条件で get 可能", async () => {
    const { guestClientDB } = getDB();
    const collectionRef = collection(guestClientDB, "MThumbnail");
    await assertSucceeds(getDoc(doc(collectionRef, "test")));
  });
  it("list: MThumbnail は無条件で list 可能", async () => {
    const { guestClientDB } = getDB();
    const collectionRef = collection(guestClientDB, "MThumbnail");
    await assertSucceeds(getDocs(collectionRef));
  });
  it("create: MThumbnail は無条件で create 不可能", async () => {
    const { guestClientDB } = getDB();
    const collectionRef = collection(guestClientDB, "MThumbnail");
    await assertFails(addDoc(collectionRef, { test: "test" }));
  });
  it("update: MThumbnail は無条件で update 不可能", async () => {
    const { guestClientDB } = getDB();
    const collectionRef = collection(guestClientDB, "MThumbnail");
    await assertFails(updateDoc(doc(collectionRef, "test"), { test: "test" }));
  });
  it("delete: MThumbnail は無条件で delete 不可能", async () => {
    const { guestClientDB } = getDB();
    const collectionRef = collection(guestClientDB, "MThumbnail");
    await assertFails(deleteDoc(doc(collectionRef, "test")));
  });
});

describe("Decorations security rules", () => {
  it("get: Decorations は無条件で get 可能", async () => {
    const { guestClientDB } = getDB();
    const collectionRef = collection(
      doc(collection(guestClientDB, "MThumbnail"), "SampleMThumbnail"),
      "Decorations"
    );
    await assertSucceeds(getDoc(doc(collectionRef, "test")));
  });
  it("list: Decorations は無条件で list 可能", async () => {
    const { guestClientDB } = getDB();
    const collectionRef = collection(
      doc(collection(guestClientDB, "MThumbnail"), "SampleMThumbnail"),
      "Decorations"
    );
    await assertSucceeds(getDocs(collectionRef));
  });
  it("create: Decorations は無条件で create 不可能", async () => {
    const { guestClientDB } = getDB();
    const collectionRef = collection(
      doc(collection(guestClientDB, "MThumbnail"), "SampleMThumbnail"),
      "Decorations"
    );
    await assertFails(addDoc(collectionRef, { test: "test" }));
  });
  it("update: Decorations は無条件で update 不可能", async () => {
    const { guestClientDB } = getDB();
    const collectionRef = collection(
      doc(collection(guestClientDB, "MThumbnail"), "SampleMThumbnail"),
      "Decorations"
    );
    await assertFails(updateDoc(doc(collectionRef, "test"), { test: "test" }));
  });
  it("delete: Decorations は無条件で delete 不可能", async () => {
    const { guestClientDB } = getDB();
    const collectionRef = collection(
      doc(collection(guestClientDB, "MThumbnail"), "SampleMThumbnail"),
      "Decorations"
    );
    await assertFails(deleteDoc(doc(collectionRef, "test")));
  });
});

describe("MMaskShape security rules", () => {
  it("get: MMaskShape は無条件で get 可能", async () => {
    const { guestClientDB } = getDB();
    const collectionRef = collection(guestClientDB, "MMaskShape");
    await assertSucceeds(getDoc(doc(collectionRef, "test")));
  });
  it("list: MMaskShape は無条件で list 可能", async () => {
    const { guestClientDB } = getDB();
    const collectionRef = collection(guestClientDB, "MMaskShape");
    await assertSucceeds(getDocs(collectionRef));
  });
  it("create: MMaskShape は無条件で create 不可能", async () => {
    const { guestClientDB } = getDB();
    const collectionRef = collection(guestClientDB, "MMaskShape");
    await assertFails(addDoc(collectionRef, { test: "test" }));
  });
  it("update: MMaskShape は無条件で update 不可能", async () => {
    const { guestClientDB } = getDB();
    const collectionRef = collection(guestClientDB, "MMaskShape");
    await assertFails(updateDoc(doc(collectionRef, "test"), { test: "test" }));
  });
  it("delete: MMaskShape は無条件で delete 不可能", async () => {
    const { guestClientDB } = getDB();
    const collectionRef = collection(guestClientDB, "MMaskShape");
    await assertFails(deleteDoc(doc(collectionRef, "test")));
  });
});
