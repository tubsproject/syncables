--
-- Slack Web API.
-- Prepared SQL queries for 'admin_conversations_getConversationPrefs_schema' definition.
--


--
-- SELECT template for table `admin_conversations_getConversationPrefs_schema`
--
SELECT `ok`, `prefs` FROM `admin_conversations_getConversationPrefs_schema` WHERE 1;

--
-- INSERT template for table `admin_conversations_getConversationPrefs_schema`
--
INSERT INTO `admin_conversations_getConversationPrefs_schema`(`ok`, `prefs`) VALUES (?, ?);

--
-- UPDATE template for table `admin_conversations_getConversationPrefs_schema`
--
UPDATE `admin_conversations_getConversationPrefs_schema` SET `ok` = ?, `prefs` = ? WHERE 1;

--
-- DELETE template for table `admin_conversations_getConversationPrefs_schema`
--
DELETE FROM `admin_conversations_getConversationPrefs_schema` WHERE 0;

