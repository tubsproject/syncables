--
-- Slack Web API.
-- Prepared SQL queries for 'objs_user_profile' definition.
--


--
-- SELECT template for table `objs_user_profile`
--
SELECT `always_active`, `api_app_id`, `avatar_hash`, `bot_id`, `display_name`, `display_name_normalized`, `is_app_user`, `is_custom_image`, `last_avatar_image_hash`, `memberships_count`, `phone`, `pronouns`, `real_name`, `real_name_normalized`, `skype`, `status_default_emoji`, `status_default_text`, `status_emoji`, `status_expiration`, `status_text`, `team`, `title`, `updated`, `user_id` FROM `objs_user_profile` WHERE 1;

--
-- INSERT template for table `objs_user_profile`
--
INSERT INTO `objs_user_profile`(`always_active`, `api_app_id`, `avatar_hash`, `bot_id`, `display_name`, `display_name_normalized`, `is_app_user`, `is_custom_image`, `last_avatar_image_hash`, `memberships_count`, `phone`, `pronouns`, `real_name`, `real_name_normalized`, `skype`, `status_default_emoji`, `status_default_text`, `status_emoji`, `status_expiration`, `status_text`, `team`, `title`, `updated`, `user_id`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

--
-- UPDATE template for table `objs_user_profile`
--
UPDATE `objs_user_profile` SET `always_active` = ?, `api_app_id` = ?, `avatar_hash` = ?, `bot_id` = ?, `display_name` = ?, `display_name_normalized` = ?, `is_app_user` = ?, `is_custom_image` = ?, `last_avatar_image_hash` = ?, `memberships_count` = ?, `phone` = ?, `pronouns` = ?, `real_name` = ?, `real_name_normalized` = ?, `skype` = ?, `status_default_emoji` = ?, `status_default_text` = ?, `status_emoji` = ?, `status_expiration` = ?, `status_text` = ?, `team` = ?, `title` = ?, `updated` = ?, `user_id` = ? WHERE 1;

--
-- DELETE template for table `objs_user_profile`
--
DELETE FROM `objs_user_profile` WHERE 0;

