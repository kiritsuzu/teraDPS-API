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

  var checkValidBoss = function(boss) {
    switch (true) {

      // FINM
      case boss === '459.1001':
        return true;
        break;
      case boss === '459.1002':
        return true;
        break;
      case boss === '459.1003':
        return true;
        break;

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


  // TeraDPS API
  Api.addRoute('que', {
    authRequired: false
  }, {
    post: function() {
      var records = {};
      this.bodyParams.bossId = JSON.stringify(this.bodyParams.bossId);
      this.bodyParams.areaId = JSON.stringify(this.bodyParams.areaId);

      this.bodyParams.bossId = this.bodyParams.areaId + '.' + this.bodyParams.bossId;

      var lastSubmittedRankingTime = ModRankings.findOne({
        bossId: this.bodyParams.bossId,
        members: this.bodyParams.members
      }, {
        sort: {
          $natural: -1
        }
      });

      if (lastSubmittedRankingTime !== undefined) {
        var mom = moment().format('MMMM Do YYYY, h:mm:ss a');
        var now = moment(mom, 'MMMM Do YYYY, h:mm:ss a');
        var then = moment(lastSubmittedRankingTime.trueCreatedOn, 'MMMM Do YYYY, h:mm:ss a');
        var difference = now.diff(then, 'seconds');

        if (difference < 180) {
          this.response.write('Sorry, it seems someone from your party already submitted your encounter.');
          this.done();
          return false;
        }
      }

      if (checkValidBoss(this.bodyParams.bossId) === true) {

        var record = this.bodyParams;
        record.healers = '';

        for (var i = 0; i < this.bodyParams.members.length; i++) {
          if (this.bodyParams.members[i].playerClass === "Priest" || this.bodyParams.members[i].playerClass === "Mystic") {
            record.healers += this.bodyParams.members[i].playerName;
          }
        }
        // Here we seperate the encounter into member specific encounters for personalized sorting on frontend.

        for (var i = 0; i < this.bodyParams.members.length; i++) {

          if (this.bodyParams.members[i].playerClass === "Priest" || this.bodyParams.members[i].playerClass === "Mystic") {
            continue;
          }

          record.owner = this.request.headers['x-user-id'];
          record.mainPlayer = this.bodyParams.members[i].playerName;
          record.mainClass = this.bodyParams.members[i].playerClass;
          record.mainDps = this.bodyParams.members[i].playerDps;
          record.mainServer = this.bodyParams.members[i].playerServer;

          // Store their location in the members array so we can reference them outside the accordion on frontend.
          record.mainIndex = i;

          // Created On for Public Display.
          record.createdOn = moment().format('MMMM D, YYYY');

          // Created On for table sorting by submit date.
          record.trueCreatedOn = moment().format('MMMM Do YYYY, h:mm:ss a');

          var recordId = ModRankings.insert(record, function(err, data) {
            if (err) {
              console.log('ERROR', err);
            } else {
              return true;
            }
          });

          records.status = 'success';
          records[record.mainPlayer] = recordId;


        }

        var partyRecord = this.bodyParams;
        partyRecord.partyComp = '';
        partyRecord.playerNames = '';

        for (var i = 0; i < this.bodyParams.members.length; i++) {
          partyRecord.partyComp += this.bodyParams.members[i].playerClass;
          partyRecord.playerNames += this.bodyParams.members[i].playerName;
        }

        var partyRecordId = PartyRankings.insert(partyRecord, function(err, data) {
          if (err) {
            console.log('ERROR', err);
          } else {
            return true;
          }
        });

        return records;
      } else {
        return {
          status: "failed",
          message: "Your record was rejected because the boss isn't supported."
        }
      }
    }
  });

  // Fallback for debugging db.
  // Api.addCollection(ModRankings, {
  //   excludedEndpoints: ['delete']
  // });

  // Generates: POST on /api/users
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
