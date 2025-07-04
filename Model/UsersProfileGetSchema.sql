--
-- Slack Web API.
-- Prepared SQL queries for 'users_profile_get_schema' definition.
--


--
-- SELECT template for table `users_profile_get_schema`
--
SELECT `ok`, `profile` FROM `users_profile_get_schema` WHERE 1;

--
-- INSERT template for table `users_profile_get_schema`
--
INSERT INTO `users_profile_get_schema`(`ok`, `profile`) VALUES (?, ?);

--
-- UPDATE template for table `users_profile_get_schema`
--
UPDATE `users_profile_get_schema` SET `ok` = ?, `profile` = ? WHERE 1;

--
-- DELETE template for table `users_profile_get_schema`
--
DELETE FROM `users_profile_get_schema` WHERE 0;

