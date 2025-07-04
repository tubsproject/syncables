--
-- Slack Web API.
-- Prepared SQL queries for 'objs_reaction' definition.
--


--
-- SELECT template for table `objs_reaction`
--
SELECT `count`, `name`, `users` FROM `objs_reaction` WHERE 1;

--
-- INSERT template for table `objs_reaction`
--
INSERT INTO `objs_reaction`(`count`, `name`, `users`) VALUES (?, ?, ?);

--
-- UPDATE template for table `objs_reaction`
--
UPDATE `objs_reaction` SET `count` = ?, `name` = ?, `users` = ? WHERE 1;

--
-- DELETE template for table `objs_reaction`
--
DELETE FROM `objs_reaction` WHERE 0;

