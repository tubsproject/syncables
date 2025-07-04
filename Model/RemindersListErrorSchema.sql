--
-- Slack Web API.
-- Prepared SQL queries for 'reminders_list_error_schema' definition.
--


--
-- SELECT template for table `reminders_list_error_schema`
--
SELECT `callstack`, `error`, `ok` FROM `reminders_list_error_schema` WHERE 1;

--
-- INSERT template for table `reminders_list_error_schema`
--
INSERT INTO `reminders_list_error_schema`(`callstack`, `error`, `ok`) VALUES (?, ?, ?);

--
-- UPDATE template for table `reminders_list_error_schema`
--
UPDATE `reminders_list_error_schema` SET `callstack` = ?, `error` = ?, `ok` = ? WHERE 1;

--
-- DELETE template for table `reminders_list_error_schema`
--
DELETE FROM `reminders_list_error_schema` WHERE 0;

