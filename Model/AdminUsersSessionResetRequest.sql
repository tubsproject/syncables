--
-- Slack Web API.
-- Prepared SQL queries for 'admin_users_session_reset_request' definition.
--


--
-- SELECT template for table `admin_users_session_reset_request`
--
SELECT `user_id`, `mobile_only`, `web_only` FROM `admin_users_session_reset_request` WHERE 1;

--
-- INSERT template for table `admin_users_session_reset_request`
--
INSERT INTO `admin_users_session_reset_request`(`user_id`, `mobile_only`, `web_only`) VALUES (?, ?, ?);

--
-- UPDATE template for table `admin_users_session_reset_request`
--
UPDATE `admin_users_session_reset_request` SET `user_id` = ?, `mobile_only` = ?, `web_only` = ? WHERE 1;

--
-- DELETE template for table `admin_users_session_reset_request`
--
DELETE FROM `admin_users_session_reset_request` WHERE 0;

