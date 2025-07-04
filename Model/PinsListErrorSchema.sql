--
-- Slack Web API.
-- Prepared SQL queries for 'pins_list_error_schema' definition.
--


--
-- SELECT template for table `pins_list_error_schema`
--
SELECT `callstack`, `error`, `ok` FROM `pins_list_error_schema` WHERE 1;

--
-- INSERT template for table `pins_list_error_schema`
--
INSERT INTO `pins_list_error_schema`(`callstack`, `error`, `ok`) VALUES (?, ?, ?);

--
-- UPDATE template for table `pins_list_error_schema`
--
UPDATE `pins_list_error_schema` SET `callstack` = ?, `error` = ?, `ok` = ? WHERE 1;

--
-- DELETE template for table `pins_list_error_schema`
--
DELETE FROM `pins_list_error_schema` WHERE 0;

