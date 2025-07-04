--
-- Slack Web API.
-- Prepared SQL queries for 'stars_remove_request' definition.
--


--
-- SELECT template for table `stars_remove_request`
--
SELECT `channel`, `file`, `file_comment`, `timestamp` FROM `stars_remove_request` WHERE 1;

--
-- INSERT template for table `stars_remove_request`
--
INSERT INTO `stars_remove_request`(`channel`, `file`, `file_comment`, `timestamp`) VALUES (?, ?, ?, ?);

--
-- UPDATE template for table `stars_remove_request`
--
UPDATE `stars_remove_request` SET `channel` = ?, `file` = ?, `file_comment` = ?, `timestamp` = ? WHERE 1;

--
-- DELETE template for table `stars_remove_request`
--
DELETE FROM `stars_remove_request` WHERE 0;

