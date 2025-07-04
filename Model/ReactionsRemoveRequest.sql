--
-- Slack Web API.
-- Prepared SQL queries for 'reactions_remove_request' definition.
--


--
-- SELECT template for table `reactions_remove_request`
--
SELECT `name`, `file`, `file_comment`, `channel`, `timestamp` FROM `reactions_remove_request` WHERE 1;

--
-- INSERT template for table `reactions_remove_request`
--
INSERT INTO `reactions_remove_request`(`name`, `file`, `file_comment`, `channel`, `timestamp`) VALUES (?, ?, ?, ?, ?);

--
-- UPDATE template for table `reactions_remove_request`
--
UPDATE `reactions_remove_request` SET `name` = ?, `file` = ?, `file_comment` = ?, `channel` = ?, `timestamp` = ? WHERE 1;

--
-- DELETE template for table `reactions_remove_request`
--
DELETE FROM `reactions_remove_request` WHERE 0;

