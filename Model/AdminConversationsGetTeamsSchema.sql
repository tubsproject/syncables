--
-- Slack Web API.
-- Prepared SQL queries for 'admin_conversations_getTeams_schema' definition.
--


--
-- SELECT template for table `admin_conversations_getTeams_schema`
--
SELECT `ok`, `response_metadata`, `team_ids` FROM `admin_conversations_getTeams_schema` WHERE 1;

--
-- INSERT template for table `admin_conversations_getTeams_schema`
--
INSERT INTO `admin_conversations_getTeams_schema`(`ok`, `response_metadata`, `team_ids`) VALUES (?, ?, ?);

--
-- UPDATE template for table `admin_conversations_getTeams_schema`
--
UPDATE `admin_conversations_getTeams_schema` SET `ok` = ?, `response_metadata` = ?, `team_ids` = ? WHERE 1;

--
-- DELETE template for table `admin_conversations_getTeams_schema`
--
DELETE FROM `admin_conversations_getTeams_schema` WHERE 0;

