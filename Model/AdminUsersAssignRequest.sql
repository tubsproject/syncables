--
-- Slack Web API.
-- Prepared SQL queries for 'admin_users_assign_request' definition.
--


--
-- SELECT template for table `admin_users_assign_request`
--
SELECT `team_id`, `user_id`, `is_restricted`, `is_ultra_restricted`, `channel_ids` FROM `admin_users_assign_request` WHERE 1;

--
-- INSERT template for table `admin_users_assign_request`
--
INSERT INTO `admin_users_assign_request`(`team_id`, `user_id`, `is_restricted`, `is_ultra_restricted`, `channel_ids`) VALUES (?, ?, ?, ?, ?);

--
-- UPDATE template for table `admin_users_assign_request`
--
UPDATE `admin_users_assign_request` SET `team_id` = ?, `user_id` = ?, `is_restricted` = ?, `is_ultra_restricted` = ?, `channel_ids` = ? WHERE 1;

--
-- DELETE template for table `admin_users_assign_request`
--
DELETE FROM `admin_users_assign_request` WHERE 0;

