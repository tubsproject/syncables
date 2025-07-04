--
-- Slack Web API.
-- Prepared SQL queries for 'files_sharedPublicURL_schema' definition.
--


--
-- SELECT template for table `files_sharedPublicURL_schema`
--
SELECT `file`, `ok` FROM `files_sharedPublicURL_schema` WHERE 1;

--
-- INSERT template for table `files_sharedPublicURL_schema`
--
INSERT INTO `files_sharedPublicURL_schema`(`file`, `ok`) VALUES (?, ?);

--
-- UPDATE template for table `files_sharedPublicURL_schema`
--
UPDATE `files_sharedPublicURL_schema` SET `file` = ?, `ok` = ? WHERE 1;

--
-- DELETE template for table `files_sharedPublicURL_schema`
--
DELETE FROM `files_sharedPublicURL_schema` WHERE 0;

