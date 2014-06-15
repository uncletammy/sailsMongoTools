var _ = require('lodash');
var fs = require('fs');
var async = require('async');
var fse = require('fs-extra');
var natural = require('natural');



// module.exports = function associateUsersWithMessages(theMap){
// 	var l = theMap;
// 	var doAssociation = function(k){

// 			var nowSave = function(err,u){
// 				if (err) return console.log('err with ',k);
// 				var messagesToSave = l[k];
// 				if (u.messages){
// 					console.log('adding',messagesToSave,'to user',u.lcnick);
// 					// u.messages.add(messagesToSave);

// 					var doIt = _.each(messagesToSave,u.messages.add);

// 					u.save(function(e,dun){
// 						if (e) return console.log('err saving added messages',e);
// 						console.log('Added and saved:',doIt,'\n\n')
// 					});
// 				}
// 			};

// 		User.findOneById(k).exec(nowSave)
// 	}
// 	for (var k in l)
// 		doAssociation(k);
// }


// t.saveJSON('irc_users_formatted',t.parseFile('.json'));
// 

// t.saveJSON('allUniqueObjects',t.findImposter(t.parseFile('messageOnServer.json'),['text','sender']))
// t.saveJSON('delete_these_messages',t.findImposter(t.parseFile('messageOnServer.json'),'text'))
// t.parseFile('delete_these_messages.json')
// t.saveJSON('allUniqueObjects',t.findImposter(t.parseFile('messageOnServer.json'),['text','sender']))

// t.getRecords('message',[],function(records){t.saveJSON('messageOnServer_part2',records)});

// t.addMessages(t.mapMessages(this.parseFile('/home/dude/node/scripts/getSailsAggregatorData/roundTwo/final__chatMessages_exported.json'));
// t.addMessages(t.parseFile('/home/dude/node/scripts/getSailsAggregatorData/roundTwo/final__chatMessages_exported.json'));

// t.saveJSON('messagesNeedAssociations',t.doThatThing())

// t.makeAssociationMap(t.parseFile('messagesNeedAssociations.json'),'grams',t.parseFile('gramsOnServer.json'))


// module.exports={
var t = {
	hold:{},
	errors:[],
	doThatThing: function(){
		var t = this;
		var getAllMessages = t.parseFile('messageOnServer.json');
		var getTheAccused = t.parseFile('delete_these_messages.json');
		var getRealImposters = t.parseFile('imposterIDS_roundTwo.json');
		var getAllMessageIDs = _.pluck(getAllMessages,'id');

		var getFalselyAccused = _.difference(getTheAccused,getRealImposters);
		var messagesNeedAssociations = _.difference(getAllMessageIDs,getRealImposters);
		console.log('Messages that need associations:',messagesNeedAssociations.length)
		// var reCreateMessages = _.map(_.unique(getFalselyAccused),function(oneDeadMessageID){
		// 	return _.find(getAllMessages,{id:oneDeadMessageID})
		// });
		console.log('Total messages',getAllMessageIDs.length);
		// console.log('Number of Accused',getTheAccused.length);
		console.log('Actual Imposters',getRealImposters.length);
		// console.log('There are',getFalselyAccused.length,'messages that were falsely deleted and should be recreated.','\n','Creating',reCreateMessages.length);
		// t.addMessages(reCreateMessages);

		return getFalselyAccused
	},
	// t=require('../roundTwo/tools.js');t.saveJSON('tested_messageGramMap',t.makeAssociationMap(t.parseFile('messagesNeedAssociations_test.json'),'grams',t.parseFile('grams_on_server.json')))
	makeAssociationMap: function(collectionNameToAssociate){
				var t = this;

				var existingCollection = t.parseFile('grams_on_server.json');
				var allMessagesOnServer = t.parseFile('messageOnServer.json');
				var arrayOfModels = _.map(t.parseFile('messagesNeedAssociations_test.json'),function(oneMsgId){
					return _.find(allMessagesOnServer,{id:oneMsgId})
				});

		var mappedModels = _.map(arrayOfModels,function(oneRecord){
				// console.log('on',oneRecord)
			var customMap = function(){
	            var theseAssociations = {create:[],update:[]};
	            var ignoreWords = ['true','false','null','undefined'];
                var getMessageWords = oneRecord.text.toLowerCase().replace(/[^\w ]/ig,'').replace(/[ÁÉÍÓÚáéíóuñÑ]/ig,'').replace(/ {2,}/,'').split(' ');
                var allMessageWords = _.unique(_.filter(getMessageWords,function(thisWord){
                    if (thisWord.length>1);// Is this smart?  Only time will tell.
                        return thisWord
                }));

                var NGrams = natural.NGrams;
                var unoGrams = NGrams.ngrams(allMessageWords, 1);
                var biGrams = NGrams.bigrams(allMessageWords);
                var triGrams = NGrams.trigrams(allMessageWords);

                var processTheseGrams = _.unique(biGrams.concat(unoGrams,triGrams));


				var filteredArrays = _.map(processTheseGrams,function(oneGramArray){
					var joinedValue = oneGramArray.join('');
					if (joinedValue.length > 0){
					// console.log('Filtering array:',oneGramArray,'to',joinedValue)
					return joinedValue;
					}
				});

                var existingGrams = _.pluck(existingCollection,'name');

                var updateTheseGrams = _.unique(_.intersection(existingGrams,filteredArrays));

                _.each(updateTheseGrams,function(oneExistingGram){
                	return theseAssociations.update.push(_.find(existingCollection,{name:oneExistingGram}).name)
                });

                var gramsForCreation = _.unique(_.difference(filteredArrays,existingGrams.concat(ignoreWords)));

                _.each(gramsForCreation,function(oneGramName){
                	return theseAssociations.create.push({name:oneGramName})
                });

				return theseAssociations;
			};

			oneRecord[collectionNameToAssociate] = customMap();

			return oneRecord
		})


		return mappedModels;

	},
/*
  {
    "sender": "rwoverdijk",
    "channel": "5398d161bc9477dd23c6ae5e",
    "text": "iksik, Love yoouu",
    "createdAt": "2014-01-29T12:58:17.117Z",
    "updatedAt": "2014-06-12T05:57:25.756Z",
    "id": "53994145190ba9b928bb9d11",
    "grams":["iksikloveyouu","loveyouu","iksiklove","iksik"]
  }

// 539a2786c32ceb383320d7df
// t=require('../roundTwo/tools.js');t.doSeriesUpdate('message','id',t.makeAssociationMap('grams'),'grams')

*/

	// Output the join table for links - link_postedin__message_links


	mapUserMentions: function(){
		var messages = t.messages;
		var allMentions = [];
		var users = _.filter(t.users,function(oneUser){
			if (oneUser.lcnick.length>2)
				return oneUser
		});

        _.each(messages,function(oneMessage){

            var messageWords = oneMessage.text.toLowerCase().replace(/[^\w ]/ig,'').replace(/ {2,}/,'').split(' ');

        	_.each(users,function(oneUser){


        		if (_.contains(messageWords,oneUser.lcnick)){
					var anObject = {
						"message_usermentions" : oneMessage["_id"]["$oid"],
						"user_mentionedin" : oneUser.lcnick
					}

					allMentions.push(anObject);
        		}

        	})

        });

        allMentions = _.unique(allMentions);

		console.log('There are',allMentions.length,'userMentions in',messages.length,'messages');

		t.saveJSON('message_usermentions__user_mentionedin',allMentions);
		return true;
	},
	mapLinks: function(){
		var t=this;
		// {messageID:['linkId1','linkID2']}


		var postedIn = [];
		var postedBy = [];

		var links = t.links;
		var messages = t.messages;
		// var users = t.users;

        _.each(messages,function(oneMessage){

			var linksFound = _.unique(oneMessage.text.match(/(https{0,1}:\/\/[:?=#!.\w\d\/_-]+)/ig));
        	var senderName = oneMessage.sender.toLowerCase().replace(/[\W_]/ig,'')

        	_.each(links,function(oneLink){

        		if (_.contains(linksFound,oneLink.linktext)){
        			_.each(linksFound,function(thisLink){
						var link_postedIn = {
							"link_postedin" : oneLink["_id"]["$oid"],
							"message_links" : oneMessage["_id"]["$oid"]
						}
						postedIn.push(link_postedIn);

						var link_postedBy = {
							"link_postedby" : oneLink["_id"]["$oid"],
							"user_links" : oneMessage.sender
						}
						postedBy.push(link_postedBy);
        				
        			})

        		}

        	})

        });

		console.log('There are',postedIn.length,'links posted in',messages.length,'messages');
		t.saveJSON('link_postedin__message_links',postedIn);
		t.saveJSON('link_postedby__user_links',postedBy);
		return true;
	},
	getGrams: function(){
		var t=this;

		var allGrams =[];
        var NGrams = natural.NGrams;
		var allMessages = _.unique(_.pluck(t.messages,'text'));
		console.log('There are',allMessages.length,'unique messages among',t.messages.length);
		_.each(allMessages, function(oneMessage){
            var getMessageWords = oneMessage.toLowerCase().replace(/[^\w ]/ig,'').replace(/ {2,}/,'').split(' ');
            var allMessageWords = _.unique(_.filter(getMessageWords,function(thisWord){
                if (thisWord.length>1);// Is this smart?  Only time will tell.
                    return thisWord
            }));

            var unoGrams = NGrams.ngrams(allMessageWords, 1);
            var biGrams = NGrams.bigrams(allMessageWords);
            var triGrams = NGrams.trigrams(allMessageWords);

            var processTheseGrams = biGrams.concat(unoGrams,triGrams);

			var filteredArrays = _.map(processTheseGrams,function(oneGramArray){
				var joinedValue = oneGramArray.join('');
				if (joinedValue.length > 0){
					return joinedValue;
				}
			});

			allGrams = allGrams.concat(filteredArrays);

		});

		var uniqueGrams = _.unique(allGrams);

		console.log('There are',uniqueGrams.length,'unique Grams among',allGrams.length);

		var mapped = _.map(uniqueGrams,function(oneGramArray){
			return {name:oneGramArray}
		});


		// console.log('Returning',allGrams.length)
		t.saveJSON('AllGramsEver',mapped);
		return true;
	},
	mapGrams2: function(fileNameWithMessages){
		var t=this;
		var daGrams = t.grams;
		var allGrams =[];
		var saveToTable = [];
		var theseMessages = t.parseFile(fileNameWithMessages);
        var NGrams = natural.NGrams;
		// var allMessages = _.unique(_.pluck(theseMessages,'text'));
		console.log('Now processing',theseMessages.length,'messages and saving to',fileNameWithMessages);
		_.each(theseMessages, function(oneMessage){
            var getMessageWords = oneMessage.text.toLowerCase().replace(/[^\w ]/ig,'').replace(/ {2,}/,'').split(' ');
            var allMessageWords = _.unique(_.filter(getMessageWords,function(thisWord){
                if (thisWord.length>1);// Is this smart?  Only time will tell.
                    return thisWord
            }));

            var unoGrams = NGrams.ngrams(allMessageWords, 1);
            var biGrams = NGrams.bigrams(allMessageWords);
            var triGrams = NGrams.trigrams(allMessageWords);

            var processTheseGrams = biGrams.concat(unoGrams,triGrams);

			var filteredArrays = _.map(processTheseGrams,function(oneGramArray){
				var joinedValue = oneGramArray.join('');
				if (joinedValue.length > 0){
					return joinedValue+':'+oneMessage["_id"]["$oid"];
				}
			});

			allGrams = allGrams.concat(filteredArrays);

		});

		// var uniqueGrams = _.unique(allGrams);
		var uniqueGrams = allGrams;

		console.log('There are',uniqueGrams.length,'Grams among',theseMessages.length);

		var mapped = _.map(uniqueGrams,function(oneGramArray){
			var seperateGramAndId = oneGramArray.split(':');
			var anItem = {
				"gram_inmessage" : _.find(daGrams,{name:seperateGramAndId[0]})["_id"]["$oid"],
				"message_grams" : seperateGramAndId[1]
			};
			return anItem;
			// inMessage.push(anItem);
// {name:oneGramArray}
		});


		// console.log('Returning',allGrams.length)
		console.log('There are',mapped.length,'grams in all',theseMessages.length,'messages');
		t.saveJSON('gram_inmessage____'+fileNameWithMessages,mapped);
		return true;
	},
	mapGrams: function(fileNameWithMessages){
		var t=this;
// gram_inmessage__message_grams
		var counter = 0;
		var inMessage = [];
		var allGrams = t.grams;

		var theMessages = t.parseFile(fileNameWithMessages);

		var messagesWithIDs = _.map(theMessages,function(oneMessage){
			var msgIdObj = {
				msgText: oneMessage.text.toLowerCase().replace(/[^\w ]/ig,'').replace(/ {2,}/,'').split(' '),
				messageID: oneMessage["_id"]["$oid"]
			}
			return msgIdObj;
		});

		console.log('There are',allGrams.length,'unique grams and',theMessages.length,'messages to look through.');

		_.each(allGrams, function(oneGram){

			counter++;
			if ((counter/1000).toString().indexOf('.')<0){
				var percentageDone = counter/405371;
				console.log(counter,'out of 405371 - ',percentageDone,'% finished');
			}

// t.mapGrams('msgSplit0.json')
			_.each(messagesWithIDs,function(oneMessageID){

				// console.log('oneMessageID.msgText is of type',typeof oneMessageID.msgText,'and length',oneMessageID.msgText.length);
				// return fart;
				_.each(oneMessageID.msgText,function(checkThisWord){

					if (oneGram === checkThisWord){
						var anItem = {
							"gram_inmessage" : oneGram["_id"]["$oid"],
							"message_grams" : oneMessageID.messageID
						};
						inMessage.push(anItem);
					}
					
				})

			})
		});


		console.log('There are',inMessage.length,'grams in all',theMessages.length,'messages');
		t.saveJSON('gram_inmessage____'+fileNameWithMessages,inMessage);

	},
	getLinks: function(){
		var t=this;

		var allLinks =[];
		var allMessages = _.unique(_.pluck(t.messages,'text'));
		console.log('There are',allMessages.length,'unique messages among',t.messages.length);
		_.each(t.messages, function(oneMessage){
            // var getMessageWords = oneMessage.text.toLowerCase().replace(/[^\w ]/ig,'').replace(/[ÁÉÍÓÚáéíóuñÑ]/ig,'').replace(/ {2,}/,'').split(' ');
            // var allMessageWords = _.unique(_.filter(getMessageWords,function(thisWord){
            //     if (thisWord.length>1);// Is this smart?  Only time will tell.
            //         return thisWord
            // }));
			var linksFound = _.unique(oneMessage.text.match(/(https{0,1}:\/\/[:?=#!.\w\d\/_-]+)/ig));

            if (linksFound.length)
            	allLinks = allLinks.concat(linksFound);
		});

		var uniqueLinks = _.unique(allLinks);

        var mappedLinks = _.map(uniqueLinks,function(oneLink){
                  var indexOfLinkStart = oneLink.indexOf('://');
                  // Chop off protocol and split at '/'
                  var splitLinkPath = oneLink.split(/https{0,1}:\/\//i)[1].split('/');
                  if (splitLinkPath.length)
                      getLinkDomain = splitLinkPath[0];
                  else
                      getLinkDomain = splitLinkPath.join('');

                  // console.log('Link Domain:',getLinkDomain)
                  var modifiedLink = {
                      linktext:oneLink,
                      domain:getLinkDomain
                  };      
                  return modifiedLink
        });


		console.log('There are',uniqueLinks.length,'unique links and',(allLinks.length-uniqueLinks.length),'reposts');
		console.log('Returning',mappedLinks.length)
		return mappedLinks;
	},
	findImposter: function(someCollection,determineByKeys){


		var returnTheseImposterIds = [];

		// var findUniqueKeys = _.unique(_.pluck(someCollection,determineByKey));

		var makeDeterministicObjects = _.map(someCollection,function(oneCollectionItem){
			var determineByObject = {};

			_.each(determineByKeys,function(thisDeterministicKey){
				determineByObject[thisDeterministicKey] = oneCollectionItem[thisDeterministicKey];
				return;
			})
			return JSON.stringify(determineByObject);
		});
		var getUniqueObjects = _.map(_.unique(makeDeterministicObjects),JSON.parse);

		console.log('There are',getUniqueObjects.length,'items with matching',determineByKeys,'and are of type:',typeof getUniqueObjects[0])
		// return getUniqueObjects;

		// Get all objects which share deterministic values with each other.
		// Sort them by date.  Save the first and store the ids of the others
		// so they can be destroyed.
		_.each(getUniqueObjects,function(oneUniqueObject){
			var findEveryone = _.where(someCollection,oneUniqueObject);

			var sortThem = _.sortBy(findEveryone, function(someone){ return new Date(someone.updatedAt)});

			if (sortThem.length === 1){
				// console.log('Unique Message.  Exiting');
				return
			}
			sortThem.shift();
			returnTheseImposterIds = returnTheseImposterIds.concat(_.pluck(sortThem,'_id')["$oid"]);
		})
		console.log('Found',returnTheseImposterIds.length,'imposters among',someCollection.length);
		return returnTheseImposterIds;
	},
	getRecords: function(modelName,populateThese,callback){
		var whichModel = sails.models[modelName].find();

		_.each(populateThese,function(thisAssociation){
			whichModel = whichModel.populate(thisAssociation);
			return true;
		})
		var whenReturned = function(err,records){
			if (err){
				console.log('Error getting model',modelName,':',err);
				return callback();
			} else {
				console.log('Found records for model',modelName,'!  Populated associations:',populateThese);
				return callback(records);			
			}

		}

		whichModel = whichModel.exec(whenReturned);

	},
	saveJSON: function(filename,someJSON){
		console.log('Saving someJSON in',filename,'.json')
		var saveStatus = fse.outputJsonSync(process.cwd()+'/'+filename+'.json', someJSON);

		return saveStatus;
	},
	addMessages: function(createThese){

			// var messageRecordNames = _.pluck(messageRecords,'nick');
			// var maybeCreateThese = _.pluck(arrayOfmessages,'nick');
			// var createThese = _.difference(maybeCreateThese,messageRecordNames);
			// console.log('messages in db:',messageRecordNames.length);
			// console.log('messages in oldData:',maybeCreateThese.length);
			console.log('messages that need creation:',createThese.length);
			Message.createEach(createThese,function(err,deets){
				if (err) return console.log('Message Create Error:',err);
				console.log('Created message with id:',deets.id);
			})
	},
	feedWaterline: function(){
		var allErrors = [];

		// var allChatMessages = this.mapMessages(this.parseFile('/home/dude/node/scripts/getSailsAggregatorData/roundTwo/final__chatMessages_exported.json'));
		var allChatMessages = this.mapMessages(this.parseFile('/home/dude/node/scripts/getSailsAggregatorData/roundTwo/final__chatMessages_exported.json'));
		console.log('Message Length:',allChatMessages.length);

		// var testData = [{"sender": "thread","text": "yeah, sails allows you to do that","channel": "53953648d222370a1ee3cb1f","date": "2014-01-25T04:50:14.056Z"},{"sender": "HariHaraSudhan","text": "is this the way its been done, or is there any improvement after this. http://stackoverflow.com/questions/18246681/sails-js-authorization-for-socket-requests","channel": "53953648d222370a1ee3cb1f","date": "2014-01-25T04:54:18.203Z"},{"sender": "HariHaraSudhan","text": "i meant the first answer http://stackoverflow.com/a/18292053/796094","channel": "53953648d222370a1ee3cb1f","date": "2014-01-25T04:55:21.305Z"},{"sender": "robdubya","text": "HariHaraSudhan its probably easier to explain what you're trying to do","channel": "53953648d222370a1ee3cb1f","date": "2014-01-25T05:14:06.956Z"},{"sender": "robdubya","text": "broadly, i mean","channel": "53953648d222370a1ee3cb1f","date": "2014-01-25T05:14:11.886Z"},{"sender": "HariHaraSudhan","text": "i should allow the user to edit only his data and should not allow him to delete his data in the collection and view only his data.","channel": "53953648d222370a1ee3cb1f","date": "2014-01-25T05:17:06.269Z"}];
			async.forEachSeries(allChatMessages, function(oneMessage,cb){

					Message.create(oneMessage,function(err,deets){
						if (err) console.log('Message Create Error:',err);
						// console.log(deets)
						return cb(null)
					})
			})
	},
	'_': require('lodash'),

	mapMessages: function(messageArray){
		var lastDate = null;
		var oldMessages = t.parseFile('oldMessagesOnServer.json');
		return _.map(messageArray, function(msgObj) {

			if (_.isUndefined(msgObj.sender))
				msgObj.sender = _.find(oldMessages,{text:msgObj.text}).sender;

			if (_.isUndefined(msgObj.createdAt)){
				// console.log('cant find message with details:',msgObj);
				try {
					msgObj.createdAt = _.find(oldMessages,{text:msgObj.text}).createdAt;
				} catch(nope){
					msgObj.createdAt = lastDate;
				}
			}

			lastDate = msgObj.createdAt;


			var message = {
				sender: msgObj.sender.toLowerCase().replace(/[\W_]/ig,''),
				text: msgObj.text,
				channel:'5398d161bc9477dd23c6ae5e',
				createdAt: new Date(msgObj.createdAt["$date"]),
				id: msgObj["_id"]["$oid"]
			};

			return message
		});
	},
	mapUsers: function(userArray){
		return _.map(userArray, function(userObj) {
			var user = {
				nick:userObj.nick,
				lcnick:userObj.nick.toLowerCase().replace(/[\W_]/ig,'')
			};
			return user
		});
			console.log('userArray.length',userArray.length)

	},
	parseFile: function(fileName){
		try {

			var file = fs.readFileSync(fileName,'utf-8');
			return JSON.parse(file);
			// file = f.replace(/\n/ig,',\n');

			// file = f.replace(/ \} \},\{/ig,' } }\n{ ');//.replace(/ \} \}\n\{/ig,'ENDOFSHITBALLSFUCK').replace(/\n/ig,'').replace(/ENDOFSHITBALLSFUCK/ig,'}}\n');
		} catch(byah){
			console.log('Error converting mongooutput file to object:',byah)
			return false;
		}
	},
	pretty: function(fileName){
		t.saveJSON(fileName,t.parseFile(fileName+'.json'));
		console.log(fileName,'.json is now pretty and readable in sublime');
		return;
	},
	splitToFiles: function(oneBigArray,splitByQty,fileNamePrefix){
		console.log('Splitting',oneBigArray.length,'into',splitByQty,'files');
		var numOfCompleteFiles = oneBigArray.length/splitByQty;
		var grabTheseObjects = oneBigArray;
		var fileNames = [];
		var turnToNumber = Math.floor(numOfCompleteFiles);
		while(turnToNumber>0){
			fileNames.push({saveAs:fileNamePrefix+turnToNumber,vals:grabTheseObjects.splice(0,splitByQty+1)})
			turnToNumber--;
		}

		fileNames.push({saveAs:fileNamePrefix+turnToNumber,vals:grabTheseObjects})


		_.each(fileNames,function(oneFileObj){
			console.log('File:',oneFileObj.saveAs+'.json','will contain',oneFileObj.vals.length,'objects')
			t.saveJSON(oneFileObj.saveAs,oneFileObj.vals)
		})
		return true;
	}
};
t.users = t.parseFile('usersOnServer.json');
t.messages = t.parseFile('messagesOnServer.json');
t.links = t.parseFile('linksOnServer.json');
t.grams = t.parseFile('gramsOnServer.json');
module.exports=t;