--
-- Slack Web API.
-- Prepared SQL queries for 'reminders_delete_request' definition.
--


--
-- SELECT template for table `reminders_delete_request`
--
SELECT `reminder` FROM `reminders_delete_request` WHERE 1;

--
-- INSERT template for table `reminders_delete_request`
--
INSERT INTO `reminders_delete_request`(`reminder`) VALUES (?);

--
-- UPDATE template for table `reminders_delete_request`
--
UPDATE `reminders_delete_request` SET `reminder` = ? WHERE 1;

--
-- DELETE template for table `reminders_delete_request`
--
DELETE FROM `reminders_delete_request` WHERE 0;

