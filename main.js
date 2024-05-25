const fs = require("fs");
const { rmSync, rmdirSync } = require("fs");
const path = require("path");
const archiver = require("archiver");

// ---------------------------------------------------------
//               DIRECTORY STRUCTURE
// ---------------------------------------------------------

const sptRoot = "./user/mods";
const outputFile = "./modBundlesToSend.zip";

// ---------------------------------------------------------
//               FUNCTION TO KEEP TERMINAL WINDOW OPEN
// ---------------------------------------------------------

// ---------------------------------------------------------
//               CHECK IF IN SPT ROOT OR IF MODS EXIST
// ---------------------------------------------------------

if (fs.existsSync(sptRoot)) {
  console.log("\nMods folder found, SPT root directory confirmed.");
} else {
  console.log(
    "\nYour 'mods' folder was not found. \nPlease ensure Bundle Archiver is in the SPT root directory or check that you have mods installed.\n"
  );
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
  process.exit(0);
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

  console.log("\nYou can find the zip file your SPT root directory.");
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

//Show some work is being done
let i = 0;
process.stdout.write("\x1B[?25l"); //Hide the cursor
const spinner = setInterval(() => {
  process.stdout.write(`\r${".".repeat(i++ % 4)}   `);
}, 300);

//Create the zip file
modsWithBundles.forEach((mod) => {
  console.log("- " + mod);
  archive.directory(mod, "user/cache/bundles");
});

archive.finalize();
