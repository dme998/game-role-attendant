# Backend Initialization

Directions listed here assume you are in the server folder directory.

### Half Docker

```bash
# Get and start a redis backend
docker run -p 6379:6379 -d redislabs/redismod:preview

# Run server.js
npm start
```

### Full Docker w/ Compose

```bash
# Start containers detached
docker-compose up -d

# Stop containers
docker-compose down
```

## Example requests

### Create room

- bash:

```bash
# Create a room passing details you would from the front end.
curl -X PUT -H "Content-Type: application/json" \
-d "{\"userName\": \"dme_998\", \"ruleset\": \"Secret Hitler\", \"isHost\": true}" \
http://localhost:3000/room -s
# ^ This will return the RoomId and PlayerId to use in the following cURLs.

# Fetch player info:
curl -X GET http://localhost:3000/room/player/01G90F041EDJ6BEBXPTQY8TVX4 -s

# Fetch room info:
curl -X GET http://localhost:3000/room/01G90F041DGV6SA4JMPXA8FJZF -s
```

- PowerShell:

```powershell
# Create a room passing details you would from the front end.
Invoke-WebRequest -URI http://localhost:3000/room -Method PUT -Body '{"userName": "dme_998", "ruleset": "Secret Hitler", "isHost": true}' -ContentType "application/json"
# ^ This will return the RoomId and PlayerId to use in the following cURLs.

# Fetch player info:
Invoke-WebRequest -URI http://localhost:3000/room/player/01G90FH9Y93BJ95K84XB2KWN27 -Method GET

# Fetch room info:
Invoke-WebRequest -URI http://localhost:3000/room/01G90FH9Y8MQE17WGCX1WGKDYW -Method GET
```

### Join Room

```bash
curl -X PUT -H "Content-Type: application/json" \
-d "{\"userName\": \"tut0\", \"roomCode\": \"A17G\"}" \
http://localhost:3000/room/join -s
```

```powershell
Invoke-WebRequest -URI http://localhost:3000/room/join -Method PUT -Body '{"userName": "tut0", "roomCode": "A17G"}' -ContentType "application/json"
```

## Teardown

```bash
# Kill the Redis container when finished.
# List processes, use -a after ps to list non running containers.
docker ps

# Use container id
docker stop <container_id>
docker rm <container_id>  # If error use docker rm <container_id> -f
```
