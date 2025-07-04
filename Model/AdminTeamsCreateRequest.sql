--
-- Slack Web API.
-- Prepared SQL queries for 'admin_teams_create_request' definition.
--


--
-- SELECT template for table `admin_teams_create_request`
--
SELECT `team_domain`, `team_name`, `team_description`, `team_discoverability` FROM `admin_teams_create_request` WHERE 1;

--
-- INSERT template for table `admin_teams_create_request`
--
INSERT INTO `admin_teams_create_request`(`team_domain`, `team_name`, `team_description`, `team_discoverability`) VALUES (?, ?, ?, ?);

--
-- UPDATE template for table `admin_teams_create_request`
--
UPDATE `admin_teams_create_request` SET `team_domain` = ?, `team_name` = ?, `team_description` = ?, `team_discoverability` = ? WHERE 1;

--
-- DELETE template for table `admin_teams_create_request`
--
DELETE FROM `admin_teams_create_request` WHERE 0;

