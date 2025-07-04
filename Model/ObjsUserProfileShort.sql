--
-- Slack Web API.
-- Prepared SQL queries for 'objs_user_profile_short' definition.
--


--
-- SELECT template for table `objs_user_profile_short`
--
SELECT `avatar_hash`, `display_name`, `display_name_normalized`, `image_72`, `is_restricted`, `is_ultra_restricted`, `name`, `real_name`, `real_name_normalized`, `team` FROM `objs_user_profile_short` WHERE 1;

--
-- INSERT template for table `objs_user_profile_short`
--
INSERT INTO `objs_user_profile_short`(`avatar_hash`, `display_name`, `display_name_normalized`, `image_72`, `is_restricted`, `is_ultra_restricted`, `name`, `real_name`, `real_name_normalized`, `team`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

--
-- UPDATE template for table `objs_user_profile_short`
--
UPDATE `objs_user_profile_short` SET `avatar_hash` = ?, `display_name` = ?, `display_name_normalized` = ?, `image_72` = ?, `is_restricted` = ?, `is_ultra_restricted` = ?, `name` = ?, `real_name` = ?, `real_name_normalized` = ?, `team` = ? WHERE 1;

--
-- DELETE template for table `objs_user_profile_short`
--
DELETE FROM `objs_user_profile_short` WHERE 0;

