import { fetchAllDesignData, generateFile } from "./utils";

const stringifyObjectKeysToString = (obj: { [key: string]: string }) => {
  return (
    "{" +
    Object.keys(obj)
      .map((key) => {
        if (!key) return "";
        return `${key}: string;`;
      })
      .join("\n") +
    "}"
  );
};

const generateDesignDataInterface = async () => {
  const allDesignData = (await fetchAllDesignData()) as {
    [key: string]: { [key: string]: string }[];
  };
  const result =
    "export interface DesignDataInterface {" +
    Object.keys(allDesignData)
      .map((key) => {
        return `${key}: ${stringifyObjectKeysToString(allDesignData[key][0])}`;
      })
      .join("\n") +
    "}[]";
  return result;
};

const main = async () => {
  generateFile(
    await generateDesignDataInterface(),
    "./src/DesignData.interface.ts"
  );
};

main();
