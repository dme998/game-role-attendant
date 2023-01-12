import { choice } from './utils.js';

export class SecretHitler {
    constructor(players) {
        this.players = players;
        this.minPlayers = 5;
        this.maxPlayers = 10;
    }

    get playerCounts () {
        return {minCount: this.minPlayers, maxCount: this.maxPlayers}
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

    async setRolesForPlayers() {
        
		// Copy players to push and pop freely.
        let players = [...this.players];
        const playerCount = this.players.length;
        const rules = this.determineRoleCount(playerCount);
        let playerRoles = []
		
		// shuffle the working array
		let workingElement;			
		for(let i = 0; i < players.length; i++) {
			let rand = choice(players)
			workingElement = players[i];
			players[i] = players[rand];
			players[rand] = workingElement;
		}

		for(let i = 1; i < rules.fascistCount + 1; i++) {
            let message = (rules.fascistCount < 2) ?
                `${players[i].userName}, your Secret Role is Fascist. The identity of Hitler is ${players[0].userName}.` :
                `${players[i].userName}, your Secret Role is Fascist. The identity of Hitler is ${players[0].userName}. Your fascist teammates are: `
			playerRoles.push({playerId: players[i].entityId, RoleType: "Fascist", color: "negative",
							 message: message})
		}
		
		for(let i = 1 + rules.fascistCount; i < rules.liberalCount + rules.fascistCount + 1; i++) {
			playerRoles.push({playerId: players[i].entityId, RoleType: "Liberal", color: "info", 
							 message: `${players[i].userName}, your Secret Role is Liberal.` })
		}
		
		if (rules.fascistsKnownToHitler) {
        	playerRoles.push({playerId: players[0].entityId, RoleType: "Hitler", color: "maroon",
							  message: `${players[0].userName}, your Secret Role is Hitler and your fellow Fascist is ${players[1].userName}.` })
        }
		else {
			playerRoles.push({playerId: players[0].entityId, RoleType: "Hitler", color: "maroon",
							 message: `${players[0].userName}, your Secret Role is Hitler.` })
		}
		
		
		// Update the message variable for each fascist so they know who their teammates are
		let fascists = players.slice(1, 1 + rules.fascistCount)
        switch(fascists.length) {
            case 1:
                break;
            case 2:
                //first fascist's message
                playerRoles[0].message += fascists[1].userName + "."
                //second fascist's message
                playerRoles[1].message += fascists[0].userName + "."
                break;
            case 3:
                //first fascist's message
                playerRoles[0].message += fascists[1].userName + ", "
                playerRoles[0].message += fascists[2].userName + "."
                //second fascist's message
                playerRoles[1].message += fascists[0].userName + ", "
                playerRoles[1].message += fascists[2].userName + "."
                //third fascist's message
                playerRoles[2].message += fascists[0].userName + ", "
                playerRoles[2].message += fascists[1].userName + "."
                break;
        }
        
        return playerRoles 
		
    }

}

export const RULESETS = {"Secret Hitler": SecretHitler};
