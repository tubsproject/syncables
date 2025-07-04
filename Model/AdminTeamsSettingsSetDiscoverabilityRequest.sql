--
-- Slack Web API.
-- Prepared SQL queries for 'admin_teams_settings_setDiscoverability_request' definition.
--


--
-- SELECT template for table `admin_teams_settings_setDiscoverability_request`
--
SELECT `team_id`, `discoverability` FROM `admin_teams_settings_setDiscoverability_request` WHERE 1;

--
-- INSERT template for table `admin_teams_settings_setDiscoverability_request`
--
INSERT INTO `admin_teams_settings_setDiscoverability_request`(`team_id`, `discoverability`) VALUES (?, ?);

--
-- UPDATE template for table `admin_teams_settings_setDiscoverability_request`
--
UPDATE `admin_teams_settings_setDiscoverability_request` SET `team_id` = ?, `discoverability` = ? WHERE 1;

--
-- DELETE template for table `admin_teams_settings_setDiscoverability_request`
--
DELETE FROM `admin_teams_settings_setDiscoverability_request` WHERE 0;

