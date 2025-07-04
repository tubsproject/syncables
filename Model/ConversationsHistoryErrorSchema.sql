--
-- Slack Web API.
-- Prepared SQL queries for 'conversations_history_error_schema' definition.
--


--
-- SELECT template for table `conversations_history_error_schema`
--
SELECT `callstack`, `error`, `needed`, `ok`, `provided` FROM `conversations_history_error_schema` WHERE 1;

--
-- INSERT template for table `conversations_history_error_schema`
--
INSERT INTO `conversations_history_error_schema`(`callstack`, `error`, `needed`, `ok`, `provided`) VALUES (?, ?, ?, ?, ?);

--
-- UPDATE template for table `conversations_history_error_schema`
--
UPDATE `conversations_history_error_schema` SET `callstack` = ?, `error` = ?, `needed` = ?, `ok` = ?, `provided` = ? WHERE 1;

--
-- DELETE template for table `conversations_history_error_schema`
--
DELETE FROM `conversations_history_error_schema` WHERE 0;

