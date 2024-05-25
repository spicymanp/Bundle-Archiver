const fs = require("fs");
const { rmSync, rmdirSync } = require("fs");
const path = require("path");
const archiver = require("archiver");

//-------------DIRECTORY STRUCTURE-------------

const sptRoot = "./user/mods";
const outputFile = "./modBundles.zip";

//-------------FILESIZE CONVERSION-------------

function formatBytes(a, b = 2) {
  if (!+a) return "0 Bytes";
  const c = 0 > b ? 0 : b,
    d = Math.floor(Math.log(a) / Math.log(1024));
  return `${parseFloat((a / Math.pow(1024, d)).toFixed(c))} ${
    ["Bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"][d]
  }`;
}

//-------------CHECK IF IN SPT ROOT OR IF MODS EXIST-------------

const sptFolderExists = fs.existsSync(sptRoot);

if (sptFolderExists) {
  console.log("\nSPT root directory confirmed & mods folder found.");

  //-------------GATHERING THE MODS WITH BUNDLES-------------

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

  const bundlesExist = modsWithBundles.length > 0;

  if (bundlesExist) {
    console.log(
      "Number of mods with bundles : " + modsWithBundles.length + "\n"
    );
    console.log("Listing mods with bundles :");

    //-------------ZIP BUNDLES-------------

    const output = fs.createWriteStream(outputFile);
    const archive = archiver("zip", {
      zlib: { level: 3 },
    });

    output.on("close", function () {
      clearInterval(spinner);
      console.log(" ");

      // GET THE FILESIZE OF THE ARCHIVE
      fs.stat(outputFile, (err, stats) => {
        if (err) {
          console.log(`File doesn't exist.`);
        } else {
          const size = stats.size;
          process.stdout.write(
            "\r\n'modBundles.zip' created. \nSize of archive : " +
              formatBytes(size)
          );
          // SHOW THE CURSOR
          process.stdout.write("\x1B[?25h");

          console.log("\nYou can find the zip file the SPT root directory.");
          console.log("\nPress any key to exit...");
        }
      });
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

    // SHOW SOME WORK IS BEING DONE
    let i = 0;
    // HIDE CURSOR
    process.stdout.write("\x1B[?25l");
    const spinner = setInterval(() => {
      process.stdout.write(`\r${".".repeat(i++ % 10)}         `);
    }, 300);

    // CREATE THE ZIP FILE
    modsWithBundles.forEach((mod) => {
      console.log("- " + mod);
      archive.directory(mod, "user/cache/bundles");
    });
    console.log("\nCreating Archive (this may take some time).");
    archive.finalize();
  } else {
    console.log(
      "None of your mods have bundles, you don't need this script!\n"
    );
    console.log("\nPress any key to exit...");
  }
} else {
  console.log(
    "\nYour 'mods' folder was not found. \nPlease ensure Bundle Archiver is in the SPT root directory or check that you have mods installed.\n"
  );
  console.log("\nPress any key to exit...");
}

process.stdin.resume();
process.stdin.on("data", function () {
  process.exit(0);
});
