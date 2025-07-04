--
-- Slack Web API.
-- Prepared SQL queries for 'chat_delete_request' definition.
--


--
-- SELECT template for table `chat_delete_request`
--
SELECT `ts`, `channel`, `as_user` FROM `chat_delete_request` WHERE 1;

--
-- INSERT template for table `chat_delete_request`
--
INSERT INTO `chat_delete_request`(`ts`, `channel`, `as_user`) VALUES (?, ?, ?);

--
-- UPDATE template for table `chat_delete_request`
--
UPDATE `chat_delete_request` SET `ts` = ?, `channel` = ?, `as_user` = ? WHERE 1;

--
-- DELETE template for table `chat_delete_request`
--
DELETE FROM `chat_delete_request` WHERE 0;

