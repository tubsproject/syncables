--
-- Slack Web API.
-- Prepared SQL queries for 'chat_unfurl_request' definition.
--


--
-- SELECT template for table `chat_unfurl_request`
--
SELECT `channel`, `ts`, `unfurls`, `user_auth_message`, `user_auth_required`, `user_auth_url` FROM `chat_unfurl_request` WHERE 1;

--
-- INSERT template for table `chat_unfurl_request`
--
INSERT INTO `chat_unfurl_request`(`channel`, `ts`, `unfurls`, `user_auth_message`, `user_auth_required`, `user_auth_url`) VALUES (?, ?, ?, ?, ?, ?);

--
-- UPDATE template for table `chat_unfurl_request`
--
UPDATE `chat_unfurl_request` SET `channel` = ?, `ts` = ?, `unfurls` = ?, `user_auth_message` = ?, `user_auth_required` = ?, `user_auth_url` = ? WHERE 1;

--
-- DELETE template for table `chat_unfurl_request`
--
DELETE FROM `chat_unfurl_request` WHERE 0;

