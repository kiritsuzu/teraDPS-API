# TeraDPS API How-to
An explanation on how to use the api for TeraDPS to send meter information to the webserver at teradps.io

# Step 1: Create an account.
First, you need to create an account on the TeraDPS. You can do this by either creating an account on the website (teradps.io) or by sending a POST request to teradps.io/api/users endpoint with 'email' and 'password' fields.

# Step 2: Login & get your Auth Token & userId.
Login to the site by sending a POST to teradps.io/api/login with 'email' and 'password'. Upon successful login, your response will include 'authToken' and 'userId' keys. The values of these keys will be used when submitting encounters.

# Step 3: Submit encounter through the API.
API Link: teradps.io/api/que

Send a POST request to the API with a JSON object including the following information on your encounter as properties on the object.
In the POST request, make sure to add your authToken and userId as headers:

Ex.
authToken is 8PBcPuHHhRK_57tk3Ryc9IP_XtOIRXh_4-j9A9QUBxu
userId is crdChGPz6PndHvMYh

Add these headers in your request:

```
X-Auth-Token: 8PBcPuHHhRK_57tk3Ryc9IP_XtOIRXh_4-j9A9QUBxu
X-User-Id: crdChGPz6PndHvMYh
```

The general structure of the JSON request object should be as follows:
```
Encounter Base {
  areaId: Number,
  bossId: Number,
  debuffsUptime: {
    traverseCut: Percent String,
    combativeStrike: Percent String,
    debilitate: Percent String,
    jackhammer: Percent String,
    ensnaringTrap: Percent String,
    tripleNemesis: Percent String,
    contagion: Percent String,
    volleyOfCurses: Percent String
  },
  supportClassesPresent: {
    lancer: Boolean,
    warrior: Boolean,
    brawler: Boolean,
    archer: Boolean,
    priest: Boolean,
    mystic: Boolean
  }
  members: [
    {
      playerName: String,
      playerDPS: Number,
      playerClass: String,
      playerTotalDamage: Number,
      playerTotalDamagePercent: Percent String,
      playerAverageCritRate: Percent String,
      skillLog: [
        {
          skillName: 'String',
          skillHits: 'Number',
          skillTotalDamage: 'Number',
          skillCritRate: Percent String,
          skillDamagePercent: Percent String,
          skillHighestCrit: Number,
          skillLowestCrit: Number,
          skillAverageCrit: Number,
          skillAverageWhite: Number
        }
      ],
      buffsUptime: {
        energyStars: Percent String,
        guardianShout: Percent String,
        titanicWrath: Percent String
      },
      consumables: {
        charms: Boolean,
        nostrum: Boolean,
        scroll: Boolean,
        bravery: Boolean,
        canephora: Boolean,
        noctenium: Boolean,
        partyFood: Boolean,
        lamb: Boolean,
        heavensElixir: Boolean
      }
    }
  ]
}
```

Below is the list of the object properties:

## Main Encounter properties

##### `areaId`
- _Number_
- The area id in reference to database.

##### `bossId`
- _Number_
- The boss id in reference to database.

##### `debuffsUptime`
- _Object_
- Each property represents an endurance debuff with % uptime on boss.
- Example: 
```
{
debilitate: '80%',
traverseCut: '60%'
}
```

##### `supportClasses`
- _Object_
- Each property represents a support class whether they were in the party or not, value of true/false.
- Example: 
```
{
lancer: true,
warrior: false,
priest: true,
mystic: false
}
```

##### `members`
- _Array of Objects_
- An array containing Objects that represent the members of the party.
- Example:
```
[
  {
  playerName: One,
  playerDPS: 400,
  playerClass: Slayer,
  ...
  },
  {
  playerName: Two,
  playerDPS: 10,
  playerClass: Priest,
  ...
  }
]
```

## Member Properties
These properties will be on each party member Object.

##### `playerName`
- _String_
- Name of player.

##### `playerDPS`
- _Number_
- DPS recorded at the end of the encounter.

##### `playerClass`
- _String_
- Class of Player.

##### `playerTotalDamage`
- _Number_
- Total damage by player, as determined by skill log.

##### `playerTotalDamagePercent`
- _Number %_
- % of total damage done by player.

##### `playerTotalDamagePercent`
- _Number %_
- Average crit rate across all skills.

##### `skillLog`
- _Array of Objects_
- An array containing Objects that represent the skills used in the log.

##### `buffsUptime`
- _Object_
- Each property represents a consumable whether it was used or not, value of true/false.
- Example:
```
{
energyStars: '90%',
titanicWrath: '40%',
guardianShout: '20%'
}
```

##### `consumables`
- _Object_
- Each property represents a consumable whether it was used or not, value of true/false.

## Skill Log Properties
These properties will be on each skillLog Object.

##### `skillName` (Maybe skillId? For multi-lingual purposes)
- if skillName: _String_
- if skillId: _Number_
- Name/ID of Skill.

##### `skillHits`
- _Number_
- Number of successful hits.

##### `skillTotalDamage`
- _Number_
- Total damage dealt by skill.

##### `skillCritRate`
- _Number %_
- Overall % Crit Rate of skill.

##### `skillDamagePercent`
- _Number %_
- % of total damage.

##### `skillHighestCrit`
- _Number_
- Highest crit.

##### `skillLowestCrit`
- _Number_
- Lowest crit.

##### `skillAverageCrit`
- _Number_
- Average crit.

##### `skillAverageWhite`
- _Number_
- Average white.


## Consumables Properties

##### `charm`
- _Boolean_
- Charms

##### `scroll`
- _Boolean_
- Scroll

##### `nostrum`
- _Boolean_
- Nostrum

##### `bravery`
- _Boolean_
- Bravery Potion

##### `canephora`
- _Boolean_
- Canephora Potion

##### `partyFood`
- _Boolean_
- Party-wide Food (Gold food)

##### `lamb`
- _Boolean_
- Lamb Bulgogi

##### `noctenium`
- _Boolean_
- Noctenium Infusion

##### `heavensElixir`
- _Boolean_
- Heaven's Elixir
