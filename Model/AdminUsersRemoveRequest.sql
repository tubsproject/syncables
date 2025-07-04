--
-- Slack Web API.
-- Prepared SQL queries for 'admin_users_remove_request' definition.
--


--
-- SELECT template for table `admin_users_remove_request`
--
SELECT `team_id`, `user_id` FROM `admin_users_remove_request` WHERE 1;

--
-- INSERT template for table `admin_users_remove_request`
--
INSERT INTO `admin_users_remove_request`(`team_id`, `user_id`) VALUES (?, ?);

--
-- UPDATE template for table `admin_users_remove_request`
--
UPDATE `admin_users_remove_request` SET `team_id` = ?, `user_id` = ? WHERE 1;

--
-- DELETE template for table `admin_users_remove_request`
--
DELETE FROM `admin_users_remove_request` WHERE 0;

