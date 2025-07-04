--
-- Slack Web API.
-- Prepared SQL queries for 'calls_update_request' definition.
--


--
-- SELECT template for table `calls_update_request`
--
SELECT `id`, `title`, `join_url`, `desktop_app_join_url` FROM `calls_update_request` WHERE 1;

--
-- INSERT template for table `calls_update_request`
--
INSERT INTO `calls_update_request`(`id`, `title`, `join_url`, `desktop_app_join_url`) VALUES (?, ?, ?, ?);

--
-- UPDATE template for table `calls_update_request`
--
UPDATE `calls_update_request` SET `id` = ?, `title` = ?, `join_url` = ?, `desktop_app_join_url` = ? WHERE 1;

--
-- DELETE template for table `calls_update_request`
--
DELETE FROM `calls_update_request` WHERE 0;

