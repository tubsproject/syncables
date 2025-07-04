--
-- Slack Web API.
-- Prepared SQL queries for 'admin_conversations_delete_request' definition.
--


--
-- SELECT template for table `admin_conversations_delete_request`
--
SELECT `channel_id` FROM `admin_conversations_delete_request` WHERE 1;

--
-- INSERT template for table `admin_conversations_delete_request`
--
INSERT INTO `admin_conversations_delete_request`(`channel_id`) VALUES (?);

--
-- UPDATE template for table `admin_conversations_delete_request`
--
UPDATE `admin_conversations_delete_request` SET `channel_id` = ? WHERE 1;

--
-- DELETE template for table `admin_conversations_delete_request`
--
DELETE FROM `admin_conversations_delete_request` WHERE 0;

