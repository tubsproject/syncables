--
-- Slack Web API.
-- Prepared SQL queries for 'chat_postEphemeral_request' definition.
--


--
-- SELECT template for table `chat_postEphemeral_request`
--
SELECT `as_user`, `attachments`, `blocks`, `channel`, `icon_emoji`, `icon_url`, `link_names`, `parse`, `text`, `thread_ts`, `user`, `username` FROM `chat_postEphemeral_request` WHERE 1;

--
-- INSERT template for table `chat_postEphemeral_request`
--
INSERT INTO `chat_postEphemeral_request`(`as_user`, `attachments`, `blocks`, `channel`, `icon_emoji`, `icon_url`, `link_names`, `parse`, `text`, `thread_ts`, `user`, `username`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

--
-- UPDATE template for table `chat_postEphemeral_request`
--
UPDATE `chat_postEphemeral_request` SET `as_user` = ?, `attachments` = ?, `blocks` = ?, `channel` = ?, `icon_emoji` = ?, `icon_url` = ?, `link_names` = ?, `parse` = ?, `text` = ?, `thread_ts` = ?, `user` = ?, `username` = ? WHERE 1;

--
-- DELETE template for table `chat_postEphemeral_request`
--
DELETE FROM `chat_postEphemeral_request` WHERE 0;

