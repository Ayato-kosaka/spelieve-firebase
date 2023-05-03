import { DesignDataInterface } from "../DesignData.interface";

export type SecurityRulesInterface =
  DesignDataInterface["SECURITY_RULES"][0] & {
    designData: DesignDataInterface;
  };
