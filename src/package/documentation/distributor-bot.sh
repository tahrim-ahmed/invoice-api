#!/usr/bin/env bash

deploy_dir="distributor-deploy"
api="invoice-api"

echo -e '
Choose the what you want: (Enter to run 1 and 2) \n
1: ------------------------ restart nginx  ----------------------------- \n
2: ---------------------- restart API server ----------------------------- \n
3: --------------------------   pm2 logs  ---------------------------------
'

read num

function nginx() {
  echo 'Restarting NGINX server'
  sudo service nginx restart
  echo 'NGINX server is restarted'
}

function apiServer() {
  echo 'Restarting API server'
  cd $deploy_dir/$api

  yarn run api:stop
  yarn run api:prod
  cd
}

function seeder() {
  echo 'Running seeder'

  echo 'Deleting distributor database....'
  sudo service mysql restart
  sudo mysqladmin -u root drop distributor

  echo 'Creating distributor database....'
  sudo mysqladmin -u root create distributor

  echo 'Initializing seeder'
  cd $deploy_dir/$api

  yarn run seeder:prod
  cd
}

case $num in
1)
  nginx
  ;;
2)
  apiServer
  pm2 logs distributor-api
  ;;
3)
  pm2 logs distributor-api
  ;;
*)
  nginx
  apiServer
  ;;
esac
