
# check that dependencies
which redis-server > /dev/null 2>&1
if [ $? -eq 1 ]; then
  echo "redis-server command not found, exiting.."
  exit 1
fi

# check that dependencies
which redis-cli > /dev/null 2>&1
if [ $? -eq 1 ]; then
  echo "redis-cli command not found, exiting.."
  exit 1
fi

# send the kill signal to child process launched
trap terminate SIGINT
terminate(){
    pkill -SIGINT -P $$
    exit
}
