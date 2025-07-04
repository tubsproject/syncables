--
-- Slack Web API.
-- Prepared SQL queries for 'users_profile_set_schema' definition.
--


--
-- SELECT template for table `users_profile_set_schema`
--
SELECT `email_pending`, `ok`, `profile`, `username` FROM `users_profile_set_schema` WHERE 1;

--
-- INSERT template for table `users_profile_set_schema`
--
INSERT INTO `users_profile_set_schema`(`email_pending`, `ok`, `profile`, `username`) VALUES (?, ?, ?, ?);

--
-- UPDATE template for table `users_profile_set_schema`
--
UPDATE `users_profile_set_schema` SET `email_pending` = ?, `ok` = ?, `profile` = ?, `username` = ? WHERE 1;

--
-- DELETE template for table `users_profile_set_schema`
--
DELETE FROM `users_profile_set_schema` WHERE 0;

