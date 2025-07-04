--
-- Slack Web API.
-- Prepared SQL queries for 'admin_teams_settings_setDescription_request' definition.
--


--
-- SELECT template for table `admin_teams_settings_setDescription_request`
--
SELECT `team_id`, `description` FROM `admin_teams_settings_setDescription_request` WHERE 1;

--
-- INSERT template for table `admin_teams_settings_setDescription_request`
--
INSERT INTO `admin_teams_settings_setDescription_request`(`team_id`, `description`) VALUES (?, ?);

--
-- UPDATE template for table `admin_teams_settings_setDescription_request`
--
UPDATE `admin_teams_settings_setDescription_request` SET `team_id` = ?, `description` = ? WHERE 1;

--
-- DELETE template for table `admin_teams_settings_setDescription_request`
--
DELETE FROM `admin_teams_settings_setDescription_request` WHERE 0;

