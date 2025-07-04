--
-- Slack Web API.
-- Prepared SQL queries for 'conversations_setTopic_request' definition.
--


--
-- SELECT template for table `conversations_setTopic_request`
--
SELECT `channel`, `topic` FROM `conversations_setTopic_request` WHERE 1;

--
-- INSERT template for table `conversations_setTopic_request`
--
INSERT INTO `conversations_setTopic_request`(`channel`, `topic`) VALUES (?, ?);

--
-- UPDATE template for table `conversations_setTopic_request`
--
UPDATE `conversations_setTopic_request` SET `channel` = ?, `topic` = ? WHERE 1;

--
-- DELETE template for table `conversations_setTopic_request`
--
DELETE FROM `conversations_setTopic_request` WHERE 0;

