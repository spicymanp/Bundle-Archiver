High Priority - prior to release

- so much completeness...

Low Priority - post release

- add a small delay between listing each mod, for effect. (do this asyncronously)
- show size of bundles (before compression)
- progress bar for archiving process
- add some colour to the various text
- log when the last copy was run
- check if zip file exists, offer option to delete or overwrite or exit
- ask to input spt root folder path (as an option to not run from spt root)
- allow for the choice of which mods to then copy and zip
- expand on user/mods directory check to check for spt root (currently assuming in root)
- option to only copy files newer than the last copy
- look into how to integrate 'prompts' npmjs.com/package/prompts
- measure time taken to complete the task
- if the process completed in less than a second, print a message highlighting how quick that was
- rafactor code into functions that make it more elegant, make use of async/await
- sync host settings & mods (possibly better as a seperate utility)

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
✔ check if zip file exists before writing to it
✔ add a function to keep terminal window open after an error
✔ Ensure terminal remains open and waits for user input before exiting, regardless of reason.
✔ show file sizes
✔ proper unit conversion
✔ Ensure print messages are clear, concise and accurate.
✔ include instructions in the zipped archive with instructions for where to extract the bundles zip to
✔ clean up code
✔ do tests
