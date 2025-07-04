--
-- Slack Web API.
-- Prepared SQL queries for 'apps_permissions_info_schema_info' definition.
--


--
-- SELECT template for table `apps_permissions_info_schema_info`
--
SELECT `app_home`, `channel`, `group`, `im`, `mpim`, `team` FROM `apps_permissions_info_schema_info` WHERE 1;

--
-- INSERT template for table `apps_permissions_info_schema_info`
--
INSERT INTO `apps_permissions_info_schema_info`(`app_home`, `channel`, `group`, `im`, `mpim`, `team`) VALUES (?, ?, ?, ?, ?, ?);

--
-- UPDATE template for table `apps_permissions_info_schema_info`
--
UPDATE `apps_permissions_info_schema_info` SET `app_home` = ?, `channel` = ?, `group` = ?, `im` = ?, `mpim` = ?, `team` = ? WHERE 1;

--
-- DELETE template for table `apps_permissions_info_schema_info`
--
DELETE FROM `apps_permissions_info_schema_info` WHERE 0;

