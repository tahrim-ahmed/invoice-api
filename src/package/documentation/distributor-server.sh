#!/usr/bin/env bash

root_dir="distributor-api"
deploy_dir="distributor-deploy"

api="invoice-api"

echo "Cleaning directories........."
rm -rf $root_dir
rm -rf $deploy_dir/$api
rm -rf "~/.cache"

echo "Creating directories..........."
mkdir -p -- $root_dir
mkdir -p -- $deploy_dir
mkdir -p -- $root_dir/$api
mkdir -p -- $deploy_dir/$api

cd $root_dir

#api repo cloning
git clone "git@github.com:tahrim-ahmed/$api.git"
cd $api

echo "Installing $api ......."
yarn install

echo "Building $api ........."
yarn run build

cd "src/package/documentation"
cp -rf -t "$HOME" distributor-site.sh distributor-server.sh distributor-bot.sh

#goto api folder
cd "$HOME"/$root_dir/$api

rm -rf src .eslintrc.js .gitignore .prettierrc nest-cli.json yarn.lock

echo "Copying $api for deploying ............"
cp -r -t "$HOME"/$deploy_dir/$api node_modules dist test package.json env tsconfig.json tsconfig.build.json

#goto root folder
cd "$HOME"

# starting server
echo 'Restarting API server'
cd $deploy_dir/$api

yarn run api:stop
yarn run api:prod

# goto root folder
cd "$HOME"

echo "Deleting source files......."
rm -rf $root_dir
sudo chmod -R 755 $deploy_dir

echo "Giving permission to scripts......"
#permission to the sh file
chmod +x distributor-server.sh
chmod +x distributor-site.sh
chmod +x distributor-bot.sh

#log the api
pm2 logs distributor-api
