--
-- Slack Web API.
-- Prepared SQL queries for 'pins_remove_request' definition.
--


--
-- SELECT template for table `pins_remove_request`
--
SELECT `channel`, `timestamp` FROM `pins_remove_request` WHERE 1;

--
-- INSERT template for table `pins_remove_request`
--
INSERT INTO `pins_remove_request`(`channel`, `timestamp`) VALUES (?, ?);

--
-- UPDATE template for table `pins_remove_request`
--
UPDATE `pins_remove_request` SET `channel` = ?, `timestamp` = ? WHERE 1;

--
-- DELETE template for table `pins_remove_request`
--
DELETE FROM `pins_remove_request` WHERE 0;

