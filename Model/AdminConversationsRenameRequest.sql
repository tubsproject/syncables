--
-- Slack Web API.
-- Prepared SQL queries for 'admin_conversations_rename_request' definition.
--


--
-- SELECT template for table `admin_conversations_rename_request`
--
SELECT `channel_id`, `name` FROM `admin_conversations_rename_request` WHERE 1;

--
-- INSERT template for table `admin_conversations_rename_request`
--
INSERT INTO `admin_conversations_rename_request`(`channel_id`, `name`) VALUES (?, ?);

--
-- UPDATE template for table `admin_conversations_rename_request`
--
UPDATE `admin_conversations_rename_request` SET `channel_id` = ?, `name` = ? WHERE 1;

--
-- DELETE template for table `admin_conversations_rename_request`
--
DELETE FROM `admin_conversations_rename_request` WHERE 0;

