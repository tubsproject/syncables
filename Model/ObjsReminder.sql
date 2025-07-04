--
-- Slack Web API.
-- Prepared SQL queries for 'objs_reminder' definition.
--


--
-- SELECT template for table `objs_reminder`
--
SELECT `complete_ts`, `creator`, `id`, `recurring`, `text`, `time`, `user` FROM `objs_reminder` WHERE 1;

--
-- INSERT template for table `objs_reminder`
--
INSERT INTO `objs_reminder`(`complete_ts`, `creator`, `id`, `recurring`, `text`, `time`, `user`) VALUES (?, ?, ?, ?, ?, ?, ?);

--
-- UPDATE template for table `objs_reminder`
--
UPDATE `objs_reminder` SET `complete_ts` = ?, `creator` = ?, `id` = ?, `recurring` = ?, `text` = ?, `time` = ?, `user` = ? WHERE 1;

--
-- DELETE template for table `objs_reminder`
--
DELETE FROM `objs_reminder` WHERE 0;

