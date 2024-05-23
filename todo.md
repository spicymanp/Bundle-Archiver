High Priority - prior to release

- check if zip file exists before writing to it
- clean up code
- do tests

Low Priority - post release

- show file sizes maybe
- proper unit conversion
- progress bar for archiving process
- add some colour to the various text
- allow for the choice of which mods to then copy and zip
- log when the last copy was run
- option to only copy files newer than the last copy
- ask to input spt root folder path (as an option to not run from spt root)
- expand on user/mods directory check to check for spt root (currently assuming in root)
- look into how to integrate 'prompts' npmjs.com/package/prompts

Complete :

✔ change the async readdir to sync readdir : <https://www.geeksforgeeks.org/node-js-fs-readdirsync-method/>
✔ print only mods with bundles
✔ how to copy folder to different path
✔ get total size of mods with bundles
✔ how to zip up a whole folder
✔ add little loading dots
✔ message about not having mods with bundles
✔ eliminate need for temp folder, take contents of array and let archiver to its thing on that
✔ generate an exe of the project
✔ delete/empty temp folder after copy and zip is complete (deprecated)
✔ don't create a zip file if there are no bundles
✔ detect if current folder is SPT root folder (and/or? if there are any mods)
✔ show some indication that zipping is taking place
