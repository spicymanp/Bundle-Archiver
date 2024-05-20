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
console.log(""); //blank line
console.log("Total Number of Mods Currently Installed : " + mods.length);
console.log("Total Number of Mods with Bundles : " + modsWithBundles.length);

// ---------------------------------------------------------
//               GET FILESIZE OF A FOLDER
// ---------------------------------------------------------

const getDirSize = (dirPath) => {
  let size = 0;
  const files = fs.readdirSync(dirPath);

  for (let i = 0; i < files.length; i++) {
    const filePath = path.join(dirPath, files[i]);
    const stats = fs.statSync(filePath);

    if (stats.isFile()) {
      size += stats.size;
    } else if (stats.isDirectory()) {
      size += getDirSize(filePath);
    }
  }

  return size;
};

// ---------------------------------------------------------
//              FUNCTION TO DELETE FOLDERS
// ---------------------------------------------------------

// const cleaningServices = (path) => {
//   const pathToDelete = fs.rmdirSync(path);

//   try {
//     cleaningServices(pathToDelete);
//
//   } catch (err) {
//
//     console.log(err);
//   }
//   if (err) {
//     throw err;
//   }
// };

//-------------------------------------------------------
//             COPY MODS WITH BUNDLES TO TEMP FOLDER
//-------------------------------------------------------
console.log(""); //blank line
console.log(
  "Copying the following mod bundles to temp path : " + tempBundlesRootPath
);
// check if temp folder exists, if not create it

// if (!fs.existsSync(tempBundlesPath)) {
//   fs.mkdirSync(tempBundlesPath, { recursive: true });
// }

modsWithBundles.forEach((mod) => {
  console.log(mod);
  fs.cpSync(mod, tempBundlesPath, { recursive: true });
});
// Report the size of the temp bundles folder
console.log(""); //blank line
const totalDirSize = getDirSize(tempBundlesPath).toExponential(2) / 1000000;
console.log("Size of bundles : " + totalDirSize + " megabytes");

// ---------------------------------------------------------
//              ZIP TEMP MODS FOLDER
// ---------------------------------------------------------

const output = fs.createWriteStream(outputFile);
const archive = archiver("zip", {
  zlib: { level: 9 }, // Sets the compression level. 1 quickest/largest - 9 slowest/smallest
});

console.log(""); //blank line
// listen for all archive data to be written
// 'close' event is fired only when a file descriptor is involved

output.on("close", function () {
  console.log(
    "Your bundles archive" +
      outputFile +
      "is ready to upload and can be found in the your SPT root directory."
  );
  console.log(
    "Size of archive : " +
      archive.pointer().toExponential(2) / 1000000 +
      " megabytes"
  );

  //              DELETE TEMP FOLDER AFTER ZIPPING

  console.log(""); //blank line

  try {
    rmSync(tempBundlesRootPath, { recursive: true, force: true });
  } catch (err) {
    console.log(err);
  }
});

// This event is fired when the data source is drained no matter what was the data source.
// @see: https://nodejs.org/api/stream.html#stream_event_end
output.on("end", function () {
  console.log("Data has been drained");
});

// good practice to catch warnings (ie stat failures and other non-blocking errors)
archive.on("warning", function (err) {
  if (err.code === "ENOENT") {
    // log warning
  } else {
    // throw error
    throw err;
  }
});

// good practice to catch this error explicitly
archive.on("error", function (err) {
  throw err;
});

// pipe archive data to the file
archive.pipe(output);

// append files from a sub-directory, putting its contents at the root of archive
archive.directory(tempBundlesPath, "user/cache/bundles");

// finalize the archive (ie we are done appending files but streams have to finish yet)
// 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
archive.finalize();

process.stdin.resume();
process.stdin.on("data", function () {
  process.exit(0);
});
