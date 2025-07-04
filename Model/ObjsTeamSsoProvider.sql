--
-- Slack Web API.
-- Prepared SQL queries for 'objs_team_sso_provider' definition.
--


--
-- SELECT template for table `objs_team_sso_provider`
--
SELECT `label`, `name`, `type` FROM `objs_team_sso_provider` WHERE 1;

--
-- INSERT template for table `objs_team_sso_provider`
--
INSERT INTO `objs_team_sso_provider`(`label`, `name`, `type`) VALUES (?, ?, ?);

--
-- UPDATE template for table `objs_team_sso_provider`
--
UPDATE `objs_team_sso_provider` SET `label` = ?, `name` = ?, `type` = ? WHERE 1;

--
-- DELETE template for table `objs_team_sso_provider`
--
DELETE FROM `objs_team_sso_provider` WHERE 0;

