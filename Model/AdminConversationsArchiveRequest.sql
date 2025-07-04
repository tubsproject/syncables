--
-- Slack Web API.
-- Prepared SQL queries for 'admin_conversations_archive_request' definition.
--


--
-- SELECT template for table `admin_conversations_archive_request`
--
SELECT `channel_id` FROM `admin_conversations_archive_request` WHERE 1;

--
-- INSERT template for table `admin_conversations_archive_request`
--
INSERT INTO `admin_conversations_archive_request`(`channel_id`) VALUES (?);

--
-- UPDATE template for table `admin_conversations_archive_request`
--
UPDATE `admin_conversations_archive_request` SET `channel_id` = ? WHERE 1;

--
-- DELETE template for table `admin_conversations_archive_request`
--
DELETE FROM `admin_conversations_archive_request` WHERE 0;

