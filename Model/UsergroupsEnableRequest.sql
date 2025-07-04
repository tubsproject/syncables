--
-- Slack Web API.
-- Prepared SQL queries for 'usergroups_enable_request' definition.
--


--
-- SELECT template for table `usergroups_enable_request`
--
SELECT `include_count`, `usergroup` FROM `usergroups_enable_request` WHERE 1;

--
-- INSERT template for table `usergroups_enable_request`
--
INSERT INTO `usergroups_enable_request`(`include_count`, `usergroup`) VALUES (?, ?);

--
-- UPDATE template for table `usergroups_enable_request`
--
UPDATE `usergroups_enable_request` SET `include_count` = ?, `usergroup` = ? WHERE 1;

--
-- DELETE template for table `usergroups_enable_request`
--
DELETE FROM `usergroups_enable_request` WHERE 0;

