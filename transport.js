// This is a small script that will hopefully find all bundles contained within the user/mods foilder and then copy them to a seperate location.
// This is an attempt at writing my own code and comments.

// Eeek!

// Use node js filesystem to access a specific path
const fs = require("fs");
const path = require("path");

// Set the path. This will have to become a variable at some stage. Will need a GUI for this I think.
const folderPath = 'H:\\EFT-SPT\\user\\mods\\acidphantasm-brightlasers';
// Backup path, not currently in use. This will also have to be a variable eventually.
const backupPath = "H:\\bundlesBK";

// Initialise counters
let fileCount = 0;
let folderCount = 0;

// Read the contents of the directory using fs.readdir
fs.readdir(folderPath, (err, items) => {
  if (err) {
    console.log("Error reading folder :", err);
    return;
  }

  const hasBundleFolder = items.includes('bundles');

  if (hasBundleFolder){
    console.log('Bundles folder found');
  } else {
    console.log('Bundles folder not found');
  }

//   // Itterate through each item in the directory
//   items.forEach((item) => {
//     // Construct the full path
//     const fullPath = path.join(folderPath, item);

//     // Use fs.statSync to get info about the item
//     const stats = fs.statSync(fullPath);

//     // Check if the item is a file
//     if (stats.isFile()) {
//       fileCount++;
//     }

//     // Check if the item is a folder
//     if (stats.isDirectory()) {
//       folderCount++;
//     }
//   });

  // Display the current path
  console.log("The current directory selected is : " + folderPath + ".");

  // Display the number of files & folders present in the current directory
  console.log(
    "Number of files in the current directory is : " +
      fileCount +
      " and the number of folders is :" +
      folderCount +
      "."
  );

  // List the names of the files and folders within the current directory
  items.forEach((item) => {
    console.log(item);
  });
});
