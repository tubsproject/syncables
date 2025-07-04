--
-- Slack Web API.
-- Prepared SQL queries for 'admin_apps_restrict_request' definition.
--


--
-- SELECT template for table `admin_apps_restrict_request`
--
SELECT `app_id`, `request_id`, `team_id` FROM `admin_apps_restrict_request` WHERE 1;

--
-- INSERT template for table `admin_apps_restrict_request`
--
INSERT INTO `admin_apps_restrict_request`(`app_id`, `request_id`, `team_id`) VALUES (?, ?, ?);

--
-- UPDATE template for table `admin_apps_restrict_request`
--
UPDATE `admin_apps_restrict_request` SET `app_id` = ?, `request_id` = ?, `team_id` = ? WHERE 1;

--
-- DELETE template for table `admin_apps_restrict_request`
--
DELETE FROM `admin_apps_restrict_request` WHERE 0;

