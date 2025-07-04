--
-- Slack Web API.
-- Prepared SQL queries for 'conversations_invite_error_schema_1' definition.
--


--
-- SELECT template for table `conversations_invite_error_schema_1`
--
SELECT `callstack`, `error`, `errors`, `needed`, `ok`, `provided` FROM `conversations_invite_error_schema_1` WHERE 1;

--
-- INSERT template for table `conversations_invite_error_schema_1`
--
INSERT INTO `conversations_invite_error_schema_1`(`callstack`, `error`, `errors`, `needed`, `ok`, `provided`) VALUES (?, ?, ?, ?, ?, ?);

--
-- UPDATE template for table `conversations_invite_error_schema_1`
--
UPDATE `conversations_invite_error_schema_1` SET `callstack` = ?, `error` = ?, `errors` = ?, `needed` = ?, `ok` = ?, `provided` = ? WHERE 1;

--
-- DELETE template for table `conversations_invite_error_schema_1`
--
DELETE FROM `conversations_invite_error_schema_1` WHERE 0;

