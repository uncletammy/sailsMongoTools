var t = require('./theTools.js');


var repl = require("repl"),
	tools = t;

// repl.context = {};
var a = repl.start("tools> ");
a.context.t=tools;


// a.context._=require('lodash');
/*
// repl.context._=_;
	doSeriesUpdate: function(modelName,primaryKeyOfAssociatingModel,arrayOfModels,collectionNameToAssociate){
			async.forEachSeries(arrayOfModels, function(oneModel,cb){
					var modelPK = primaryKeyOfAssociatingModel;

					var whenAssociated = function(err,associatedRecord){
						if (err) {
							console.log('ERROR Associating',modelName,':',oneModel[modelPK],'\n',err)
							return cb(null)
						} else {
							console.log('Sucesfully associated',modelName,':',associatedRecord[modelPK],'!')							
							return cb(null)
						}
					};

					var whenReturned = function(err,gotThisModel){
						if (err) {
							console.log('Couldnt find',modelName,':',oneModel[modelPK],'\n',err)
							return cb(null)
						} else {

							// remove current associations so there arent any conflicts
							var removeCurrentAssociations = function(next){
								var returnedModel = gotThisModel;
								var returnedAssociations = returnedModel.toJSON();
								console.log('returned!',returnedAssociations)

								if (returnedAssociations)
									returnedAssociations = returnedAssociations[collectionNameToAssociate];
								if (returnedAssociations.length){
									_.each(returnedAssociations,function(associatedRecordToRemove){
										console.log('removing association with',associatedRecordToRemove);
										if (_.isString(associatedRecordToRemove.name))
											returnedModel[collectionNameToAssociate].remove(associatedRecordToRemove.name)	
									});
									returnedModel.save(function(e,saved){
										if (e) {
											console.log('Error Updating association:',JSON.stringify(e));
											return cb(null)
										}
										if (saved){
											console.log('Update of ngram worked!')
											return next(saved);
										}
									});
								} else {
									return next();
								}
							};

							// create new grams
							var createNewAssociations = function(returnedModel,next){
								console.log('after association remove:',returnedModel);
									if (oneModel[collectionNameToAssociate].create.length){
										returnedModel[collectionNameToAssociate].add(oneModel[collectionNameToAssociate].create);
			
										try {
												returnedModel.save(function(e,saved){
													if (e) {
														console.log('\n\n','Error Updating association:','\n\n',JSON.stringify(e),'\n\n');
														return cb(null)
													}
													if (saved){
														console.log('Update of ngram worked!')
														return next(null,saved);
													}
												});
											} catch (assocSaveError){
												console.log('There was an error updating',modelName,':',oneModel[modelPK]);
												return cb(null)
											}
									} else {
										return next(null,returnedModel);
									}

							};
							var linkExistingAssociations = function(returnedModel,next){
								console.log('Now linking existing associations:',returnedModel);
								// Now do updates
								if (oneModel[collectionNameToAssociate].update.length){
									_.each(oneModel[collectionNameToAssociate].update,function(oneAssociatingPK){
										returnedModel[collectionNameToAssociate].add(oneAssociatingPK)
									});

									try {
										returnedModel.save(whenAssociated);
									} catch (assocSaveError){
										console.log('There was an error saving',modelName,':',oneModel[modelPK],':',assocSaveError);
										return cb(null)
									}
								} else {
									console.log('Done with',oneModel.id);
									return cb(null)
								}
							};

							console.log('starting async series.')
							async.series([removeCurrentAssociations,createNewAssociations,linkExistingAssociations],console.log);

						}
					};

					console.log('Looking for model',oneModel[modelPK],'and populating',collectionNameToAssociate);
					sails.models[modelName].findOne(oneModel[modelPK]).populate(collectionNameToAssociate).exec(whenReturned)
			})
// Mongo/waterline assumes all associations are of same type.  Doesnt differentiate between objects and strings.  cant mix nesting in same .save()

	}

*/	