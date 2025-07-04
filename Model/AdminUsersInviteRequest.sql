--
-- Slack Web API.
-- Prepared SQL queries for 'admin_users_invite_request' definition.
--


--
-- SELECT template for table `admin_users_invite_request`
--
SELECT `team_id`, `email`, `channel_ids`, `custom_message`, `real_name`, `resend`, `is_restricted`, `is_ultra_restricted`, `guest_expiration_ts` FROM `admin_users_invite_request` WHERE 1;

--
-- INSERT template for table `admin_users_invite_request`
--
INSERT INTO `admin_users_invite_request`(`team_id`, `email`, `channel_ids`, `custom_message`, `real_name`, `resend`, `is_restricted`, `is_ultra_restricted`, `guest_expiration_ts`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);

--
-- UPDATE template for table `admin_users_invite_request`
--
UPDATE `admin_users_invite_request` SET `team_id` = ?, `email` = ?, `channel_ids` = ?, `custom_message` = ?, `real_name` = ?, `resend` = ?, `is_restricted` = ?, `is_ultra_restricted` = ?, `guest_expiration_ts` = ? WHERE 1;

--
-- DELETE template for table `admin_users_invite_request`
--
DELETE FROM `admin_users_invite_request` WHERE 0;

