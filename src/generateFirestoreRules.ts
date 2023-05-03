import { SecurityRules } from "./SecurityRules";
import { fetchAllDesignData, generateFile, getFirebaseConfig } from "./utils";

const generateFirestoreRules = async () => {
  const allDesignData = await fetchAllDesignData();

  const disallowUpdatesOnRestrictedFields = ({ t_id }: { t_id: string }) => {
    const columns = allDesignData.T_COLUMNS.filter((c) => c.t_id === t_id);
    return `!dataDiff().affectedKeys().hasAny([${columns
      .filter((c) => c.c_updatable === false)
      .map((c) => `'${c.c_name}'`)
      .join(", ")}].toSet())`;
  };

  const recusiveMatchTemplate = ({
    parent_tid,
    parentPath,
  }: {
    parent_tid: string;
    parentPath: string;
  }): string => {
    const tables = allDesignData.TABLES.filter(
      (t) => t.parent_tid === parent_tid
    );
    if (tables.length === 0) return "";

    const standardMethods = ["get", "list", "create", "update", "delete"];
    return tables
      .map((table) => {
        const variable = `${table.t_name}ID`;
        const path = `${parentPath}/${table.t_name}/$(${variable})`;
        const securityRules = allDesignData.SECURITY_RULES.filter(
          (sr) => sr.t_id === table.t_id
        );
        const allows = standardMethods.reduce((prev, method) => {
          return {
            ...prev,
            [method]: [
              // @ts-ignore allow_get などのプロパティが存在する
              table["allow_" + method],
              ...securityRules
                .filter((sr) => sr.crud_type === method)
                .map((sr) =>
                  SecurityRules[sr.func_id]({
                    designData: allDesignData,
                    ...sr,
                  })
                ),
              ...[
                method === "update"
                  ? disallowUpdatesOnRestrictedFields({ t_id: table.t_id })
                  : undefined,
              ].filter((v) => v !== undefined),
            ].join(" && "),
          };
        }, {} as { [method: string]: string });
        return `
    match /${table.t_name}/{${variable}} {
      
      function get${table.t_name}Data() {
        return get(${path}).data
      }
      
      ${Object.entries(allows)
        .map(([method, allow]) => {
          return `allow ${method}: if ${allow};`;
        })
        .join("\n")}${recusiveMatchTemplate({
          parent_tid: table.t_id,
          parentPath: path,
        })}
    }`;
      })
      .join("\n");
  };

  const template = () => {
    return `rules_version = '2';
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

    ${recusiveMatchTemplate({
      parent_tid: "",
      parentPath: "/databases/$(database)/documents",
    })}
  }
}`;
  };

  return template();
};

const main = async () => {
  generateFile(
    await generateFirestoreRules(),
    getFirebaseConfig().firestore.rules
  );
};

main();
