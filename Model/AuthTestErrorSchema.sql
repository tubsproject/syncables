--
-- Slack Web API.
-- Prepared SQL queries for 'auth_test_error_schema' definition.
--


--
-- SELECT template for table `auth_test_error_schema`
--
SELECT `callstack`, `error`, `ok` FROM `auth_test_error_schema` WHERE 1;

--
-- INSERT template for table `auth_test_error_schema`
--
INSERT INTO `auth_test_error_schema`(`callstack`, `error`, `ok`) VALUES (?, ?, ?);

--
-- UPDATE template for table `auth_test_error_schema`
--
UPDATE `auth_test_error_schema` SET `callstack` = ?, `error` = ?, `ok` = ? WHERE 1;

--
-- DELETE template for table `auth_test_error_schema`
--
DELETE FROM `auth_test_error_schema` WHERE 0;

