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

export function getTTLDate(currentDate, ttlInSeconds) {
    const currentTime = currentDate.getTime();
    const addedTime = currentTime + (ttlInSeconds * 1000);
    return new Date(addedTime);
}