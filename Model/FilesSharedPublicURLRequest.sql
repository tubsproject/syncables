--
-- Slack Web API.
-- Prepared SQL queries for 'files_sharedPublicURL_request' definition.
--


--
-- SELECT template for table `files_sharedPublicURL_request`
--
SELECT `file` FROM `files_sharedPublicURL_request` WHERE 1;

--
-- INSERT template for table `files_sharedPublicURL_request`
--
INSERT INTO `files_sharedPublicURL_request`(`file`) VALUES (?);

--
-- UPDATE template for table `files_sharedPublicURL_request`
--
UPDATE `files_sharedPublicURL_request` SET `file` = ? WHERE 1;

--
-- DELETE template for table `files_sharedPublicURL_request`
--
DELETE FROM `files_sharedPublicURL_request` WHERE 0;

