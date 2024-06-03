//-------------DEPENDENCIES

const fs = require("fs");
const { rmSync, rmdirSync } = require("fs");
const path = require("path");
const archiver = require("archiver");
const cliProgress = require("cli-progress");
const cliBox = require("cli-box");

//-------------DIRECTORY STRUCTURE

const sptRoot = "./user/mods";
const outputFile = "./modBundles.zip";

//-------------PROJECT INFORMATION

const title = "BUNDLE ARCHIVER";
const version = "1.0.0";
const gitLink = "https://www.github.com/spicymanp/bundle-archiver";
const description = "Find & create an archive of SPT mod bundles";

//-------------A SIMPLE FUNCTION TO DELAY FOR EFFECT

function wait(ms) {
    var start = Date.now(),
        now = start;
    while (now - start < ms) {
        now = Date.now();
    }
}

//-------------CLI BOX WITH INFO

const myBox = new cliBox(
    {
        w: 70,
        h: 7,
        stringify: false,
        marks: {
            nw: "\x1b[32m╭",
            n: "\x1b[32m─",
            ne: "\x1b[32m╮",
            e: "\x1b[32m│",
            se: "\x1b[32m╯",
            s: "\x1b[32m─",
            sw: "\x1b[32m╰",
            w: "\x1b[32m│",
        },
        hAlign: "left",
    },

    `\t\x1b[33m${title}
    \t${description}

    \t▸ Version      \x1b[32m:\x1b[33m   ${version}
    \t▸ Github Link  \x1b[32m:\x1b[33m   ${gitLink}`
);
console.log(myBox.stringify());
wait(1000); //  A SHORT PAUSE FOR EFFECT
console.log("\x1b[0m"); // RESET CONSOLE COLOUR OUTPUT

//-------------FILESIZE CONVERSION

function formatBytes(a, b = 2) {
    if (!+a) return "0 Bytes";
    const c = 0 > b ? 0 : b,
        d = Math.floor(Math.log(a) / Math.log(1024));
    return `${parseFloat((a / Math.pow(1024, d)).toFixed(c))} ${["Bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"][d]}`;
}

//-------------SIMPLIFY MOD LIST OUTPUT STRING

function removeText(textToRemove) {
    let newText = textToRemove.replace("user\\mods\\", "");
    let finalText = newText.replace("\\bundles", "");
    return finalText;
}

//-------------GET TOTAL NUMBER OF FILES IN MODS WITH BUNDLES

function getAllFilesInSubdirectories(dir, files = []) {
    const fileList = fs.readdirSync(dir);

    for (const file of fileList) {
        const name = `${dir}/${file}`;
        if (fs.statSync(name).isDirectory()) {
            getAllFilesInSubdirectories(name, files);
        } else {
            files.push(name);
        }
    }
    return files;
}

//-------------CHECK IF IN SPT ROOT OR IF THERE ARE ANY MODS INSTALLED

const sptFolderExists = fs.existsSync(sptRoot);

if (sptFolderExists) {
    console.log("\nSPT root directory confirmed & mods folder found.");

    //-------------LOOK FOR MODS WITH BUNDLES

    const mods = fs.readdirSync(sptRoot);
    const modsWithBundles = [];
    let totalNumberofFiles = 25; // DOING THIS TO ENSURE PROGRESS BAR DOESN'T SIT ON 100% FOR TOO LONG (WHILE I FIGURE OUT THE CALCULATION ISSUES)

    mods.forEach((mod) => {
        const fullPath = path.join(sptRoot, mod);
        const fullPathWithBundles = path.join(fullPath, "bundles");
        const modHasBundles = fs.existsSync(fullPathWithBundles);

        if (modHasBundles) {
            modsWithBundles.push(fullPathWithBundles);

            let fileCount = getAllFilesInSubdirectories(fullPathWithBundles);
            totalNumberofFiles += fileCount.length;
        }
    });
    console.log("\nNumber of mods currently installed : " + mods.length);

    //-------------IF THERE ARE MODS WITH BUNDLES

    const bundlesExist = modsWithBundles.length > 0;
    if (bundlesExist) {
        console.log("Number of mods with bundles : " + modsWithBundles.length + "\n");

        console.log("Listing mods with bundles:");
        wait(1000); //  A SHORT PAUSE FOR EFFECT

        //-------------ZIP BUNDLES

        const output = fs.createWriteStream(outputFile);
        const archive = archiver("zip", {
            zlib: { level: 1 },
        });

        output.on("close", function () {
            console.log(" ");

            //-------------GET THE FILESIZE OF THE ARCHIVE

            fs.stat(outputFile, (err, stats) => {
                if (err) {
                    console.log(`File doesn't exist.`);
                } else {
                    const size = stats.size;
                    process.stdout.write("\r\n'modBundles.zip' created. \nSize of archive : " + formatBytes(size));
                    process.stdout.write("\x1B[?25h"); // SHOW THE CURSOR
                    console.log("\nYou can find the zip file in the SPT root directory.");
                    console.log("\nPress any key to exit...");
                }
            });
        });

        //-------------SHOW SOME WORK IS BEING DONE

        const progressBar = new cliProgress.SingleBar({
            format: "|{bar}| {percentage}%",
            barCompleteChar: "\u2588",
            barIncompleteChar: "\u2591",
            hideCursor: true,
        });

        archive.on("progress", (progress) => {
            const percentage = (progress.entries.processed / totalNumberofFiles) * 100;
            // process.stdout.write("\x1B[?25l"); // HIDE CURSOR
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            process.stdout.write(percentage.toFixed(2) + "%");
            progressBar.start(totalNumberofFiles, progress.entries.processed);
            progressBar.update(progress.entries.processed);
        });

        //-------------CREATE THE ZIP FILE

        modsWithBundles.forEach((mod) => {
            console.log("- " + removeText(mod));
            wait(125); //  A SHORT PAUSE FOR EFFECT
            archive.directory(mod, "user/cache/bundles");
        });

        wait(400); //  A SHORT PAUSE FOR EFFECT

        console.log("\nCreating Archive (this may take some time).");
        archive.append("Extract zip contents into SPT root directory.", { name: "Instructions.txt" });
        archive.finalize();
        output.on("end", function () {
            console.log("Data has been drained");
        });

        archive.pipe(output);

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
    } else {
        console.log("None of your mods have bundles, you don't need this script!\n");
        console.log("\nPress any key to exit...");
    }
} else {
    console.log(
        "\nYour 'mods' folder was not found. \nPlease ensure Bundle Archiver is in the SPT root directory or check that you have mods installed.\n"
    );
    console.log("\nPress any key to exit...");
}

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on("data", function () {
    process.exit(0);
});
