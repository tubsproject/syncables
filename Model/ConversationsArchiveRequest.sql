--
-- Slack Web API.
-- Prepared SQL queries for 'conversations_archive_request' definition.
--


--
-- SELECT template for table `conversations_archive_request`
--
SELECT `channel` FROM `conversations_archive_request` WHERE 1;

--
-- INSERT template for table `conversations_archive_request`
--
INSERT INTO `conversations_archive_request`(`channel`) VALUES (?);

--
-- UPDATE template for table `conversations_archive_request`
--
UPDATE `conversations_archive_request` SET `channel` = ? WHERE 1;

--
-- DELETE template for table `conversations_archive_request`
--
DELETE FROM `conversations_archive_request` WHERE 0;

