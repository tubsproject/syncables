--
-- Slack Web API.
-- Prepared SQL queries for 'conversations_invite_request' definition.
--


--
-- SELECT template for table `conversations_invite_request`
--
SELECT `channel`, `users` FROM `conversations_invite_request` WHERE 1;

--
-- INSERT template for table `conversations_invite_request`
--
INSERT INTO `conversations_invite_request`(`channel`, `users`) VALUES (?, ?);

--
-- UPDATE template for table `conversations_invite_request`
--
UPDATE `conversations_invite_request` SET `channel` = ?, `users` = ? WHERE 1;

--
-- DELETE template for table `conversations_invite_request`
--
DELETE FROM `conversations_invite_request` WHERE 0;

