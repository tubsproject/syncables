--
-- Slack Web API.
-- Prepared SQL queries for 'usergroups_create_request' definition.
--


--
-- SELECT template for table `usergroups_create_request`
--
SELECT `channels`, `description`, `handle`, `include_count`, `name` FROM `usergroups_create_request` WHERE 1;

--
-- INSERT template for table `usergroups_create_request`
--
INSERT INTO `usergroups_create_request`(`channels`, `description`, `handle`, `include_count`, `name`) VALUES (?, ?, ?, ?, ?);

--
-- UPDATE template for table `usergroups_create_request`
--
UPDATE `usergroups_create_request` SET `channels` = ?, `description` = ?, `handle` = ?, `include_count` = ?, `name` = ? WHERE 1;

--
-- DELETE template for table `usergroups_create_request`
--
DELETE FROM `usergroups_create_request` WHERE 0;

