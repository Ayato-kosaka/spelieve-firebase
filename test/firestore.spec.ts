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
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  collection,
  CollectionReference,
  DocumentReference,
  DocumentData,
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

describe("Itineraries", () => {
  let guestCollectionRef: CollectionReference<DocumentData>;
  beforeAll(() => {
    const { guestClientDB } = getDB();
    guestCollectionRef = collection(guestClientDB, "Itineraries");
  });
  beforeEach(async () => {
    await testEnv.withSecurityRulesDisabled(async (noRuleContext) => {
      const noRuleCollectionRef = collection(
        noRuleContext.firestore(),
        "Itineraries"
      );
      await setDoc(doc(noRuleCollectionRef, "testDocId"), {
        field1: "value1",
      });
      await setDoc(doc(noRuleCollectionRef, "immutableDocId"), {
        field1: "value1",
        isImmutable: true,
      });
    });
  });
  it("get: 無条件で get 可能", async () => {
    await assertSucceeds(getDoc(doc(guestCollectionRef, "immutableDocId")));
  });
  it("list: 無条件で list 不可能", async () => {
    await assertFails(getDocs(guestCollectionRef));
  });
  it("create: 無条件で create 可能", async () => {
    await assertSucceeds(
      addDoc(guestCollectionRef, {
        field1: "value1",
        isImmutable: true,
      })
    );
  });
  describe("update", () => {
    it("isImmutable フィールドが true の場合、update 不可能", async () => {
      await assertFails(
        updateDoc(doc(guestCollectionRef, "immutableDocId"), {
          field1: "value1",
        })
      );
    });
    it("上記以外の場合、update 可能", async () => {
      await assertSucceeds(
        updateDoc(doc(guestCollectionRef, "testDocId"), {
          field1: "value1",
          isImmutable: true,
        })
      );
    });
  });
  it("delete: 無条件で delete 不可能", async () => {
    await assertFails(deleteDoc(doc(guestCollectionRef, "testDocId")));
  });
});

describe("PlanGroups", () => {
  let guestCollectionRef: CollectionReference<DocumentData>;
  let guestImmutableCollectionRef: CollectionReference<DocumentData>;
  beforeAll(() => {
    const { guestClientDB } = getDB();
    guestCollectionRef = collection(
      collection(guestClientDB, "Itineraries"),
      "testDocId",
      "PlanGroups"
    );
    guestImmutableCollectionRef = collection(
      collection(guestClientDB, "Itineraries"),
      "immutableDocId",
      "PlanGroups"
    );
  });
  // Global.beforeEach が走るため、beforeAll ではなく、beforeEach で定義する
  beforeEach(async () => {
    await testEnv.withSecurityRulesDisabled(async (noRuleContext) => {
      const noRuleCollectionRef = collection(
        noRuleContext.firestore(),
        "Itineraries"
      );
      await setDoc(doc(noRuleCollectionRef, "testDocId"), {
        field1: "value1",
      });
      await setDoc(doc(noRuleCollectionRef, "immutableDocId"), {
        field1: "value1",
        isImmutable: true,
      });
      await setDoc(
        doc(noRuleCollectionRef, "testDocId", "PlanGroups", "testDocId"),
        {
          field1: "value1",
        }
      );
      await setDoc(
        doc(noRuleCollectionRef, "immutableDocId", "PlanGroups", "testDocId"),
        {
          field1: "value1",
        }
      );
    });
  });
  it("get: 無条件で get 可能", async () => {
    await assertSucceeds(getDoc(doc(guestImmutableCollectionRef, "testDocId")));
  });
  it("list: 無条件で list 可能", async () => {
    await assertSucceeds(getDocs(guestImmutableCollectionRef));
  });
  describe("create", () => {
    it("Itineraries の isImmutable フィールドが true の場合、create 不可能", async () => {
      await assertFails(
        addDoc(guestImmutableCollectionRef, { field1: "newValue" })
      );
    });
    it("上記以外の場合、create 可能", async () => {
      await assertSucceeds(addDoc(guestCollectionRef, { field1: "newValue" }));
    });
  });
  describe("update", () => {
    it("Itineraries の isImmutable フィールドが true の場合、update 不可能", async () => {
      await assertFails(
        updateDoc(doc(guestImmutableCollectionRef, "testDocId"), {
          field1: "newValue",
        })
      );
    });
    it("上記以外の場合、update 可能", async () => {
      await assertSucceeds(
        updateDoc(doc(guestCollectionRef, "testDocId"), { field1: "newValue" })
      );
    });
  });
  describe("delete", () => {
    it("Itineraries の isImmutable フィールドが true の場合、delete 不可能", async () => {
      await assertFails(
        deleteDoc(doc(guestImmutableCollectionRef, "testDocId"))
      );
    });
    it("上記以外の場合、delete 可能", async () => {
      await assertSucceeds(deleteDoc(doc(guestCollectionRef, "testDocId")));
    });
  });
});

describe("Plans", () => {
  let guestCollectionRef: CollectionReference<DocumentData>;
  let guestImmutableCollectionRef: CollectionReference<DocumentData>;
  beforeAll(() => {
    const { guestClientDB } = getDB();
    guestCollectionRef = collection(
      collection(guestClientDB, "Itineraries"),
      "testDocId",
      "Plans"
    );
    guestImmutableCollectionRef = collection(
      collection(guestClientDB, "Itineraries"),
      "immutableDocId",
      "Plans"
    );
  });
  // Global.beforeEach が走るため、beforeAll ではなく、beforeEach で定義する
  beforeEach(async () => {
    await testEnv.withSecurityRulesDisabled(async (noRuleContext) => {
      const noRuleCollectionRef = collection(
        noRuleContext.firestore(),
        "Itineraries"
      );
      await setDoc(doc(noRuleCollectionRef, "testDocId"), {
        field1: "value1",
      });
      await setDoc(doc(noRuleCollectionRef, "immutableDocId"), {
        field1: "value1",
        isImmutable: true,
      });
      await setDoc(
        doc(noRuleCollectionRef, "testDocId", "Plans", "testDocId"),
        {
          field1: "value1",
        }
      );
      await setDoc(
        doc(noRuleCollectionRef, "immutableDocId", "Plans", "testDocId"),
        {
          field1: "value1",
        }
      );
    });
  });
  it("get: 無条件で get 可能", async () => {
    await assertSucceeds(getDoc(doc(guestImmutableCollectionRef, "testDocId")));
  });
  it("list: 無条件で list 可能", async () => {
    await assertSucceeds(getDocs(guestImmutableCollectionRef));
  });
  describe("create", () => {
    it("Itineraries の isImmutable フィールドが true の場合、create 不可能", async () => {
      await assertFails(
        addDoc(guestImmutableCollectionRef, { field1: "newValue" })
      );
    });
    it("上記以外の場合、create 可能", async () => {
      await assertSucceeds(addDoc(guestCollectionRef, { field1: "newValue" }));
    });
  });
  describe("update", () => {
    it("Itineraries の isImmutable フィールドが true の場合、update 不可能", async () => {
      await assertFails(
        updateDoc(doc(guestImmutableCollectionRef, "testDocId"), {
          field1: "newValue",
        })
      );
    });
    it("上記以外の場合、update 可能", async () => {
      await assertSucceeds(
        updateDoc(doc(guestCollectionRef, "testDocId"), { field1: "newValue" })
      );
    });
  });
  describe("delete", () => {
    it("Itineraries の isImmutable フィールドが true の場合、delete 不可能", async () => {
      await assertFails(
        deleteDoc(doc(guestImmutableCollectionRef, "testDocId"))
      );
    });
    it("上記以外の場合、delete 可能", async () => {
      await assertSucceeds(deleteDoc(doc(guestCollectionRef, "testDocId")));
    });
  });
});

describe("MPlace", () => {
  let guestCollectionRef: CollectionReference<DocumentData>;
  beforeAll(() => {
    const { guestClientDB } = getDB();
    guestCollectionRef = collection(guestClientDB, "MPlace");
  });
  beforeEach(async () => {
    await testEnv.withSecurityRulesDisabled(async (noRuleContext) => {
      const noRuleCollectionRef = collection(
        noRuleContext.firestore(),
        "MPlace"
      );
      await setDoc(doc(noRuleCollectionRef, "testDocId"), {
        field1: "value1",
      });
    });
  });
  it("get: 無条件で get 可能", async () => {
    await assertSucceeds(getDoc(doc(guestCollectionRef, "testDocId")));
  });
  it("list: 無条件で list 可能", async () => {
    await assertSucceeds(getDocs(guestCollectionRef));
  });
  it("create: 無条件で create 不可能", async () => {
    await assertFails(addDoc(guestCollectionRef, { field1: "newValue" }));
  });
  it("update: 無条件で update 不可能", async () => {
    await assertFails(
      updateDoc(doc(guestCollectionRef, "testDocId"), { field1: "newValue" })
    );
  });
  it("delete: 無条件で delete 不可能", async () => {
    await assertFails(deleteDoc(doc(guestCollectionRef, "testDocId")));
  });
});

describe("MThumbnail", () => {
  let guestCollectionRef: CollectionReference<DocumentData>;
  beforeAll(() => {
    const { guestClientDB } = getDB();
    guestCollectionRef = collection(guestClientDB, "MThumbnail");
  });
  beforeEach(async () => {
    await testEnv.withSecurityRulesDisabled(async (noRuleContext) => {
      const noRuleCollectionRef = collection(
        noRuleContext.firestore(),
        "MThumbnail"
      );
      await setDoc(doc(noRuleCollectionRef, "testDocId"), {
        field1: "value1",
      });
    });
  });
  it("get: 無条件で get 可能", async () => {
    await assertSucceeds(getDoc(doc(guestCollectionRef, "testDocId")));
  });
  it("list: 無条件で list 可能", async () => {
    await assertSucceeds(getDocs(guestCollectionRef));
  });
  it("create: 無条件で create 可能", async () => {
    await assertSucceeds(addDoc(guestCollectionRef, { field1: "newValue" }));
  });
  it("update: 無条件で update 不可能", async () => {
    await assertFails(
      updateDoc(doc(guestCollectionRef, "testDocId"), { field1: "newValue" })
    );
  });
  it("delete: 無条件で delete 不可能", async () => {
    await assertFails(deleteDoc(doc(guestCollectionRef, "testDocId")));
  });
});

describe("Decorations", () => {
  let guestCollectionRef: CollectionReference<DocumentData>;
  beforeAll(() => {
    const { guestClientDB } = getDB();
    guestCollectionRef = collection(
      collection(guestClientDB, "MThumbnail"),
      "testDocId",
      "Decorations"
    );
  });
  beforeEach(async () => {
    await testEnv.withSecurityRulesDisabled(async (noRuleContext) => {
      const noRuleCollectionRef = collection(
        noRuleContext.firestore(),
        "MThumbnail"
      );
      await setDoc(doc(noRuleCollectionRef, "testDocId"), {
        field1: "value1",
      });
      await setDoc(
        doc(noRuleCollectionRef, "testDocId", "Decorations", "testDocId"),
        {
          field1: "value1",
        }
      );
    });
  });
  it("get: 無条件で get 可能", async () => {
    await assertSucceeds(getDoc(doc(guestCollectionRef, "testDocId")));
  });
  it("list: 無条件で list 可能", async () => {
    await assertSucceeds(getDocs(guestCollectionRef));
  });
  it("create: 無条件で create 可能", async () => {
    await assertSucceeds(addDoc(guestCollectionRef, { field1: "newValue" }));
  });
  it("update: 無条件で update 不可能", async () => {
    await assertFails(
      updateDoc(doc(guestCollectionRef, "testDocId"), { field1: "newValue" })
    );
  });
  it("delete: 無条件で delete 不可能", async () => {
    await assertFails(deleteDoc(doc(guestCollectionRef, "testDocId")));
  });
});

describe("MMaskShape", () => {
  let guestCollectionRef: CollectionReference<DocumentData>;
  beforeAll(() => {
    const { guestClientDB } = getDB();
    guestCollectionRef = collection(guestClientDB, "MMaskShape");
  });
  beforeEach(async () => {
    await testEnv.withSecurityRulesDisabled(async (noRuleContext) => {
      const noRuleCollectionRef = collection(
        noRuleContext.firestore(),
        "MMaskShape"
      );
      await setDoc(doc(noRuleCollectionRef, "testDocId"), {
        field1: "value1",
      });
    });
  });
  it("get: 無条件で get 可能", async () => {
    await assertSucceeds(getDoc(doc(guestCollectionRef, "testDocId")));
  });
  it("list: 無条件で list 可能", async () => {
    await assertSucceeds(getDocs(guestCollectionRef));
  });
  it("create: 無条件で create 不可能", async () => {
    await assertFails(addDoc(guestCollectionRef, { field1: "newValue" }));
  });
  it("update: 無条件で update 不可能", async () => {
    await assertFails(
      updateDoc(doc(guestCollectionRef, "testDocId"), { field1: "newValue" })
    );
  });
  it("delete: 無条件で delete 不可能", async () => {
    await assertFails(deleteDoc(doc(guestCollectionRef, "testDocId")));
  });
});
