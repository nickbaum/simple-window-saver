#!/bin/bash

# This script copies all the extension files into a subdirectory
# removes any files that we don't want in the packaged extension,
# and zips the directory up for easy upload to the gallery

# These are the files that we don't want in the packaged extension.
# TODO: currently the code doesn't support file names with spaces.
files_to_clean_up=(
	.DS_Store
	.git
	feedback
	icon32.png
	package.sh
	screenshot.png
)

# clean up previous state
rm -f SimpleWindowSaver.zip;
rm -rf SimpleWindowSaver;

# copy files
mkdir SimpleWindowSaver;
echo "Expect: cp: SimpleWindowSaver is a directory (not copied)."
cp * SimpleWindowSaver;

# remove files we don't want in the packaged extension
cd SimpleWindowSaver;
# TODO: make this safe if the cd fails!
for i in ${files_to_clean_up[@]}; do
	rm -rf $i;
done
cd ../;

# TODO: add js compilation and html/css minification

# zip for easy upload to the gallery
zip -rq SimpleWindowSaver.zip SimpleWindowSaver;
rm -r SimpleWindowSaver;

