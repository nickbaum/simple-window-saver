#!/bin/bash

# This script zips the extension up for easy upload to the gallery
# It excludes the do_not_package directory as well as .git and .DS_Store

cd ../../

# TODO: add js compilation and html/css minification

# zip for easy upload to the gallery
zip -rq simple-window-saver simple-window-saver -x \*do_not_package\* \*.DS_Store \*.git\*;

cd -;
