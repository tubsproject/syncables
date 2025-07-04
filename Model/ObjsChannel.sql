--
-- Slack Web API.
-- Prepared SQL queries for 'objs_channel' definition.
--


--
-- SELECT template for table `objs_channel`
--
SELECT `accepted_user`, `created`, `creator`, `id`, `is_archived`, `is_channel`, `is_frozen`, `is_general`, `is_member`, `is_moved`, `is_mpim`, `is_non_threadable`, `is_org_shared`, `is_pending_ext_shared`, `is_private`, `is_read_only`, `is_shared`, `is_thread_only`, `last_read`, `latest`, `members`, `name`, `name_normalized`, `num_members`, `pending_shared`, `previous_names`, `priority`, `purpose`, `topic`, `unlinked`, `unread_count`, `unread_count_display` FROM `objs_channel` WHERE 1;

--
-- INSERT template for table `objs_channel`
--
INSERT INTO `objs_channel`(`accepted_user`, `created`, `creator`, `id`, `is_archived`, `is_channel`, `is_frozen`, `is_general`, `is_member`, `is_moved`, `is_mpim`, `is_non_threadable`, `is_org_shared`, `is_pending_ext_shared`, `is_private`, `is_read_only`, `is_shared`, `is_thread_only`, `last_read`, `latest`, `members`, `name`, `name_normalized`, `num_members`, `pending_shared`, `previous_names`, `priority`, `purpose`, `topic`, `unlinked`, `unread_count`, `unread_count_display`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

--
-- UPDATE template for table `objs_channel`
--
UPDATE `objs_channel` SET `accepted_user` = ?, `created` = ?, `creator` = ?, `id` = ?, `is_archived` = ?, `is_channel` = ?, `is_frozen` = ?, `is_general` = ?, `is_member` = ?, `is_moved` = ?, `is_mpim` = ?, `is_non_threadable` = ?, `is_org_shared` = ?, `is_pending_ext_shared` = ?, `is_private` = ?, `is_read_only` = ?, `is_shared` = ?, `is_thread_only` = ?, `last_read` = ?, `latest` = ?, `members` = ?, `name` = ?, `name_normalized` = ?, `num_members` = ?, `pending_shared` = ?, `previous_names` = ?, `priority` = ?, `purpose` = ?, `topic` = ?, `unlinked` = ?, `unread_count` = ?, `unread_count_display` = ? WHERE 1;

--
-- DELETE template for table `objs_channel`
--
DELETE FROM `objs_channel` WHERE 0;

