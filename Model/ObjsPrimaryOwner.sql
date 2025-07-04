--
-- Slack Web API.
-- Prepared SQL queries for 'objs_primary_owner' definition.
--


--
-- SELECT template for table `objs_primary_owner`
--
SELECT `email`, `id` FROM `objs_primary_owner` WHERE 1;

--
-- INSERT template for table `objs_primary_owner`
--
INSERT INTO `objs_primary_owner`(`email`, `id`) VALUES (?, ?);

--
-- UPDATE template for table `objs_primary_owner`
--
UPDATE `objs_primary_owner` SET `email` = ?, `id` = ? WHERE 1;

--
-- DELETE template for table `objs_primary_owner`
--
DELETE FROM `objs_primary_owner` WHERE 0;

