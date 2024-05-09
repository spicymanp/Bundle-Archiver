//import fse from "fs-extra";  // I need to figure this one out
import fs from "fs";
import path from "path";

const sptRoot = "H:\\EFT-SPT\\user\\mods";
const bundlesCopy = "H:\\sptBundlesBackup";
const modsWithBundles = [];
const mods = fs.readdirSync(sptRoot);
let numberOfBundles = 0;

function catchError(err) {
  if (err) console.log(err);
  else {
    console.log("File written successfully\n");
  }
}

console.log("\nCurrently Installed Mods with Bundles :\n ");

mods.forEach((mod) => {
  const fullPath = path.join(sptRoot, mod);
  const fullPathWithBundles = path.join(fullPath, "bundles");
  const modHasBundles = fs.existsSync(fullPathWithBundles);

  if (modHasBundles) {
    fs.cp(
      fullPathWithBundles,
      bundlesCopy,
      { force: true, recursive: true },
      catchError
    );
    numberOfBundles++;
  }
  console.log(fullPathWithBundles);
  console.log("\n");
  console.log("- " + mod + " - " + "'" + fullPath + "'");
});

console.log("\nTotal Number of Mods Currently Installed : " + mods.length);
console.log("\nTotal Number of Mods with Bundles : " + numberOfBundles);
console.log("\n");

// Leaving this here for reference
//
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
