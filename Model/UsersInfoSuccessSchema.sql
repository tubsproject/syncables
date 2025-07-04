--
-- Slack Web API.
-- Prepared SQL queries for 'users_info_success_schema' definition.
--


--
-- SELECT template for table `users_info_success_schema`
--
SELECT `ok`, `user` FROM `users_info_success_schema` WHERE 1;

--
-- INSERT template for table `users_info_success_schema`
--
INSERT INTO `users_info_success_schema`(`ok`, `user`) VALUES (?, ?);

--
-- UPDATE template for table `users_info_success_schema`
--
UPDATE `users_info_success_schema` SET `ok` = ?, `user` = ? WHERE 1;

--
-- DELETE template for table `users_info_success_schema`
--
DELETE FROM `users_info_success_schema` WHERE 0;

