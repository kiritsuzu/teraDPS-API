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

Below is a list of the properties that are currently recognized:

## Main properties (required)

##### `name`
- _String_
- Character's name.

##### `clas`
- _String_
- Character's class. (ex. Berserker, Slayer, Lancer)

##### `boss`
- _String_
- Boss of the encounter. (ex. Hrathgol, Shandra Manaya, Nightmare Desolarus)

##### `server`
- _String_
- Character's server. (ex. Mount Tyrannas, Tempest Reach)

##### `number`
- _Number_
- Final encounter DPS.

## Support Classes

##### `supLan`
- _Boolean_
- Lancer support was present?

##### `supBraw`
- _Boolean_
- Brawler support was present?

##### `supWar`
- _Boolean_
- Warrior support was present?

##### `supArch`
- _Boolean_
- Archer support was present?

##### `supPri`
- _Boolean_
- Priest support was present?

##### `supMys`
- _Boolean_
- Mystic support was present?

## Consumables

##### `charm`
- _Boolean_
- Charms

##### `scroll`
- _Boolean_
- Scroll

##### `nostrum`
- _Boolean_
- Nostrum

##### `brave`
- _Boolean_
- Bravery Potion / Canephora Potion

##### `partyFood`
- _Boolean_
- Party-wide Food (Gold food)

##### `lamb`
- _Boolean_
- Lamb Bulgogi

##### `noc`
- _Boolean_
- Noctenium Infusion

##### `heaven`
- _Boolean_
- Heaven's Elixir
