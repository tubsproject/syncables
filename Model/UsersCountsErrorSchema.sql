--
-- Slack Web API.
-- Prepared SQL queries for 'users_counts_error_schema' definition.
--


--
-- SELECT template for table `users_counts_error_schema`
--
SELECT `error`, `ok` FROM `users_counts_error_schema` WHERE 1;

--
-- INSERT template for table `users_counts_error_schema`
--
INSERT INTO `users_counts_error_schema`(`error`, `ok`) VALUES (?, ?);

--
-- UPDATE template for table `users_counts_error_schema`
--
UPDATE `users_counts_error_schema` SET `error` = ?, `ok` = ? WHERE 1;

--
-- DELETE template for table `users_counts_error_schema`
--
DELETE FROM `users_counts_error_schema` WHERE 0;

