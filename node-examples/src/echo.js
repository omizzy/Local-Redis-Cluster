import readline from "node:readline";
import { getCluster } from "./cluster.js";

async function main() {
    let cluster = null;
    let rl = null;
    try {
        rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        function getInput(prompt) {
            return new Promise((resolve) => {
                rl.question(prompt, (input) => {
                    resolve(input);
                });
            });
        }

        cluster = await getCluster();

        while (true) {
            // enter key
            const key = await getInput("Enter key: ");
            let value = await getInput("Enter value: ");
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
}
main();
