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