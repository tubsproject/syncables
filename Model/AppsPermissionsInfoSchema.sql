--
-- Slack Web API.
-- Prepared SQL queries for 'apps_permissions_info_schema' definition.
--


--
-- SELECT template for table `apps_permissions_info_schema`
--
SELECT `info`, `ok` FROM `apps_permissions_info_schema` WHERE 1;

--
-- INSERT template for table `apps_permissions_info_schema`
--
INSERT INTO `apps_permissions_info_schema`(`info`, `ok`) VALUES (?, ?);

--
-- UPDATE template for table `apps_permissions_info_schema`
--
UPDATE `apps_permissions_info_schema` SET `info` = ?, `ok` = ? WHERE 1;

--
-- DELETE template for table `apps_permissions_info_schema`
--
DELETE FROM `apps_permissions_info_schema` WHERE 0;

