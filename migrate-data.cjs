const fs = require("fs");
const path = require("path");

const srcDir = path.join(__dirname, "public", "wedding-data", "data");
const destDir = path.join(__dirname, "src", "data");

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const filesToConvert = ["venues", "services", "decor", "outfits", "themes"];

filesToConvert.forEach((file) => {
  const jsonPath = path.join(srcDir, `${file}.json`);
  const tsPath = path.join(destDir, `${file}.ts`);

  let data = "[]";
  if (fs.existsSync(jsonPath)) {
    data = fs.readFileSync(jsonPath, "utf8");
  } else if (file === "themes") {
    // Generate some default themes since the JSON doesn't exist
    data = JSON.stringify(
      [
        {
          id: "t1",
          name: "Royal",
          description: "Grand palatial decor with gold and red accents",
          type: "traditional",
        },
        {
          id: "t2",
          name: "Minimalist",
          description: "Clean lines, pastels, and elegant simplicity",
          type: "modern",
        },
        {
          id: "t3",
          name: "Boho",
          description: "Earthy tones, pampas grass, and relaxed seating",
          type: "modern",
        },
        {
          id: "t4",
          name: "Floral",
          description: "Abundant flower arrangements and pastel drapes",
          type: "traditional",
        },
      ],
      null,
      2,
    );
  }

  const tsContent = `export const ${file} = ${data};\n`;
  fs.writeFileSync(tsPath, tsContent);
  console.log(`Converted ${file} to ${file}.ts`);
});
