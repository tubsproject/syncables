--
-- Slack Web API.
-- Prepared SQL queries for 'admin_conversations_setTeams_request' definition.
--


--
-- SELECT template for table `admin_conversations_setTeams_request`
--
SELECT `channel_id`, `team_id`, `target_team_ids`, `org_channel` FROM `admin_conversations_setTeams_request` WHERE 1;

--
-- INSERT template for table `admin_conversations_setTeams_request`
--
INSERT INTO `admin_conversations_setTeams_request`(`channel_id`, `team_id`, `target_team_ids`, `org_channel`) VALUES (?, ?, ?, ?);

--
-- UPDATE template for table `admin_conversations_setTeams_request`
--
UPDATE `admin_conversations_setTeams_request` SET `channel_id` = ?, `team_id` = ?, `target_team_ids` = ?, `org_channel` = ? WHERE 1;

--
-- DELETE template for table `admin_conversations_setTeams_request`
--
DELETE FROM `admin_conversations_setTeams_request` WHERE 0;

