--
-- Slack Web API.
-- Prepared SQL queries for 'files_upload_schema' definition.
--


--
-- SELECT template for table `files_upload_schema`
--
SELECT `file`, `ok` FROM `files_upload_schema` WHERE 1;

--
-- INSERT template for table `files_upload_schema`
--
INSERT INTO `files_upload_schema`(`file`, `ok`) VALUES (?, ?);

--
-- UPDATE template for table `files_upload_schema`
--
UPDATE `files_upload_schema` SET `file` = ?, `ok` = ? WHERE 1;

--
-- DELETE template for table `files_upload_schema`
--
DELETE FROM `files_upload_schema` WHERE 0;

