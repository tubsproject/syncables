--
-- Slack Web API.
-- Prepared SQL queries for 'users_setPhoto_error_schema' definition.
--


--
-- SELECT template for table `users_setPhoto_error_schema`
--
SELECT `callstack`, `debug_step`, `dims`, `error`, `ok`, `time_ident` FROM `users_setPhoto_error_schema` WHERE 1;

--
-- INSERT template for table `users_setPhoto_error_schema`
--
INSERT INTO `users_setPhoto_error_schema`(`callstack`, `debug_step`, `dims`, `error`, `ok`, `time_ident`) VALUES (?, ?, ?, ?, ?, ?);

--
-- UPDATE template for table `users_setPhoto_error_schema`
--
UPDATE `users_setPhoto_error_schema` SET `callstack` = ?, `debug_step` = ?, `dims` = ?, `error` = ?, `ok` = ?, `time_ident` = ? WHERE 1;

--
-- DELETE template for table `users_setPhoto_error_schema`
--
DELETE FROM `users_setPhoto_error_schema` WHERE 0;

