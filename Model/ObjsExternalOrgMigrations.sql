--
-- Slack Web API.
-- Prepared SQL queries for 'objs_external_org_migrations' definition.
--


--
-- SELECT template for table `objs_external_org_migrations`
--
SELECT `current`, `date_updated` FROM `objs_external_org_migrations` WHERE 1;

--
-- INSERT template for table `objs_external_org_migrations`
--
INSERT INTO `objs_external_org_migrations`(`current`, `date_updated`) VALUES (?, ?);

--
-- UPDATE template for table `objs_external_org_migrations`
--
UPDATE `objs_external_org_migrations` SET `current` = ?, `date_updated` = ? WHERE 1;

--
-- DELETE template for table `objs_external_org_migrations`
--
DELETE FROM `objs_external_org_migrations` WHERE 0;

