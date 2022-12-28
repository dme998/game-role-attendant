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
		
		// shuffle the working array
		let workingElement;			
		for(let i = 0; i < players.length; i++) {
			let rand = choice(players)
			workingElement = players[i];
			players[i] = players[rand];
			players[rand] = workingElement;
		}
		
		for(let i = 1; i < rules.fascistCount; i++) {
			playerRoles.push({[players[i].entityID]: "Facist", color: "negative", 
							 message: `${players[i].userName}, your Secret Role is Facist. The identity of Hitler is ${players[0].userName}. `})
		}
		
		for(let i = 1 + rules.fascistCount; i < rules.liberalCount; i++) {
			playerRoles.push({[players[i].entityID]: "Liberal", color: "info", 
							 message: `${players[0].userName}, your Secret Role is Liberal.` })
		}
		
		if (rules.fascistsKnownToHitler) {
        	playerRoles.push({[players[0].entityID]: "Hitler", color: "maroon", 
							  message: `${players[0].userName}, your Secret Role is Hitler and your fellow Facist is ${players[1].userName}` })
			for(let i = 0; i < players.length; i++) {
				
			}
        }
		else {
			playerRoles.push({[players[0].entityID]: "Hitler", color: "maroon",
							 message: `${players[0].userName}, your Secret Role is Hitler. Your fellow Facists: ` })
		}
		
		
		// Update the message variable for each facist so they know who their teammates are
		let facists = players.slice(1, 1 + rules.fascistCount)
		for(let i = 0; i < facists.length; i++) {
			for(let j = 0; j < facists.length; j++) {
				let k = j + 1;
				if (k > facists.length) k = 0;

				// i+1 is to reassociate facists element number with original players element number
				if (j === facists.length) {
					playerRoles[i+1].message += facists[k].userName + "."	
				}
				else {
					playerRoles[i+1].message += facists[k].userName + ", "
				}
			}
		}
		
        
        return playerRoles 
		
    }

}
