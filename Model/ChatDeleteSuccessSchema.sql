--
-- Slack Web API.
-- Prepared SQL queries for 'chat_delete_success_schema' definition.
--


--
-- SELECT template for table `chat_delete_success_schema`
--
SELECT `channel`, `ok`, `ts` FROM `chat_delete_success_schema` WHERE 1;

--
-- INSERT template for table `chat_delete_success_schema`
--
INSERT INTO `chat_delete_success_schema`(`channel`, `ok`, `ts`) VALUES (?, ?, ?);

--
-- UPDATE template for table `chat_delete_success_schema`
--
UPDATE `chat_delete_success_schema` SET `channel` = ?, `ok` = ?, `ts` = ? WHERE 1;

--
-- DELETE template for table `chat_delete_success_schema`
--
DELETE FROM `chat_delete_success_schema` WHERE 0;

