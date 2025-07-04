--
-- Slack Web API.
-- Prepared SQL queries for 'calls_end_request' definition.
--


--
-- SELECT template for table `calls_end_request`
--
SELECT `id`, `duration` FROM `calls_end_request` WHERE 1;

--
-- INSERT template for table `calls_end_request`
--
INSERT INTO `calls_end_request`(`id`, `duration`) VALUES (?, ?);

--
-- UPDATE template for table `calls_end_request`
--
UPDATE `calls_end_request` SET `id` = ?, `duration` = ? WHERE 1;

--
-- DELETE template for table `calls_end_request`
--
DELETE FROM `calls_end_request` WHERE 0;

