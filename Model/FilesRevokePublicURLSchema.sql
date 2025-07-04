--
-- Slack Web API.
-- Prepared SQL queries for 'files_revokePublicURL_schema' definition.
--


--
-- SELECT template for table `files_revokePublicURL_schema`
--
SELECT `file`, `ok` FROM `files_revokePublicURL_schema` WHERE 1;

--
-- INSERT template for table `files_revokePublicURL_schema`
--
INSERT INTO `files_revokePublicURL_schema`(`file`, `ok`) VALUES (?, ?);

--
-- UPDATE template for table `files_revokePublicURL_schema`
--
UPDATE `files_revokePublicURL_schema` SET `file` = ?, `ok` = ? WHERE 1;

--
-- DELETE template for table `files_revokePublicURL_schema`
--
DELETE FROM `files_revokePublicURL_schema` WHERE 0;

