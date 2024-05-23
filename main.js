const fs = require("fs");
const { rmSync, rmdirSync } = require("fs");
const path = require("path");
const archiver = require("archiver");
const prompts = require("prompts");

// ---------------------------------------------------------
//               DIRECTORY STRUCTURE
// ---------------------------------------------------------

const sptRoot = "./user/mods";
const tempBundlesPath = "./sptBundlesTemp/user/cache";
const tempBundlesRootPath = "./sptBundlesTemp";
const outputFile = "./modBundlesToSend.zip";

// ---------------------------------------------------------
//               CHECK IF IN SPT ROOT OR IF MODS EXIST
// ---------------------------------------------------------

const inRoot = fs.existsSync(sptRoot);

if (inRoot) {
  console.log("\nSPT mods founds, SPT root directory confirmed.");
} else {
  console.log(
    "\nPlease place bundler in the SPT root directory or check that you have mods installed.\n"
  );
  process.exit(1);
}

// ---------------------------------------------------------
//               GATHERING THE MODS WITH BUNDLES
// ---------------------------------------------------------

const mods = fs.readdirSync(sptRoot);
const modsWithBundles = [];

mods.forEach((mod) => {
  const fullPath = path.join(sptRoot, mod);
  const fullPathWithBundles = path.join(fullPath, "bundles");
  const modHasBundles = fs.existsSync(fullPathWithBundles);

  if (modHasBundles) {
    modsWithBundles.push(fullPathWithBundles);
  }
});
console.log("\nTotal Number of Mods Currently Installed : " + mods.length);
if (modsWithBundles.length === 0) {
  console.log("None of your mods have bundles, happy gaming!\n");
  process.exit(1);
}
console.log(
  "Total Number of Mods with Bundles : " + modsWithBundles.length + "\n"
);

// ---------------------------------------------------------
//               GET FILESIZE OF A FOLDER
// ---------------------------------------------------------

// const getDirSize = (dirPath) => {
//   let size = 0;
//   const files = fs.readdirSync(dirPath);

//   for (let i = 0; i < files.length; i++) {
//     const filePath = path.join(dirPath, files[i]);
//     const stats = fs.statSync(filePath);

//     if (stats.isFile()) {
//       size += stats.size;
//     } else if (stats.isDirectory()) {
//       size += getDirSize(filePath);
//     }
//   }

//   return size;
// };

// Report the size of the temp bundles folder
// console.log(""); //blank line
// const totalDirSize = getDirSize(tempBundlesPath).toExponential(2) / 1000000;
// console.log("Size of bundles : " + totalDirSize + " megabytes");

// ---------------------------------------------------------
//              ZIP BUNDLES
// ---------------------------------------------------------

const output = fs.createWriteStream(outputFile);
const archive = archiver("zip", {
  zlib: { level: 9 },
});
output.on("close", function () {
  console.log(
    "\nZip file 'modBundlesToSend.zip' created. Size of archive : " +
      archive.pointer().toExponential(2) / 1000000 +
      " megabytes"
  );
  console.log(
    "\nJob done! You can find your file in the SPT root directory. Press any key to exit."
  );
});

output.on("end", function () {
  console.log("Data has been drained");
});

archive.on("warning", (err) => {
  if (err.code === "ENOENT") {
    // log warning
  } else {
    // throw error
    throw err;
  }
});

archive.on("error", function (err) {
  throw err;
});

archive.pipe(output);

//Create the zip
modsWithBundles.forEach((mod) => {
  console.log(mod);
  archive.directory(mod, "user/cache/bundles");
});
archive.finalize();

process.stdin.resume();
process.stdin.on("data", function () {
  process.exit(0);
});
