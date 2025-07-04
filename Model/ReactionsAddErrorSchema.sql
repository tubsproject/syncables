--
-- Slack Web API.
-- Prepared SQL queries for 'reactions_add_error_schema' definition.
--


--
-- SELECT template for table `reactions_add_error_schema`
--
SELECT `callstack`, `error`, `ok` FROM `reactions_add_error_schema` WHERE 1;

--
-- INSERT template for table `reactions_add_error_schema`
--
INSERT INTO `reactions_add_error_schema`(`callstack`, `error`, `ok`) VALUES (?, ?, ?);

--
-- UPDATE template for table `reactions_add_error_schema`
--
UPDATE `reactions_add_error_schema` SET `callstack` = ?, `error` = ?, `ok` = ? WHERE 1;

--
-- DELETE template for table `reactions_add_error_schema`
--
DELETE FROM `reactions_add_error_schema` WHERE 0;

