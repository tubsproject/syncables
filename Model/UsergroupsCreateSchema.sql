--
-- Slack Web API.
-- Prepared SQL queries for 'usergroups_create_schema' definition.
--


--
-- SELECT template for table `usergroups_create_schema`
--
SELECT `ok`, `usergroup` FROM `usergroups_create_schema` WHERE 1;

--
-- INSERT template for table `usergroups_create_schema`
--
INSERT INTO `usergroups_create_schema`(`ok`, `usergroup`) VALUES (?, ?);

--
-- UPDATE template for table `usergroups_create_schema`
--
UPDATE `usergroups_create_schema` SET `ok` = ?, `usergroup` = ? WHERE 1;

--
-- DELETE template for table `usergroups_create_schema`
--
DELETE FROM `usergroups_create_schema` WHERE 0;

