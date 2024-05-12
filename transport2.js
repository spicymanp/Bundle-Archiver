import fs from "fs";
import path from "path";
import archiver from "archiver";
import ora from "ora";

const sptRoot = "H:\\EFT-SPT\\user\\mods";
const tempBundlesPath = "H:\\sptBundlesTemp\\user\\cache";
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
console.log("\nTotal Number of Mods Currently Installed : " + mods.length);
console.log(
  "\nTotal Number of Mods with Bundles : " + modsWithBundles.length + "\n"
);

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

//-------------------------------------------------------
//             COPY MODS WITH BUNDLES TO TEMP FOLDER
//-------------------------------------------------------

modsWithBundles.forEach((mod) => {
  console.log(mod);
  fs.cpSync(mod, tempBundlesPath, { recursive: true });
});
// Report the size of the temp bundles folder
const totalDirSize = getDirSize(tempBundlesPath);
console.log(totalDirSize);

// ---------------------------------------------------------
//              ZIP TEMP MODS FOLDER
// ---------------------------------------------------------

const output = fs.createWriteStream(outputFile);
const archive = archiver("zip", {
  zlib: { level: 1 }, // Sets the compression level.
});

const spinner = ora("Creating archive...\n").start();

// listen for all archive data to be written
// 'close' event is fired only when a file descriptor is involved
output.on("close", function () {
  spinner.stop();
  spinner.succeed("Archiving complete.\n");

  console.log(
    "Total size of archive is " +
      archive.pointer().toExponential(2) / 1000000 +
      " megabytes"
  );
  console.log(
    "\nYour bundles archive is ready to upload and can be found in the your SPT root directory.\n"
  );
  //console.log("Archiver has been finalized and the output file descriptor has closed.");
});

// This event is fired when the data source is drained no matter what was the data source.
// It is not part of this library but rather from the NodeJS Stream API.
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
archive.directory(tempBundlesPath, false);

// finalize the archive (ie we are done appending files but streams have to finish yet)
// 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
archive.finalize();
