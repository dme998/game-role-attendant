const ROOM_CODE_CHAR_SET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const ROOM_CODE_LENGTH = 4;

export function makeRoomCode() {
  let result = "";
  const charsLength = ROOM_CODE_CHAR_SET.length;

  for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
    result += ROOM_CODE_CHAR_SET.charAt(
      Math.floor(Math.random() * charsLength)
    );
  }
  return result;
}

export function normalizeUsername(username) {
  return username.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 12);
}

export function validateRoomCode(roomCode) {
  if (!roomCode) {
    return false;
  }
  if (roomCode.length !== ROOM_CODE_LENGTH) {
    return false;
  }
  const upperRoomCode = roomCode.toUpperCase();
  for (let c of upperRoomCode) {
    if (![...ROOM_CODE_CHAR_SET].includes(c)) {
      return false;
    }
  }

  return upperRoomCode;
}

export function getTTLDate(currentDate, ttlInSeconds) {
  const currentTime = currentDate.getTime();
  const addedTime = currentTime + ttlInSeconds * 1000; //1000 means ms conversion
  return new Date(addedTime);
}

export function choice(arr) {
  return Math.floor(Math.random() * arr.length);
}

// This function removes internal data that does not need to be sent to the client.
export function playersOut(playerObjects) {
  let result = [];
  for (let player in playerObjects) {
    result.push({
      userName: playerObjects[player].userName,
      isHost: playerObjects[player].isHost,
    });
  }

  return result;
}
