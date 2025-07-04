--
-- Slack Web API.
-- Prepared SQL queries for 'chat_postMessage_success_schema' definition.
--


--
-- SELECT template for table `chat_postMessage_success_schema`
--
SELECT `channel`, `message`, `ok`, `ts` FROM `chat_postMessage_success_schema` WHERE 1;

--
-- INSERT template for table `chat_postMessage_success_schema`
--
INSERT INTO `chat_postMessage_success_schema`(`channel`, `message`, `ok`, `ts`) VALUES (?, ?, ?, ?);

--
-- UPDATE template for table `chat_postMessage_success_schema`
--
UPDATE `chat_postMessage_success_schema` SET `channel` = ?, `message` = ?, `ok` = ?, `ts` = ? WHERE 1;

--
-- DELETE template for table `chat_postMessage_success_schema`
--
DELETE FROM `chat_postMessage_success_schema` WHERE 0;

