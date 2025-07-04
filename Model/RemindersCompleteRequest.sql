--
-- Slack Web API.
-- Prepared SQL queries for 'reminders_complete_request' definition.
--


--
-- SELECT template for table `reminders_complete_request`
--
SELECT `reminder` FROM `reminders_complete_request` WHERE 1;

--
-- INSERT template for table `reminders_complete_request`
--
INSERT INTO `reminders_complete_request`(`reminder`) VALUES (?);

--
-- UPDATE template for table `reminders_complete_request`
--
UPDATE `reminders_complete_request` SET `reminder` = ? WHERE 1;

--
-- DELETE template for table `reminders_complete_request`
--
DELETE FROM `reminders_complete_request` WHERE 0;

