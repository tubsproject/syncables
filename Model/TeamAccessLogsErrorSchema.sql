--
-- Slack Web API.
-- Prepared SQL queries for 'team_accessLogs_error_schema' definition.
--


--
-- SELECT template for table `team_accessLogs_error_schema`
--
SELECT `callstack`, `error`, `ok` FROM `team_accessLogs_error_schema` WHERE 1;

--
-- INSERT template for table `team_accessLogs_error_schema`
--
INSERT INTO `team_accessLogs_error_schema`(`callstack`, `error`, `ok`) VALUES (?, ?, ?);

--
-- UPDATE template for table `team_accessLogs_error_schema`
--
UPDATE `team_accessLogs_error_schema` SET `callstack` = ?, `error` = ?, `ok` = ? WHERE 1;

--
-- DELETE template for table `team_accessLogs_error_schema`
--
DELETE FROM `team_accessLogs_error_schema` WHERE 0;

