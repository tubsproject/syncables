--
-- Slack Web API.
-- Prepared SQL queries for 'stars_add_request' definition.
--


--
-- SELECT template for table `stars_add_request`
--
SELECT `channel`, `file`, `file_comment`, `timestamp` FROM `stars_add_request` WHERE 1;

--
-- INSERT template for table `stars_add_request`
--
INSERT INTO `stars_add_request`(`channel`, `file`, `file_comment`, `timestamp`) VALUES (?, ?, ?, ?);

--
-- UPDATE template for table `stars_add_request`
--
UPDATE `stars_add_request` SET `channel` = ?, `file` = ?, `file_comment` = ?, `timestamp` = ? WHERE 1;

--
-- DELETE template for table `stars_add_request`
--
DELETE FROM `stars_add_request` WHERE 0;

