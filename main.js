const fs = require("fs");
const { rmSync, rmdirSync } = require("fs");
const path = require("path");
const archiver = require("archiver");

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
//              ZIP BUNDLES
// ---------------------------------------------------------

const output = fs.createWriteStream(outputFile);
const archive = archiver("zip", {
  zlib: { level: 9 },
});
output.on("close", function () {
  clearInterval(spinner);
  process.stdout.write(
    "\rZip file 'modBundlesToSend.zip' created. Size of archive : " +
      archive.pointer().toExponential(2) / 1000000 +
      " megabytes"
  );
  process.stdout.write("\x1B[?25h"); //Show the cursror
  console.log(
    "\nJob done! You can find your file in the SPT root directory. Hit return to exit."
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
let i = 0; //for the spinner
process.stdout.write("\x1B[?25l"); //Hide the cursor
//Show some work is being done
const spinner = setInterval(() => {
  process.stdout.write(`\rWorking${".".repeat(i++ % 4)}   `);
}, 500);

modsWithBundles.forEach((mod) => {
  console.log(mod);
  archive.directory(mod, "user/cache/bundles");
});
archive.finalize();

process.stdin.resume();
process.stdin.on("data", function () {
  process.exit(0);
});
