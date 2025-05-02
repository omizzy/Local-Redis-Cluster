import { createCluster } from "redis";
import { parseFile } from "key-value-file";

export async function getCluster() {
    const kv = await parseFile("../work/conf");

    const startPort = kv.get("START_PORT");
    const endPort = kv.get("END_PORT");
    const nodeConfigs = [];
    for (let port = startPort; port <= endPort; port++) {
        nodeConfigs.push({
            url: `redis://127.0.0.1:${port}`,
        });
    }

    const cluster = await createCluster({
        rootNodes: nodeConfigs,
    });
    await cluster.connect();
    return cluster;
}
