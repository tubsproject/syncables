--
-- Slack Web API.
-- Prepared SQL queries for 'usergroups_update_request' definition.
--


--
-- SELECT template for table `usergroups_update_request`
--
SELECT `handle`, `description`, `channels`, `include_count`, `usergroup`, `name` FROM `usergroups_update_request` WHERE 1;

--
-- INSERT template for table `usergroups_update_request`
--
INSERT INTO `usergroups_update_request`(`handle`, `description`, `channels`, `include_count`, `usergroup`, `name`) VALUES (?, ?, ?, ?, ?, ?);

--
-- UPDATE template for table `usergroups_update_request`
--
UPDATE `usergroups_update_request` SET `handle` = ?, `description` = ?, `channels` = ?, `include_count` = ?, `usergroup` = ?, `name` = ? WHERE 1;

--
-- DELETE template for table `usergroups_update_request`
--
DELETE FROM `usergroups_update_request` WHERE 0;

