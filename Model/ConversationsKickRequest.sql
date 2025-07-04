--
-- Slack Web API.
-- Prepared SQL queries for 'conversations_kick_request' definition.
--


--
-- SELECT template for table `conversations_kick_request`
--
SELECT `channel`, `user` FROM `conversations_kick_request` WHERE 1;

--
-- INSERT template for table `conversations_kick_request`
--
INSERT INTO `conversations_kick_request`(`channel`, `user`) VALUES (?, ?);

--
-- UPDATE template for table `conversations_kick_request`
--
UPDATE `conversations_kick_request` SET `channel` = ?, `user` = ? WHERE 1;

--
-- DELETE template for table `conversations_kick_request`
--
DELETE FROM `conversations_kick_request` WHERE 0;

