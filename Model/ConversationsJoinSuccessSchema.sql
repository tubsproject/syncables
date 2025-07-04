--
-- Slack Web API.
-- Prepared SQL queries for 'conversations_join_success_schema' definition.
--


--
-- SELECT template for table `conversations_join_success_schema`
--
SELECT `channel`, `ok`, `response_metadata`, `warning` FROM `conversations_join_success_schema` WHERE 1;

--
-- INSERT template for table `conversations_join_success_schema`
--
INSERT INTO `conversations_join_success_schema`(`channel`, `ok`, `response_metadata`, `warning`) VALUES (?, ?, ?, ?);

--
-- UPDATE template for table `conversations_join_success_schema`
--
UPDATE `conversations_join_success_schema` SET `channel` = ?, `ok` = ?, `response_metadata` = ?, `warning` = ? WHERE 1;

--
-- DELETE template for table `conversations_join_success_schema`
--
DELETE FROM `conversations_join_success_schema` WHERE 0;

