--
-- Slack Web API.
-- Prepared SQL queries for 'objs_message' definition.
--


--
-- SELECT template for table `objs_message`
--
SELECT `attachments`, `blocks`, `bot_id`, `bot_profile`, `client_msg_id`, `comment`, `display_as_bot`, `file`, `files`, `icons`, `inviter`, `is_delayed_message`, `is_intro`, `is_starred`, `last_read`, `latest_reply`, `name`, `old_name`, `parent_user_id`, `permalink`, `pinned_to`, `purpose`, `reactions`, `reply_count`, `reply_users`, `reply_users_count`, `source_team`, `subscribed`, `subtype`, `team`, `text`, `thread_ts`, `topic`, `ts`, `type`, `unread_count`, `upload`, `user`, `user_profile`, `user_team`, `username` FROM `objs_message` WHERE 1;

--
-- INSERT template for table `objs_message`
--
INSERT INTO `objs_message`(`attachments`, `blocks`, `bot_id`, `bot_profile`, `client_msg_id`, `comment`, `display_as_bot`, `file`, `files`, `icons`, `inviter`, `is_delayed_message`, `is_intro`, `is_starred`, `last_read`, `latest_reply`, `name`, `old_name`, `parent_user_id`, `permalink`, `pinned_to`, `purpose`, `reactions`, `reply_count`, `reply_users`, `reply_users_count`, `source_team`, `subscribed`, `subtype`, `team`, `text`, `thread_ts`, `topic`, `ts`, `type`, `unread_count`, `upload`, `user`, `user_profile`, `user_team`, `username`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

--
-- UPDATE template for table `objs_message`
--
UPDATE `objs_message` SET `attachments` = ?, `blocks` = ?, `bot_id` = ?, `bot_profile` = ?, `client_msg_id` = ?, `comment` = ?, `display_as_bot` = ?, `file` = ?, `files` = ?, `icons` = ?, `inviter` = ?, `is_delayed_message` = ?, `is_intro` = ?, `is_starred` = ?, `last_read` = ?, `latest_reply` = ?, `name` = ?, `old_name` = ?, `parent_user_id` = ?, `permalink` = ?, `pinned_to` = ?, `purpose` = ?, `reactions` = ?, `reply_count` = ?, `reply_users` = ?, `reply_users_count` = ?, `source_team` = ?, `subscribed` = ?, `subtype` = ?, `team` = ?, `text` = ?, `thread_ts` = ?, `topic` = ?, `ts` = ?, `type` = ?, `unread_count` = ?, `upload` = ?, `user` = ?, `user_profile` = ?, `user_team` = ?, `username` = ? WHERE 1;

--
-- DELETE template for table `objs_message`
--
DELETE FROM `objs_message` WHERE 0;

