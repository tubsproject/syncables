--
-- Slack Web API.
-- Prepared SQL queries for 'admin_conversations_invite_request' definition.
--


--
-- SELECT template for table `admin_conversations_invite_request`
--
SELECT `user_ids`, `channel_id` FROM `admin_conversations_invite_request` WHERE 1;

--
-- INSERT template for table `admin_conversations_invite_request`
--
INSERT INTO `admin_conversations_invite_request`(`user_ids`, `channel_id`) VALUES (?, ?);

--
-- UPDATE template for table `admin_conversations_invite_request`
--
UPDATE `admin_conversations_invite_request` SET `user_ids` = ?, `channel_id` = ? WHERE 1;

--
-- DELETE template for table `admin_conversations_invite_request`
--
DELETE FROM `admin_conversations_invite_request` WHERE 0;

