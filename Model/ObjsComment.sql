--
-- Slack Web API.
-- Prepared SQL queries for 'objs_comment' definition.
--


--
-- SELECT template for table `objs_comment`
--
SELECT `comment`, `created`, `id`, `is_intro`, `is_starred`, `num_stars`, `pinned_info`, `pinned_to`, `reactions`, `timestamp`, `user` FROM `objs_comment` WHERE 1;

--
-- INSERT template for table `objs_comment`
--
INSERT INTO `objs_comment`(`comment`, `created`, `id`, `is_intro`, `is_starred`, `num_stars`, `pinned_info`, `pinned_to`, `reactions`, `timestamp`, `user`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

--
-- UPDATE template for table `objs_comment`
--
UPDATE `objs_comment` SET `comment` = ?, `created` = ?, `id` = ?, `is_intro` = ?, `is_starred` = ?, `num_stars` = ?, `pinned_info` = ?, `pinned_to` = ?, `reactions` = ?, `timestamp` = ?, `user` = ? WHERE 1;

--
-- DELETE template for table `objs_comment`
--
DELETE FROM `objs_comment` WHERE 0;

