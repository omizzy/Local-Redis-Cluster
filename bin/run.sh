#!/usr/bin/env bash

. ./bin/bootstrap.sh

# load the config
. ./work/conf

echo "Launching redis servers.."
for ((i=START_PORT; i<=END_PORT; i++))
do
  echo "Launching redis server" $i
  cd ./work/$i;
  # start the servers
  `which redis-server` ./redis.conf > ../logs/$i.log &
  # wait for it be ready
  echo -n sent PING...
  SUCCESS=1
  until [ "$SUCCESS" -eq 0 ]
  do
    redis-cli -h 127.0.0.1 -p $i ping > /dev/null 2>&1
    SUCCESS=$?
    echo -n .
  done
  echo PONG
  # add it to list
  SERVERS+=("127.0.0.1:$i")
  cd ../..
done

echo done

wait
