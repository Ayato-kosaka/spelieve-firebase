import { SecurityRules } from "./SecurityRules";
import { fetchAllDesignData, generateFile, getFirebaseConfig } from "./utils";

// Firestoreのセキュリティルールを生成する非同期関数
const generateFirestoreRules = async () => {
  // すべてのデザインデータを取得します
  const allDesignData = await fetchAllDesignData();

  const recusiveTableRule = ({
    parent_tid,
    parentPath,
  }: {
    parent_tid: string;
    parentPath: string;
  }): string => {
    const current_tables = allDesignData.TABLES.filter(
      (t) => t.parent_tid === parent_tid
    );
    if (current_tables.length === 0) return "";

    return current_tables
      .map((table) => {
        const tableVariable = `${table.t_name}ID`;
        const path = `${parentPath}/${table.t_name}/$(${tableVariable})`;
        // crudConditionObj は get, list, create, update, delete に対してそれぞれの allow_XXX のセキュリティルールを定義する
        // table に allow_get などのプロパティが存在するので、それを条件に加える
        // また、SECURITY_RULES に定義が存在する場合はそれを条件に加える
        const crudConditionObj = {
          get: [
            table["allow_get"],
            ...allDesignData.SECURITY_RULES.filter(
              (sr) => sr.t_id === table.t_id && sr.crud_type === "get"
            ).map((sr) =>
              SecurityRules[sr.func_id]({
                designData: allDesignData,
                ...sr,
              })
            ),
          ].join(" && "),
          list: [
            table["allow_list"],
            ...allDesignData.SECURITY_RULES.filter(
              (sr) => sr.t_id === table.t_id && sr.crud_type === "list"
            ).map((sr) =>
              SecurityRules[sr.func_id]({
                designData: allDesignData,
                ...sr,
              })
            ),
          ].join(" && "),
          create: [
            table["allow_create"],
            ...allDesignData.SECURITY_RULES.filter(
              (sr) => sr.t_id === table.t_id && sr.crud_type === "create"
            ).map((sr) =>
              SecurityRules[sr.func_id]({
                designData: allDesignData,
                ...sr,
              })
            ),
          ].join(" && "),
          update: [
            table["allow_update"],
            ...allDesignData.SECURITY_RULES.filter(
              (sr) => sr.t_id === table.t_id && sr.crud_type === "update"
            ).map((sr) =>
              SecurityRules[sr.func_id]({
                designData: allDesignData,
                ...sr,
              })
            ),
            // 制限されたフィールドに対する更新を禁止する
            `!dataDiff().affectedKeys().hasAny([${allDesignData.T_COLUMNS.filter(
              (c) => c.t_id === table.t_id && c.c_updatable === false
            )
              .map((c) => `'${c.c_name}'`)
              .join(", ")}].toSet())`,
          ].join(" && "),
          delete: [
            table["allow_delete"],
            ...allDesignData.SECURITY_RULES.filter(
              (sr) => sr.t_id === table.t_id && sr.crud_type === "delete"
            ).map((sr) =>
              SecurityRules[sr.func_id]({
                designData: allDesignData,
                ...sr,
              })
            ),
          ].join(" && "),
        };
        return [
          `match /${table.t_name}/{${tableVariable}} {`,
          ` function get${table.t_name}Data() {`,
          `   return get(${path}).data`,
          ` }`,
          ` allow get: if ${crudConditionObj.get};`,
          ` allow list: if ${crudConditionObj.list};`,
          ` allow create: if ${crudConditionObj.create};`,
          ` allow update: if ${crudConditionObj.update};`,
          ` allow delete: if ${crudConditionObj.delete};`,
          // 子テーブルのセキュリティルールを再帰的に定義する
          recusiveTableRule({
            parent_tid: table.t_id,
            parentPath: path,
          }),
          `}`,
        ].join("\n");
      })
      .join("\n");
  };

  return `
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        function existingData() {
          return resource.data;
        }

        function incomingData() {
          return request.resource.data;
        }

        function dataDiff() {
          return incomingData().diff(existingData());
        }

        ${recusiveTableRule({
          parent_tid: "",
          parentPath: "/databases/$(database)/documents",
        })}
      }
    }`;
};

const main = async () => {
  generateFile(
    await generateFirestoreRules(),
    getFirebaseConfig().firestore.rules
  );
};

main();
