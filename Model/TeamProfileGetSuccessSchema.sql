--
-- Slack Web API.
-- Prepared SQL queries for 'team_profile_get_success_schema' definition.
--


--
-- SELECT template for table `team_profile_get_success_schema`
--
SELECT `ok`, `profile` FROM `team_profile_get_success_schema` WHERE 1;

--
-- INSERT template for table `team_profile_get_success_schema`
--
INSERT INTO `team_profile_get_success_schema`(`ok`, `profile`) VALUES (?, ?);

--
-- UPDATE template for table `team_profile_get_success_schema`
--
UPDATE `team_profile_get_success_schema` SET `ok` = ?, `profile` = ? WHERE 1;

--
-- DELETE template for table `team_profile_get_success_schema`
--
DELETE FROM `team_profile_get_success_schema` WHERE 0;

