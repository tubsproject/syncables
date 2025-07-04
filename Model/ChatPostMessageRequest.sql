--
-- Slack Web API.
-- Prepared SQL queries for 'chat_postMessage_request' definition.
--


--
-- SELECT template for table `chat_postMessage_request`
--
SELECT `as_user`, `attachments`, `blocks`, `channel`, `icon_emoji`, `icon_url`, `link_names`, `mrkdwn`, `parse`, `reply_broadcast`, `text`, `thread_ts`, `unfurl_links`, `unfurl_media`, `username` FROM `chat_postMessage_request` WHERE 1;

--
-- INSERT template for table `chat_postMessage_request`
--
INSERT INTO `chat_postMessage_request`(`as_user`, `attachments`, `blocks`, `channel`, `icon_emoji`, `icon_url`, `link_names`, `mrkdwn`, `parse`, `reply_broadcast`, `text`, `thread_ts`, `unfurl_links`, `unfurl_media`, `username`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

--
-- UPDATE template for table `chat_postMessage_request`
--
UPDATE `chat_postMessage_request` SET `as_user` = ?, `attachments` = ?, `blocks` = ?, `channel` = ?, `icon_emoji` = ?, `icon_url` = ?, `link_names` = ?, `mrkdwn` = ?, `parse` = ?, `reply_broadcast` = ?, `text` = ?, `thread_ts` = ?, `unfurl_links` = ?, `unfurl_media` = ?, `username` = ? WHERE 1;

--
-- DELETE template for table `chat_postMessage_request`
--
DELETE FROM `chat_postMessage_request` WHERE 0;

