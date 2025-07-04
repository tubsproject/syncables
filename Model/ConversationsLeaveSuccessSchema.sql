--
-- Slack Web API.
-- Prepared SQL queries for 'conversations_leave_success_schema' definition.
--


--
-- SELECT template for table `conversations_leave_success_schema`
--
SELECT `not_in_channel`, `ok` FROM `conversations_leave_success_schema` WHERE 1;

--
-- INSERT template for table `conversations_leave_success_schema`
--
INSERT INTO `conversations_leave_success_schema`(`not_in_channel`, `ok`) VALUES (?, ?);

--
-- UPDATE template for table `conversations_leave_success_schema`
--
UPDATE `conversations_leave_success_schema` SET `not_in_channel` = ?, `ok` = ? WHERE 1;

--
-- DELETE template for table `conversations_leave_success_schema`
--
DELETE FROM `conversations_leave_success_schema` WHERE 0;

