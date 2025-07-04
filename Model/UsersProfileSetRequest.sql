--
-- Slack Web API.
-- Prepared SQL queries for 'users_profile_set_request' definition.
--


--
-- SELECT template for table `users_profile_set_request`
--
SELECT `name`, `profile`, `user`, `value` FROM `users_profile_set_request` WHERE 1;

--
-- INSERT template for table `users_profile_set_request`
--
INSERT INTO `users_profile_set_request`(`name`, `profile`, `user`, `value`) VALUES (?, ?, ?, ?);

--
-- UPDATE template for table `users_profile_set_request`
--
UPDATE `users_profile_set_request` SET `name` = ?, `profile` = ?, `user` = ?, `value` = ? WHERE 1;

--
-- DELETE template for table `users_profile_set_request`
--
DELETE FROM `users_profile_set_request` WHERE 0;

