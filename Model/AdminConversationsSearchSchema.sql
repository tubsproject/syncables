--
-- Slack Web API.
-- Prepared SQL queries for 'admin_conversations_search_schema' definition.
--


--
-- SELECT template for table `admin_conversations_search_schema`
--
SELECT `channels`, `next_cursor` FROM `admin_conversations_search_schema` WHERE 1;

--
-- INSERT template for table `admin_conversations_search_schema`
--
INSERT INTO `admin_conversations_search_schema`(`channels`, `next_cursor`) VALUES (?, ?);

--
-- UPDATE template for table `admin_conversations_search_schema`
--
UPDATE `admin_conversations_search_schema` SET `channels` = ?, `next_cursor` = ? WHERE 1;

--
-- DELETE template for table `admin_conversations_search_schema`
--
DELETE FROM `admin_conversations_search_schema` WHERE 0;

