CREATE TABLE IF NOT EXISTS `session`(
    `id` int auto_increment PRIMARY KEY,
    `key` varchar(255),
    `started` DateTime, 
    `ended` DateTime
);

CREATE TABLE IF NOT EXISTS `session_user`(
    `id` int auto_increment PRIMARY KEY,
    `session_id` int, 
    `key` varchar(255),
    `entered` DateTime, 
    `left` DateTime,
    FOREIGN KEY (session_id) REFERENCES session(id)
);