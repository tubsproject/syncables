--
-- Slack Web API.
-- Prepared SQL queries for 'admin_conversations_disconnectShared_request' definition.
--


--
-- SELECT template for table `admin_conversations_disconnectShared_request`
--
SELECT `channel_id`, `leaving_team_ids` FROM `admin_conversations_disconnectShared_request` WHERE 1;

--
-- INSERT template for table `admin_conversations_disconnectShared_request`
--
INSERT INTO `admin_conversations_disconnectShared_request`(`channel_id`, `leaving_team_ids`) VALUES (?, ?);

--
-- UPDATE template for table `admin_conversations_disconnectShared_request`
--
UPDATE `admin_conversations_disconnectShared_request` SET `channel_id` = ?, `leaving_team_ids` = ? WHERE 1;

--
-- DELETE template for table `admin_conversations_disconnectShared_request`
--
DELETE FROM `admin_conversations_disconnectShared_request` WHERE 0;

