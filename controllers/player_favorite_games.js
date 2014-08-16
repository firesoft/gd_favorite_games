"use strict";

var gdValidationHelper = require('../libs/gd_validation_helper.js');
var playerFavoriteGamesModel = require('../models/player_favorite_games.js');

function get(req, res, next) {
	playerFavoriteGamesModel.get(req.parsedData, function(err, data) {
		if (err) return next(err, []);
		res.json(data);
	});
}

function validate(req, res, next) {
	req.checkParams('playerId', 'Invalid playerId param.').notEmpty().isInt().isPositive();
	if (!req.query.limit) {
		req.query.limit = -1;
	}
	req.checkQuery('limit', 'Invalid limit param.').isInt(); 
	
	var err = gdValidationHelper.checkValidationErrors(req);
	if (err) return next(err); 
	
	req.sanitize('playerId').toInt();
	req.sanitize('limit').toInt();
	initParsedData(req);
	
	next();
}

function initParsedData(req) {
	req.parsedData = {};
	req.parsedData.playerId = req.params.playerId;
	req.parsedData.limit = req.query.limit;
}

function update(req, res, next) {
	playerFavoriteGamesModel.update(req.parsedData, function(err, data) {
		if (err) return next(err, {});
		res.json({status: 'updated'});
	});
}

function validateUpdate(req, res, next) {
	req.checkParams('playerId', 'Invalid playerId param.').notEmpty().isInt().isPositive();
	req.checkBody('gameNumber', 'Invalid gameNumber param.').notEmpty().isInt().isPositive();
	req.checkBody('timeSpent', 'Invalid timeSpent param.').notEmpty().isInt().isPositive();
	
	var err = gdValidationHelper.checkValidationErrors(req);
	if (err) return next(err); 
	
	req.sanitize('playerId').toInt();
	req.sanitize('gameNumber').toInt();
	req.sanitize('timeSpent').toInt();
	initParsedDataUpdate(req);
	
	next();
}

function initParsedDataUpdate(req) {
	req.parsedData = {};
	req.parsedData.gameNumber = req.params.playerId;
	req.parsedData.gameNumber = req.body.gameNumber;
	req.parsedData.timeSpent = req.body.timeSpent;
}

module.exports.get = get;
module.exports.validate = validate;
module.exports.update = update;
module.exports.validateUpdate = validateUpdate;