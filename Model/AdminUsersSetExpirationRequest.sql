--
-- Slack Web API.
-- Prepared SQL queries for 'admin_users_setExpiration_request' definition.
--


--
-- SELECT template for table `admin_users_setExpiration_request`
--
SELECT `team_id`, `user_id`, `expiration_ts` FROM `admin_users_setExpiration_request` WHERE 1;

--
-- INSERT template for table `admin_users_setExpiration_request`
--
INSERT INTO `admin_users_setExpiration_request`(`team_id`, `user_id`, `expiration_ts`) VALUES (?, ?, ?);

--
-- UPDATE template for table `admin_users_setExpiration_request`
--
UPDATE `admin_users_setExpiration_request` SET `team_id` = ?, `user_id` = ?, `expiration_ts` = ? WHERE 1;

--
-- DELETE template for table `admin_users_setExpiration_request`
--
DELETE FROM `admin_users_setExpiration_request` WHERE 0;

