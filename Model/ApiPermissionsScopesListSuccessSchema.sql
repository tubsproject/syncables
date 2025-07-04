--
-- Slack Web API.
-- Prepared SQL queries for 'api_permissions_scopes_list_success_schema' definition.
--


--
-- SELECT template for table `api_permissions_scopes_list_success_schema`
--
SELECT `ok`, `scopes` FROM `api_permissions_scopes_list_success_schema` WHERE 1;

--
-- INSERT template for table `api_permissions_scopes_list_success_schema`
--
INSERT INTO `api_permissions_scopes_list_success_schema`(`ok`, `scopes`) VALUES (?, ?);

--
-- UPDATE template for table `api_permissions_scopes_list_success_schema`
--
UPDATE `api_permissions_scopes_list_success_schema` SET `ok` = ?, `scopes` = ? WHERE 1;

--
-- DELETE template for table `api_permissions_scopes_list_success_schema`
--
DELETE FROM `api_permissions_scopes_list_success_schema` WHERE 0;

