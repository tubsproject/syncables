--
-- Slack Web API.
-- Prepared SQL queries for 'conversations_leave_request' definition.
--


--
-- SELECT template for table `conversations_leave_request`
--
SELECT `channel` FROM `conversations_leave_request` WHERE 1;

--
-- INSERT template for table `conversations_leave_request`
--
INSERT INTO `conversations_leave_request`(`channel`) VALUES (?);

--
-- UPDATE template for table `conversations_leave_request`
--
UPDATE `conversations_leave_request` SET `channel` = ? WHERE 1;

--
-- DELETE template for table `conversations_leave_request`
--
DELETE FROM `conversations_leave_request` WHERE 0;

