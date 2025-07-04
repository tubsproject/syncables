--
-- Slack Web API.
-- Prepared SQL queries for 'team_accessLogs_schema' definition.
--


--
-- SELECT template for table `team_accessLogs_schema`
--
SELECT `logins`, `ok`, `paging` FROM `team_accessLogs_schema` WHERE 1;

--
-- INSERT template for table `team_accessLogs_schema`
--
INSERT INTO `team_accessLogs_schema`(`logins`, `ok`, `paging`) VALUES (?, ?, ?);

--
-- UPDATE template for table `team_accessLogs_schema`
--
UPDATE `team_accessLogs_schema` SET `logins` = ?, `ok` = ?, `paging` = ? WHERE 1;

--
-- DELETE template for table `team_accessLogs_schema`
--
DELETE FROM `team_accessLogs_schema` WHERE 0;

