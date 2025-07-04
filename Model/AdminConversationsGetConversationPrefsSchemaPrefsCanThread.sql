--
-- Slack Web API.
-- Prepared SQL queries for 'admin_conversations_getConversationPrefs_schema_prefs_can_thread' definition.
--


--
-- SELECT template for table `admin_conversations_getConversationPrefs_schema_prefs_can_thread`
--
SELECT `type`, `user` FROM `admin_conversations_getConversationPrefs_schema_prefs_can_thread` WHERE 1;

--
-- INSERT template for table `admin_conversations_getConversationPrefs_schema_prefs_can_thread`
--
INSERT INTO `admin_conversations_getConversationPrefs_schema_prefs_can_thread`(`type`, `user`) VALUES (?, ?);

--
-- UPDATE template for table `admin_conversations_getConversationPrefs_schema_prefs_can_thread`
--
UPDATE `admin_conversations_getConversationPrefs_schema_prefs_can_thread` SET `type` = ?, `user` = ? WHERE 1;

--
-- DELETE template for table `admin_conversations_getConversationPrefs_schema_prefs_can_thread`
--
DELETE FROM `admin_conversations_getConversationPrefs_schema_prefs_can_thread` WHERE 0;

