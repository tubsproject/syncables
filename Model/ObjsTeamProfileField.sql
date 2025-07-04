--
-- Slack Web API.
-- Prepared SQL queries for 'objs_team_profile_field' definition.
--


--
-- SELECT template for table `objs_team_profile_field`
--
SELECT `hint`, `id`, `is_hidden`, `label`, `options`, `ordering`, `type` FROM `objs_team_profile_field` WHERE 1;

--
-- INSERT template for table `objs_team_profile_field`
--
INSERT INTO `objs_team_profile_field`(`hint`, `id`, `is_hidden`, `label`, `options`, `ordering`, `type`) VALUES (?, ?, ?, ?, ?, ?, ?);

--
-- UPDATE template for table `objs_team_profile_field`
--
UPDATE `objs_team_profile_field` SET `hint` = ?, `id` = ?, `is_hidden` = ?, `label` = ?, `options` = ?, `ordering` = ?, `type` = ? WHERE 1;

--
-- DELETE template for table `objs_team_profile_field`
--
DELETE FROM `objs_team_profile_field` WHERE 0;

