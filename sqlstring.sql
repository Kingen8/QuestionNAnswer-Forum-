-- SQLite



---------------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users(
email VARCHAR(50) UNIQUE,
firstname varchar(20),
lastname VARCHAR(20),
username varchar(50),
password VARCHAR(50),
picture VARCHAR(50),
userlevel INTEGER,
isblocked bit NOT NULL DEFAULT (0),
userid INTEGER PRIMARY KEY AUTOINCREMENT);





------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS questions;
CREATE TABLE IF NOT EXISTS questions(
title VARCHAR(50),
text VARCHAR(200),
category VARCHAR(50),
userid INTEGER NOT NULL,
duplicate INTEGER,
created_at DEFAULT CURRENT_TIMESTAMP,
id INTEGER PRIMARY KEY AUTOINCREMENT);








DROP TABLE IF EXISTS answers;
CREATE TABLE IF NOT EXISTS answers(
comment TEXT, 
questionidforanswer INTEGER,
created_at DEFAULT CURRENT_TIMESTAMP,
anupVote INTEGER DEFAULT 0,
andownVote INTEGER DEFAULT 0,
userid INTEGER NOT NULL,
answerid INTEGER PRIMARY KEY AUTOINCREMENT);



 
 

  



 



