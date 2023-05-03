import CSR001 from "./CSR001IsMe";
import CSR003 from "./CSR003IsUpdatable";
import { SecurityRulesInterface } from "./SecrityRules.interface";

export const SecurityRules: {
  [func_id: string]: (props: SecurityRulesInterface) => string;
} = {
  CSR001,
  CSR003,
};
