# Local Redis Cluster

## Usage Guide

Scripts to help a build redis cluster locally. Note that:
* Each master node is assigned at least one replica.
* The cluster command will determine the amount of masters and replicas based on the available nodes (the `number of nodes` you provide in the `generate-conf` command).
* Recommended minimum amount of nodes 6.

### 0. Super quick start

This command will start a cluster of 6 nodes using ports 9000 through 9005.

```console
./bin/destroy.sh && echo -e "9000\n6" | ./bin/generate-conf.sh && ./bin/build.sh && yes yes | ./bin/init-run.sh
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
local-redis-clusters ./bin/generate-conf.sh
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
./bin/build.sh
```

Example:

```console
> ./bin/build.sh
Generating redis config files..
./work/1100
./work/1101
./work/1102
./work/1103
./work/1104
./work/1105
./work/1106
./work/1107
./work/1108
./work/1109
```

### 3. Run the server starter AND clustering command

This command starts the redis servers, and clusters them up. Only use this once for every build of the cluster.

```console
./bin/init-run.sh
```

Example:

```console
> ./bin/init-run.sh
Launching redis servers..
Launching redis server 1100
sent PING........PONG
Launching redis server 1101
sent PING........PONG
Launching redis server 1102
sent PING........PONG
Launching redis server 1103
sent PING.........PONG
Launching redis server 1104
sent PING.........PONG
Launching redis server 1105
sent PING.........PONG
Launching redis server 1106
sent PING........PONG
Launching redis server 1107
sent PING.........PONG
Launching redis server 1108
sent PING........PONG
Launching redis server 1109
sent PING........PONG
Creating cluster..
>>> Performing hash slots allocation on 10 nodes...
Master[0] -> Slots 0 - 3276
Master[1] -> Slots 3277 - 6553
Master[2] -> Slots 6554 - 9829
Master[3] -> Slots 9830 - 13106
Master[4] -> Slots 13107 - 16383
Adding replica 127.0.0.1:1106 to 127.0.0.1:1100
Adding replica 127.0.0.1:1107 to 127.0.0.1:1101
Adding replica 127.0.0.1:1108 to 127.0.0.1:1102
Adding replica 127.0.0.1:1109 to 127.0.0.1:1103
Adding replica 127.0.0.1:1105 to 127.0.0.1:1104
>>> Trying to optimize slaves allocation for anti-affinity
[WARNING] Some slaves are in the same host as their master
M: ef947ff4613a050e58c3f66163c61be44f7763fe 127.0.0.1:1100
   slots:[0-3276] (3277 slots) master
M: 48c036806b48e791f0ab85d3ebe7ffc49b25ca71 127.0.0.1:1101
   slots:[3277-6553] (3277 slots) master
M: e902fc42f1784c5c7b3147697e72c6a8b001bda1 127.0.0.1:1102
   slots:[6554-9829] (3276 slots) master
M: 0552b10e2f13b0015b900bd35d31e21ca729c1b8 127.0.0.1:1103
   slots:[9830-13106] (3277 slots) master
M: c87870eb47419da4010753b4364d30833a040225 127.0.0.1:1104
   slots:[13107-16383] (3277 slots) master
S: f30e65ff6f31a80a9c9672438e319f99d9310c95 127.0.0.1:1105
   replicates c87870eb47419da4010753b4364d30833a040225
S: 9b9b942a1d522566a14e0454986e7f0e3a33dcfd 127.0.0.1:1106
   replicates 0552b10e2f13b0015b900bd35d31e21ca729c1b8
S: 30a0aea8b2816353ec1968c062e7ca23d318b095 127.0.0.1:1107
   replicates ef947ff4613a050e58c3f66163c61be44f7763fe
S: acbcee57a5a5c330308c99970af49499a3c1b9b3 127.0.0.1:1108
   replicates e902fc42f1784c5c7b3147697e72c6a8b001bda1
S: cca624b4791ba2348f8707419fe0292b71fee8a0 127.0.0.1:1109
   replicates 48c036806b48e791f0ab85d3ebe7ffc49b25ca71
Can I set the above configuration? (type 'yes' to accept): >>> Nodes configuration updated
>>> Assign a different config epoch to each node
>>> Sending CLUSTER MEET messages to join the cluster
Waiting for the cluster to join
..
>>> Performing Cluster Check (using node 127.0.0.1:1100)
M: ef947ff4613a050e58c3f66163c61be44f7763fe 127.0.0.1:1100
   slots:[0-3276] (3277 slots) master
   1 additional replica(s)
M: 0552b10e2f13b0015b900bd35d31e21ca729c1b8 127.0.0.1:1103
   slots:[9830-13106] (3277 slots) master
   1 additional replica(s)
S: f30e65ff6f31a80a9c9672438e319f99d9310c95 127.0.0.1:1105
   slots: (0 slots) slave
   replicates c87870eb47419da4010753b4364d30833a040225
S: cca624b4791ba2348f8707419fe0292b71fee8a0 127.0.0.1:1109
   slots: (0 slots) slave
   replicates 48c036806b48e791f0ab85d3ebe7ffc49b25ca71
S: 30a0aea8b2816353ec1968c062e7ca23d318b095 127.0.0.1:1107
   slots: (0 slots) slave
   replicates ef947ff4613a050e58c3f66163c61be44f7763fe
S: acbcee57a5a5c330308c99970af49499a3c1b9b3 127.0.0.1:1108
   slots: (0 slots) slave
   replicates e902fc42f1784c5c7b3147697e72c6a8b001bda1
M: c87870eb47419da4010753b4364d30833a040225 127.0.0.1:1104
   slots:[13107-16383] (3277 slots) master
   1 additional replica(s)
M: 48c036806b48e791f0ab85d3ebe7ffc49b25ca71 127.0.0.1:1101
   slots:[3277-6553] (3277 slots) master
   1 additional replica(s)
S: 9b9b942a1d522566a14e0454986e7f0e3a33dcfd 127.0.0.1:1106
   slots: (0 slots) slave
   replicates 0552b10e2f13b0015b900bd35d31e21ca729c1b8
M: e902fc42f1784c5c7b3147697e72c6a8b001bda1 127.0.0.1:1102
   slots:[6554-9829] (3276 slots) master
   1 additional replica(s)
[OK] All nodes agree about slots configuration.
>>> Check for open slots...
>>> Check slots coverage...
[OK] All 16384 slots covered.
done
```

The command `wait`s until you <kbd>Ctrl</kbd> + <kbd>c</kbd>, which shuts down the clusters and stops the process.

### 4. Restart the cluster

If you <kbd>Ctrl</kbd> + <kbd>c</kbd> the `init-run.sh` command, you can restart the cluster with

```console
./bin/run.sh
```

Example:

```console
> ./bin/run.sh
Launching redis servers..
Launching redis server 1100
sent PING......PONG
Launching redis server 1101
sent PING......PONG
Launching redis server 1102
sent PING......PONG
Launching redis server 1103
sent PING......PONG
Launching redis server 1104
sent PING......PONG
Launching redis server 1105
sent PING......PONG
Launching redis server 1106
sent PING...........PONG
Launching redis server 1107
sent PING.............PONG
Launching redis server 1108
sent PING...............PONG
Launching redis server 1109
sent PING...............PONG
done
done
```

The command `wait`s until you <kbd>Ctrl</kbd> + <kbd>c</kbd>, which shuts down the clusters and stops the process.

### 5. Destroy the cluster

The following command destroys the cluster's resources, make sure the cluster is not running during this time.

```console
./bin/destroy.sh
```

Example:

```console
> ./bin/destroy.sh
Deleting dirs..
```

You can then rebuild starting at [Super quick start](#0-super-quick-start) or [first step](#1-create-a-base-config-file)

## References

* [4.1 Exercise - Creating a Redis Cluster](https://redis.io/learn/operate/redis-at-scale/scalability/exercise-1)
