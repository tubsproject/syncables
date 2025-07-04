--
-- Slack Web API.
-- Prepared SQL queries for 'chat_update_request' definition.
--


--
-- SELECT template for table `chat_update_request`
--
SELECT `as_user`, `attachments`, `blocks`, `channel`, `link_names`, `parse`, `text`, `ts` FROM `chat_update_request` WHERE 1;

--
-- INSERT template for table `chat_update_request`
--
INSERT INTO `chat_update_request`(`as_user`, `attachments`, `blocks`, `channel`, `link_names`, `parse`, `text`, `ts`) VALUES (?, ?, ?, ?, ?, ?, ?, ?);

--
-- UPDATE template for table `chat_update_request`
--
UPDATE `chat_update_request` SET `as_user` = ?, `attachments` = ?, `blocks` = ?, `channel` = ?, `link_names` = ?, `parse` = ?, `text` = ?, `ts` = ? WHERE 1;

--
-- DELETE template for table `chat_update_request`
--
DELETE FROM `chat_update_request` WHERE 0;

