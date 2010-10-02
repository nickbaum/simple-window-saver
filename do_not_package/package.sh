#!/bin/bash

# This script zips the extension up for easy upload to the gallery
# It excludes the do_not_package directory as well as few other files

# TODO: make this runnable from extension directory
cd ../../

# TODO: add js compilation and html/css minification

# replace debug.js with empty file
mv simple-window-saver/debug.js simple-window-saver/do_not_package/
cp simple-window-saver/do_not_package/empty_debug.js simple-window-saver/debug.js

# zip for easy upload to the gallery
zip -rq simple-window-saver simple-window-saver -x \*do_not_package\* \*.DS_Store \*.git\* \*README.txt;

# restore debug.js
mv simple-window-saver/do_not_package/debug.js simple-window-saver/debug.js

cd -;
