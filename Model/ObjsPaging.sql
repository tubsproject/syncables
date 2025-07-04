--
-- Slack Web API.
-- Prepared SQL queries for 'objs_paging' definition.
--


--
-- SELECT template for table `objs_paging`
--
SELECT `count`, `page`, `pages`, `per_page`, `spill`, `total` FROM `objs_paging` WHERE 1;

--
-- INSERT template for table `objs_paging`
--
INSERT INTO `objs_paging`(`count`, `page`, `pages`, `per_page`, `spill`, `total`) VALUES (?, ?, ?, ?, ?, ?);

--
-- UPDATE template for table `objs_paging`
--
UPDATE `objs_paging` SET `count` = ?, `page` = ?, `pages` = ?, `per_page` = ?, `spill` = ?, `total` = ? WHERE 1;

--
-- DELETE template for table `objs_paging`
--
DELETE FROM `objs_paging` WHERE 0;

