--
-- Slack Web API.
-- Prepared SQL queries for 'admin_users_session_invalidate_request' definition.
--


--
-- SELECT template for table `admin_users_session_invalidate_request`
--
SELECT `team_id`, `session_id` FROM `admin_users_session_invalidate_request` WHERE 1;

--
-- INSERT template for table `admin_users_session_invalidate_request`
--
INSERT INTO `admin_users_session_invalidate_request`(`team_id`, `session_id`) VALUES (?, ?);

--
-- UPDATE template for table `admin_users_session_invalidate_request`
--
UPDATE `admin_users_session_invalidate_request` SET `team_id` = ?, `session_id` = ? WHERE 1;

--
-- DELETE template for table `admin_users_session_invalidate_request`
--
DELETE FROM `admin_users_session_invalidate_request` WHERE 0;

