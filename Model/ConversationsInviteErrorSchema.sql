--
-- Slack Web API.
-- Prepared SQL queries for 'conversations_invite_error_schema' definition.
--


--
-- SELECT template for table `conversations_invite_error_schema`
--
SELECT `channel`, `ok` FROM `conversations_invite_error_schema` WHERE 1;

--
-- INSERT template for table `conversations_invite_error_schema`
--
INSERT INTO `conversations_invite_error_schema`(`channel`, `ok`) VALUES (?, ?);

--
-- UPDATE template for table `conversations_invite_error_schema`
--
UPDATE `conversations_invite_error_schema` SET `channel` = ?, `ok` = ? WHERE 1;

--
-- DELETE template for table `conversations_invite_error_schema`
--
DELETE FROM `conversations_invite_error_schema` WHERE 0;

