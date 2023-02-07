# Backend Initialization

Directions listed here assume you are in the server folder directory.

### Configure environment variables

```bash
cp .env_example .env
# Make changes if needed
nano .env
```

### Half Docker

```bash
# Get and start a redis backend
docker run -p 6379:6379 -d redislabs/redismod:preview

# Run server.js
npm start
```

### Full Docker w/ Compose

```bash
# Start containers detached for development
docker-compose up -d
# OR
# Start containers detached for prod
docker-compose -f docker-compose-prod.yml up -d

# Stop containers
docker-compose down
```

## Example requests

### Create room

- bash:

```bash
# Create a room passing details you would from the front end.
curl -X PUT -H "Content-Type: application/json" \
-d "{\"userName\": \"dme_998\", \"ruleset\": \"Secret Hitler\", \"playerCount\": 5}" \
http://localhost:3000/room -s
```

- PowerShell:

```powershell
# Create a room passing details you would from the front end.
Invoke-RestMethod -URI http://localhost:3000/room -Method PUT -Body '{"userName": "dme_998", "ruleset": "Secret Hitler", "playerCount": 5}' -ContentType "application/json"
# OR
Invoke-WebRequest -URI http://localhost:3000/room -Method PUT -Body '{"userName": "dme_998", "ruleset": "Secret Hitler", "playerCount": 5}' -ContentType "application/json"
```

### Join Room

- bash:

```bash
curl -X PUT -H "Content-Type: application/json" \
-d "{\"userName\": \"tut0\", \"roomCode\": \"A17G\"}" \
http://localhost:3000/room/join -s
```

- PowerShell:

```powershell
Invoke-RestMethod -URI http://localhost:3000/room/join -Method PUT -Body '{"userName": "tut0", "roomCode": "A17G"}' -ContentType "application/json"
# OR
Invoke-WebRequest -URI http://localhost:3000/room/join -Method PUT -Body '{"userName": "tut0", "roomCode": "A17G"}' -ContentType "application/json"
```

### Get Rulesets

- bash:

```bash
curl -X GET http://localhost:3000/room/rulesets
```

- PowerShell

```powershell
Invoke-RestMethod -URI http://localhost:3000/room/rulesets -Method GET
# OR
Invoke-WebRequest -URI http://localhost:3000/room/rulesets -Method GET
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
