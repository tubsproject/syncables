--
-- Slack Web API.
-- Prepared SQL queries for 'admin_conversations_create_request' definition.
--


--
-- SELECT template for table `admin_conversations_create_request`
--
SELECT `name`, `description`, `is_private`, `org_wide`, `team_id` FROM `admin_conversations_create_request` WHERE 1;

--
-- INSERT template for table `admin_conversations_create_request`
--
INSERT INTO `admin_conversations_create_request`(`name`, `description`, `is_private`, `org_wide`, `team_id`) VALUES (?, ?, ?, ?, ?);

--
-- UPDATE template for table `admin_conversations_create_request`
--
UPDATE `admin_conversations_create_request` SET `name` = ?, `description` = ?, `is_private` = ?, `org_wide` = ?, `team_id` = ? WHERE 1;

--
-- DELETE template for table `admin_conversations_create_request`
--
DELETE FROM `admin_conversations_create_request` WHERE 0;

