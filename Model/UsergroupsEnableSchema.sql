--
-- Slack Web API.
-- Prepared SQL queries for 'usergroups_enable_schema' definition.
--


--
-- SELECT template for table `usergroups_enable_schema`
--
SELECT `ok`, `usergroup` FROM `usergroups_enable_schema` WHERE 1;

--
-- INSERT template for table `usergroups_enable_schema`
--
INSERT INTO `usergroups_enable_schema`(`ok`, `usergroup`) VALUES (?, ?);

--
-- UPDATE template for table `usergroups_enable_schema`
--
UPDATE `usergroups_enable_schema` SET `ok` = ?, `usergroup` = ? WHERE 1;

--
-- DELETE template for table `usergroups_enable_schema`
--
DELETE FROM `usergroups_enable_schema` WHERE 0;

