import { SecurityRulesInterface } from "./SecrityRules.interface";

export default ({ designData, t_id, args }: SecurityRulesInterface) => {
  // args として isImmutable となっているかの判定をするテーブルのIDが渡される
  const targetTableId = args;

  const table = designData.TABLES.find((t) => t.t_id === t_id);
  if (!table) throw new Error("CSR003 table not found");
  const recursiveTableFind = (
    current_table: typeof table
  ): typeof table | undefined => {
    if (current_table.t_id === targetTableId) return current_table;
    const parentTable = designData.TABLES.find(
      (t) => t.t_id === current_table.parent_tid
    );
    if (!parentTable) return undefined;
    return recursiveTableFind(parentTable);
  };
  const targetTable = recursiveTableFind(table);
  if (!targetTable) throw new Error("CSR003 target table not found");

  const columnName = "isImmutable";

  const column = designData.T_COLUMNS.find(
    (c) =>
      c.t_id === targetTable.t_id &&
      c.c_name === columnName &&
      c.c_datatype === "boolean"
  );
  if (!column) throw new Error("CSR003 column not found");
  return `!get${targetTable.t_name}Data().get('${columnName}', false)`;
};
