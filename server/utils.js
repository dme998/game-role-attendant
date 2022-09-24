export function makeRoomCode() {
    let result = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charsLength = chars.length

    for (let i = 0; i < 4; i++) {
        result += chars.charAt(Math.floor(Math.random() * charsLength));
    }
    return result
}

export function normalizeUsername(username) {
	return username.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 12);
}

export function validateRoomCode(roomCode) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    if (!roomCode) {
        return false;
    }
    if (roomCode.length !== 4) {
        return false;
    }
    const upperRoomCode = roomCode.toUpperCase();
    for (let c of upperRoomCode) {
        if (![...chars].includes(c)) {
            return false;
        }
    }

    return upperRoomCode;
}

export function getTTLDate(currentDate, ttlInSeconds) {
    const currentTime = currentDate.getTime();
    const addedTime = currentTime + (ttlInSeconds * 1000);
    return new Date(addedTime);
}