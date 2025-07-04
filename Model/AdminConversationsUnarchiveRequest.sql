--
-- Slack Web API.
-- Prepared SQL queries for 'admin_conversations_unarchive_request' definition.
--


--
-- SELECT template for table `admin_conversations_unarchive_request`
--
SELECT `channel_id` FROM `admin_conversations_unarchive_request` WHERE 1;

--
-- INSERT template for table `admin_conversations_unarchive_request`
--
INSERT INTO `admin_conversations_unarchive_request`(`channel_id`) VALUES (?);

--
-- UPDATE template for table `admin_conversations_unarchive_request`
--
UPDATE `admin_conversations_unarchive_request` SET `channel_id` = ? WHERE 1;

--
-- DELETE template for table `admin_conversations_unarchive_request`
--
DELETE FROM `admin_conversations_unarchive_request` WHERE 0;

