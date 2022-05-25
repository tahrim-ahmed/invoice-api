#!/usr/bin/env bash

app_name=distributor-frontend
docker_username=taharimahmed
docker_password=mi63939633

echo 'Distributor stopping the frontend.........'
docker rm $(docker stop $(docker ps -a -q --filter ancestor=taharimahmed/$app_name --format="{{.ID}}"))

echo "Clearing the cache"
docker system prune -a -f --volumes
rm -rf  "$HOME/.cache"

echo "Login in docker hub..........."
docker login -u $docker_username -p $docker_password

echo 'Pulling from docker hub.......'
docker run -d --pull always --publish 4901:80 $docker_username/$app_name

echo 'Distributor frontend is running...........'

echo 'Restarting NGINX server'
sudo service nginx restart
echo 'NGINX server is restarted'
