# Exanple programs in nodejs

Setup the project first so that the programs can execute correctly..

```console
npm install
```

## Example Echo Program

###  About

Make sure you have a local redis cluster running before executing this program..

1. This program connects to a redis cluster.
2. Asks the user for a key and value pair
3. Stores this pair in the cluster.
4. Then retrieves the value using the provided echo.
5. Go to 2.

<kbd>Ctrl</kbd> + <kbd>c</kbd>  stops the program.

### Run it

```console
npm run echo
```

## Example Slot Computer

### About

Make sure you have a local redis cluster running before executing this program..

1. This program generates a set 100000 keys (key are also used as a value).
2. Computes the slot for the key.
3. Keeps track of this slot-to-keys mapping.
3. Stores the key/value into the Redis cluster.

Once all the keys are generated
1. This program iterates over the unique set of slots computed.
2. Issues a mult-delete operation at the Redis cluster for all the keys for each slot.

### Run it

```console
npm run compute-slots
```
