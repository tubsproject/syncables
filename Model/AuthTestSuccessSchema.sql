--
-- Slack Web API.
-- Prepared SQL queries for 'auth_test_success_schema' definition.
--


--
-- SELECT template for table `auth_test_success_schema`
--
SELECT `bot_id`, `is_enterprise_install`, `ok`, `team`, `team_id`, `url`, `user`, `user_id` FROM `auth_test_success_schema` WHERE 1;

--
-- INSERT template for table `auth_test_success_schema`
--
INSERT INTO `auth_test_success_schema`(`bot_id`, `is_enterprise_install`, `ok`, `team`, `team_id`, `url`, `user`, `user_id`) VALUES (?, ?, ?, ?, ?, ?, ?, ?);

--
-- UPDATE template for table `auth_test_success_schema`
--
UPDATE `auth_test_success_schema` SET `bot_id` = ?, `is_enterprise_install` = ?, `ok` = ?, `team` = ?, `team_id` = ?, `url` = ?, `user` = ?, `user_id` = ? WHERE 1;

--
-- DELETE template for table `auth_test_success_schema`
--
DELETE FROM `auth_test_success_schema` WHERE 0;

