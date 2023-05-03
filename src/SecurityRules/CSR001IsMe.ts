import { SecurityRulesInterface } from "./SecrityRules.interface";

export default ({ designData, t_id, args }: SecurityRulesInterface) => {
  // args としてリクエストされたデータのカラム名が渡される
  const c_name = args;

  const column = designData.T_COLUMNS.find(
    (c) => c.t_id === t_id && c.c_name === c_name
  );
  if (!column) throw new Error("CSR001 column not found");
  return `request.auth.uid == incomingData().${column.c_name}`;
};
