--
-- Slack Web API.
-- Prepared SQL queries for 'apps_permissions_info_schema_info_app_home' definition.
--


--
-- SELECT template for table `apps_permissions_info_schema_info_app_home`
--
SELECT `resources`, `scopes` FROM `apps_permissions_info_schema_info_app_home` WHERE 1;

--
-- INSERT template for table `apps_permissions_info_schema_info_app_home`
--
INSERT INTO `apps_permissions_info_schema_info_app_home`(`resources`, `scopes`) VALUES (?, ?);

--
-- UPDATE template for table `apps_permissions_info_schema_info_app_home`
--
UPDATE `apps_permissions_info_schema_info_app_home` SET `resources` = ?, `scopes` = ? WHERE 1;

--
-- DELETE template for table `apps_permissions_info_schema_info_app_home`
--
DELETE FROM `apps_permissions_info_schema_info_app_home` WHERE 0;

