"use strict";

var router = require('express').Router();

var playerFavoriteGamesController = require('../controllers/player_favorite_games.js');

router.get('/players/:playerId', playerFavoriteGamesController.validate, playerFavoriteGamesController.get);
router.post('/players/:playerId', playerFavoriteGamesController.validateUpdate, playerFavoriteGamesController.update);

module.exports = router;