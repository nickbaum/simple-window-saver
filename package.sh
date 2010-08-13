#!/bin/bash

# This script copies all the extension files into a subdirectory
# removes any files that we don't want in the final crx file,
# and zips the directory up for easy upload to the gallery

# clean up previous state
rm -f SimpleWindowSaver.zip;
rm -rf SimpleWindowSaver;

# copy files
mkdir SimpleWindowSaver;
echo "Expect: cp: SimpleWindowSaver is a directory (not copied)."
cp * SimpleWindowSaver;

# clean up
cd SimpleWindowSaver;
files_to_clean_up=(
	.DS_Store
	.git
	feedback
	icon32.png
	package.sh
	screenshot.png
)
# TODO: make this safe if the cd fails!
for i in ${files_to_clean_up[@]}; do
	rm -rf $i;
done
cd ../;

# TODO: add js compilation and html/css minification

# archive
zip -rq SimpleWindowSaver.zip SimpleWindowSaver;
rm -r SimpleWindowSaver;

