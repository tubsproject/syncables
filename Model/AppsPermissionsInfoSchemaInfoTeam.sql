--
-- Slack Web API.
-- Prepared SQL queries for 'apps_permissions_info_schema_info_team' definition.
--


--
-- SELECT template for table `apps_permissions_info_schema_info_team`
--
SELECT `resources`, `scopes` FROM `apps_permissions_info_schema_info_team` WHERE 1;

--
-- INSERT template for table `apps_permissions_info_schema_info_team`
--
INSERT INTO `apps_permissions_info_schema_info_team`(`resources`, `scopes`) VALUES (?, ?);

--
-- UPDATE template for table `apps_permissions_info_schema_info_team`
--
UPDATE `apps_permissions_info_schema_info_team` SET `resources` = ?, `scopes` = ? WHERE 1;

--
-- DELETE template for table `apps_permissions_info_schema_info_team`
--
DELETE FROM `apps_permissions_info_schema_info_team` WHERE 0;

