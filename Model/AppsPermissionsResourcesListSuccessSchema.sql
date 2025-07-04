--
-- Slack Web API.
-- Prepared SQL queries for 'apps_permissions_resources_list_success_schema' definition.
--


--
-- SELECT template for table `apps_permissions_resources_list_success_schema`
--
SELECT `ok`, `resources`, `response_metadata` FROM `apps_permissions_resources_list_success_schema` WHERE 1;

--
-- INSERT template for table `apps_permissions_resources_list_success_schema`
--
INSERT INTO `apps_permissions_resources_list_success_schema`(`ok`, `resources`, `response_metadata`) VALUES (?, ?, ?);

--
-- UPDATE template for table `apps_permissions_resources_list_success_schema`
--
UPDATE `apps_permissions_resources_list_success_schema` SET `ok` = ?, `resources` = ?, `response_metadata` = ? WHERE 1;

--
-- DELETE template for table `apps_permissions_resources_list_success_schema`
--
DELETE FROM `apps_permissions_resources_list_success_schema` WHERE 0;

