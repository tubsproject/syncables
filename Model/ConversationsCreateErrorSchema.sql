--
-- Slack Web API.
-- Prepared SQL queries for 'conversations_create_error_schema' definition.
--


--
-- SELECT template for table `conversations_create_error_schema`
--
SELECT `callstack`, `detail`, `error`, `needed`, `ok`, `provided` FROM `conversations_create_error_schema` WHERE 1;

--
-- INSERT template for table `conversations_create_error_schema`
--
INSERT INTO `conversations_create_error_schema`(`callstack`, `detail`, `error`, `needed`, `ok`, `provided`) VALUES (?, ?, ?, ?, ?, ?);

--
-- UPDATE template for table `conversations_create_error_schema`
--
UPDATE `conversations_create_error_schema` SET `callstack` = ?, `detail` = ?, `error` = ?, `needed` = ?, `ok` = ?, `provided` = ? WHERE 1;

--
-- DELETE template for table `conversations_create_error_schema`
--
DELETE FROM `conversations_create_error_schema` WHERE 0;

