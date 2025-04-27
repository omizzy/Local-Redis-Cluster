#!/usr/bin/env bash

# Check if a file exists
if [ ! -f ./work/conf ]; then
  echo "./work/conf file does not exist, exiting"
  exit 1
fi

# load the config
. ./work/conf

mkdir ./work/logs
echo "Generating redis config files.."
for ((i=START_PORT; i<=END_PORT; i++))
do
    mkdir -v ./work/$i
    cd ./work/$i;
    cat << EOF > ./redis.conf
# redis.conf file
port $i
cluster-enabled yes
cluster-config-file nodes.conf
cluster-node-timeout 5000
appendonly yes
EOF
    cd ../..
done
