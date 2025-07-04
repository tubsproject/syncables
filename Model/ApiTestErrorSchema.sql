--
-- Slack Web API.
-- Prepared SQL queries for 'api_test_error_schema' definition.
--


--
-- SELECT template for table `api_test_error_schema`
--
SELECT `error`, `ok` FROM `api_test_error_schema` WHERE 1;

--
-- INSERT template for table `api_test_error_schema`
--
INSERT INTO `api_test_error_schema`(`error`, `ok`) VALUES (?, ?);

--
-- UPDATE template for table `api_test_error_schema`
--
UPDATE `api_test_error_schema` SET `error` = ?, `ok` = ? WHERE 1;

--
-- DELETE template for table `api_test_error_schema`
--
DELETE FROM `api_test_error_schema` WHERE 0;

