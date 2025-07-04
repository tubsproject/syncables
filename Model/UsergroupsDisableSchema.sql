--
-- Slack Web API.
-- Prepared SQL queries for 'usergroups_disable_schema' definition.
--


--
-- SELECT template for table `usergroups_disable_schema`
--
SELECT `ok`, `usergroup` FROM `usergroups_disable_schema` WHERE 1;

--
-- INSERT template for table `usergroups_disable_schema`
--
INSERT INTO `usergroups_disable_schema`(`ok`, `usergroup`) VALUES (?, ?);

--
-- UPDATE template for table `usergroups_disable_schema`
--
UPDATE `usergroups_disable_schema` SET `ok` = ?, `usergroup` = ? WHERE 1;

--
-- DELETE template for table `usergroups_disable_schema`
--
DELETE FROM `usergroups_disable_schema` WHERE 0;

