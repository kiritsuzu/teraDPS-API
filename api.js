if (Meteor.isServer) {

  // var checkTotalDamageOnBossHp = function(record) {
  //   var totalDamage = 0;
  //
  //   for (var i = 0; i < record.members.length; i++) {
  //     totalDamage + record.members[i].playerTotalDamage;
  //   }
  //
  //   if ((record.bossHp - totalDamage) > 10000000) {
  //     return false;
  //   }
  //
  //   return true;
  // };

  var checkServer = function(teraServer) {
    var input = teraServer;
    switch (input) {
      case 'Mount Tyrannas':
      case 'Valley Of Titans':
      case 'Lake Of Tears':
      case 'Tempest Reach':
      case 'Celestial Hills':
      case 'Ascension Valley':
      case 'Highwatch':
        return true;
        break;
      case 'Killian':
      case 'Fraya':
      case 'Hasmina':
      case 'Elinu':
      case 'Icaruna':
      case 'Veritas':
      case 'Akasha':
      case 'Arcadia':
      case 'Kaidun':
        return true;
        break;
      case 'Арун':
      case 'Кайатор':
      case 'Арборея':
      case 'Лоркада':
      case 'Балдера':
      case 'Эссения':
        return true;
        break;
      default:
        return false;
        break;
    }
  }

  var checkEuConsumables = function(input) {
    switch (true) {

      //  case input === 7777015: Combat Accelerator
      // EU and RU consumables
      case input < 47:
      case input === 16300013:
      case input === 4833:
      case input === 14400001:
      case input === 14400002:
      case input === 14400003:
        return false;
        break;
      default:
        return true;
        break;
    }
  };

  var checkValidBoss = function(boss) {
    switch (true) {

      // FINM
      // case boss === '459.1001':
      //   return true;
      //   break;
      // case boss === '459.1002':
      //   return true;
      //   break;
      // case boss === '459.1003':
      //   return true;
      //   break;

        // FIHM
      case boss === '759.1001':
        return true;
        break;
      case boss === '759.1002':
        return true;
        break;
      case boss === '759.1003':
        return true;
        break;

        // DS + Kelsaik
      case boss === '886.88518':
        return true;
        break;
      case boss === '885.88514':
        return true;
        break;
      case boss === '886.88517':
        return true;
        break;
      case boss === '886.88516':
        return true;
        break;
      case boss === '886.88519':
        return true;
        break;
      case boss === '886.88601':
        return true;
        break;
      case boss === '886.88602':
        return true;
        break;
      case boss === '886.885200':
        return true;
        break;
      default:
        return false;
        break;
    }
  };

  // Global API configuration
  var Api = new Restivus({
    useDefaultAuth: true,
    prettyJson: true
  });

  Api.addRoute('que', {
    authRequired: false
  }, {
    post: function() {

        var playerArray = [];

        this.bodyParams.partyComp = '';
        this.bodyParams.playerNames = '';
        this.bodyParams.playerServers = '';
        this.bodyParams.trueCreatedOn = moment().format('MMMM Do YYYY, h:mm:ss a');

        for (var i = 0; i < this.bodyParams.members.length; i++) {
          this.bodyParams.partyComp += this.bodyParams.members[i].playerClass;
          this.bodyParams.playerServers += this.bodyParams.members[i].playerServer;

          if (checkServer(this.bodyParams.members[i].playerServer) === false) {
            return {
              status: "failed",
              message: "Sorry, it seems your server isn't supported."
            };
          }

          playerArray.push(this.bodyParams.members[i].playerName);
        }

        var sorted = playerArray.sort();
        this.bodyParams.playerNames = sorted.join();

        this.bodyParams.bossId = this.bodyParams.areaId + '.' + this.bodyParams.bossId;

        this.bodyParams.date = new Date();

        var lastSubmittedRankingTime = PartyRankings.findOne({
          bossId: this.bodyParams.bossId,
          playerNames: this.bodyParams.playerNames
        }, {
          sort: {
            $natural: -1
          }
        });

        if (lastSubmittedRankingTime !== undefined) {
          var now = this.bodyParams.date.getTime();
          var then = lastSubmittedRankingTime.date.getTime();
          var difference = now - then;
        }

        if (difference < 180000 || now === then) {
          return {
            status: "failed",
            message: "Sorry, it seems someone from your party already submitted your encounter. Last submitted encounter returned.",
            id: lastSubmittedRankingTime._id
          };
          this.done();
        }

        if (parseInt(this.bodyParams.fightDuration) < 30) {
          return {
            status: "failed",
            message: "Sorry, your fight took too little time."
          };
          this.done();
        }

        if (this.bodyParams.members.length > 5) {
          return {
            status: "failed",
            message: "Sorry, you have more than a full party in your encounter."
          };
          this.done();
        }

        if (checkValidBoss(this.bodyParams.bossId) === true) {

          var record = this.bodyParams;
          record.owner = this.request.headers['x-user-id'];
          record.partyDps = parseInt(record.partyDps);

          if (record.partyDps < 2000000) {
            return {
              status: "failed",
              message: "Sorry, your party's DPS was too low, only encounters with at least 1,000,000 party DPS are allowed."
            };
            this.done();
          }

          for (var k = 0; k < record.members.length; k++) {
            for (var j = 0; j < record.members[k].skillLog.length; j++) {
              record.members[k].skillLog[j].skillTotalDamage = parseInt(record.members[k].skillLog[j].skillTotalDamage);
            }

            for (var l = 0; l < record.members[k].buffUptime.length; l++) {
              if (checkEuConsumables(parseInt(record.members[k].buffUptime[l].Key)) === false) {
                return {
                  status: "failed",
                  message: "Sorry, no crazy consumables allowed.",
                };
                this.done();
              }
            }

            record.members[k].playerDps = parseInt(record.members[k].playerDps);
          }

          var partyId = PartyRankings.insert(record, function(err, data) {
            if (err) {
              console.log('ERROR', err);
            } else {
              return true;
            }
          });

          for (var z = 0; z < this.bodyParams.members.length; z++) {

            if (this.bodyParams.members[z].playerClass === "Priest" || this.bodyParams.members[z].playerClass === "Mystic") {
              continue;
            }

            var solo = {
              mainPlayer: this.bodyParams.members[z].playerName,
              mainClass: this.bodyParams.members[z].playerClass,
              mainDps: parseInt(this.bodyParams.members[z].playerDps),
              mainServer: this.bodyParams.members[z].playerServer,
              bossId: this.bodyParams.bossId,
              trueCreatedOn: this.bodyParams.trueCreatedOn,
              encId: partyId
            };

            ModRankings.insert(solo, function(err, data) {
              if (err) {
                console.log('ERROR', err);
              } else {
                return true;
              }
            });
          }

          return {
            status: "success",
            message: "Successfully added!",
            id: partyId
          };
        } else {
          return {
            status: "failed",
            message: "Your record was rejected because the boss isn't supported."
          }
        }

      } // post function close
  }); // rest function close

  // Generates: GET, POST on /api/items and GET, PUT, DELETE on
  // /api/items/:id for the Items collection
  // Api.addCollection(ModRankings, {
  //   excludedEndpoints: ['delete']
  // });

  // Generates: POST on /api/users and GET, DELETE /api/users/:id for
  // Meteor.users collection
  Api.addCollection(Meteor.users, {
    excludedEndpoints: ['getAll', 'put'],
    routeOptions: {
      authRequired: true
    },
    endpoints: {
      post: {
        authRequired: false
      },
      delete: {
        roleRequired: 'admin'
      }
    }
  });
}
