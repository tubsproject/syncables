--
-- Slack Web API.
-- Prepared SQL queries for 'chat_meMessage_request' definition.
--


--
-- SELECT template for table `chat_meMessage_request`
--
SELECT `channel`, `text` FROM `chat_meMessage_request` WHERE 1;

--
-- INSERT template for table `chat_meMessage_request`
--
INSERT INTO `chat_meMessage_request`(`channel`, `text`) VALUES (?, ?);

--
-- UPDATE template for table `chat_meMessage_request`
--
UPDATE `chat_meMessage_request` SET `channel` = ?, `text` = ? WHERE 1;

--
-- DELETE template for table `chat_meMessage_request`
--
DELETE FROM `chat_meMessage_request` WHERE 0;

