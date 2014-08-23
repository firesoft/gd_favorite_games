GD Favorite Games Service - api specs
---

Favorite Games Service - returns and adds info about players favorite games.

### Routes:

##### GET / - service info
info about service, return example:
```
{"status":"online","name":"gd_jackpot","ip":"0.0.0.0","port":8088,"startTime":1408812425}
```

##### GET /players/:PLAYER_ID
returns info about player favorite games: array of gameNumbers, sorted by most popular
return example:
```
[3000,2001,2000]
```

##### POST /players/:PLAYER_ID
adds (or updates) player`s favorite game info, post params: [(int)gameNumber, (int)timeSpent]
return example:
```
{status: 'updated'}
```

##### PLAYER_ID param
:PLAYER_ID - playerId of player

##### errors
in case of error service will return one of the following errors (with http status):

 * status 404 - not found
 ```
 {"message":"four - oh - four"}
 ```

 * status 400 - bad request - in case of incorrect parameters
 ```
 {"message":"Invalid type param."}
 ```
 
 * status 500 - internal service error
 ```
 {"message":"Internal server error."}
 ```
 
 
 