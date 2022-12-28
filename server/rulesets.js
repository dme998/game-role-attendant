import { choice, removeItem } from './utils.js'

class SecretHitler {
    constructor(players) {
        this.players = players;
        this.minPlayers = 5;
        this.maxPlayers = 10;
        if (!this.players.length >= this.minPlayers || !this.players.length <= this.maxPlayers) {
            throw Error("That boy ain't right....");
        }
    }

    determineRoleCount(playerCount) {
        let liberalCount;
        let fascistCount;
        let fascistsKnownToHitler;
        const hitlerCount = 1;
        switch (playerCount) {
            case 5:
                liberalCount = 3;
                fascistCount = 1;
                fascistsKnownToHitler = true;
                return {liberalCount, fascistCount, hitlerCount, fascistsKnownToHitler}
            case 6:
                liberalCount = 4;
                fascistCount = 1;
                fascistsKnownToHitler = true;
                return {liberalCount, fascistCount, hitlerCount, fascistsKnownToHitler}
            case 7:
                liberalCount = 4;
                fascistCount = 2;
                fascistsKnownToHitler = false;
                return {liberalCount, fascistCount, hitlerCount, fascistsKnownToHitler}
            case 8:
                liberalCount = 5;
                fascistCount = 2;
                fascistsKnownToHitler = false;
                return {liberalCount, fascistCount, hitlerCount, fascistsKnownToHitler}
            case 9:
                liberalCount = 5;
                fascistCount = 3;
                fascistsKnownToHitler = false;
                return {liberalCount, fascistCount, hitlerCount, fascistsKnownToHitler}
            case 10:
                liberalCount = 6;
                fascistCount = 3;
                fascistsKnownToHitler = false;
                return {liberalCount, fascistCount, hitlerCount, fascistsKnownToHitler}
        }
    }

    setRolesForPlayers() {
        // Copy players to push and pop freely.
        let players = self.players;
        const playerCount = self.players.length;
        const rules = this.determineRoleCount(playerCount);
        let playerRoles = []
        for (let i = 0; i < rules.liberalCount; i++) {
            const playerIndex = choice(players)
            playerRoles.push({[players[playerIndex].entityId]: "Liberal", color: "info", message: `${players[playerIndex].userName}, you are a Liberal! Enact Liberal policies and try to assassinate Hitler.`})
            players = removeItem(players, players[playerIndex])
        }
        for (let i = 0; i < rules.fascistCount; i++) {
            const playerIndex = choice(players)
            playerRoles.push({[players[playerIndex].entityId]: "Fascist", color: "negative", message: `${players[playerIndex].userName}, you are a Fascist! Enact Fascist policies and try to elect Hitler.`})
            players = removeItem(players, players[playerIndex])
        }
        if (rules.fascistsKnownToHitler) {
            // do something.
        }
        playerRoles.push({[players[0]]: "Hitler", color: "maroon"})

        return playerRoles
    }

}