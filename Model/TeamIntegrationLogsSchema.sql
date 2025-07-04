--
-- Slack Web API.
-- Prepared SQL queries for 'team_integrationLogs_schema' definition.
--


--
-- SELECT template for table `team_integrationLogs_schema`
--
SELECT `logs`, `ok`, `paging` FROM `team_integrationLogs_schema` WHERE 1;

--
-- INSERT template for table `team_integrationLogs_schema`
--
INSERT INTO `team_integrationLogs_schema`(`logs`, `ok`, `paging`) VALUES (?, ?, ?);

--
-- UPDATE template for table `team_integrationLogs_schema`
--
UPDATE `team_integrationLogs_schema` SET `logs` = ?, `ok` = ?, `paging` = ? WHERE 1;

--
-- DELETE template for table `team_integrationLogs_schema`
--
DELETE FROM `team_integrationLogs_schema` WHERE 0;

