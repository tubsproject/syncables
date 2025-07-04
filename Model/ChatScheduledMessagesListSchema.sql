--
-- Slack Web API.
-- Prepared SQL queries for 'chat_scheduledMessages_list_schema' definition.
--


--
-- SELECT template for table `chat_scheduledMessages_list_schema`
--
SELECT `ok`, `response_metadata`, `scheduled_messages` FROM `chat_scheduledMessages_list_schema` WHERE 1;

--
-- INSERT template for table `chat_scheduledMessages_list_schema`
--
INSERT INTO `chat_scheduledMessages_list_schema`(`ok`, `response_metadata`, `scheduled_messages`) VALUES (?, ?, ?);

--
-- UPDATE template for table `chat_scheduledMessages_list_schema`
--
UPDATE `chat_scheduledMessages_list_schema` SET `ok` = ?, `response_metadata` = ?, `scheduled_messages` = ? WHERE 1;

--
-- DELETE template for table `chat_scheduledMessages_list_schema`
--
DELETE FROM `chat_scheduledMessages_list_schema` WHERE 0;

