--
-- Slack Web API.
-- Prepared SQL queries for 'usergroups_update_schema' definition.
--


--
-- SELECT template for table `usergroups_update_schema`
--
SELECT `ok`, `usergroup` FROM `usergroups_update_schema` WHERE 1;

--
-- INSERT template for table `usergroups_update_schema`
--
INSERT INTO `usergroups_update_schema`(`ok`, `usergroup`) VALUES (?, ?);

--
-- UPDATE template for table `usergroups_update_schema`
--
UPDATE `usergroups_update_schema` SET `ok` = ?, `usergroup` = ? WHERE 1;

--
-- DELETE template for table `usergroups_update_schema`
--
DELETE FROM `usergroups_update_schema` WHERE 0;

