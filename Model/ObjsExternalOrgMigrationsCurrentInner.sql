--
-- Slack Web API.
-- Prepared SQL queries for 'objs_external_org_migrations_current_inner' definition.
--


--
-- SELECT template for table `objs_external_org_migrations_current_inner`
--
SELECT `date_started`, `team_id` FROM `objs_external_org_migrations_current_inner` WHERE 1;

--
-- INSERT template for table `objs_external_org_migrations_current_inner`
--
INSERT INTO `objs_external_org_migrations_current_inner`(`date_started`, `team_id`) VALUES (?, ?);

--
-- UPDATE template for table `objs_external_org_migrations_current_inner`
--
UPDATE `objs_external_org_migrations_current_inner` SET `date_started` = ?, `team_id` = ? WHERE 1;

--
-- DELETE template for table `objs_external_org_migrations_current_inner`
--
DELETE FROM `objs_external_org_migrations_current_inner` WHERE 0;

