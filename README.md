# Local Redis Cluster


## Usage Guide


Scripts to help a build redis cluster locally. Note that:
* Each master node is assigned at least one replica.
* The cluster command will determine the amount of masters and replicas based on the available nodes (the `number of nodes` you provide in the `generate-conf` command).
* Recommended minimum amount of nodes 6.


### 0. Super quick start

This command will start a cluster of 6 nodes using ports 9000 through 9005.

```console
> ./bin/destroy.sh && echo -e "9000\n6" | ./bin/generate-conf.sh && ./bin/build.sh && yes yes | ./bin/init-run.sh

```

<kbd>Ctrl</kbd> + <kbd>c</kbd>  stops the cluster

Example: 

```console
> ./bin/destroy.sh && echo -e "9000\n6" | ./bin/generate-conf.sh && ./bin/build.sh && yes yes | ./bin/init-run.sh
Deleting dirs..
Enter starting port:
Start port: 9000
Enter number of nodes:
Number of nodes: 6
End port: 9006
file generated in ./work/conf
Generating conf files..
./work/9000
./work/9001
./work/9002
./work/9003
./work/9004
./work/9005
Launching redis servers..
Launching redis server 9000
sent PING.........PONG
Launching redis server 9001
sent PING.........PONG
Launching redis server 9002
sent PING.........PONG
Launching redis server 9003
sent PING........PONG
Launching redis server 9004
sent PING........PONG
Launching redis server 9005
sent PING........PONG
Creating cluster..
>>> Performing hash slots allocation on 6 nodes...
Master[0] -> Slots 0 - 5460
Master[1] -> Slots 5461 - 10922
Master[2] -> Slots 10923 - 16383
Adding replica 127.0.0.1:9004 to 127.0.0.1:9000
Adding replica 127.0.0.1:9005 to 127.0.0.1:9001
Adding replica 127.0.0.1:9003 to 127.0.0.1:9002
>>> Trying to optimize slaves allocation for anti-affinity
[WARNING] Some slaves are in the same host as their master
M: 4d20136f5c6233ae4b6c1d6affe7a0a88fc7f3cf 127.0.0.1:9000
   slots:[0-5460] (5461 slots) master
M: 9e4355291258f7a86312b0004d721454d138494b 127.0.0.1:9001
   slots:[5461-10922] (5462 slots) master
M: b662b91298a08c0c80d1f5d4e47055bafb0e8110 127.0.0.1:9002
   slots:[10923-16383] (5461 slots) master
S: 6eca6f31b4d6e31c29e139fd872a5af91326039a 127.0.0.1:9003
   replicates 9e4355291258f7a86312b0004d721454d138494b
S: 9a674c8951e85a8ea77f9c4daf6afb85027d952f 127.0.0.1:9004
   replicates b662b91298a08c0c80d1f5d4e47055bafb0e8110
S: a09b2b4f8a035a794a0fa9ada3988a4f81a92103 127.0.0.1:9005
   replicates 4d20136f5c6233ae4b6c1d6affe7a0a88fc7f3cf
Can I set the above configuration? (type 'yes' to accept): >>> Nodes configuration updated
>>> Assign a different config epoch to each node
>>> Sending CLUSTER MEET messages to join the cluster
Waiting for the cluster to join
...
>>> Performing Cluster Check (using node 127.0.0.1:9000)
M: 4d20136f5c6233ae4b6c1d6affe7a0a88fc7f3cf 127.0.0.1:9000
   slots:[0-5460] (5461 slots) master
   1 additional replica(s)
M: b662b91298a08c0c80d1f5d4e47055bafb0e8110 127.0.0.1:9002
   slots:[10923-16383] (5461 slots) master
   1 additional replica(s)
S: 6eca6f31b4d6e31c29e139fd872a5af91326039a 127.0.0.1:9003
   slots: (0 slots) slave
   replicates 9e4355291258f7a86312b0004d721454d138494b
M: 9e4355291258f7a86312b0004d721454d138494b 127.0.0.1:9001
   slots:[5461-10922] (5462 slots) master
   1 additional replica(s)
S: a09b2b4f8a035a794a0fa9ada3988a4f81a92103 127.0.0.1:9005
   slots: (0 slots) slave
   replicates 4d20136f5c6233ae4b6c1d6affe7a0a88fc7f3cf
S: 9a674c8951e85a8ea77f9c4daf6afb85027d952f 127.0.0.1:9004
   slots: (0 slots) slave
   replicates b662b91298a08c0c80d1f5d4e47055bafb0e8110
[OK] All nodes agree about slots configuration.
>>> Check for open slots...
>>> Check slots coverage...
[OK] All 16384 slots covered.
```


You are done, but if you want to configure the cluster a bit more manually ignore this step, and continue the next steps. Otherwise, you can stop here.


### 1. Create a base config file

The cluster will use a consecutive number of ports.
- You will need to provide the first port that should be assigned.
- Then provide the number of nodes in the cluster.

The remaining ports will be computed from the number of nodes for the cluster. 

```console
>  local-redis-clusters ./bin/generate-conf.sh
```


Example:

Port 1100 was selected with 10 nodes. so ports 1100 through 1109 will be used.


```console
>  local-redis-clusters ./bin/generate-conf.sh
Enter starting port:
1100
Start port: 1100
Enter number of nodes:
10
Number of nodes: 10
End port: 1109
file generated in ./work/conf
```

### 2. Build the node configs and logs directory

This command will create the subdirectories and config files under the `./work` directory

```console
> ./bin/build.sh
Generating redis config files..
./work/9000
./work/9001
./work/9002
./work/9003
./work/9004
./work/9005
```

### 3. Run the server starter AND clustering command

This command starts the redis servers, and clusters them up. Only use this once for every build of the cluster.

```console
> ./bin/init-run.sh
```

Example:

```console
> ./bin/init-run.sh
Launching redis servers..
Launching redis server 9000
sent PING.........PONG
Launching redis server 9001
sent PING........PONG
Launching redis server 9002
sent PING.........PONG
Launching redis server 9003
sent PING.........PONG
Launching redis server 9004
sent PING........PONG
Launching redis server 9005
sent PING........PONG
Creating cluster..
>>> Performing hash slots allocation on 6 nodes...
Master[0] -> Slots 0 - 5460
Master[1] -> Slots 5461 - 10922
Master[2] -> Slots 10923 - 16383
Adding replica 127.0.0.1:9004 to 127.0.0.1:9000
Adding replica 127.0.0.1:9005 to 127.0.0.1:9001
Adding replica 127.0.0.1:9003 to 127.0.0.1:9002
>>> Trying to optimize slaves allocation for anti-affinity
[WARNING] Some slaves are in the same host as their master
M: da32eb2ed1196e67de6cc23a0866553b83f68c87 127.0.0.1:9000
   slots:[0-5460] (5461 slots) master
M: 8c0a0c1fcb5733b1cfc8de0037b007f8ffe96ebf 127.0.0.1:9001
   slots:[5461-10922] (5462 slots) master
M: 9289d4c4e612debe5cfe753fda96f448c549a534 127.0.0.1:9002
   slots:[10923-16383] (5461 slots) master
S: 8d9bcdc164535b9a0738871697da92156af934a8 127.0.0.1:9003
   replicates 8c0a0c1fcb5733b1cfc8de0037b007f8ffe96ebf
S: bc95a530f353987988fa086f7e3aafa4b43213a8 127.0.0.1:9004
   replicates 9289d4c4e612debe5cfe753fda96f448c549a534
S: f83154eb29183b939f1c9b483bddc708dcc1e4b5 127.0.0.1:9005
   replicates da32eb2ed1196e67de6cc23a0866553b83f68c87
Can I set the above configuration? (type 'yes' to accept): >>> Nodes configuration updated
>>> Assign a different config epoch to each node
>>> Sending CLUSTER MEET messages to join the cluster
Waiting for the cluster to join

>>> Performing Cluster Check (using node 127.0.0.1:9000)
M: da32eb2ed1196e67de6cc23a0866553b83f68c87 127.0.0.1:9000
   slots:[0-5460] (5461 slots) master
   1 additional replica(s)
S: bc95a530f353987988fa086f7e3aafa4b43213a8 127.0.0.1:9004
   slots: (0 slots) slave
   replicates 9289d4c4e612debe5cfe753fda96f448c549a534
S: 8d9bcdc164535b9a0738871697da92156af934a8 127.0.0.1:9003
   slots: (0 slots) slave
   replicates 8c0a0c1fcb5733b1cfc8de0037b007f8ffe96ebf
M: 8c0a0c1fcb5733b1cfc8de0037b007f8ffe96ebf 127.0.0.1:9001
   slots:[5461-10922] (5462 slots) master
   1 additional replica(s)
S: f83154eb29183b939f1c9b483bddc708dcc1e4b5 127.0.0.1:9005
   slots: (0 slots) slave
   replicates da32eb2ed1196e67de6cc23a0866553b83f68c87
M: 9289d4c4e612debe5cfe753fda96f448c549a534 127.0.0.1:9002
   slots:[10923-16383] (5461 slots) master
   1 additional replica(s)
[OK] All nodes agree about slots configuration.
>>> Check for open slots...
>>> Check slots coverage...
[OK] All 16384 slots covered.
```

The command `wait`s until you <kbd>Ctrl</kbd> + <kbd>c</kbd>


### 4. Restart the cluster

If you <kbd>Ctrl</kbd> + <kbd>c</kbd> the `init-run.sh` command, you can restart the cluster with

```console
> ./bin/run.sh
```

Example:

```console
Launching redis servers..
Launching redis server 9000
sent PING......PONG
Launching redis server 9001
sent PING......PONG
Launching redis server 9002
sent PING......PONG
Launching redis server 9003
sent PING......PONG
Launching redis server 9004
sent PING............PONG
Launching redis server 9005
sent PING...........PONG
done
```

The command `wait`s until you <kbd>Ctrl</kbd> + <kbd>c</kbd>


### 5. Destroy the cluster

The following command destroys the cluster's resources, make sure the cluster is not running during this time.

```console
> ./bin/destroy.sh
Deleting dirs..
```

You can then rebuild starting at [Super quick start](#0-super-quick-start) or [first step](#1-create-a-base-config-file)



## References

* [4.1 Exercise - Creating a Redis Cluster](https://redis.io/learn/operate/redis-at-scale/scalability/exercise-1)

