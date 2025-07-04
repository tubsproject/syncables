--
-- Slack Web API.
-- Prepared SQL queries for 'stars_add_error_schema' definition.
--


--
-- SELECT template for table `stars_add_error_schema`
--
SELECT `callstack`, `error`, `ok` FROM `stars_add_error_schema` WHERE 1;

--
-- INSERT template for table `stars_add_error_schema`
--
INSERT INTO `stars_add_error_schema`(`callstack`, `error`, `ok`) VALUES (?, ?, ?);

--
-- UPDATE template for table `stars_add_error_schema`
--
UPDATE `stars_add_error_schema` SET `callstack` = ?, `error` = ?, `ok` = ? WHERE 1;

--
-- DELETE template for table `stars_add_error_schema`
--
DELETE FROM `stars_add_error_schema` WHERE 0;

