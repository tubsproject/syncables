--
-- Slack Web API.
-- Prepared SQL queries for 'admin_conversations_create_schema' definition.
--


--
-- SELECT template for table `admin_conversations_create_schema`
--
SELECT `channel_id`, `ok` FROM `admin_conversations_create_schema` WHERE 1;

--
-- INSERT template for table `admin_conversations_create_schema`
--
INSERT INTO `admin_conversations_create_schema`(`channel_id`, `ok`) VALUES (?, ?);

--
-- UPDATE template for table `admin_conversations_create_schema`
--
UPDATE `admin_conversations_create_schema` SET `channel_id` = ?, `ok` = ? WHERE 1;

--
-- DELETE template for table `admin_conversations_create_schema`
--
DELETE FROM `admin_conversations_create_schema` WHERE 0;

