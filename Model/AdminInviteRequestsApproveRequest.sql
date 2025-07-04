--
-- Slack Web API.
-- Prepared SQL queries for 'admin_inviteRequests_approve_request' definition.
--


--
-- SELECT template for table `admin_inviteRequests_approve_request`
--
SELECT `team_id`, `invite_request_id` FROM `admin_inviteRequests_approve_request` WHERE 1;

--
-- INSERT template for table `admin_inviteRequests_approve_request`
--
INSERT INTO `admin_inviteRequests_approve_request`(`team_id`, `invite_request_id`) VALUES (?, ?);

--
-- UPDATE template for table `admin_inviteRequests_approve_request`
--
UPDATE `admin_inviteRequests_approve_request` SET `team_id` = ?, `invite_request_id` = ? WHERE 1;

--
-- DELETE template for table `admin_inviteRequests_approve_request`
--
DELETE FROM `admin_inviteRequests_approve_request` WHERE 0;

