--
-- Slack Web API.
-- Prepared SQL queries for 'chat_meMessage_schema' definition.
--


--
-- SELECT template for table `chat_meMessage_schema`
--
SELECT `channel`, `ok`, `ts` FROM `chat_meMessage_schema` WHERE 1;

--
-- INSERT template for table `chat_meMessage_schema`
--
INSERT INTO `chat_meMessage_schema`(`channel`, `ok`, `ts`) VALUES (?, ?, ?);

--
-- UPDATE template for table `chat_meMessage_schema`
--
UPDATE `chat_meMessage_schema` SET `channel` = ?, `ok` = ?, `ts` = ? WHERE 1;

--
-- DELETE template for table `chat_meMessage_schema`
--
DELETE FROM `chat_meMessage_schema` WHERE 0;

