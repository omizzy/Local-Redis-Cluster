#!/usr/bin/env bash

echo "Enter starting port:"
read START_PORT
echo Start port: $START_PORT 

echo "Enter number of nodes:"
read NODES
echo Number of nodes: $NODES 

# compute the end port
END_PORT=$((START_PORT + NODES - 1))
echo End port: $END_PORT


cat << EOF > ./work/conf
START_PORT=$START_PORT
NODES=$NODES
END_PORT=$END_PORT
EOF

echo file generated in ./work/conf
