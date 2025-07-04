--
-- Slack Web API.
-- Prepared SQL queries for 'apps_permissions_scopes_list_error_schema' definition.
--


--
-- SELECT template for table `apps_permissions_scopes_list_error_schema`
--
SELECT `callstack`, `error`, `ok` FROM `apps_permissions_scopes_list_error_schema` WHERE 1;

--
-- INSERT template for table `apps_permissions_scopes_list_error_schema`
--
INSERT INTO `apps_permissions_scopes_list_error_schema`(`callstack`, `error`, `ok`) VALUES (?, ?, ?);

--
-- UPDATE template for table `apps_permissions_scopes_list_error_schema`
--
UPDATE `apps_permissions_scopes_list_error_schema` SET `callstack` = ?, `error` = ?, `ok` = ? WHERE 1;

--
-- DELETE template for table `apps_permissions_scopes_list_error_schema`
--
DELETE FROM `apps_permissions_scopes_list_error_schema` WHERE 0;

