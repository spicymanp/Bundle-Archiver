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
  console.log("\nMods folder found, SPT root directory confirmed.");
} else {
  console.log(
    "\nYour 'mods' folder was not found. \nPlease ensure Bundle Archiver is in the SPT root directory or check that you have mods installed.\n"
  );
  process.exit(1);
}

// ---------------------------------------------------------
//               CHECK IF 'modBundlesToSend.zip' EXISTS
// ---------------------------------------------------------

const zipExists = fs.existsSync(outputFile);
if (zipExists) {
  console.log(
    "\nThe file 'modBundlesToSend.zip' already exists, please delete it and try again.\n"
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
console.log("\nNumber of Mods Currently Installed : " + mods.length);
if (modsWithBundles.length === 0) {
  console.log("None of your mods have bundles, happy gaming!\n");
  process.exit(1);
}
console.log("Number of mods with bundles : " + modsWithBundles.length + "\n");
console.log("Listing mods with bundles :");
// ---------------------------------------------------------
//              ZIP BUNDLES
// ---------------------------------------------------------

const output = fs.createWriteStream(outputFile);
const archive = archiver("zip", {
  zlib: { level: 1 },
});

output.on("close", function () {
  clearInterval(spinner);
  console.log(" ");
  process.stdout.write(
    "\rZip file 'modBundlesToSend.zip' created. Size of archive : " +
      archive.pointer().toExponential(2) / 1000000 +
      " megabytes"
  );

  process.stdout.write("\x1B[?25h"); //Show the cursror

  console.log(
    "\nJob done! You can find your file in the SPT root directory. \nHit return to exit."
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
  process.stdout.write(`\r${".".repeat(i++ % 4)}   `);
}, 300);

modsWithBundles.forEach((mod) => {
  console.log("- " + mod);
  archive.directory(mod, "user/cache/bundles");
});
archive.finalize();

process.stdin.resume();
process.stdin.on("data", function () {
  process.exit(0);
});
