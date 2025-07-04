--
-- Slack Web API.
-- Prepared SQL queries for 'objs_enterprise_user' definition.
--


--
-- SELECT template for table `objs_enterprise_user`
--
SELECT `enterprise_id`, `enterprise_name`, `id`, `is_admin`, `is_owner`, `teams` FROM `objs_enterprise_user` WHERE 1;

--
-- INSERT template for table `objs_enterprise_user`
--
INSERT INTO `objs_enterprise_user`(`enterprise_id`, `enterprise_name`, `id`, `is_admin`, `is_owner`, `teams`) VALUES (?, ?, ?, ?, ?, ?);

--
-- UPDATE template for table `objs_enterprise_user`
--
UPDATE `objs_enterprise_user` SET `enterprise_id` = ?, `enterprise_name` = ?, `id` = ?, `is_admin` = ?, `is_owner` = ?, `teams` = ? WHERE 1;

--
-- DELETE template for table `objs_enterprise_user`
--
DELETE FROM `objs_enterprise_user` WHERE 0;

