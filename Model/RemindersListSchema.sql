--
-- Slack Web API.
-- Prepared SQL queries for 'reminders_list_schema' definition.
--


--
-- SELECT template for table `reminders_list_schema`
--
SELECT `ok`, `reminders` FROM `reminders_list_schema` WHERE 1;

--
-- INSERT template for table `reminders_list_schema`
--
INSERT INTO `reminders_list_schema`(`ok`, `reminders`) VALUES (?, ?);

--
-- UPDATE template for table `reminders_list_schema`
--
UPDATE `reminders_list_schema` SET `ok` = ?, `reminders` = ? WHERE 1;

--
-- DELETE template for table `reminders_list_schema`
--
DELETE FROM `reminders_list_schema` WHERE 0;

