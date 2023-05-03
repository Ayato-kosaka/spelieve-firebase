import fetch from "node-fetch";
import * as fs from "fs";
import dotenv from "dotenv";
import { DesignDataInterface } from "./DesignData.interface";
dotenv.config();

export const fetchAllDesignData = async () => {
  const response = await fetch(process.env.PG_DATA_ENDPOINT as string);
  return (await response.json()) as DesignDataInterface;
};

export const generateFile = (content: string, outputFilePath: string): void => {
  fs.writeFileSync(outputFilePath, content, { encoding: "utf-8" });
};
