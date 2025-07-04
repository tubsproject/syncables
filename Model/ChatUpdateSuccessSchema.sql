--
-- Slack Web API.
-- Prepared SQL queries for 'chat_update_success_schema' definition.
--


--
-- SELECT template for table `chat_update_success_schema`
--
SELECT `channel`, `message`, `ok`, `text`, `ts` FROM `chat_update_success_schema` WHERE 1;

--
-- INSERT template for table `chat_update_success_schema`
--
INSERT INTO `chat_update_success_schema`(`channel`, `message`, `ok`, `text`, `ts`) VALUES (?, ?, ?, ?, ?);

--
-- UPDATE template for table `chat_update_success_schema`
--
UPDATE `chat_update_success_schema` SET `channel` = ?, `message` = ?, `ok` = ?, `text` = ?, `ts` = ? WHERE 1;

--
-- DELETE template for table `chat_update_success_schema`
--
DELETE FROM `chat_update_success_schema` WHERE 0;

