--
-- Slack Web API.
-- Prepared SQL queries for 'objs_bot_profile' definition.
--


--
-- SELECT template for table `objs_bot_profile`
--
SELECT `app_id`, `deleted`, `icons`, `id`, `name`, `team_id`, `updated` FROM `objs_bot_profile` WHERE 1;

--
-- INSERT template for table `objs_bot_profile`
--
INSERT INTO `objs_bot_profile`(`app_id`, `deleted`, `icons`, `id`, `name`, `team_id`, `updated`) VALUES (?, ?, ?, ?, ?, ?, ?);

--
-- UPDATE template for table `objs_bot_profile`
--
UPDATE `objs_bot_profile` SET `app_id` = ?, `deleted` = ?, `icons` = ?, `id` = ?, `name` = ?, `team_id` = ?, `updated` = ? WHERE 1;

--
-- DELETE template for table `objs_bot_profile`
--
DELETE FROM `objs_bot_profile` WHERE 0;

