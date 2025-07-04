--
-- Slack Web API.
-- Prepared SQL queries for 'objs_subteam' definition.
--


--
-- SELECT template for table `objs_subteam`
--
SELECT `auto_provision`, `auto_type`, `channel_count`, `created_by`, `date_create`, `date_delete`, `date_update`, `deleted_by`, `description`, `enterprise_subteam_id`, `handle`, `id`, `is_external`, `is_subteam`, `is_usergroup`, `name`, `prefs`, `team_id`, `updated_by`, `user_count`, `users` FROM `objs_subteam` WHERE 1;

--
-- INSERT template for table `objs_subteam`
--
INSERT INTO `objs_subteam`(`auto_provision`, `auto_type`, `channel_count`, `created_by`, `date_create`, `date_delete`, `date_update`, `deleted_by`, `description`, `enterprise_subteam_id`, `handle`, `id`, `is_external`, `is_subteam`, `is_usergroup`, `name`, `prefs`, `team_id`, `updated_by`, `user_count`, `users`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

--
-- UPDATE template for table `objs_subteam`
--
UPDATE `objs_subteam` SET `auto_provision` = ?, `auto_type` = ?, `channel_count` = ?, `created_by` = ?, `date_create` = ?, `date_delete` = ?, `date_update` = ?, `deleted_by` = ?, `description` = ?, `enterprise_subteam_id` = ?, `handle` = ?, `id` = ?, `is_external` = ?, `is_subteam` = ?, `is_usergroup` = ?, `name` = ?, `prefs` = ?, `team_id` = ?, `updated_by` = ?, `user_count` = ?, `users` = ? WHERE 1;

--
-- DELETE template for table `objs_subteam`
--
DELETE FROM `objs_subteam` WHERE 0;

