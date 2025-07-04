--
-- Slack Web API.
-- Prepared SQL queries for 'usergroups_list_schema' definition.
--


--
-- SELECT template for table `usergroups_list_schema`
--
SELECT `ok`, `usergroups` FROM `usergroups_list_schema` WHERE 1;

--
-- INSERT template for table `usergroups_list_schema`
--
INSERT INTO `usergroups_list_schema`(`ok`, `usergroups`) VALUES (?, ?);

--
-- UPDATE template for table `usergroups_list_schema`
--
UPDATE `usergroups_list_schema` SET `ok` = ?, `usergroups` = ? WHERE 1;

--
-- DELETE template for table `usergroups_list_schema`
--
DELETE FROM `usergroups_list_schema` WHERE 0;

