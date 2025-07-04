--
-- Slack Web API.
-- Prepared SQL queries for 'reactions_add_request' definition.
--


--
-- SELECT template for table `reactions_add_request`
--
SELECT `channel`, `name`, `timestamp` FROM `reactions_add_request` WHERE 1;

--
-- INSERT template for table `reactions_add_request`
--
INSERT INTO `reactions_add_request`(`channel`, `name`, `timestamp`) VALUES (?, ?, ?);

--
-- UPDATE template for table `reactions_add_request`
--
UPDATE `reactions_add_request` SET `channel` = ?, `name` = ?, `timestamp` = ? WHERE 1;

--
-- DELETE template for table `reactions_add_request`
--
DELETE FROM `reactions_add_request` WHERE 0;

