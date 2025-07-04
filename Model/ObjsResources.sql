--
-- Slack Web API.
-- Prepared SQL queries for 'objs_resources' definition.
--


--
-- SELECT template for table `objs_resources`
--
SELECT `excluded_ids`, `ids`, `wildcard` FROM `objs_resources` WHERE 1;

--
-- INSERT template for table `objs_resources`
--
INSERT INTO `objs_resources`(`excluded_ids`, `ids`, `wildcard`) VALUES (?, ?, ?);

--
-- UPDATE template for table `objs_resources`
--
UPDATE `objs_resources` SET `excluded_ids` = ?, `ids` = ?, `wildcard` = ? WHERE 1;

--
-- DELETE template for table `objs_resources`
--
DELETE FROM `objs_resources` WHERE 0;

