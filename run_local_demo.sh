#!/usr/bin/env bash

dbpasswd=$(pwgen 32 1)

# Container variables for launch
export POSTGRES_PASSWORD="$dbpasswd"
export POSTGRES_USER="dbadmin"
export POSTGRES_DB="dbmain"
# Environment variables
cat >env.list <<EOF
NODE_ENV=production
DB_ENGINE=postgres
DB_HOST=postgres
DB_PORT=5432
DB_PASSWORD=$dbpasswd
DB_USERNAME=dbadmin
DB_NAME=dbmain
PROJECT_DB_PASSWORD=$dbpasswd
PROJECT_DB_USERNAME=dbadmin
PROJECT_DB_NAME=dbmain
RABBITMQ_HOST=rabbitmq
EOF

docker kill postgres 2>/dev/null ; docker rm postgres 2>/dev/null
eval docker run "${DOCKER_FLAGS:-"--rm -d"}" --name postgres -e POSTGRES_PASSWORD="${POSTGRES_PASSWORD}" -e POSTGRES_USER="${POSTGRES_USER}" -e POSTGRES_DB="${POSTGRES_DB}" postgres

export RABBITMQ_HOST=rabbitmq

docker kill rabbitmq 2>/dev/null ; docker rm rabbitmq 2>/dev/null
eval docker run "${DOCKER_FLAGS:-"--rm -d"}" --name rabbitmq rabbitmq

for i in $(seq 1 "${NUM_WORKERS:-1}"); do
	docker kill "sqsc-demo-worker-$i" 2>/dev/null ; docker rm "sqsc-demo-worker-$i" 2>/dev/null
	eval docker run "${DOCKER_FLAGS:-"--rm -d"}" --name "sqsc-demo-worker-$i" --link rabbitmq --link postgres --env-file env.list squarescale/sqsc-demo-worker
done

docker kill sqsc-demo-app 2>/dev/null ; docker rm sqsc-demo-app 2>/dev/null
eval docker run "${DOCKER_FLAGS:-"--rm -d"}" -p 3000:3000 --name sqsc-demo-app --link rabbitmq --link postgres --env-file env.list squarescale/sqsc-demo-app
