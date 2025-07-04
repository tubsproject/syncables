--
-- Slack Web API.
-- Prepared SQL queries for 'conversations_list_success_schema' definition.
--


--
-- SELECT template for table `conversations_list_success_schema`
--
SELECT `channels`, `ok`, `response_metadata` FROM `conversations_list_success_schema` WHERE 1;

--
-- INSERT template for table `conversations_list_success_schema`
--
INSERT INTO `conversations_list_success_schema`(`channels`, `ok`, `response_metadata`) VALUES (?, ?, ?);

--
-- UPDATE template for table `conversations_list_success_schema`
--
UPDATE `conversations_list_success_schema` SET `channels` = ?, `ok` = ?, `response_metadata` = ? WHERE 1;

--
-- DELETE template for table `conversations_list_success_schema`
--
DELETE FROM `conversations_list_success_schema` WHERE 0;

