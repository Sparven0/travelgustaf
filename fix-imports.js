import fs from "fs";
import path from "path";

const SRC_DIR = path.resolve("src");

function cleanImports(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  // Remove @version patterns in import statements
  const cleaned = content.replace(/"([^"]+)@[0-9]+\.[0-9]+\.[0-9]+"/g, '"$1"');

  if (cleaned !== content) {
    fs.writeFileSync(filePath, cleaned, "utf8");
    console.log("🧹 Fixed:", filePath);
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full);
    else if (/\.(t|j)sx?$/.test(entry)) cleanImports(full);
  }
}

walk(SRC_DIR);
console.log("\n✅ Finished cleaning imports!\n");
