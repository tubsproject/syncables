--
-- Slack Web API.
-- Prepared SQL queries for 'chat_meMessage_error_schema' definition.
--


--
-- SELECT template for table `chat_meMessage_error_schema`
--
SELECT `callstack`, `error`, `ok` FROM `chat_meMessage_error_schema` WHERE 1;

--
-- INSERT template for table `chat_meMessage_error_schema`
--
INSERT INTO `chat_meMessage_error_schema`(`callstack`, `error`, `ok`) VALUES (?, ?, ?);

--
-- UPDATE template for table `chat_meMessage_error_schema`
--
UPDATE `chat_meMessage_error_schema` SET `callstack` = ?, `error` = ?, `ok` = ? WHERE 1;

--
-- DELETE template for table `chat_meMessage_error_schema`
--
DELETE FROM `chat_meMessage_error_schema` WHERE 0;

