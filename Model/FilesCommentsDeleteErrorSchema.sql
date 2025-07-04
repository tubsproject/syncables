--
-- Slack Web API.
-- Prepared SQL queries for 'files_comments_delete_error_schema' definition.
--


--
-- SELECT template for table `files_comments_delete_error_schema`
--
SELECT `callstack`, `error`, `ok` FROM `files_comments_delete_error_schema` WHERE 1;

--
-- INSERT template for table `files_comments_delete_error_schema`
--
INSERT INTO `files_comments_delete_error_schema`(`callstack`, `error`, `ok`) VALUES (?, ?, ?);

--
-- UPDATE template for table `files_comments_delete_error_schema`
--
UPDATE `files_comments_delete_error_schema` SET `callstack` = ?, `error` = ?, `ok` = ? WHERE 1;

--
-- DELETE template for table `files_comments_delete_error_schema`
--
DELETE FROM `files_comments_delete_error_schema` WHERE 0;

