--
-- Slack Web API.
-- Prepared SQL queries for 'reminders_info_schema' definition.
--


--
-- SELECT template for table `reminders_info_schema`
--
SELECT `ok`, `reminder` FROM `reminders_info_schema` WHERE 1;

--
-- INSERT template for table `reminders_info_schema`
--
INSERT INTO `reminders_info_schema`(`ok`, `reminder`) VALUES (?, ?);

--
-- UPDATE template for table `reminders_info_schema`
--
UPDATE `reminders_info_schema` SET `ok` = ?, `reminder` = ? WHERE 1;

--
-- DELETE template for table `reminders_info_schema`
--
DELETE FROM `reminders_info_schema` WHERE 0;

