--
-- Slack Web API.
-- Prepared SQL queries for 'admin_conversations_getConversationPrefs_schema_prefs' definition.
--


--
-- SELECT template for table `admin_conversations_getConversationPrefs_schema_prefs`
--
SELECT `can_thread`, `who_can_post` FROM `admin_conversations_getConversationPrefs_schema_prefs` WHERE 1;

--
-- INSERT template for table `admin_conversations_getConversationPrefs_schema_prefs`
--
INSERT INTO `admin_conversations_getConversationPrefs_schema_prefs`(`can_thread`, `who_can_post`) VALUES (?, ?);

--
-- UPDATE template for table `admin_conversations_getConversationPrefs_schema_prefs`
--
UPDATE `admin_conversations_getConversationPrefs_schema_prefs` SET `can_thread` = ?, `who_can_post` = ? WHERE 1;

--
-- DELETE template for table `admin_conversations_getConversationPrefs_schema_prefs`
--
DELETE FROM `admin_conversations_getConversationPrefs_schema_prefs` WHERE 0;

