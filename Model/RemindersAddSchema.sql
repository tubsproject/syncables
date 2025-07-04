--
-- Slack Web API.
-- Prepared SQL queries for 'reminders_add_schema' definition.
--


--
-- SELECT template for table `reminders_add_schema`
--
SELECT `ok`, `reminder` FROM `reminders_add_schema` WHERE 1;

--
-- INSERT template for table `reminders_add_schema`
--
INSERT INTO `reminders_add_schema`(`ok`, `reminder`) VALUES (?, ?);

--
-- UPDATE template for table `reminders_add_schema`
--
UPDATE `reminders_add_schema` SET `ok` = ?, `reminder` = ? WHERE 1;

--
-- DELETE template for table `reminders_add_schema`
--
DELETE FROM `reminders_add_schema` WHERE 0;

