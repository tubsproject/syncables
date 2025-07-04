--
-- Slack Web API.
-- Prepared SQL queries for 'usergroups_users_update_request' definition.
--


--
-- SELECT template for table `usergroups_users_update_request`
--
SELECT `include_count`, `usergroup`, `users` FROM `usergroups_users_update_request` WHERE 1;

--
-- INSERT template for table `usergroups_users_update_request`
--
INSERT INTO `usergroups_users_update_request`(`include_count`, `usergroup`, `users`) VALUES (?, ?, ?);

--
-- UPDATE template for table `usergroups_users_update_request`
--
UPDATE `usergroups_users_update_request` SET `include_count` = ?, `usergroup` = ?, `users` = ? WHERE 1;

--
-- DELETE template for table `usergroups_users_update_request`
--
DELETE FROM `usergroups_users_update_request` WHERE 0;

