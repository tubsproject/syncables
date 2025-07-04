--
-- Slack Web API.
-- Prepared SQL queries for 'apps_permissions_resources_list_success_schema_resources_inner' definition.
--


--
-- SELECT template for table `apps_permissions_resources_list_success_schema_resources_inner`
--
SELECT `id`, `type` FROM `apps_permissions_resources_list_success_schema_resources_inner` WHERE 1;

--
-- INSERT template for table `apps_permissions_resources_list_success_schema_resources_inner`
--
INSERT INTO `apps_permissions_resources_list_success_schema_resources_inner`(`id`, `type`) VALUES (?, ?);

--
-- UPDATE template for table `apps_permissions_resources_list_success_schema_resources_inner`
--
UPDATE `apps_permissions_resources_list_success_schema_resources_inner` SET `id` = ?, `type` = ? WHERE 1;

--
-- DELETE template for table `apps_permissions_resources_list_success_schema_resources_inner`
--
DELETE FROM `apps_permissions_resources_list_success_schema_resources_inner` WHERE 0;

