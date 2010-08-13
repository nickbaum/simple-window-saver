#!/bin/bash

# clean up previous state
rm -f SimpleWindowSaver.zip;
rm -rf SimpleWindowSaver;

# copy files
mkdir SimpleWindowSaver;
cp * SimpleWindowSaver > /dev/null;

# clean up
cd SimpleWindowSaver;
rm -f .DS_Store;
rm -rf .git;
rm -f screenshot.png;
rm -f icon32.png;
rm -f feedback\ for\ extensions\ team;
rm -f package.sh;
cd ../;

# archive
zip -rq SimpleWindowSaver.zip SimpleWindowSaver;
rm -r SimpleWindowSaver;

