"use strict";

var _ = require('lodash');
var memoryCache = require('memory-cache');
var gdMysql = require('../libs/gd_mysql.js');

function get(params, callback) {
	var playerId = params.playerId;
	var games = getFromCache(playerId);
	if (games !== null) {
		return callback(null, games);
	}
	getFromDB(playerId, function(err, data) {
		console.log(data);
		if (err || !data) return callback(err, []);
		games = processDBData(data);
		putToCache(playerId, games);
		games = applyLimit(games, params.limit);
		callback(null, games);
	});
}

function update(params, callback) {
	query = 'CALL `ganymede_social`.update_most_popular_games(' + $params.playerId + ',' + params.gameNumber  + ',' + params.timeSpent + ')';
	gdMysql.query(query, 'master', callback);
}

function getFromDB(playerId, callback) {
	var query = 'select `game_number`,`score`,`time_last_played` from `ganymede_social`.`mod_most_popular_games` where playerId=' + playerId + ' and score>0';
	gdMysql.query(query, 'slave', callback);
}

function processDBData(data) {
	data = sortData(data);
	return getGamesFromData(data);
}

function sortData(data) {
	return data.sort(compareRows);
}

function compareRows(row1, row2) {
	if (row1.score == row2.score) {
		return row2.time_last_played - row1.time_last_played;
	}
	return row2.score - row1.score;
}

function getGamesFromData(data) {
	return _.pluck(data, 'game_number');
}

function applyLimit(games, limit) {
	if (limit < 1) {
		return games;
	}
	return games.slice(0, limit);
}

function getFromCache(playerId) {
	return memoryCache.get(getCacheKey(playerId));
}

function getCacheKey(playerId) {
	return 'fg_' + playerId;
}

function putToCache(playerId, games) {
	memoryCache.put(getCacheKey(playerId), games, 3600 * 1000);
}

module.exports.get = get;
module.exports.update = update;