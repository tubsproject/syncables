--
-- Slack Web API.
-- Prepared SQL queries for 'admin_conversations_setConversationPrefs_request' definition.
--


--
-- SELECT template for table `admin_conversations_setConversationPrefs_request`
--
SELECT `channel_id`, `prefs` FROM `admin_conversations_setConversationPrefs_request` WHERE 1;

--
-- INSERT template for table `admin_conversations_setConversationPrefs_request`
--
INSERT INTO `admin_conversations_setConversationPrefs_request`(`channel_id`, `prefs`) VALUES (?, ?);

--
-- UPDATE template for table `admin_conversations_setConversationPrefs_request`
--
UPDATE `admin_conversations_setConversationPrefs_request` SET `channel_id` = ?, `prefs` = ? WHERE 1;

--
-- DELETE template for table `admin_conversations_setConversationPrefs_request`
--
DELETE FROM `admin_conversations_setConversationPrefs_request` WHERE 0;

