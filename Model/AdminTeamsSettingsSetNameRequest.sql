--
-- Slack Web API.
-- Prepared SQL queries for 'admin_teams_settings_setName_request' definition.
--


--
-- SELECT template for table `admin_teams_settings_setName_request`
--
SELECT `team_id`, `name` FROM `admin_teams_settings_setName_request` WHERE 1;

--
-- INSERT template for table `admin_teams_settings_setName_request`
--
INSERT INTO `admin_teams_settings_setName_request`(`team_id`, `name`) VALUES (?, ?);

--
-- UPDATE template for table `admin_teams_settings_setName_request`
--
UPDATE `admin_teams_settings_setName_request` SET `team_id` = ?, `name` = ? WHERE 1;

--
-- DELETE template for table `admin_teams_settings_setName_request`
--
DELETE FROM `admin_teams_settings_setName_request` WHERE 0;

