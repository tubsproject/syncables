--
-- Slack Web API.
-- Prepared SQL queries for 'files_revokePublicURL_request' definition.
--


--
-- SELECT template for table `files_revokePublicURL_request`
--
SELECT `file` FROM `files_revokePublicURL_request` WHERE 1;

--
-- INSERT template for table `files_revokePublicURL_request`
--
INSERT INTO `files_revokePublicURL_request`(`file`) VALUES (?);

--
-- UPDATE template for table `files_revokePublicURL_request`
--
UPDATE `files_revokePublicURL_request` SET `file` = ? WHERE 1;

--
-- DELETE template for table `files_revokePublicURL_request`
--
DELETE FROM `files_revokePublicURL_request` WHERE 0;

