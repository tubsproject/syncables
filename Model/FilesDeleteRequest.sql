--
-- Slack Web API.
-- Prepared SQL queries for 'files_delete_request' definition.
--


--
-- SELECT template for table `files_delete_request`
--
SELECT `file` FROM `files_delete_request` WHERE 1;

--
-- INSERT template for table `files_delete_request`
--
INSERT INTO `files_delete_request`(`file`) VALUES (?);

--
-- UPDATE template for table `files_delete_request`
--
UPDATE `files_delete_request` SET `file` = ? WHERE 1;

--
-- DELETE template for table `files_delete_request`
--
DELETE FROM `files_delete_request` WHERE 0;

