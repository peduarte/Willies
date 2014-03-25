#!/bin/bash
echo "Starting deployment to pedroduarte.github.io (github pages)...";

echo "Making sure branch 'master' is up to date...";
git checkout master;
git add .;
git commit -am "Updated branch 'master'."
git pull origin master;
git push origin master;

echo "Switching to branch 'gh-pages'...";
git checkout gh-pages;
git pull origin gh-pages;
cp -r build/. .;
rm -rf build;
git add .;
git commit -am "New version generated from master.";
git push origin gh-pages;

echo "Switching back to branch 'master'...";
git checkout master;
