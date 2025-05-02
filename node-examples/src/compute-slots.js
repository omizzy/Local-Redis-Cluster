import { v4 as uuidv4 } from "uuid";
import { getCluster } from "./cluster.js";
import calculateSlot from "cluster-key-slot";

function sleep(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function main() {
    let cluster = null;
    try {
        cluster = await getCluster();
        console.log('connected to cluster..');
        const slotsAndKeys = new Map();
        const limit = 1000000;
        let i = 0;
        while (i < limit) {
            const key = uuidv4();
            console.log("generated key:", key);
            const slot = calculateSlot(key);
            console.log("computed slot:", slot);
            await cluster.set(key, key); // use key for a value too

            if (slotsAndKeys.has(slot)) {
                const keys = slotsAndKeys.get(slot);
                keys.push(key);
                slotsAndKeys.set(slot, keys);
            } else {
                const keys = [key];
                slotsAndKeys.set(slot, keys);
            }
            i++;
        }

        for (const [slot, keys] of slotsAndKeys) {
            console.log("slot:", slot);
            console.log("deleting keys:", keys);
            await cluster.del(keys);
        }
    } catch (err) {
        console.error(err);
    } finally {
        if (cluster) {
            await cluster.quit();
        }
    }
}

main();
