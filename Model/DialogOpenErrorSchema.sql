--
-- Slack Web API.
-- Prepared SQL queries for 'dialog_open_error_schema' definition.
--


--
-- SELECT template for table `dialog_open_error_schema`
--
SELECT `callstack`, `error`, `ok` FROM `dialog_open_error_schema` WHERE 1;

--
-- INSERT template for table `dialog_open_error_schema`
--
INSERT INTO `dialog_open_error_schema`(`callstack`, `error`, `ok`) VALUES (?, ?, ?);

--
-- UPDATE template for table `dialog_open_error_schema`
--
UPDATE `dialog_open_error_schema` SET `callstack` = ?, `error` = ?, `ok` = ? WHERE 1;

--
-- DELETE template for table `dialog_open_error_schema`
--
DELETE FROM `dialog_open_error_schema` WHERE 0;

