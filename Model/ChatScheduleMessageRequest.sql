--
-- Slack Web API.
-- Prepared SQL queries for 'chat_scheduleMessage_request' definition.
--


--
-- SELECT template for table `chat_scheduleMessage_request`
--
SELECT `channel`, `text`, `post_at`, `parse`, `as_user`, `link_names`, `attachments`, `blocks`, `unfurl_links`, `unfurl_media`, `thread_ts`, `reply_broadcast` FROM `chat_scheduleMessage_request` WHERE 1;

--
-- INSERT template for table `chat_scheduleMessage_request`
--
INSERT INTO `chat_scheduleMessage_request`(`channel`, `text`, `post_at`, `parse`, `as_user`, `link_names`, `attachments`, `blocks`, `unfurl_links`, `unfurl_media`, `thread_ts`, `reply_broadcast`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

--
-- UPDATE template for table `chat_scheduleMessage_request`
--
UPDATE `chat_scheduleMessage_request` SET `channel` = ?, `text` = ?, `post_at` = ?, `parse` = ?, `as_user` = ?, `link_names` = ?, `attachments` = ?, `blocks` = ?, `unfurl_links` = ?, `unfurl_media` = ?, `thread_ts` = ?, `reply_broadcast` = ? WHERE 1;

--
-- DELETE template for table `chat_scheduleMessage_request`
--
DELETE FROM `chat_scheduleMessage_request` WHERE 0;

