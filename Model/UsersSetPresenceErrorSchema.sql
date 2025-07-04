--
-- Slack Web API.
-- Prepared SQL queries for 'users_setPresence_error_schema' definition.
--


--
-- SELECT template for table `users_setPresence_error_schema`
--
SELECT `callstack`, `error`, `ok` FROM `users_setPresence_error_schema` WHERE 1;

--
-- INSERT template for table `users_setPresence_error_schema`
--
INSERT INTO `users_setPresence_error_schema`(`callstack`, `error`, `ok`) VALUES (?, ?, ?);

--
-- UPDATE template for table `users_setPresence_error_schema`
--
UPDATE `users_setPresence_error_schema` SET `callstack` = ?, `error` = ?, `ok` = ? WHERE 1;

--
-- DELETE template for table `users_setPresence_error_schema`
--
DELETE FROM `users_setPresence_error_schema` WHERE 0;

