import * as fs from "fs";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment
} from "@firebase/rules-unit-testing"
import { getDoc, doc } from "firebase/firestore";

let testEnv: RulesTestEnvironment

const getDB = () => {
  // ログイン情報つきのContextを作成し、そこから Firestore インスタンスを得る。
  // authenticatedContextは引数をUIDにもつ認証済みContextを返す。
  // const authenticatedContext = testEnv.authenticatedContext(uid)
  // const clientDB = authenticatedContext.firestore()

  // ゲストContextを作成し、そこから Firestore インスタンスを得る。
  // unauthenticatedContextは未認証Contextを返す。
  const unauthenticatedContext = testEnv.unauthenticatedContext()
  const guestClientDB = unauthenticatedContext.firestore()
  return { guestClientDB }
}


// await assertSucceeds(setDoc(doc(unauthedDb, '/users/alice'), {test: "test"}));

// グローバルで定義されたbeforeAllはテストの開始前に一回実行されます。
beforeAll(async () => {
  // テストプロジェクト環境の作成
  console.log("beforeAll")
  testEnv = await initializeTestEnvironment({
    projectId: "my-test-project",
    firestore: {
      rules: fs.readFileSync("firestore/firestore.rules", "utf8"),
      port: 8080,
      host: "localhost"
    },
  });
})

// グローバルで定義されたbeforeEachは各テストの開始前に一回実行されます。
beforeEach(async () => {
  // Firestore エミュレータ用に構成された Firebase プロジェクトの Firestore のデータをクリアします。
  await testEnv.clearFirestore()
})

// グローバルで定義されたafterAllはテストの終了後に一回実行されます。
afterAll(async () => {
  //テスト終了後テスト環境で作成されたすべての RulesTestContexts を破棄します。
  await testEnv.cleanup()
})

describe('Itineraries security rules', () => {
  it('get: Itineraries は無条件で get 可能', async () => {
    const { guestClientDB } = getDB();
    await assertSucceeds(
      getDoc(doc(guestClientDB, "Itineraries"))
    )
  })
});

describe('PlanGroups security rules', () => {
  // Your tests for PlanGroups security rules
});

describe('Plans security rules', () => {
  // Your tests for Plans security rules
});

describe('MPlace security rules', () => {
  // Your tests for MPlace security rules
});

describe('MThumbnail security rules', () => {
  // Your tests for MThumbnail security rules
});

describe('Decorations security rules', () => {
  // Your tests for Decorations security rules
});

describe('MMaskShape security rules', () => {
  // Your tests for MMaskShape security rules
});