--
-- Slack Web API.
-- Prepared SQL queries for 'conversations_history_success_schema' definition.
--


--
-- SELECT template for table `conversations_history_success_schema`
--
SELECT `channel_actions_count`, `channel_actions_ts`, `has_more`, `messages`, `ok`, `pin_count` FROM `conversations_history_success_schema` WHERE 1;

--
-- INSERT template for table `conversations_history_success_schema`
--
INSERT INTO `conversations_history_success_schema`(`channel_actions_count`, `channel_actions_ts`, `has_more`, `messages`, `ok`, `pin_count`) VALUES (?, ?, ?, ?, ?, ?);

--
-- UPDATE template for table `conversations_history_success_schema`
--
UPDATE `conversations_history_success_schema` SET `channel_actions_count` = ?, `channel_actions_ts` = ?, `has_more` = ?, `messages` = ?, `ok` = ?, `pin_count` = ? WHERE 1;

--
-- DELETE template for table `conversations_history_success_schema`
--
DELETE FROM `conversations_history_success_schema` WHERE 0;

