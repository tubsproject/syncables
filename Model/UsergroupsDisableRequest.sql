--
-- Slack Web API.
-- Prepared SQL queries for 'usergroups_disable_request' definition.
--


--
-- SELECT template for table `usergroups_disable_request`
--
SELECT `include_count`, `usergroup` FROM `usergroups_disable_request` WHERE 1;

--
-- INSERT template for table `usergroups_disable_request`
--
INSERT INTO `usergroups_disable_request`(`include_count`, `usergroup`) VALUES (?, ?);

--
-- UPDATE template for table `usergroups_disable_request`
--
UPDATE `usergroups_disable_request` SET `include_count` = ?, `usergroup` = ? WHERE 1;

--
-- DELETE template for table `usergroups_disable_request`
--
DELETE FROM `usergroups_disable_request` WHERE 0;

