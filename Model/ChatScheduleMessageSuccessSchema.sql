--
-- Slack Web API.
-- Prepared SQL queries for 'chat_scheduleMessage_success_schema' definition.
--


--
-- SELECT template for table `chat_scheduleMessage_success_schema`
--
SELECT `channel`, `message`, `ok`, `post_at`, `scheduled_message_id` FROM `chat_scheduleMessage_success_schema` WHERE 1;

--
-- INSERT template for table `chat_scheduleMessage_success_schema`
--
INSERT INTO `chat_scheduleMessage_success_schema`(`channel`, `message`, `ok`, `post_at`, `scheduled_message_id`) VALUES (?, ?, ?, ?, ?);

--
-- UPDATE template for table `chat_scheduleMessage_success_schema`
--
UPDATE `chat_scheduleMessage_success_schema` SET `channel` = ?, `message` = ?, `ok` = ?, `post_at` = ?, `scheduled_message_id` = ? WHERE 1;

--
-- DELETE template for table `chat_scheduleMessage_success_schema`
--
DELETE FROM `chat_scheduleMessage_success_schema` WHERE 0;

