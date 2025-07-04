--
-- Slack Web API.
-- Prepared SQL queries for 'usergroups_enable_error_schema' definition.
--


--
-- SELECT template for table `usergroups_enable_error_schema`
--
SELECT `callstack`, `error`, `ok` FROM `usergroups_enable_error_schema` WHERE 1;

--
-- INSERT template for table `usergroups_enable_error_schema`
--
INSERT INTO `usergroups_enable_error_schema`(`callstack`, `error`, `ok`) VALUES (?, ?, ?);

--
-- UPDATE template for table `usergroups_enable_error_schema`
--
UPDATE `usergroups_enable_error_schema` SET `callstack` = ?, `error` = ?, `ok` = ? WHERE 1;

--
-- DELETE template for table `usergroups_enable_error_schema`
--
DELETE FROM `usergroups_enable_error_schema` WHERE 0;

