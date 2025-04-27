import { createCluster } from 'redis';
import { parseFile } from 'key-value-file'
import readline from 'node:readline';

let cluster = null;
let rl = null;
try {

    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    function getInput(prompt) {
        return new Promise((resolve) => {
            rl.question(prompt, input => {
                resolve(input);
            });
        });  
    }
    const kv = await parseFile('../work/conf')

    const startPort= kv.get('START_PORT');
    const endPort= kv.get('END_PORT');

    const nodeConfigs = [];
    for (let port = startPort; port <= endPort; port++) {
        nodeConfigs.push({
            url: `redis://127.0.0.1:${port}`
        });
    }

    cluster = await createCluster({
        rootNodes: nodeConfigs
    }); 
    await cluster.connect();

    while (true) {
        // enter key
        const key = await getInput('Enter key: ');
        let value = await getInput('Enter value: ');
        await cluster.set(key, value);
        value = await cluster.get(key);
        console.log(`Echo => `, `${key}:`, value);
    }
} catch (err) {
    console.error(err);
} finally {
    if (cluster) {
        await cluster.quit();
    }
    if (rl) {
        rl.close();
    }
}
