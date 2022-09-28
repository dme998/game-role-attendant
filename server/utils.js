const roomCodeCharSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const roomCodeLength = 4;

export function makeRoomCode() {
    let result = '';
    const charsLength = roomCodeCharSet.length;

    for (let i = 0; i < roomCodeLength; i++) {
        result += roomCodeCharSet.charAt(Math.floor(Math.random() * charsLength));
    }
    return result
}

export function normalizeUsername(username) {
	return username.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 12);
}

export function validateRoomCode(roomCode) {
    if (!roomCode) {
        return false;
    }
    if (roomCode.length !== roomCodeLength) {
        return false;
    }
    const upperRoomCode = roomCode.toUpperCase();
    for (let c of upperRoomCode) {
        if (![...roomCodeCharSet].includes(c)) {
            return false;
        }
    }

    return upperRoomCode;
}

export function getTTLDate(currentDate, ttlInSeconds) {
    const currentTime = currentDate.getTime();
    const addedTime = currentTime + (ttlInSeconds * 1000);  //1000 means ms conversion
    return new Date(addedTime);
}