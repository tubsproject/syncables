--
-- Slack Web API.
-- Prepared SQL queries for 'conversations_open_error_schema' definition.
--


--
-- SELECT template for table `conversations_open_error_schema`
--
SELECT `callstack`, `error`, `ok` FROM `conversations_open_error_schema` WHERE 1;

--
-- INSERT template for table `conversations_open_error_schema`
--
INSERT INTO `conversations_open_error_schema`(`callstack`, `error`, `ok`) VALUES (?, ?, ?);

--
-- UPDATE template for table `conversations_open_error_schema`
--
UPDATE `conversations_open_error_schema` SET `callstack` = ?, `error` = ?, `ok` = ? WHERE 1;

--
-- DELETE template for table `conversations_open_error_schema`
--
DELETE FROM `conversations_open_error_schema` WHERE 0;

