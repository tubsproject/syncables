--
-- Slack Web API.
-- Prepared SQL queries for 'chat_getPermalink_success_schema' definition.
--


--
-- SELECT template for table `chat_getPermalink_success_schema`
--
SELECT `channel`, `ok`, `permalink` FROM `chat_getPermalink_success_schema` WHERE 1;

--
-- INSERT template for table `chat_getPermalink_success_schema`
--
INSERT INTO `chat_getPermalink_success_schema`(`channel`, `ok`, `permalink`) VALUES (?, ?, ?);

--
-- UPDATE template for table `chat_getPermalink_success_schema`
--
UPDATE `chat_getPermalink_success_schema` SET `channel` = ?, `ok` = ?, `permalink` = ? WHERE 1;

--
-- DELETE template for table `chat_getPermalink_success_schema`
--
DELETE FROM `chat_getPermalink_success_schema` WHERE 0;

