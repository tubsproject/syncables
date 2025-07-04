--
-- Slack Web API.
-- Prepared SQL queries for 'admin_usergroups_removeChannels_request' definition.
--


--
-- SELECT template for table `admin_usergroups_removeChannels_request`
--
SELECT `usergroup_id`, `channel_ids` FROM `admin_usergroups_removeChannels_request` WHERE 1;

--
-- INSERT template for table `admin_usergroups_removeChannels_request`
--
INSERT INTO `admin_usergroups_removeChannels_request`(`usergroup_id`, `channel_ids`) VALUES (?, ?);

--
-- UPDATE template for table `admin_usergroups_removeChannels_request`
--
UPDATE `admin_usergroups_removeChannels_request` SET `usergroup_id` = ?, `channel_ids` = ? WHERE 1;

--
-- DELETE template for table `admin_usergroups_removeChannels_request`
--
DELETE FROM `admin_usergroups_removeChannels_request` WHERE 0;

