High Priority - prior to release

-   include BepinEx\plugins in this

Low Priority - a post release idea dump in no particular order

-   file hash on each file to determine if you want to include a file/mod in the new zip
-   allow user to decide the output folder (use a separate json file to allow user to set this up)
-   expand readme to include more instructions/ideas around a shared google drive folder(or cloud storage of choice) (basically syncing)
-   explore creating a clickable link that opens users spt root directory after completion
-   fix percentage done fuckery.
-   check why overwriting files on extract
-   refactor code into functions that make it more elegant, make use of async/await-   
-   show size of bundles (before compression)-   
-   add some colour to the various text
-   log when the last copy was run
-   check if zip file exists, offer option to delete or overwrite or exit
-   ask to input spt root folder path (as an option to not run from spt root)
-   allow for the choice of which mods to then copy and zip
-   measure time taken to complete the task, if the process completed in less than a second, print a message highlighting how quick that was just for fun
-   list each mod as it is being added to the archive then add a tick mark to indicate that the mod has been added to the archive


Complete :

✔ progress bar for archiving process
✔ add a small delay between listing each mod, for effect. 
✔ Create a simple block of text with some info about the project
✔ Add Fika faq link to readme
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
