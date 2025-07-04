--
-- Slack Web API.
-- Prepared SQL queries for 'objs_team' definition.
--


--
-- SELECT template for table `objs_team`
--
SELECT `archived`, `avatar_base_url`, `created`, `date_create`, `deleted`, `discoverable`, `domain`, `email_domain`, `enterprise_id`, `enterprise_name`, `external_org_migrations`, `has_compliance_export`, `icon`, `id`, `is_assigned`, `is_enterprise`, `is_over_storage_limit`, `limit_ts`, `locale`, `messages_count`, `msg_edit_window_mins`, `name`, `over_integrations_limit`, `over_storage_limit`, `pay_prod_cur`, `plan`, `primary_owner`, `sso_provider` FROM `objs_team` WHERE 1;

--
-- INSERT template for table `objs_team`
--
INSERT INTO `objs_team`(`archived`, `avatar_base_url`, `created`, `date_create`, `deleted`, `discoverable`, `domain`, `email_domain`, `enterprise_id`, `enterprise_name`, `external_org_migrations`, `has_compliance_export`, `icon`, `id`, `is_assigned`, `is_enterprise`, `is_over_storage_limit`, `limit_ts`, `locale`, `messages_count`, `msg_edit_window_mins`, `name`, `over_integrations_limit`, `over_storage_limit`, `pay_prod_cur`, `plan`, `primary_owner`, `sso_provider`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

--
-- UPDATE template for table `objs_team`
--
UPDATE `objs_team` SET `archived` = ?, `avatar_base_url` = ?, `created` = ?, `date_create` = ?, `deleted` = ?, `discoverable` = ?, `domain` = ?, `email_domain` = ?, `enterprise_id` = ?, `enterprise_name` = ?, `external_org_migrations` = ?, `has_compliance_export` = ?, `icon` = ?, `id` = ?, `is_assigned` = ?, `is_enterprise` = ?, `is_over_storage_limit` = ?, `limit_ts` = ?, `locale` = ?, `messages_count` = ?, `msg_edit_window_mins` = ?, `name` = ?, `over_integrations_limit` = ?, `over_storage_limit` = ?, `pay_prod_cur` = ?, `plan` = ?, `primary_owner` = ?, `sso_provider` = ? WHERE 1;

--
-- DELETE template for table `objs_team`
--
DELETE FROM `objs_team` WHERE 0;

