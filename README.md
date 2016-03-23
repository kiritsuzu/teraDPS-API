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
  server: String,
  fightDuration: Number,
  debuffUptime: [
    {skillId: Percent String}
  ],
  members: [
    {
      playerName: String,
      playerDPS: Number,
      playerClass: String,
      playerTotalDamage: Number,
      playerTotalDamagePercent: Percent String,
      playerAverageCritRate: Percent String,
      playerDeaths: Number,
      skillLog: [
        {
          skillId: Number,
          skillHits: Number,
          skillTotalDamage: Number,
          skillCritRate: Percent String,
          skillDamagePercent: Percent String,
          skillHighestCrit: Number,
          skillLowestCrit: Number,
          skillAverageCrit: Number,
          skillAverageWhite: Number
        }
      ],
      buffUptime: [
        {buffId: Percent String}
      ]
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

##### `fightDuration`
- _Number_
- Duration of the encounter (measured in seconds?).

##### `server`
- _String_
- The name of the server in which the encounter took place.

##### `debuffUptime`
- _Array of Objects_
- Each object represents a debuff (by SkillId) and it's respective uptime in %.

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

##### `playerDeaths`
- _Number_
- Number of times player died in the encounter.

##### `skillLog`
- _Array of Objects_
- An array containing Objects that represent the skills used in the log.

##### `buffUptime`
- _Array of Objects_
- Each object represents a buff, debuff, or consumable (by Id) and it's respective uptime in %.

## Skill Log Properties
These properties will be on each skillLog Object.

##### `skillId`
- if skillId: _Number_
- ID of Skill.

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
