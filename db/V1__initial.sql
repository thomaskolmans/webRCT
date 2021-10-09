CREATE DATABASE IF NOT EXISTS `webrtc`;

CREATE USER `webrtc`@'%' IDENTIFIED WITH mysql_native_password BY 'localpassword';
GRANT ALL PRIVILEGES on `webrtc`.* TO 'webrtc'@'%';

CREATE TABLE IF NOT EXISTS `webrtc`.`session`(
    `id` int auto_increment PRIMARY KEY,
    `key` varchar(255),
    `started` DateTime, 
    `ended` DateTime
);

CREATE TABLE IF NOT EXISTS `webrtc`.`session_user`(
    `id` int auto_increment PRIMARY KEY,
    `session_id` int, 
    `key` varchar(255),
    `entered` DateTime, 
    `left` DateTime,
    FOREIGN KEY (session_id) REFERENCES session(id)
);

CREATE TABLE IF NOT EXISTS `webrtc`.`session_queue`(
    `id` int auto_increment PRIMARY KEY,
    `session_id` int, 
    `started` DateTime,
    FOREIGN KEY (session_id) REFERENCES session(id)
);