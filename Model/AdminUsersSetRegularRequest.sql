--
-- Slack Web API.
-- Prepared SQL queries for 'admin_users_setRegular_request' definition.
--


--
-- SELECT template for table `admin_users_setRegular_request`
--
SELECT `team_id`, `user_id` FROM `admin_users_setRegular_request` WHERE 1;

--
-- INSERT template for table `admin_users_setRegular_request`
--
INSERT INTO `admin_users_setRegular_request`(`team_id`, `user_id`) VALUES (?, ?);

--
-- UPDATE template for table `admin_users_setRegular_request`
--
UPDATE `admin_users_setRegular_request` SET `team_id` = ?, `user_id` = ? WHERE 1;

--
-- DELETE template for table `admin_users_setRegular_request`
--
DELETE FROM `admin_users_setRegular_request` WHERE 0;

