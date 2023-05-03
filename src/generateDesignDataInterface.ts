import { fetchAllDesignData, generateFile } from "./utils";

function generateDesignDataInterface(json: {
  [key: string]: {
    [key: string]: any;
  }[];
}): string {
  let interfaceCode = "export interface DesignDataInterface {\n";

  // Loop through the top-level keys in the JSON object
  for (const key in json) {
    const values = json[key];

    // Assume the first element in the array has a complete set of keys
    const keys = Object.keys(values[0]);

    // Generate the interface property definition
    const propertyDefinition = keys
      .filter((k) => k !== "")
      .map((k) => `  ${k}: ${getType(values[0][k])};`)
      .join("\n");

    // Generate the full interface definition
    interfaceCode += `  ${key}: {\n${propertyDefinition}\n  }[];\n`;
  }

  interfaceCode += "}\n";

  return interfaceCode;
}

function getType(value: any): string {
  const type = typeof value;

  switch (type) {
    case "string":
    case "number":
    case "boolean":
      return type;
    case "object":
      if (Array.isArray(value)) {
        // Assume the array contains only objects with the same structure
        return `${getType(value[0])}[]`;
      } else {
        // Generate a new interface for the nested object
        return generateDesignDataInterface(value);
      }
    default:
      return "any";
  }
}

const main = async () => {
  const allDesignData = (await fetchAllDesignData()) as unknown;
  generateFile(
    generateDesignDataInterface(allDesignData as any),
    "./src/DesignData.interface.ts"
  );
};

main();
