--
-- Slack Web API.
-- Prepared SQL queries for 'api_test_success_schema' definition.
--


--
-- SELECT template for table `api_test_success_schema`
--
SELECT `ok` FROM `api_test_success_schema` WHERE 1;

--
-- INSERT template for table `api_test_success_schema`
--
INSERT INTO `api_test_success_schema`(`ok`) VALUES (?);

--
-- UPDATE template for table `api_test_success_schema`
--
UPDATE `api_test_success_schema` SET `ok` = ? WHERE 1;

--
-- DELETE template for table `api_test_success_schema`
--
DELETE FROM `api_test_success_schema` WHERE 0;

