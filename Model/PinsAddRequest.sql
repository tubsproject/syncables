--
-- Slack Web API.
-- Prepared SQL queries for 'pins_add_request' definition.
--


--
-- SELECT template for table `pins_add_request`
--
SELECT `channel`, `timestamp` FROM `pins_add_request` WHERE 1;

--
-- INSERT template for table `pins_add_request`
--
INSERT INTO `pins_add_request`(`channel`, `timestamp`) VALUES (?, ?);

--
-- UPDATE template for table `pins_add_request`
--
UPDATE `pins_add_request` SET `channel` = ?, `timestamp` = ? WHERE 1;

--
-- DELETE template for table `pins_add_request`
--
DELETE FROM `pins_add_request` WHERE 0;

