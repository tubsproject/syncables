--
-- Slack Web API.
-- Prepared SQL queries for 'calls_add_request' definition.
--


--
-- SELECT template for table `calls_add_request`
--
SELECT `external_unique_id`, `external_display_id`, `join_url`, `desktop_app_join_url`, `date_start`, `title`, `created_by`, `users` FROM `calls_add_request` WHERE 1;

--
-- INSERT template for table `calls_add_request`
--
INSERT INTO `calls_add_request`(`external_unique_id`, `external_display_id`, `join_url`, `desktop_app_join_url`, `date_start`, `title`, `created_by`, `users`) VALUES (?, ?, ?, ?, ?, ?, ?, ?);

--
-- UPDATE template for table `calls_add_request`
--
UPDATE `calls_add_request` SET `external_unique_id` = ?, `external_display_id` = ?, `join_url` = ?, `desktop_app_join_url` = ?, `date_start` = ?, `title` = ?, `created_by` = ?, `users` = ? WHERE 1;

--
-- DELETE template for table `calls_add_request`
--
DELETE FROM `calls_add_request` WHERE 0;

