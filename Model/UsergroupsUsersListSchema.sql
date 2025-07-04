--
-- Slack Web API.
-- Prepared SQL queries for 'usergroups_users_list_schema' definition.
--


--
-- SELECT template for table `usergroups_users_list_schema`
--
SELECT `ok`, `users` FROM `usergroups_users_list_schema` WHERE 1;

--
-- INSERT template for table `usergroups_users_list_schema`
--
INSERT INTO `usergroups_users_list_schema`(`ok`, `users`) VALUES (?, ?);

--
-- UPDATE template for table `usergroups_users_list_schema`
--
UPDATE `usergroups_users_list_schema` SET `ok` = ?, `users` = ? WHERE 1;

--
-- DELETE template for table `usergroups_users_list_schema`
--
DELETE FROM `usergroups_users_list_schema` WHERE 0;

