--
-- Slack Web API.
-- Prepared SQL queries for 'users_conversations_success_schema' definition.
--


--
-- SELECT template for table `users_conversations_success_schema`
--
SELECT `channels`, `ok`, `response_metadata` FROM `users_conversations_success_schema` WHERE 1;

--
-- INSERT template for table `users_conversations_success_schema`
--
INSERT INTO `users_conversations_success_schema`(`channels`, `ok`, `response_metadata`) VALUES (?, ?, ?);

--
-- UPDATE template for table `users_conversations_success_schema`
--
UPDATE `users_conversations_success_schema` SET `channels` = ?, `ok` = ?, `response_metadata` = ? WHERE 1;

--
-- DELETE template for table `users_conversations_success_schema`
--
DELETE FROM `users_conversations_success_schema` WHERE 0;

