--
-- Slack Web API.
-- Prepared SQL queries for 'chat_deleteScheduledMessage_request' definition.
--


--
-- SELECT template for table `chat_deleteScheduledMessage_request`
--
SELECT `as_user`, `channel`, `scheduled_message_id` FROM `chat_deleteScheduledMessage_request` WHERE 1;

--
-- INSERT template for table `chat_deleteScheduledMessage_request`
--
INSERT INTO `chat_deleteScheduledMessage_request`(`as_user`, `channel`, `scheduled_message_id`) VALUES (?, ?, ?);

--
-- UPDATE template for table `chat_deleteScheduledMessage_request`
--
UPDATE `chat_deleteScheduledMessage_request` SET `as_user` = ?, `channel` = ?, `scheduled_message_id` = ? WHERE 1;

--
-- DELETE template for table `chat_deleteScheduledMessage_request`
--
DELETE FROM `chat_deleteScheduledMessage_request` WHERE 0;

