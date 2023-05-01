import fetch from "node-fetch";
import * as fs from "fs";
import dotenv from "dotenv";
dotenv.config();

export const fetchAllDesignData = async () => {
  const response = await fetch(process.env.PG_DATA_ENDPOINT as string);
  return (await response.json()) as any;
};

export const generateFile = (content: string, outputFilePath: string): void => {
  fs.writeFileSync(outputFilePath, content, { encoding: "utf-8" });
};
