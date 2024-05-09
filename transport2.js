import fs from "fs";
import path from "path";

const sptRoot = "H:\\EFT-SPT\\user\\mods";
const modsWithBundles = [];

const mods = fs.readdirSync(sptRoot);
console.log("\nCurrently Installed Mods:\n ");
mods.forEach((mod) => {
  console.log("- " + mod);
});

// fs.readdir(sptRoot, (err, items) => {
//   for (let i = 0; i < items.length; i++) {
//     const item = items[i];
//     const fullPath = path.join(sptRoot, item);

//     const fullPathWithBundles = path.join(fullPath, "bundles");
//     const hasBundles = fs.existsSync(fullPathWithBundles);
//     console.log(fullPath + "  -----  " + hasBundles);
//     if (hasBundles) {
//       modsWithBundles.push(fullPathWithBundles);
//     }
//   }
// });

console.log("\nTotal Number of Mods Currently Installed : " + mods.length);
console.log("\n");
