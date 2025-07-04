--
-- Slack Web API.
-- Prepared SQL queries for 'admin_usergroups_addTeams_request' definition.
--


--
-- SELECT template for table `admin_usergroups_addTeams_request`
--
SELECT `usergroup_id`, `team_ids`, `auto_provision` FROM `admin_usergroups_addTeams_request` WHERE 1;

--
-- INSERT template for table `admin_usergroups_addTeams_request`
--
INSERT INTO `admin_usergroups_addTeams_request`(`usergroup_id`, `team_ids`, `auto_provision`) VALUES (?, ?, ?);

--
-- UPDATE template for table `admin_usergroups_addTeams_request`
--
UPDATE `admin_usergroups_addTeams_request` SET `usergroup_id` = ?, `team_ids` = ?, `auto_provision` = ? WHERE 1;

--
-- DELETE template for table `admin_usergroups_addTeams_request`
--
DELETE FROM `admin_usergroups_addTeams_request` WHERE 0;

