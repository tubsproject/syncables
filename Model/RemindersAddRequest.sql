--
-- Slack Web API.
-- Prepared SQL queries for 'reminders_add_request' definition.
--


--
-- SELECT template for table `reminders_add_request`
--
SELECT `text`, `time`, `user` FROM `reminders_add_request` WHERE 1;

--
-- INSERT template for table `reminders_add_request`
--
INSERT INTO `reminders_add_request`(`text`, `time`, `user`) VALUES (?, ?, ?);

--
-- UPDATE template for table `reminders_add_request`
--
UPDATE `reminders_add_request` SET `text` = ?, `time` = ?, `user` = ? WHERE 1;

--
-- DELETE template for table `reminders_add_request`
--
DELETE FROM `reminders_add_request` WHERE 0;

