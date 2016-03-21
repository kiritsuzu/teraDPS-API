# TeraDPS API How-to
An explanation on how to use the api for TeraDPS to send meter information to the webserver at teradps.io

# Step 1: Create an account.
First, you need to create an account on the TeraDPS. You can do this by either creating an account on the website (teradps.io) or by sending a POST request to teradps.io/api/users endpoint with 'email' and 'password' fields.

# Step 2: Login & get your Auth Token & userId.
Login to the site by sending a POST to teradps.io/api/login with 'email' and 'password'. Upon successful login, your respond will include 'authToken' and 'userId' keys. The values of these keys will be used when submitting encounters.

# Step 3: Submit encounter through the API.
API Link: teradps.io/api/que

Send a POST request to the API with a JSON object including information on your encounter. Below is a list of the current properties that are recognized:
