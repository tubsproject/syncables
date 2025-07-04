/* SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO"; */
/* SET AUTOCOMMIT = 0; */
/* START TRANSACTION; */
/* SET time_zone = "+00:00"; */

-- --------------------------------------------------------

--
-- Table structure for table `API_method__users_getPresence` generated from model 'APIUnderscoremethodUnderscoreUnderscoreusersUnderscoregetPresence'
-- Generated from users.getPresence with shasum e7251aec575d8863f9e0eb38663ae9dc26655f65
--

CREATE TABLE IF NOT EXISTS `API_method__users_getPresence` (
  `auto_away` TINYINT(1) DEFAULT NULL,
  `connection_count` INT DEFAULT NULL,
  `last_activity` INT DEFAULT NULL,
  `manual_away` TINYINT(1) DEFAULT NULL,
  `ok` TINYINT(1) NOT NULL,
  `online` TINYINT(1) DEFAULT NULL,
  `presence` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Generated from users.getPresence with shasum e7251aec575d8863f9e0eb38663ae9dc26655f65';

--
-- Table structure for table `admin_apps_approve_request` generated from model 'adminUnderscoreappsUnderscoreapproveUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `admin_apps_approve_request` (
  `app_id` TEXT DEFAULT NULL COMMENT 'The id of the app to approve.',
  `request_id` TEXT DEFAULT NULL COMMENT 'The id of the request to approve.',
  `team_id` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `admin_apps_restrict_request` generated from model 'adminUnderscoreappsUnderscorerestrictUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `admin_apps_restrict_request` (
  `app_id` TEXT DEFAULT NULL COMMENT 'The id of the app to restrict.',
  `request_id` TEXT DEFAULT NULL COMMENT 'The id of the request to restrict.',
  `team_id` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `admin_conversations_archive_error_schema` generated from model 'adminUnderscoreconversationsUnderscorearchiveUnderscoreerrorUnderscoreschema'
-- Schema for error response from admin.conversations.archive
--

CREATE TABLE IF NOT EXISTS `admin_conversations_archive_error_schema` (
  `error` ENUM('feature_not_enabled', 'channel_not_found', 'channel_type_not_supported', 'default_org_wide_channel', 'already_archived', 'cant_archive_general', 'restricted_action', 'could_not_archive_channel') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from admin.conversations.archive';

--
-- Table structure for table `admin_conversations_archive_request` generated from model 'adminUnderscoreconversationsUnderscorearchiveUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `admin_conversations_archive_request` (
  `channel_id` TEXT NOT NULL COMMENT 'The channel to archive.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `admin_conversations_archive_schema` generated from model 'adminUnderscoreconversationsUnderscorearchiveUnderscoreschema'
-- Schema for successful response of admin.conversations.archive
--

CREATE TABLE IF NOT EXISTS `admin_conversations_archive_schema` (
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response of admin.conversations.archive';

--
-- Table structure for table `admin_conversations_convertToPrivate_error_schema` generated from model 'adminUnderscoreconversationsUnderscoreconvertToPrivateUnderscoreerrorUnderscoreschema'
-- Schema for error response from admin.conversations.convertToPrivate
--

CREATE TABLE IF NOT EXISTS `admin_conversations_convertToPrivate_error_schema` (
  `error` ENUM('feature_not_enabled', 'restricted_action', 'name_taken', 'channel_not_found', 'channel_type_not_supported', 'default_org_wide_channel', 'method_not_supported_for_channel_type', 'could_not_convert_channel', 'external_channel_migrating') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from admin.conversations.convertToPrivate';

--
-- Table structure for table `admin_conversations_convertToPrivate_request` generated from model 'adminUnderscoreconversationsUnderscoreconvertToPrivateUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `admin_conversations_convertToPrivate_request` (
  `channel_id` TEXT NOT NULL COMMENT 'The channel to convert to private.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `admin_conversations_convertToPrivate_schema` generated from model 'adminUnderscoreconversationsUnderscoreconvertToPrivateUnderscoreschema'
-- Schema for successful response of admin.conversations.convertToPrivate
--

CREATE TABLE IF NOT EXISTS `admin_conversations_convertToPrivate_schema` (
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response of admin.conversations.convertToPrivate';

--
-- Table structure for table `admin_conversations_create_error_schema` generated from model 'adminUnderscoreconversationsUnderscorecreateUnderscoreerrorUnderscoreschema'
-- Schema for error response from admin.conversations.create
--

CREATE TABLE IF NOT EXISTS `admin_conversations_create_error_schema` (
  `error` ENUM('feature_not_enabled', 'name_taken', 'restricted_action', 'team_not_found', 'invalid_team', 'invalid_name', 'could_not_create_channel', 'team_id_or_org_required') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from admin.conversations.create';

--
-- Table structure for table `admin_conversations_create_request` generated from model 'adminUnderscoreconversationsUnderscorecreateUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `admin_conversations_create_request` (
  `name` TEXT NOT NULL COMMENT 'Name of the public or private channel to create.',
  `description` TEXT DEFAULT NULL COMMENT 'Description of the public or private channel to create.',
  `is_private` TINYINT(1) NOT NULL COMMENT 'When &#x60;true&#x60;, creates a private channel instead of a public channel',
  `org_wide` TINYINT(1) DEFAULT NULL COMMENT 'When &#x60;true&#x60;, the channel will be available org-wide. Note: if the channel is not &#x60;org_wide&#x3D;true&#x60;, you must specify a &#x60;team_id&#x60; for this channel',
  `team_id` TEXT DEFAULT NULL COMMENT 'The workspace to create the channel in. Note: this argument is required unless you set &#x60;org_wide&#x3D;true&#x60;.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `admin_conversations_create_schema` generated from model 'adminUnderscoreconversationsUnderscorecreateUnderscoreschema'
-- Schema for successful response of admin.conversations.create
--

CREATE TABLE IF NOT EXISTS `admin_conversations_create_schema` (
  `channel_id` TEXT DEFAULT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response of admin.conversations.create';

--
-- Table structure for table `admin_conversations_delete_error_schema` generated from model 'adminUnderscoreconversationsUnderscoredeleteUnderscoreerrorUnderscoreschema'
-- Schema for error response from admin.conversations.delete
--

CREATE TABLE IF NOT EXISTS `admin_conversations_delete_error_schema` (
  `error` ENUM('feature_not_enabled', 'not_an_admin', 'channel_not_found', 'channel_type_not_supported', 'default_org_wide_channel', 'restricted_action', 'could_not_delete_channel', 'missing_scope') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from admin.conversations.delete';

--
-- Table structure for table `admin_conversations_delete_request` generated from model 'adminUnderscoreconversationsUnderscoredeleteUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `admin_conversations_delete_request` (
  `channel_id` TEXT NOT NULL COMMENT 'The channel to delete.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `admin_conversations_delete_schema` generated from model 'adminUnderscoreconversationsUnderscoredeleteUnderscoreschema'
-- Schema for successful response of admin.conversations.delete
--

CREATE TABLE IF NOT EXISTS `admin_conversations_delete_schema` (
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response of admin.conversations.delete';

--
-- Table structure for table `admin_conversations_disconnectShared_error_schema` generated from model 'adminUnderscoreconversationsUnderscoredisconnectSharedUnderscoreerrorUnderscoreschema'
-- Schema for error response from admin.conversations.disconnectShared
--

CREATE TABLE IF NOT EXISTS `admin_conversations_disconnectShared_error_schema` (
  `error` ENUM('feature_not_enabled', 'not_an_admin', 'not_an_enterprise', 'channel_not_found', 'not_supported', 'team_not_found', 'restricted_action', 'missing_scope', 'leaving_team_not_in_channel', 'no_teams_to_disconnect', 'leaving_team_required', 'cannot_kick_team', 'cannot_kick_home_team') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from admin.conversations.disconnectShared';

--
-- Table structure for table `admin_conversations_disconnectShared_request` generated from model 'adminUnderscoreconversationsUnderscoredisconnectSharedUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `admin_conversations_disconnectShared_request` (
  `channel_id` TEXT NOT NULL COMMENT 'The channel to be disconnected from some workspaces.',
  `leaving_team_ids` TEXT DEFAULT NULL COMMENT 'The team to be removed from the channel. Currently only a single team id can be specified.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `admin_conversations_getConversationPrefs_schema` generated from model 'adminUnderscoreconversationsUnderscoregetConversationPrefsUnderscoreschema'
-- Schema for successful response of admin.conversations.getConversationPrefs
--

CREATE TABLE IF NOT EXISTS `admin_conversations_getConversationPrefs_schema` (
  `ok` TINYINT(1) NOT NULL,
  `prefs` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response of admin.conversations.getConversationPrefs';

--
-- Table structure for table `admin_conversations_getConversationPrefs_schema_prefs` generated from model 'adminUnderscoreconversationsUnderscoregetConversationPrefsUnderscoreschemaUnderscoreprefs'
--

CREATE TABLE IF NOT EXISTS `admin_conversations_getConversationPrefs_schema_prefs` (
  `can_thread` TEXT DEFAULT NULL,
  `who_can_post` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `admin_conversations_getConversationPrefs_schema_prefs_can_thread` generated from model 'adminUnderscoreconversationsUnderscoregetConversationPrefsUnderscoreschemaUnderscoreprefsUnderscorecanUnderscorethread'
--

CREATE TABLE IF NOT EXISTS `admin_conversations_getConversationPrefs_schema_prefs_can_thread` (
  `type` JSON DEFAULT NULL,
  `user` JSON DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `admin_conversations_getTeams_error_schema` generated from model 'adminUnderscoreconversationsUnderscoregetTeamsUnderscoreerrorUnderscoreschema'
-- Schema for error response from admin.conversations.getTeams
--

CREATE TABLE IF NOT EXISTS `admin_conversations_getTeams_error_schema` (
  `error` ENUM('feature_not_enabled', 'channel_not_found', 'channel_type_not_supported', 'unsupported_team_type', 'restricted_action', 'could_not_get_teams', 'invalid_cursor', 'invalid_limit') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from admin.conversations.getTeams';

--
-- Table structure for table `admin_conversations_getTeams_schema` generated from model 'adminUnderscoreconversationsUnderscoregetTeamsUnderscoreschema'
-- Schema for successful response of admin.conversations.getTeams
--

CREATE TABLE IF NOT EXISTS `admin_conversations_getTeams_schema` (
  `ok` TINYINT(1) NOT NULL,
  `response_metadata` JSON DEFAULT NULL,
  `team_ids` JSON NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response of admin.conversations.getTeams';

--
-- Table structure for table `admin_conversations_invite_error_schema` generated from model 'adminUnderscoreconversationsUnderscoreinviteUnderscoreerrorUnderscoreschema'
-- Schema for error response from admin.conversations.invite
--

CREATE TABLE IF NOT EXISTS `admin_conversations_invite_error_schema` (
  `error` ENUM('feature_not_enabled', 'channel_not_found', 'channel_type_not_supported', 'default_org_wide_channel', 'restricted_action', 'user_must_be_admin', 'failed_for_some_users') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from admin.conversations.invite';

--
-- Table structure for table `admin_conversations_invite_request` generated from model 'adminUnderscoreconversationsUnderscoreinviteUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `admin_conversations_invite_request` (
  `user_ids` TEXT NOT NULL COMMENT 'The users to invite.',
  `channel_id` TEXT NOT NULL COMMENT 'The channel that the users will be invited to.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `admin_conversations_invite_schema` generated from model 'adminUnderscoreconversationsUnderscoreinviteUnderscoreschema'
-- Schema for successful response of admin.conversations.invite
--

CREATE TABLE IF NOT EXISTS `admin_conversations_invite_schema` (
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response of admin.conversations.invite';

--
-- Table structure for table `admin_conversations_rename_request` generated from model 'adminUnderscoreconversationsUnderscorerenameUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `admin_conversations_rename_request` (
  `channel_id` TEXT NOT NULL COMMENT 'The channel to rename.',
  `name` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `admin_conversations_rename_schema` generated from model 'adminUnderscoreconversationsUnderscorerenameUnderscoreschema'
-- Schema for successful response of admin.conversations.disconnectShared
--

CREATE TABLE IF NOT EXISTS `admin_conversations_rename_schema` (
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response of admin.conversations.disconnectShared';

--
-- Table structure for table `admin_conversations_rename_schema_1` generated from model 'adminUnderscoreconversationsUnderscorerenameUnderscoreschemaUnderscore1'
-- Schema for successful response of admin.conversations.rename
--

CREATE TABLE IF NOT EXISTS `admin_conversations_rename_schema_1` (
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response of admin.conversations.rename';

--
-- Table structure for table `admin_conversations_search_error_schema` generated from model 'adminUnderscoreconversationsUnderscoresearchUnderscoreerrorUnderscoreschema'
-- Schema for error response from admin.conversations.search
--

CREATE TABLE IF NOT EXISTS `admin_conversations_search_error_schema` (
  `error` ENUM('feature_not_enabled', 'not_an_admin', 'not_an_enterprise', 'team_not_found', 'not_allowed', 'invalid_auth', 'invalid_cursor', 'invalid_search_channel_type', 'invalid_sort', 'invalid_sort_dir') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from admin.conversations.search';

--
-- Table structure for table `admin_conversations_search_schema` generated from model 'adminUnderscoreconversationsUnderscoresearchUnderscoreschema'
-- Schema for successful response of admin.conversations.search
--

CREATE TABLE IF NOT EXISTS `admin_conversations_search_schema` (
  `channels` JSON NOT NULL,
  `next_cursor` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response of admin.conversations.search';

--
-- Table structure for table `admin_conversations_setConversationPrefs_error_schema` generated from model 'adminUnderscoreconversationsUnderscoresetConversationPrefsUnderscoreerrorUnderscoreschema'
-- Schema for error response from admin.conversations.setConversationPrefs
--

CREATE TABLE IF NOT EXISTS `admin_conversations_setConversationPrefs_error_schema` (
  `error` ENUM('feature_not_enabled', 'not_an_admin', 'channel_not_found', 'channel_type_not_supported', 'restricted_action', 'missing_scope', 'could_not_set_channel_pref', 'default_org_wide_channel') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from admin.conversations.setConversationPrefs';

--
-- Table structure for table `admin_conversations_setConversationPrefs_request` generated from model 'adminUnderscoreconversationsUnderscoresetConversationPrefsUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `admin_conversations_setConversationPrefs_request` (
  `channel_id` TEXT NOT NULL COMMENT 'The channel to set the prefs for',
  `prefs` TEXT NOT NULL COMMENT 'The prefs for this channel in a stringified JSON format.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `admin_conversations_setConversationPrefs_schema` generated from model 'adminUnderscoreconversationsUnderscoresetConversationPrefsUnderscoreschema'
-- Schema for successful response of admin.conversations.setConversationPrefs
--

CREATE TABLE IF NOT EXISTS `admin_conversations_setConversationPrefs_schema` (
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response of admin.conversations.setConversationPrefs';

--
-- Table structure for table `admin_conversations_setTeams_request` generated from model 'adminUnderscoreconversationsUnderscoresetTeamsUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `admin_conversations_setTeams_request` (
  `channel_id` TEXT NOT NULL COMMENT 'The encoded &#x60;channel_id&#x60; to add or remove to workspaces.',
  `team_id` TEXT DEFAULT NULL COMMENT 'The workspace to which the channel belongs. Omit this argument if the channel is a cross-workspace shared channel.',
  `target_team_ids` TEXT DEFAULT NULL COMMENT 'A comma-separated list of workspaces to which the channel should be shared. Not required if the channel is being shared org-wide.',
  `org_channel` TINYINT(1) DEFAULT NULL COMMENT 'True if channel has to be converted to an org channel'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `admin_conversations_unarchive_error_schema` generated from model 'adminUnderscoreconversationsUnderscoreunarchiveUnderscoreerrorUnderscoreschema'
-- Schema for error response from admin.conversations.getConversationPrefs
--

CREATE TABLE IF NOT EXISTS `admin_conversations_unarchive_error_schema` (
  `error` ENUM('feature_not_enabled', 'not_an_admin', 'not_an_enterprise', 'restricted_action', 'missing_scope', 'channel_not_found', 'channel_type_not_supported', 'could_not_get_conversation_prefs') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from admin.conversations.getConversationPrefs';

--
-- Table structure for table `admin_conversations_unarchive_error_schema_1` generated from model 'adminUnderscoreconversationsUnderscoreunarchiveUnderscoreerrorUnderscoreschemaUnderscore1'
-- Schema for error response from admin.conversations.rename
--

CREATE TABLE IF NOT EXISTS `admin_conversations_unarchive_error_schema_1` (
  `error` ENUM('feature_not_enabled', 'channel_not_found', 'channel_type_not_supported', 'restricted_action', 'could_not_rename_channel', 'default_org_wide_channel', 'name_taken') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from admin.conversations.rename';

--
-- Table structure for table `admin_conversations_unarchive_error_schema_2` generated from model 'adminUnderscoreconversationsUnderscoreunarchiveUnderscoreerrorUnderscoreschemaUnderscore2'
-- Schema for error response from admin.conversations.unarchive
--

CREATE TABLE IF NOT EXISTS `admin_conversations_unarchive_error_schema_2` (
  `error` ENUM('feature_not_enabled', 'channel_not_found', 'channel_not_archived', 'channel_type_not_supported', 'restricted_action', 'could_not_unarchive_channel', 'default_org_wide_channel', 'missing_scope') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from admin.conversations.unarchive';

--
-- Table structure for table `admin_conversations_unarchive_request` generated from model 'adminUnderscoreconversationsUnderscoreunarchiveUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `admin_conversations_unarchive_request` (
  `channel_id` TEXT NOT NULL COMMENT 'The channel to unarchive.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `admin_conversations_unarchive_schema` generated from model 'adminUnderscoreconversationsUnderscoreunarchiveUnderscoreschema'
-- Schema for successful response of admin.conversations.unarchive
--

CREATE TABLE IF NOT EXISTS `admin_conversations_unarchive_schema` (
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response of admin.conversations.unarchive';

--
-- Table structure for table `admin_inviteRequests_approve_request` generated from model 'adminUnderscoreinviteRequestsUnderscoreapproveUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `admin_inviteRequests_approve_request` (
  `team_id` TEXT DEFAULT NULL COMMENT 'ID for the workspace where the invite request was made.',
  `invite_request_id` TEXT NOT NULL COMMENT 'ID of the request to invite.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `admin_teams_create_request` generated from model 'adminUnderscoreteamsUnderscorecreateUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `admin_teams_create_request` (
  `team_domain` TEXT NOT NULL COMMENT 'Team domain (for example, slacksoftballteam).',
  `team_name` TEXT NOT NULL COMMENT 'Team name (for example, Slack Softball Team).',
  `team_description` TEXT DEFAULT NULL COMMENT 'Description for the team.',
  `team_discoverability` TEXT DEFAULT NULL COMMENT 'Who can join the team. A team&#39;s discoverability can be &#x60;open&#x60;, &#x60;closed&#x60;, &#x60;invite_only&#x60;, or &#x60;unlisted&#x60;.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `admin_teams_settings_setDescription_request` generated from model 'adminUnderscoreteamsUnderscoresettingsUnderscoresetDescriptionUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `admin_teams_settings_setDescription_request` (
  `team_id` TEXT NOT NULL COMMENT 'ID for the workspace to set the description for.',
  `description` TEXT NOT NULL COMMENT 'The new description for the workspace.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `admin_teams_settings_setDiscoverability_request` generated from model 'adminUnderscoreteamsUnderscoresettingsUnderscoresetDiscoverabilityUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `admin_teams_settings_setDiscoverability_request` (
  `team_id` TEXT NOT NULL COMMENT 'The ID of the workspace to set discoverability on.',
  `discoverability` TEXT NOT NULL COMMENT 'This workspace&#39;s discovery setting. It must be set to one of &#x60;open&#x60;, &#x60;invite_only&#x60;, &#x60;closed&#x60;, or &#x60;unlisted&#x60;.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `admin_teams_settings_setName_request` generated from model 'adminUnderscoreteamsUnderscoresettingsUnderscoresetNameUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `admin_teams_settings_setName_request` (
  `team_id` TEXT NOT NULL COMMENT 'ID for the workspace to set the name for.',
  `name` TEXT NOT NULL COMMENT 'The new name of the workspace.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `admin_usergroups_addChannels_request` generated from model 'adminUnderscoreusergroupsUnderscoreaddChannelsUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `admin_usergroups_addChannels_request` (
  `usergroup_id` TEXT NOT NULL COMMENT 'ID of the IDP group to add default channels for.',
  `team_id` TEXT DEFAULT NULL COMMENT 'The workspace to add default channels in.',
  `channel_ids` TEXT NOT NULL COMMENT 'Comma separated string of channel IDs.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `admin_usergroups_addTeams_request` generated from model 'adminUnderscoreusergroupsUnderscoreaddTeamsUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `admin_usergroups_addTeams_request` (
  `usergroup_id` TEXT NOT NULL COMMENT 'An encoded usergroup (IDP Group) ID.',
  `team_ids` TEXT NOT NULL COMMENT 'A comma separated list of encoded team (workspace) IDs. Each workspace *MUST* belong to the organization associated with the token.',
  `auto_provision` TINYINT(1) DEFAULT NULL COMMENT 'When &#x60;true&#x60;, this method automatically creates new workspace accounts for the IDP group members.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `admin_usergroups_removeChannels_request` generated from model 'adminUnderscoreusergroupsUnderscoreremoveChannelsUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `admin_usergroups_removeChannels_request` (
  `usergroup_id` TEXT NOT NULL COMMENT 'ID of the IDP Group',
  `channel_ids` TEXT NOT NULL COMMENT 'Comma-separated string of channel IDs'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `admin_users_assign_request` generated from model 'adminUnderscoreusersUnderscoreassignUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `admin_users_assign_request` (
  `team_id` TEXT NOT NULL COMMENT 'The ID (&#x60;T1234&#x60;) of the workspace.',
  `user_id` TEXT NOT NULL COMMENT 'The ID of the user to add to the workspace.',
  `is_restricted` TINYINT(1) DEFAULT NULL COMMENT 'True if user should be added to the workspace as a guest.',
  `is_ultra_restricted` TINYINT(1) DEFAULT NULL COMMENT 'True if user should be added to the workspace as a single-channel guest.',
  `channel_ids` TEXT DEFAULT NULL COMMENT 'Comma separated values of channel IDs to add user in the new workspace.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `admin_users_invite_request` generated from model 'adminUnderscoreusersUnderscoreinviteUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `admin_users_invite_request` (
  `team_id` TEXT NOT NULL COMMENT 'The ID (&#x60;T1234&#x60;) of the workspace.',
  `email` TEXT NOT NULL COMMENT 'The email address of the person to invite.',
  `channel_ids` TEXT NOT NULL COMMENT 'A comma-separated list of &#x60;channel_id&#x60;s for this user to join. At least one channel is required.',
  `custom_message` TEXT DEFAULT NULL COMMENT 'An optional message to send to the user in the invite email.',
  `real_name` TEXT DEFAULT NULL COMMENT 'Full name of the user.',
  `resend` TINYINT(1) DEFAULT NULL COMMENT 'Allow this invite to be resent in the future if a user has not signed up yet. (default: false)',
  `is_restricted` TINYINT(1) DEFAULT NULL COMMENT 'Is this user a multi-channel guest user? (default: false)',
  `is_ultra_restricted` TINYINT(1) DEFAULT NULL COMMENT 'Is this user a single channel guest user? (default: false)',
  `guest_expiration_ts` TEXT DEFAULT NULL COMMENT 'Timestamp when guest account should be disabled. Only include this timestamp if you are inviting a guest user and you want their account to expire on a certain date.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `admin_users_remove_request` generated from model 'adminUnderscoreusersUnderscoreremoveUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `admin_users_remove_request` (
  `team_id` TEXT NOT NULL COMMENT 'The ID (&#x60;T1234&#x60;) of the workspace.',
  `user_id` TEXT NOT NULL COMMENT 'The ID of the user to remove.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `admin_users_session_invalidate_request` generated from model 'adminUnderscoreusersUnderscoresessionUnderscoreinvalidateUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `admin_users_session_invalidate_request` (
  `team_id` TEXT NOT NULL COMMENT 'ID of the team that the session belongs to',
  `session_id` INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `admin_users_session_reset_request` generated from model 'adminUnderscoreusersUnderscoresessionUnderscoreresetUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `admin_users_session_reset_request` (
  `user_id` TEXT NOT NULL COMMENT 'The ID of the user to wipe sessions for',
  `mobile_only` TINYINT(1) DEFAULT NULL COMMENT 'Only expire mobile sessions (default: false)',
  `web_only` TINYINT(1) DEFAULT NULL COMMENT 'Only expire web sessions (default: false)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `admin_users_setAdmin_request` generated from model 'adminUnderscoreusersUnderscoresetAdminUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `admin_users_setAdmin_request` (
  `team_id` TEXT NOT NULL COMMENT 'The ID (&#x60;T1234&#x60;) of the workspace.',
  `user_id` TEXT NOT NULL COMMENT 'The ID of the user to designate as an admin.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `admin_users_setExpiration_request` generated from model 'adminUnderscoreusersUnderscoresetExpirationUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `admin_users_setExpiration_request` (
  `team_id` TEXT NOT NULL COMMENT 'The ID (&#x60;T1234&#x60;) of the workspace.',
  `user_id` TEXT NOT NULL COMMENT 'The ID of the user to set an expiration for.',
  `expiration_ts` INT NOT NULL COMMENT 'Timestamp when guest account should be disabled.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `admin_users_setOwner_request` generated from model 'adminUnderscoreusersUnderscoresetOwnerUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `admin_users_setOwner_request` (
  `team_id` TEXT NOT NULL COMMENT 'The ID (&#x60;T1234&#x60;) of the workspace.',
  `user_id` TEXT NOT NULL COMMENT 'Id of the user to promote to owner.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `admin_users_setRegular_request` generated from model 'adminUnderscoreusersUnderscoresetRegularUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `admin_users_setRegular_request` (
  `team_id` TEXT NOT NULL COMMENT 'The ID (&#x60;T1234&#x60;) of the workspace.',
  `user_id` TEXT NOT NULL COMMENT 'The ID of the user to designate as a regular user.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `api_permissions_scopes_list_success_schema` generated from model 'apiUnderscorepermissionsUnderscorescopesUnderscorelistUnderscoresuccessUnderscoreschema'
-- Schema for successful response api.permissions.scopes.list method
--

CREATE TABLE IF NOT EXISTS `api_permissions_scopes_list_success_schema` (
  `ok` TINYINT(1) NOT NULL,
  `scopes` JSON NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response api.permissions.scopes.list method';

--
-- Table structure for table `api_test_error_schema` generated from model 'apiUnderscoretestUnderscoreerrorUnderscoreschema'
-- Schema for error response api.test method
--

CREATE TABLE IF NOT EXISTS `api_test_error_schema` (
  `error` TEXT NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response api.test method';

--
-- Table structure for table `api_test_success_schema` generated from model 'apiUnderscoretestUnderscoresuccessUnderscoreschema'
-- Schema for successful response api.test method
--

CREATE TABLE IF NOT EXISTS `api_test_success_schema` (
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response api.test method';

--
-- Table structure for table `apps_permissions_info_error_schema` generated from model 'appsUnderscorepermissionsUnderscoreinfoUnderscoreerrorUnderscoreschema'
-- Schema for error response from apps.permissions.info method
--

CREATE TABLE IF NOT EXISTS `apps_permissions_info_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'user_is_bot', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from apps.permissions.info method';

--
-- Table structure for table `apps_permissions_info_schema` generated from model 'appsUnderscorepermissionsUnderscoreinfoUnderscoreschema'
-- Schema for successful response from apps.permissions.info method
--

CREATE TABLE IF NOT EXISTS `apps_permissions_info_schema` (
  `info` TEXT NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from apps.permissions.info method';

--
-- Table structure for table `apps_permissions_info_schema_info` generated from model 'appsUnderscorepermissionsUnderscoreinfoUnderscoreschemaUnderscoreinfo'
--

CREATE TABLE IF NOT EXISTS `apps_permissions_info_schema_info` (
  `app_home` TEXT NOT NULL,
  `channel` TEXT NOT NULL,
  `group` TEXT NOT NULL,
  `im` TEXT NOT NULL,
  `mpim` TEXT NOT NULL,
  `team` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `apps_permissions_info_schema_info_app_home` generated from model 'appsUnderscorepermissionsUnderscoreinfoUnderscoreschemaUnderscoreinfoUnderscoreappUnderscorehome'
--

CREATE TABLE IF NOT EXISTS `apps_permissions_info_schema_info_app_home` (
  `resources` TEXT DEFAULT NULL,
  `scopes` JSON DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `apps_permissions_info_schema_info_team` generated from model 'appsUnderscorepermissionsUnderscoreinfoUnderscoreschemaUnderscoreinfoUnderscoreteam'
--

CREATE TABLE IF NOT EXISTS `apps_permissions_info_schema_info_team` (
  `resources` TEXT NOT NULL,
  `scopes` JSON NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `apps_permissions_request_error_schema` generated from model 'appsUnderscorepermissionsUnderscorerequestUnderscoreerrorUnderscoreschema'
-- Schema for error response from apps.permissions.request method
--

CREATE TABLE IF NOT EXISTS `apps_permissions_request_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('invalid_trigger', 'trigger_exchanged', 'invalid_scope', 'invalid_user', 'not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'user_is_bot', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from apps.permissions.request method';

--
-- Table structure for table `apps_permissions_request_schema` generated from model 'appsUnderscorepermissionsUnderscorerequestUnderscoreschema'
-- Schema for successful response from apps.permissions.request method
--

CREATE TABLE IF NOT EXISTS `apps_permissions_request_schema` (
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from apps.permissions.request method';

--
-- Table structure for table `apps_permissions_resources_list_error_schema` generated from model 'appsUnderscorepermissionsUnderscoreresourcesUnderscorelistUnderscoreerrorUnderscoreschema'
-- Schema for error response from apps.permissions.resources.list method
--

CREATE TABLE IF NOT EXISTS `apps_permissions_resources_list_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('invalid_cursor', 'not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'user_is_bot', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from apps.permissions.resources.list method';

--
-- Table structure for table `apps_permissions_resources_list_success_schema` generated from model 'appsUnderscorepermissionsUnderscoreresourcesUnderscorelistUnderscoresuccessUnderscoreschema'
-- Schema for successful response apps.permissions.resources.list method
--

CREATE TABLE IF NOT EXISTS `apps_permissions_resources_list_success_schema` (
  `ok` TINYINT(1) NOT NULL,
  `resources` JSON NOT NULL,
  `response_metadata` JSON DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response apps.permissions.resources.list method';

--
-- Table structure for table `apps_permissions_resources_list_success_schema_resources_inner` generated from model 'appsUnderscorepermissionsUnderscoreresourcesUnderscorelistUnderscoresuccessUnderscoreschemaUnderscoreresourcesUnderscoreinner'
--

CREATE TABLE IF NOT EXISTS `apps_permissions_resources_list_success_schema_resources_inner` (
  `id` TEXT DEFAULT NULL,
  `type` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `apps_permissions_scopes_list_error_schema` generated from model 'appsUnderscorepermissionsUnderscorescopesUnderscorelistUnderscoreerrorUnderscoreschema'
-- Schema for error response from apps.permissions.scopes.list method
--

CREATE TABLE IF NOT EXISTS `apps_permissions_scopes_list_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'user_is_bot', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from apps.permissions.scopes.list method';

--
-- Table structure for table `apps_uninstall_error_schema` generated from model 'appsUnderscoreuninstallUnderscoreerrorUnderscoreschema'
-- Schema for error response from apps.uninstall method
--

CREATE TABLE IF NOT EXISTS `apps_uninstall_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('invalid_client_id', 'bad_client_secret', 'client_id_token_mismatch', 'not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'user_is_bot', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from apps.uninstall method';

--
-- Table structure for table `apps_uninstall_schema` generated from model 'appsUnderscoreuninstallUnderscoreschema'
-- Schema for successful response from apps.uninstall method
--

CREATE TABLE IF NOT EXISTS `apps_uninstall_schema` (
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from apps.uninstall method';

--
-- Table structure for table `auth_revoke_error_schema` generated from model 'authUnderscorerevokeUnderscoreerrorUnderscoreschema'
-- Schema for error response from auth.revoke method
--

CREATE TABLE IF NOT EXISTS `auth_revoke_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from auth.revoke method';

--
-- Table structure for table `auth_revoke_schema` generated from model 'authUnderscorerevokeUnderscoreschema'
-- Schema for successful response from auth.revoke method
--

CREATE TABLE IF NOT EXISTS `auth_revoke_schema` (
  `ok` TINYINT(1) NOT NULL,
  `revoked` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from auth.revoke method';

--
-- Table structure for table `auth_test_error_schema` generated from model 'authUnderscoretestUnderscoreerrorUnderscoreschema'
-- Schema for error response auth.test method
--

CREATE TABLE IF NOT EXISTS `auth_test_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('not_authed', 'invalid_auth', 'token_revoked', 'account_inactive', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response auth.test method';

--
-- Table structure for table `auth_test_success_schema` generated from model 'authUnderscoretestUnderscoresuccessUnderscoreschema'
-- Schema for successful response auth.test method
--

CREATE TABLE IF NOT EXISTS `auth_test_success_schema` (
  `bot_id` TEXT DEFAULT NULL,
  `is_enterprise_install` TINYINT(1) DEFAULT NULL,
  `ok` TINYINT(1) NOT NULL,
  `team` TEXT NOT NULL,
  `team_id` TEXT NOT NULL,
  `url` TEXT NOT NULL,
  `user` TEXT NOT NULL,
  `user_id` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response auth.test method';

--
-- Table structure for table `bots_info_error_schema` generated from model 'botsUnderscoreinfoUnderscoreerrorUnderscoreschema'
-- Schema for error response from bots.info method
--

CREATE TABLE IF NOT EXISTS `bots_info_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('bot_not_found', 'not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from bots.info method';

--
-- Table structure for table `bots_info_schema` generated from model 'botsUnderscoreinfoUnderscoreschema'
-- Schema for successful response from bots.info method
--

CREATE TABLE IF NOT EXISTS `bots_info_schema` (
  `bot` JSON NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from bots.info method';

--
-- Table structure for table `calls_add_request` generated from model 'callsUnderscoreaddUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `calls_add_request` (
  `external_unique_id` TEXT NOT NULL COMMENT 'An ID supplied by the 3rd-party Call provider. It must be unique across all Calls from that service.',
  `external_display_id` TEXT DEFAULT NULL COMMENT 'An optional, human-readable ID supplied by the 3rd-party Call provider. If supplied, this ID will be displayed in the Call object.',
  `join_url` TEXT NOT NULL COMMENT 'The URL required for a client to join the Call.',
  `desktop_app_join_url` TEXT DEFAULT NULL COMMENT 'When supplied, available Slack clients will attempt to directly launch the 3rd-party Call with this URL.',
  `date_start` INT DEFAULT NULL COMMENT 'Call start time in UTC UNIX timestamp format',
  `title` TEXT DEFAULT NULL COMMENT 'The name of the Call.',
  `created_by` TEXT DEFAULT NULL COMMENT 'The valid Slack user ID of the user who created this Call. When this method is called with a user token, the &#x60;created_by&#x60; field is optional and defaults to the authed user of the token. Otherwise, the field is required.',
  `users` TEXT DEFAULT NULL COMMENT 'The list of users to register as participants in the Call. [Read more on how to specify users here](/apis/calls#users).'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `calls_end_request` generated from model 'callsUnderscoreendUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `calls_end_request` (
  `id` TEXT NOT NULL COMMENT '&#x60;id&#x60; returned when registering the call using the [&#x60;calls.add&#x60;](/methods/calls.add) method.',
  `duration` INT DEFAULT NULL COMMENT 'Call duration in seconds'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `calls_participants_add_request` generated from model 'callsUnderscoreparticipantsUnderscoreaddUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `calls_participants_add_request` (
  `id` TEXT NOT NULL COMMENT '&#x60;id&#x60; returned by the [&#x60;calls.add&#x60;](/methods/calls.add) method.',
  `users` TEXT NOT NULL COMMENT 'The list of users to add as participants in the Call. [Read more on how to specify users here](/apis/calls#users).'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `calls_participants_remove_request` generated from model 'callsUnderscoreparticipantsUnderscoreremoveUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `calls_participants_remove_request` (
  `id` TEXT NOT NULL COMMENT '&#x60;id&#x60; returned by the [&#x60;calls.add&#x60;](/methods/calls.add) method.',
  `users` TEXT NOT NULL COMMENT 'The list of users to remove as participants in the Call. [Read more on how to specify users here](/apis/calls#users).'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `calls_update_request` generated from model 'callsUnderscoreupdateUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `calls_update_request` (
  `id` TEXT NOT NULL COMMENT '&#x60;id&#x60; returned by the [&#x60;calls.add&#x60;](/methods/calls.add) method.',
  `title` TEXT DEFAULT NULL COMMENT 'The name of the Call.',
  `join_url` TEXT DEFAULT NULL COMMENT 'The URL required for a client to join the Call.',
  `desktop_app_join_url` TEXT DEFAULT NULL COMMENT 'When supplied, available Slack clients will attempt to directly launch the 3rd-party Call with this URL.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `chat_delete_error_schema` generated from model 'chatUnderscoredeleteUnderscoreerrorUnderscoreschema'
-- Schema for error response from chat.delete method
--

CREATE TABLE IF NOT EXISTS `chat_delete_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('message_not_found', 'channel_not_found', 'cant_delete_message', 'compliance_exports_prevent_deletion', 'not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from chat.delete method';

--
-- Table structure for table `chat_delete_request` generated from model 'chatUnderscoredeleteUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `chat_delete_request` (
  `ts` DECIMAL(20, 9) DEFAULT NULL COMMENT 'Timestamp of the message to be deleted.',
  `channel` TEXT DEFAULT NULL COMMENT 'Channel containing the message to be deleted.',
  `as_user` TINYINT(1) DEFAULT NULL COMMENT 'Pass true to delete the message as the authed user with &#x60;chat:write:user&#x60; scope. [Bot users](/bot-users) in this context are considered authed users. If unused or false, the message will be deleted with &#x60;chat:write:bot&#x60; scope.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `chat_deleteScheduledMessage_error_schema` generated from model 'chatUnderscoredeleteScheduledMessageUnderscoreerrorUnderscoreschema'
-- Schema for error response from chat.deleteScheduledMessage method
--

CREATE TABLE IF NOT EXISTS `chat_deleteScheduledMessage_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('invalid_scheduled_message_id', 'channel_not_found', 'bad_token', 'not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'ekm_access_denied', 'missing_scope', 'invalid_arguments', 'invalid_arg_name', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from chat.deleteScheduledMessage method';

--
-- Table structure for table `chat_deleteScheduledMessage_request` generated from model 'chatUnderscoredeleteScheduledMessageUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `chat_deleteScheduledMessage_request` (
  `as_user` TINYINT(1) DEFAULT NULL COMMENT 'Pass true to delete the message as the authed user with &#x60;chat:write:user&#x60; scope. [Bot users](/bot-users) in this context are considered authed users. If unused or false, the message will be deleted with &#x60;chat:write:bot&#x60; scope.',
  `channel` TEXT NOT NULL COMMENT 'The channel the scheduled_message is posting to',
  `scheduled_message_id` TEXT NOT NULL COMMENT '&#x60;scheduled_message_id&#x60; returned from call to chat.scheduleMessage'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `chat_deleteScheduledMessage_schema` generated from model 'chatUnderscoredeleteScheduledMessageUnderscoreschema'
-- Schema for successful response from chat.deleteScheduledMessage method
--

CREATE TABLE IF NOT EXISTS `chat_deleteScheduledMessage_schema` (
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from chat.deleteScheduledMessage method';

--
-- Table structure for table `chat_delete_success_schema` generated from model 'chatUnderscoredeleteUnderscoresuccessUnderscoreschema'
-- Schema for successful response of chat.delete method
--

CREATE TABLE IF NOT EXISTS `chat_delete_success_schema` (
  `channel` TEXT NOT NULL,
  `ok` TINYINT(1) NOT NULL,
  `ts` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response of chat.delete method';

--
-- Table structure for table `chat_getPermalink_error_schema` generated from model 'chatUnderscoregetPermalinkUnderscoreerrorUnderscoreschema'
-- Schema for error response from chat.getPermalink method
--

CREATE TABLE IF NOT EXISTS `chat_getPermalink_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('channel_not_found', 'message_not_found', 'not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from chat.getPermalink method';

--
-- Table structure for table `chat_getPermalink_success_schema` generated from model 'chatUnderscoregetPermalinkUnderscoresuccessUnderscoreschema'
-- Schema for successful response chat.getPermalink
--

CREATE TABLE IF NOT EXISTS `chat_getPermalink_success_schema` (
  `channel` TEXT NOT NULL,
  `ok` TINYINT(1) NOT NULL,
  `permalink` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response chat.getPermalink';

--
-- Table structure for table `chat_meMessage_error_schema` generated from model 'chatUnderscoremeMessageUnderscoreerrorUnderscoreschema'
-- Schema for error response from chat.meMessage method
--

CREATE TABLE IF NOT EXISTS `chat_meMessage_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('channel_not_found', 'not_in_channel', 'is_archived', 'msg_too_long', 'no_text', 'rate_limited', 'not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from chat.meMessage method';

--
-- Table structure for table `chat_meMessage_request` generated from model 'chatUnderscoremeMessageUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `chat_meMessage_request` (
  `channel` TEXT DEFAULT NULL COMMENT 'Channel to send message to. Can be a public channel, private group or IM channel. Can be an encoded ID, or a name.',
  `text` TEXT DEFAULT NULL COMMENT 'Text of the message to send.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `chat_meMessage_schema` generated from model 'chatUnderscoremeMessageUnderscoreschema'
-- Schema for successful response from chat.meMessage method
--

CREATE TABLE IF NOT EXISTS `chat_meMessage_schema` (
  `channel` TEXT DEFAULT NULL,
  `ok` TINYINT(1) NOT NULL,
  `ts` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from chat.meMessage method';

--
-- Table structure for table `chat_postEphemeral_error_schema` generated from model 'chatUnderscorepostEphemeralUnderscoreerrorUnderscoreschema'
-- Schema for error response from chat.postEphemeral method
--

CREATE TABLE IF NOT EXISTS `chat_postEphemeral_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('channel_not_found', 'is_archived', 'msg_too_long', 'no_text', 'restricted_action', 'too_many_attachments', 'user_not_in_channel', 'not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from chat.postEphemeral method';

--
-- Table structure for table `chat_postEphemeral_request` generated from model 'chatUnderscorepostEphemeralUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `chat_postEphemeral_request` (
  `as_user` TINYINT(1) DEFAULT NULL COMMENT 'Pass true to post the message as the authed user. Defaults to true if the chat:write:bot scope is not included. Otherwise, defaults to false.',
  `attachments` TEXT DEFAULT NULL COMMENT 'A JSON-based array of structured attachments, presented as a URL-encoded string.',
  `blocks` TEXT DEFAULT NULL COMMENT 'A JSON-based array of structured blocks, presented as a URL-encoded string.',
  `channel` TEXT NOT NULL COMMENT 'Channel, private group, or IM channel to send message to. Can be an encoded ID, or a name.',
  `icon_emoji` TEXT DEFAULT NULL COMMENT 'Emoji to use as the icon for this message. Overrides &#x60;icon_url&#x60;. Must be used in conjunction with &#x60;as_user&#x60; set to &#x60;false&#x60;, otherwise ignored. See [authorship](#authorship) below.',
  `icon_url` TEXT DEFAULT NULL COMMENT 'URL to an image to use as the icon for this message. Must be used in conjunction with &#x60;as_user&#x60; set to false, otherwise ignored. See [authorship](#authorship) below.',
  `link_names` TINYINT(1) DEFAULT NULL COMMENT 'Find and link channel names and usernames.',
  `parse` TEXT DEFAULT NULL COMMENT 'Change how messages are treated. Defaults to &#x60;none&#x60;. See [below](#formatting).',
  `text` TEXT DEFAULT NULL COMMENT 'How this field works and whether it is required depends on other fields you use in your API call. [See below](#text_usage) for more detail.',
  `thread_ts` TEXT DEFAULT NULL COMMENT 'Provide another message&#39;s &#x60;ts&#x60; value to post this message in a thread. Avoid using a reply&#39;s &#x60;ts&#x60; value; use its parent&#39;s value instead. Ephemeral messages in threads are only shown if there is already an active thread.',
  `user` TEXT NOT NULL COMMENT '&#x60;id&#x60; of the user who will receive the ephemeral message. The user should be in the channel specified by the &#x60;channel&#x60; argument.',
  `username` TEXT DEFAULT NULL COMMENT 'Set your bot&#39;s user name. Must be used in conjunction with &#x60;as_user&#x60; set to false, otherwise ignored. See [authorship](#authorship) below.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `chat_postEphemeral_success_schema` generated from model 'chatUnderscorepostEphemeralUnderscoresuccessUnderscoreschema'
-- Schema for successful response from chat.postEphemeral method
--

CREATE TABLE IF NOT EXISTS `chat_postEphemeral_success_schema` (
  `message_ts` TEXT NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from chat.postEphemeral method';

--
-- Table structure for table `chat_postMessage_error_schema` generated from model 'chatUnderscorepostMessageUnderscoreerrorUnderscoreschema'
-- Schema for error response chat.postMessage method
--

CREATE TABLE IF NOT EXISTS `chat_postMessage_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('channel_not_found', 'not_in_channel', 'is_archived', 'msg_too_long', 'no_text', 'too_many_attachments', 'rate_limited', 'not_authed', 'invalid_auth', 'account_inactive', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response chat.postMessage method';

--
-- Table structure for table `chat_postMessage_request` generated from model 'chatUnderscorepostMessageUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `chat_postMessage_request` (
  `as_user` TEXT DEFAULT NULL COMMENT 'Pass true to post the message as the authed user, instead of as a bot. Defaults to false. See [authorship](#authorship) below.',
  `attachments` TEXT DEFAULT NULL COMMENT 'A JSON-based array of structured attachments, presented as a URL-encoded string.',
  `blocks` TEXT DEFAULT NULL COMMENT 'A JSON-based array of structured blocks, presented as a URL-encoded string.',
  `channel` TEXT NOT NULL COMMENT 'Channel, private group, or IM channel to send message to. Can be an encoded ID, or a name. See [below](#channels) for more details.',
  `icon_emoji` TEXT DEFAULT NULL COMMENT 'Emoji to use as the icon for this message. Overrides &#x60;icon_url&#x60;. Must be used in conjunction with &#x60;as_user&#x60; set to &#x60;false&#x60;, otherwise ignored. See [authorship](#authorship) below.',
  `icon_url` TEXT DEFAULT NULL COMMENT 'URL to an image to use as the icon for this message. Must be used in conjunction with &#x60;as_user&#x60; set to false, otherwise ignored. See [authorship](#authorship) below.',
  `link_names` TINYINT(1) DEFAULT NULL COMMENT 'Find and link channel names and usernames.',
  `mrkdwn` TINYINT(1) DEFAULT NULL COMMENT 'Disable Slack markup parsing by setting to &#x60;false&#x60;. Enabled by default.',
  `parse` TEXT DEFAULT NULL COMMENT 'Change how messages are treated. Defaults to &#x60;none&#x60;. See [below](#formatting).',
  `reply_broadcast` TINYINT(1) DEFAULT NULL COMMENT 'Used in conjunction with &#x60;thread_ts&#x60; and indicates whether reply should be made visible to everyone in the channel or conversation. Defaults to &#x60;false&#x60;.',
  `text` TEXT DEFAULT NULL COMMENT 'How this field works and whether it is required depends on other fields you use in your API call. [See below](#text_usage) for more detail.',
  `thread_ts` TEXT DEFAULT NULL COMMENT 'Provide another message&#39;s &#x60;ts&#x60; value to make this message a reply. Avoid using a reply&#39;s &#x60;ts&#x60; value; use its parent instead.',
  `unfurl_links` TINYINT(1) DEFAULT NULL COMMENT 'Pass true to enable unfurling of primarily text-based content.',
  `unfurl_media` TINYINT(1) DEFAULT NULL COMMENT 'Pass false to disable unfurling of media content.',
  `username` TEXT DEFAULT NULL COMMENT 'Set your bot&#39;s user name. Must be used in conjunction with &#x60;as_user&#x60; set to false, otherwise ignored. See [authorship](#authorship) below.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `chat_postMessage_success_schema` generated from model 'chatUnderscorepostMessageUnderscoresuccessUnderscoreschema'
-- Schema for successful response of chat.postMessage method
--

CREATE TABLE IF NOT EXISTS `chat_postMessage_success_schema` (
  `channel` TEXT NOT NULL,
  `message` TEXT NOT NULL,
  `ok` TINYINT(1) NOT NULL,
  `ts` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response of chat.postMessage method';

--
-- Table structure for table `chat_scheduleMessage_error_schema` generated from model 'chatUnderscorescheduleMessageUnderscoreerrorUnderscoreschema'
-- Schema for error response chat.scheduleMessage method
--

CREATE TABLE IF NOT EXISTS `chat_scheduleMessage_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('invalid_time', 'time_in_past', 'time_too_far', 'channel_not_found', 'not_in_channel', 'is_archived', 'msg_too_long', 'no_text', 'restricted_action', 'restricted_action_read_only_channel', 'restricted_action_thread_only_channel', 'restricted_action_non_threadable_channel', 'too_many_attachments', 'rate_limited', 'not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'ekm_access_denied', 'missing_scope', 'invalid_arguments', 'invalid_arg_name', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response chat.scheduleMessage method';

--
-- Table structure for table `chat_scheduleMessage_request` generated from model 'chatUnderscorescheduleMessageUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `chat_scheduleMessage_request` (
  `channel` TEXT DEFAULT NULL COMMENT 'Channel, private group, or DM channel to send message to. Can be an encoded ID, or a name. See [below](#channels) for more details.',
  `text` TEXT DEFAULT NULL COMMENT 'How this field works and whether it is required depends on other fields you use in your API call. [See below](#text_usage) for more detail.',
  `post_at` TEXT DEFAULT NULL COMMENT 'Unix EPOCH timestamp of time in future to send the message.',
  `parse` TEXT DEFAULT NULL COMMENT 'Change how messages are treated. Defaults to &#x60;none&#x60;. See [chat.postMessage](chat.postMessage#formatting).',
  `as_user` TINYINT(1) DEFAULT NULL COMMENT 'Pass true to post the message as the authed user, instead of as a bot. Defaults to false. See [chat.postMessage](chat.postMessage#authorship).',
  `link_names` TINYINT(1) DEFAULT NULL COMMENT 'Find and link channel names and usernames.',
  `attachments` TEXT DEFAULT NULL COMMENT 'A JSON-based array of structured attachments, presented as a URL-encoded string.',
  `blocks` TEXT DEFAULT NULL COMMENT 'A JSON-based array of structured blocks, presented as a URL-encoded string.',
  `unfurl_links` TINYINT(1) DEFAULT NULL COMMENT 'Pass true to enable unfurling of primarily text-based content.',
  `unfurl_media` TINYINT(1) DEFAULT NULL COMMENT 'Pass false to disable unfurling of media content.',
  `thread_ts` DECIMAL(20, 9) DEFAULT NULL COMMENT 'Provide another message&#39;s &#x60;ts&#x60; value to make this message a reply. Avoid using a reply&#39;s &#x60;ts&#x60; value; use its parent instead.',
  `reply_broadcast` TINYINT(1) DEFAULT NULL COMMENT 'Used in conjunction with &#x60;thread_ts&#x60; and indicates whether reply should be made visible to everyone in the channel or conversation. Defaults to &#x60;false&#x60;.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `chat_scheduleMessage_success_schema` generated from model 'chatUnderscorescheduleMessageUnderscoresuccessUnderscoreschema'
-- Schema for successful response of chat.scheduleMessage method
--

CREATE TABLE IF NOT EXISTS `chat_scheduleMessage_success_schema` (
  `channel` TEXT NOT NULL,
  `message` JSON NOT NULL,
  `ok` TINYINT(1) NOT NULL,
  `post_at` INT NOT NULL,
  `scheduled_message_id` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response of chat.scheduleMessage method';

--
-- Table structure for table `chat_scheduledMessages_list_error_schema` generated from model 'chatUnderscorescheduledMessagesUnderscorelistUnderscoreerrorUnderscoreschema'
-- Schema for error response from chat.scheduledMessages.list method
--

CREATE TABLE IF NOT EXISTS `chat_scheduledMessages_list_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('invalid_channel', 'not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'ekm_access_denied', 'missing_scope', 'invalid_arguments', 'invalid_arg_name', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from chat.scheduledMessages.list method';

--
-- Table structure for table `chat_scheduledMessages_list_schema` generated from model 'chatUnderscorescheduledMessagesUnderscorelistUnderscoreschema'
-- Schema for successful response from chat.scheduledMessages.list method
--

CREATE TABLE IF NOT EXISTS `chat_scheduledMessages_list_schema` (
  `ok` TINYINT(1) NOT NULL,
  `response_metadata` JSON NOT NULL,
  `scheduled_messages` JSON NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from chat.scheduledMessages.list method';

--
-- Table structure for table `chat_unfurl_error_schema` generated from model 'chatUnderscoreunfurlUnderscoreerrorUnderscoreschema'
-- Schema for error response from chat.unfurl method
--

CREATE TABLE IF NOT EXISTS `chat_unfurl_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('cannot_unfurl_url', 'cannot_find_service', 'missing_unfurls', 'cannot_prompt', 'not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'user_is_bot', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from chat.unfurl method';

--
-- Table structure for table `chat_unfurl_request` generated from model 'chatUnderscoreunfurlUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `chat_unfurl_request` (
  `channel` TEXT NOT NULL COMMENT 'Channel ID of the message',
  `ts` TEXT NOT NULL COMMENT 'Timestamp of the message to add unfurl behavior to.',
  `unfurls` TEXT DEFAULT NULL COMMENT 'URL-encoded JSON map with keys set to URLs featured in the the message, pointing to their unfurl blocks or message attachments.',
  `user_auth_message` TEXT DEFAULT NULL COMMENT 'Provide a simply-formatted string to send as an ephemeral message to the user as invitation to authenticate further and enable full unfurling behavior',
  `user_auth_required` TINYINT(1) DEFAULT NULL COMMENT 'Set to &#x60;true&#x60; or &#x60;1&#x60; to indicate the user must install your Slack app to trigger unfurls for this domain',
  `user_auth_url` TEXT DEFAULT NULL COMMENT 'Send users to this custom URL where they will complete authentication in your app to fully trigger unfurling. Value should be properly URL-encoded.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `chat_unfurl_success_schema` generated from model 'chatUnderscoreunfurlUnderscoresuccessUnderscoreschema'
-- Schema for successful response from chat.unfurl method
--

CREATE TABLE IF NOT EXISTS `chat_unfurl_success_schema` (
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from chat.unfurl method';

--
-- Table structure for table `chat_update_error_schema` generated from model 'chatUnderscoreupdateUnderscoreerrorUnderscoreschema'
-- Schema for error response chat.update method
--

CREATE TABLE IF NOT EXISTS `chat_update_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('message_not_found', 'cant_update_message', 'channel_not_found', 'edit_window_closed', 'msg_too_long', 'too_many_attachments', 'rate_limited', 'no_text', 'not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'request_timeout', 'invalid_json', 'json_not_object', 'upgrade_required', 'fatal_error', 'is_inactive') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response chat.update method';

--
-- Table structure for table `chat_update_request` generated from model 'chatUnderscoreupdateUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `chat_update_request` (
  `as_user` TEXT DEFAULT NULL COMMENT 'Pass true to update the message as the authed user. [Bot users](/bot-users) in this context are considered authed users.',
  `attachments` TEXT DEFAULT NULL COMMENT 'A JSON-based array of structured attachments, presented as a URL-encoded string. This field is required when not presenting &#x60;text&#x60;. If you don&#39;t include this field, the message&#39;s previous &#x60;attachments&#x60; will be retained. To remove previous &#x60;attachments&#x60;, include an empty array for this field.',
  `blocks` TEXT DEFAULT NULL COMMENT 'A JSON-based array of [structured blocks](/block-kit/building), presented as a URL-encoded string. If you don&#39;t include this field, the message&#39;s previous &#x60;blocks&#x60; will be retained. To remove previous &#x60;blocks&#x60;, include an empty array for this field.',
  `channel` TEXT NOT NULL COMMENT 'Channel containing the message to be updated.',
  `link_names` TEXT DEFAULT NULL COMMENT 'Find and link channel names and usernames. Defaults to &#x60;none&#x60;. If you do not specify a value for this field, the original value set for the message will be overwritten with the default, &#x60;none&#x60;.',
  `parse` TEXT DEFAULT NULL COMMENT 'Change how messages are treated. Defaults to &#x60;client&#x60;, unlike &#x60;chat.postMessage&#x60;. Accepts either &#x60;none&#x60; or &#x60;full&#x60;. If you do not specify a value for this field, the original value set for the message will be overwritten with the default, &#x60;client&#x60;.',
  `text` TEXT DEFAULT NULL COMMENT 'New text for the message, using the [default formatting rules](/reference/surfaces/formatting). It&#39;s not required when presenting &#x60;blocks&#x60; or &#x60;attachments&#x60;.',
  `ts` TEXT NOT NULL COMMENT 'Timestamp of the message to be updated.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `chat_update_success_schema` generated from model 'chatUnderscoreupdateUnderscoresuccessUnderscoreschema'
-- Schema for successful response of chat.update method
--

CREATE TABLE IF NOT EXISTS `chat_update_success_schema` (
  `channel` TEXT NOT NULL,
  `message` TEXT NOT NULL,
  `ok` TINYINT(1) NOT NULL,
  `text` TEXT NOT NULL,
  `ts` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response of chat.update method';

--
-- Table structure for table `conversations_archive_error_schema` generated from model 'conversationsUnderscorearchiveUnderscoreerrorUnderscoreschema'
-- Schema for error response from conversations.archive method
--

CREATE TABLE IF NOT EXISTS `conversations_archive_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('method_not_supported_for_channel_type', 'missing_scope', 'not_supported', 'channel_not_found', 'already_archived', 'cant_archive_general', 'restricted_action', 'not_authed', 'invalid_auth', 'account_inactive', 'user_is_bot', 'user_is_restricted', 'user_is_ultra_restricted', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'team_added_to_org', 'missing_charset', 'superfluous_charset') NOT NULL,
  `needed` TEXT DEFAULT NULL,
  `ok` TINYINT(1) NOT NULL,
  `provided` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from conversations.archive method';

--
-- Table structure for table `conversations_archive_request` generated from model 'conversationsUnderscorearchiveUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `conversations_archive_request` (
  `channel` TEXT DEFAULT NULL COMMENT 'ID of conversation to archive'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `conversations_archive_success_schema` generated from model 'conversationsUnderscorearchiveUnderscoresuccessUnderscoreschema'
-- Schema for successful response conversations.archive method
--

CREATE TABLE IF NOT EXISTS `conversations_archive_success_schema` (
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response conversations.archive method';

--
-- Table structure for table `conversations_close_error_schema` generated from model 'conversationsUnderscorecloseUnderscoreerrorUnderscoreschema'
-- Schema for error response from conversations.close method
--

CREATE TABLE IF NOT EXISTS `conversations_close_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('method_not_supported_for_channel_type', 'channel_not_found', 'user_does_not_own_channel', 'missing_scope', 'not_authed', 'invalid_auth', 'account_inactive', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required') NOT NULL,
  `needed` TEXT DEFAULT NULL,
  `ok` TINYINT(1) NOT NULL,
  `provided` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from conversations.close method';

--
-- Table structure for table `conversations_close_request` generated from model 'conversationsUnderscorecloseUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `conversations_close_request` (
  `channel` TEXT DEFAULT NULL COMMENT 'Conversation to close.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `conversations_close_success_schema` generated from model 'conversationsUnderscorecloseUnderscoresuccessUnderscoreschema'
-- Schema for successful response conversations.close method
--

CREATE TABLE IF NOT EXISTS `conversations_close_success_schema` (
  `already_closed` TINYINT(1) DEFAULT NULL,
  `no_op` TINYINT(1) DEFAULT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response conversations.close method';

--
-- Table structure for table `conversations_create_error_schema` generated from model 'conversationsUnderscorecreateUnderscoreerrorUnderscoreschema'
-- Schema for error response from conversations.create method
--

CREATE TABLE IF NOT EXISTS `conversations_create_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `detail` TEXT DEFAULT NULL,
  `error` ENUM('method_not_supported_for_channel_type', 'missing_scope', 'name_taken', 'restricted_action', 'no_channel', 'invalid_name_required', 'invalid_name_punctuation', 'invalid_name_maxlength', 'invalid_name_specials', 'invalid_name', 'not_authed', 'invalid_auth', 'account_inactive', 'user_is_bot', 'user_is_restricted', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required') NOT NULL,
  `needed` TEXT DEFAULT NULL,
  `ok` TINYINT(1) NOT NULL,
  `provided` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from conversations.create method';

--
-- Table structure for table `conversations_create_request` generated from model 'conversationsUnderscorecreateUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `conversations_create_request` (
  `name` TEXT DEFAULT NULL COMMENT 'Name of the public or private channel to create',
  `is_private` TINYINT(1) DEFAULT NULL COMMENT 'Create a private channel instead of a public one'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `conversations_create_success_schema` generated from model 'conversationsUnderscorecreateUnderscoresuccessUnderscoreschema'
-- Schema for successful response conversations.create method
--

CREATE TABLE IF NOT EXISTS `conversations_create_success_schema` (
  `channel` JSON NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response conversations.create method';

--
-- Table structure for table `conversations_history_error_schema` generated from model 'conversationsUnderscorehistoryUnderscoreerrorUnderscoreschema'
-- Schema for error response from conversations.history method
--

CREATE TABLE IF NOT EXISTS `conversations_history_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('missing_scope', 'channel_not_found', 'invalid_ts_latest', 'invalid_ts_oldest', 'not_authed', 'invalid_auth', 'account_inactive', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required') NOT NULL,
  `needed` TEXT DEFAULT NULL,
  `ok` TINYINT(1) NOT NULL,
  `provided` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from conversations.history method';

--
-- Table structure for table `conversations_history_success_schema` generated from model 'conversationsUnderscorehistoryUnderscoresuccessUnderscoreschema'
-- Schema for successful response from conversations.history method
--

CREATE TABLE IF NOT EXISTS `conversations_history_success_schema` (
  `channel_actions_count` INT NOT NULL,
  `channel_actions_ts` JSON NOT NULL,
  `has_more` TINYINT(1) NOT NULL,
  `messages` JSON NOT NULL,
  `ok` TINYINT(1) NOT NULL,
  `pin_count` INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from conversations.history method';

--
-- Table structure for table `conversations_info_error_schema` generated from model 'conversationsUnderscoreinfoUnderscoreerrorUnderscoreschema'
-- Schema for error response from conversations.info method
--

CREATE TABLE IF NOT EXISTS `conversations_info_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('missing_scope', 'channel_not_found', 'team_added_to_org', 'not_authed', 'invalid_auth', 'account_inactive', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required') NOT NULL,
  `needed` TEXT DEFAULT NULL,
  `ok` TINYINT(1) NOT NULL,
  `provided` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from conversations.info method';

--
-- Table structure for table `conversations_info_success_schema` generated from model 'conversationsUnderscoreinfoUnderscoresuccessUnderscoreschema'
-- Schema for successful response conversations.info
--

CREATE TABLE IF NOT EXISTS `conversations_info_success_schema` (
  `channel` JSON NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response conversations.info';

--
-- Table structure for table `conversations_invite_error_schema` generated from model 'conversationsUnderscoreinviteUnderscoreerrorUnderscoreschema'
-- Schema for successful response from conversations.invite method
--

CREATE TABLE IF NOT EXISTS `conversations_invite_error_schema` (
  `channel` JSON NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from conversations.invite method';

--
-- Table structure for table `conversations_invite_error_schema_1` generated from model 'conversationsUnderscoreinviteUnderscoreerrorUnderscoreschemaUnderscore1'
-- Schema for error response from conversations.invite method
--

CREATE TABLE IF NOT EXISTS `conversations_invite_error_schema_1` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('method_not_supported_for_channel_type', 'missing_scope', 'channel_not_found', 'user_not_found', 'no_user', 'cant_invite_self', 'not_in_channel', 'already_in_channel', 'is_archived', 'cant_invite', 'too_many_users', 'ura_max_channels', 'not_authed', 'invalid_auth', 'account_inactive', 'user_is_bot', 'user_is_restricted', 'user_is_ultra_restricted', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'team_added_to_org', 'missing_charset', 'superfluous_charset') DEFAULT NULL,
  `errors` JSON DEFAULT NULL,
  `needed` TEXT DEFAULT NULL,
  `ok` TINYINT(1) NOT NULL,
  `provided` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from conversations.invite method';

--
-- Table structure for table `conversations_invite_request` generated from model 'conversationsUnderscoreinviteUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `conversations_invite_request` (
  `channel` TEXT DEFAULT NULL COMMENT 'The ID of the public or private channel to invite user(s) to.',
  `users` TEXT DEFAULT NULL COMMENT 'A comma separated list of user IDs. Up to 1000 users may be listed.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `conversations_join_error_schema` generated from model 'conversationsUnderscorejoinUnderscoreerrorUnderscoreschema'
-- Schema for error response from conversations.join method
--

CREATE TABLE IF NOT EXISTS `conversations_join_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('method_not_supported_for_channel_type', 'missing_scope', 'channel_not_found', 'is_archived', 'not_authed', 'invalid_auth', 'account_inactive', 'user_is_bot', 'user_is_restricted', 'user_is_ultra_restricted', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'team_added_to_org', 'missing_charset', 'superfluous_charset') NOT NULL,
  `needed` TEXT DEFAULT NULL,
  `ok` TINYINT(1) NOT NULL,
  `provided` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from conversations.join method';

--
-- Table structure for table `conversations_join_request` generated from model 'conversationsUnderscorejoinUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `conversations_join_request` (
  `channel` TEXT DEFAULT NULL COMMENT 'ID of conversation to join'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `conversations_join_success_schema` generated from model 'conversationsUnderscorejoinUnderscoresuccessUnderscoreschema'
-- Schema for successful response from conversations.join method
--

CREATE TABLE IF NOT EXISTS `conversations_join_success_schema` (
  `channel` JSON NOT NULL,
  `ok` TINYINT(1) NOT NULL,
  `response_metadata` TEXT DEFAULT NULL,
  `warning` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from conversations.join method';

--
-- Table structure for table `conversations_kick_error_schema` generated from model 'conversationsUnderscorekickUnderscoreerrorUnderscoreschema'
-- Schema for error response conversations.kick method
--

CREATE TABLE IF NOT EXISTS `conversations_kick_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('method_not_supported_for_channel_type', 'missing_scope', 'channel_not_found', 'user_not_found', 'cant_kick_self', 'not_in_channel', 'cant_kick_from_general', 'restricted_action', 'not_authed', 'invalid_auth', 'account_inactive', 'user_is_bot', 'user_is_restricted', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required') NOT NULL,
  `needed` TEXT DEFAULT NULL,
  `ok` TINYINT(1) NOT NULL,
  `provided` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response conversations.kick method';

--
-- Table structure for table `conversations_kick_request` generated from model 'conversationsUnderscorekickUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `conversations_kick_request` (
  `channel` TEXT DEFAULT NULL COMMENT 'ID of conversation to remove user from.',
  `user` TEXT DEFAULT NULL COMMENT 'User ID to be removed.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `conversations_kick_success_schema` generated from model 'conversationsUnderscorekickUnderscoresuccessUnderscoreschema'
-- Schema for successful response conversations.kick method
--

CREATE TABLE IF NOT EXISTS `conversations_kick_success_schema` (
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response conversations.kick method';

--
-- Table structure for table `conversations_leave_error_schema` generated from model 'conversationsUnderscoreleaveUnderscoreerrorUnderscoreschema'
-- Schema for error response from conversations.leave method
--

CREATE TABLE IF NOT EXISTS `conversations_leave_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('method_not_supported_for_channel_type', 'last_member', 'missing_scope', 'channel_not_found', 'is_archived', 'cant_leave_general', 'not_authed', 'invalid_auth', 'account_inactive', 'user_is_bot', 'user_is_restricted', 'user_is_ultra_restricted', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'team_added_to_org', 'missing_charset', 'superfluous_charset') NOT NULL,
  `needed` TEXT DEFAULT NULL,
  `ok` TINYINT(1) NOT NULL,
  `provided` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from conversations.leave method';

--
-- Table structure for table `conversations_leave_request` generated from model 'conversationsUnderscoreleaveUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `conversations_leave_request` (
  `channel` TEXT DEFAULT NULL COMMENT 'Conversation to leave'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `conversations_leave_success_schema` generated from model 'conversationsUnderscoreleaveUnderscoresuccessUnderscoreschema'
-- Schema for successful response from conversations.leave method
--

CREATE TABLE IF NOT EXISTS `conversations_leave_success_schema` (
  `not_in_channel` TINYINT(1) DEFAULT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from conversations.leave method';

--
-- Table structure for table `conversations_list_error_schema` generated from model 'conversationsUnderscorelistUnderscoreerrorUnderscoreschema'
-- Schema for error response from conversations.list method
--

CREATE TABLE IF NOT EXISTS `conversations_list_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('missing_scope', 'not_authed', 'invalid_auth', 'account_inactive', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required') NOT NULL,
  `needed` TEXT DEFAULT NULL,
  `ok` TINYINT(1) NOT NULL,
  `provided` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from conversations.list method';

--
-- Table structure for table `conversations_list_success_schema` generated from model 'conversationsUnderscorelistUnderscoresuccessUnderscoreschema'
-- Schema for successful response from conversations.list method
--

CREATE TABLE IF NOT EXISTS `conversations_list_success_schema` (
  `channels` JSON NOT NULL,
  `ok` TINYINT(1) NOT NULL,
  `response_metadata` JSON DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from conversations.list method';

--
-- Table structure for table `conversations_mark_error_schema` generated from model 'conversationsUnderscoremarkUnderscoreerrorUnderscoreschema'
-- Schema for error response from conversations.mark method
--

CREATE TABLE IF NOT EXISTS `conversations_mark_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('method_not_supported_for_channel_type', 'missing_scope', 'channel_not_found', 'invalid_timestamp', 'not_in_channel', 'not_authed', 'invalid_auth', 'account_inactive', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'not_allowed_token_type') NOT NULL,
  `needed` TEXT DEFAULT NULL,
  `ok` TINYINT(1) NOT NULL,
  `provided` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from conversations.mark method';

--
-- Table structure for table `conversations_mark_request` generated from model 'conversationsUnderscoremarkUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `conversations_mark_request` (
  `channel` TEXT DEFAULT NULL COMMENT 'Channel or conversation to set the read cursor for.',
  `ts` DECIMAL(20, 9) DEFAULT NULL COMMENT 'Unique identifier of message you want marked as most recently seen in this conversation.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `conversations_mark_success_schema` generated from model 'conversationsUnderscoremarkUnderscoresuccessUnderscoreschema'
-- Schema for successful response conversations.mark method
--

CREATE TABLE IF NOT EXISTS `conversations_mark_success_schema` (
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response conversations.mark method';

--
-- Table structure for table `conversations_members_error_schema` generated from model 'conversationsUnderscoremembersUnderscoreerrorUnderscoreschema'
-- Schema for error response conversations.members method
--

CREATE TABLE IF NOT EXISTS `conversations_members_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('channel_not_found', 'invalid_limit', 'invalid_cursor', 'fetch_members_failed', 'not_authed', 'invalid_auth', 'account_inactive', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response conversations.members method';

--
-- Table structure for table `conversations_members_success_schema` generated from model 'conversationsUnderscoremembersUnderscoresuccessUnderscoreschema'
-- Schema for successful response conversations.members method
--

CREATE TABLE IF NOT EXISTS `conversations_members_success_schema` (
  `members` JSON NOT NULL,
  `ok` TINYINT(1) NOT NULL,
  `response_metadata` JSON NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response conversations.members method';

--
-- Table structure for table `conversations_open_error_schema` generated from model 'conversationsUnderscoreopenUnderscoreerrorUnderscoreschema'
-- Schema for error response from conversations.open method
--

CREATE TABLE IF NOT EXISTS `conversations_open_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('method_not_supported_for_channel_type', 'user_not_found', 'user_not_visible', 'user_disabled', 'users_list_not_supplied', 'not_enough_users', 'too_many_users', 'invalid_user_combination', 'not_authed', 'invalid_auth', 'account_inactive', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'channel_not_found') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from conversations.open method';

--
-- Table structure for table `conversations_open_request` generated from model 'conversationsUnderscoreopenUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `conversations_open_request` (
  `channel` TEXT DEFAULT NULL COMMENT 'Resume a conversation by supplying an &#x60;im&#x60; or &#x60;mpim&#x60;&#39;s ID. Or provide the &#x60;users&#x60; field instead.',
  `users` TEXT DEFAULT NULL COMMENT 'Comma separated lists of users. If only one user is included, this creates a 1:1 DM.  The ordering of the users is preserved whenever a multi-person direct message is returned. Supply a &#x60;channel&#x60; when not supplying &#x60;users&#x60;.',
  `return_im` TINYINT(1) DEFAULT NULL COMMENT 'Boolean, indicates you want the full IM channel definition in the response.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `conversations_open_success_schema` generated from model 'conversationsUnderscoreopenUnderscoresuccessUnderscoreschema'
-- Schema for successful response from conversations.open method when opening channels, ims, mpims
--

CREATE TABLE IF NOT EXISTS `conversations_open_success_schema` (
  `already_open` TINYINT(1) DEFAULT NULL,
  `channel` JSON NOT NULL,
  `no_op` TINYINT(1) DEFAULT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from conversations.open method when opening channels, ims, mpims';

--
-- Table structure for table `conversations_rename_error_schema` generated from model 'conversationsUnderscorerenameUnderscoreerrorUnderscoreschema'
-- Schema for error response from conversations.rename method
--

CREATE TABLE IF NOT EXISTS `conversations_rename_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('user_is_restricted', 'method_not_supported_for_channel_type', 'missing_scope', 'channel_not_found', 'not_in_channel', 'not_authorized', 'invalid_name', 'name_taken', 'invalid_name_required', 'invalid_name_punctuation', 'invalid_name_maxlength', 'invalid_name_specials', 'not_authed', 'invalid_auth', 'account_inactive', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required') NOT NULL,
  `needed` TEXT DEFAULT NULL,
  `ok` TINYINT(1) NOT NULL,
  `provided` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from conversations.rename method';

--
-- Table structure for table `conversations_rename_request` generated from model 'conversationsUnderscorerenameUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `conversations_rename_request` (
  `channel` TEXT DEFAULT NULL COMMENT 'ID of conversation to rename',
  `name` TEXT DEFAULT NULL COMMENT 'New name for conversation.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `conversations_rename_success_schema` generated from model 'conversationsUnderscorerenameUnderscoresuccessUnderscoreschema'
-- Schema for successful response from conversations.rename method
--

CREATE TABLE IF NOT EXISTS `conversations_rename_success_schema` (
  `channel` JSON NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from conversations.rename method';

--
-- Table structure for table `conversations_replies_error_schema` generated from model 'conversationsUnderscorerepliesUnderscoreerrorUnderscoreschema'
-- Schema for error response from conversations.replies method
--

CREATE TABLE IF NOT EXISTS `conversations_replies_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('missing_scope', 'channel_not_found', 'thread_not_found', 'not_authed', 'invalid_auth', 'account_inactive', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required') NOT NULL,
  `needed` TEXT DEFAULT NULL,
  `ok` TINYINT(1) NOT NULL,
  `provided` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from conversations.replies method';

--
-- Table structure for table `conversations_replies_success_schema` generated from model 'conversationsUnderscorerepliesUnderscoresuccessUnderscoreschema'
-- Schema for successful response from conversations.replies method
--

CREATE TABLE IF NOT EXISTS `conversations_replies_success_schema` (
  `has_more` TINYINT(1) DEFAULT NULL,
  `messages` JSON NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from conversations.replies method';

--
-- Table structure for table `conversations_setPurpose_error_schema` generated from model 'conversationsUnderscoresetPurposeUnderscoreerrorUnderscoreschema'
-- Schema for error response from conversations.setPurpose method
--

CREATE TABLE IF NOT EXISTS `conversations_setPurpose_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('method_not_supported_for_channel_type', 'missing_scope', 'channel_not_found', 'not_in_channel', 'is_archived', 'too_long', 'user_is_restricted', 'not_authed', 'invalid_auth', 'account_inactive', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required') NOT NULL,
  `needed` TEXT DEFAULT NULL,
  `ok` TINYINT(1) NOT NULL,
  `provided` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from conversations.setPurpose method';

--
-- Table structure for table `conversations_setPurpose_request` generated from model 'conversationsUnderscoresetPurposeUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `conversations_setPurpose_request` (
  `channel` TEXT DEFAULT NULL COMMENT 'Conversation to set the purpose of',
  `purpose` TEXT DEFAULT NULL COMMENT 'A new, specialer purpose'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `conversations_setPurpose_success_schema` generated from model 'conversationsUnderscoresetPurposeUnderscoresuccessUnderscoreschema'
-- Schema for successful response from conversations.setPurpose method
--

CREATE TABLE IF NOT EXISTS `conversations_setPurpose_success_schema` (
  `channel` JSON NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from conversations.setPurpose method';

--
-- Table structure for table `conversations_setTopic_error_schema` generated from model 'conversationsUnderscoresetTopicUnderscoreerrorUnderscoreschema'
-- Schema for error response from conversations.setTopic method
--

CREATE TABLE IF NOT EXISTS `conversations_setTopic_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('method_not_supported_for_channel_type', 'missing_scope', 'channel_not_found', 'not_in_channel', 'is_archived', 'too_long', 'user_is_restricted', 'not_authed', 'invalid_auth', 'account_inactive', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required') NOT NULL,
  `needed` TEXT DEFAULT NULL,
  `ok` TINYINT(1) NOT NULL,
  `provided` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from conversations.setTopic method';

--
-- Table structure for table `conversations_setTopic_request` generated from model 'conversationsUnderscoresetTopicUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `conversations_setTopic_request` (
  `channel` TEXT DEFAULT NULL COMMENT 'Conversation to set the topic of',
  `topic` TEXT DEFAULT NULL COMMENT 'The new topic string. Does not support formatting or linkification.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `conversations_setTopic_success_schema` generated from model 'conversationsUnderscoresetTopicUnderscoresuccessUnderscoreschema'
-- Schema for successful response from conversations.setTopic method
--

CREATE TABLE IF NOT EXISTS `conversations_setTopic_success_schema` (
  `channel` JSON NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from conversations.setTopic method';

--
-- Table structure for table `conversations_unarchive_error_schema` generated from model 'conversationsUnderscoreunarchiveUnderscoreerrorUnderscoreschema'
-- Schema for error response from conversations.unarchive method
--

CREATE TABLE IF NOT EXISTS `conversations_unarchive_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('method_not_supported_for_channel_type', 'missing_scope', 'channel_not_found', 'not_archived', 'not_authed', 'invalid_auth', 'account_inactive', 'user_is_bot', 'user_is_restricted', 'user_is_ultra_restricted', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'team_added_to_org', 'missing_charset', 'superfluous_charset') NOT NULL,
  `needed` TEXT DEFAULT NULL,
  `ok` TINYINT(1) NOT NULL,
  `provided` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from conversations.unarchive method';

--
-- Table structure for table `conversations_unarchive_request` generated from model 'conversationsUnderscoreunarchiveUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `conversations_unarchive_request` (
  `channel` TEXT DEFAULT NULL COMMENT 'ID of conversation to unarchive'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `conversations_unarchive_success_schema` generated from model 'conversationsUnderscoreunarchiveUnderscoresuccessUnderscoreschema'
-- Schema for successful response from conversations.unarchive method
--

CREATE TABLE IF NOT EXISTS `conversations_unarchive_success_schema` (
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from conversations.unarchive method';

--
-- Table structure for table `Default_error_template` generated from model 'DefaultUnderscoreerrorUnderscoretemplate'
-- This method either only returns a brief _not OK_ response or a verbose schema is not available for this method.
--

CREATE TABLE IF NOT EXISTS `Default_error_template` (
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This method either only returns a brief _not OK_ response or a verbose schema is not available for this method.';

--
-- Table structure for table `Default_success_template` generated from model 'DefaultUnderscoresuccessUnderscoretemplate'
-- This method either only returns a brief _OK_ response or a verbose schema is not available for this method.
--

CREATE TABLE IF NOT EXISTS `Default_success_template` (
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This method either only returns a brief _OK_ response or a verbose schema is not available for this method.';

--
-- Table structure for table `dialog_open_error_schema` generated from model 'dialogUnderscoreopenUnderscoreerrorUnderscoreschema'
-- Schema for error response from dialog.open method
--

CREATE TABLE IF NOT EXISTS `dialog_open_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('validation_errors', 'missing_trigger', 'missing_dialog', 'trigger_exchanged', 'trigger_expired', 'invalid_trigger', 'app_missing_action_url', 'cannot_create_dialog', 'failed_sending_dialog', 'not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from dialog.open method';

--
-- Table structure for table `dialog_open_schema` generated from model 'dialogUnderscoreopenUnderscoreschema'
-- Schema for successful response from dialog.open method
--

CREATE TABLE IF NOT EXISTS `dialog_open_schema` (
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from dialog.open method';

--
-- Table structure for table `dnd_endDnd_error_schema` generated from model 'dndUnderscoreendDndUnderscoreerrorUnderscoreschema'
-- Schema for error response from dnd.endDnd method
--

CREATE TABLE IF NOT EXISTS `dnd_endDnd_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('unknown_error', 'not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'user_is_bot', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from dnd.endDnd method';

--
-- Table structure for table `dnd_endDnd_schema` generated from model 'dndUnderscoreendDndUnderscoreschema'
-- Schema for successful response from dnd.endDnd method
--

CREATE TABLE IF NOT EXISTS `dnd_endDnd_schema` (
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from dnd.endDnd method';

--
-- Table structure for table `dnd_endSnooze_error_schema` generated from model 'dndUnderscoreendSnoozeUnderscoreerrorUnderscoreschema'
-- Schema for error response from dnd.endSnooze method
--

CREATE TABLE IF NOT EXISTS `dnd_endSnooze_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('snooze_not_active', 'snooze_end_failed', 'not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'user_is_bot', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from dnd.endSnooze method';

--
-- Table structure for table `dnd_endSnooze_schema` generated from model 'dndUnderscoreendSnoozeUnderscoreschema'
-- Schema for successful response from dnd.endSnooze method
--

CREATE TABLE IF NOT EXISTS `dnd_endSnooze_schema` (
  `dnd_enabled` TINYINT(1) NOT NULL,
  `next_dnd_end_ts` INT NOT NULL,
  `next_dnd_start_ts` INT NOT NULL,
  `ok` TINYINT(1) NOT NULL,
  `snooze_enabled` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from dnd.endSnooze method';

--
-- Table structure for table `dnd_info_error_schema` generated from model 'dndUnderscoreinfoUnderscoreerrorUnderscoreschema'
-- Schema for error response from dnd.info method
--

CREATE TABLE IF NOT EXISTS `dnd_info_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('user_not_found', 'not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from dnd.info method';

--
-- Table structure for table `dnd_info_schema` generated from model 'dndUnderscoreinfoUnderscoreschema'
-- Schema for successful response from dnd.info method
--

CREATE TABLE IF NOT EXISTS `dnd_info_schema` (
  `dnd_enabled` TINYINT(1) NOT NULL,
  `next_dnd_end_ts` INT NOT NULL,
  `next_dnd_start_ts` INT NOT NULL,
  `ok` TINYINT(1) NOT NULL,
  `snooze_enabled` TINYINT(1) DEFAULT NULL,
  `snooze_endtime` INT DEFAULT NULL,
  `snooze_remaining` INT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from dnd.info method';

--
-- Table structure for table `dnd_setSnooze_error_schema` generated from model 'dndUnderscoresetSnoozeUnderscoreerrorUnderscoreschema'
-- Schema for error response from dnd.setSnooze method
--

CREATE TABLE IF NOT EXISTS `dnd_setSnooze_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('missing_duration', 'snooze_failed', 'not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'user_is_bot', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'too_long', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from dnd.setSnooze method';

--
-- Table structure for table `dnd_setSnooze_schema` generated from model 'dndUnderscoresetSnoozeUnderscoreschema'
-- Schema for successful response from dnd.setSnooze method
--

CREATE TABLE IF NOT EXISTS `dnd_setSnooze_schema` (
  `ok` TINYINT(1) NOT NULL,
  `snooze_enabled` TINYINT(1) NOT NULL,
  `snooze_endtime` INT NOT NULL,
  `snooze_remaining` INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from dnd.setSnooze method';

--
-- Table structure for table `files_comments_delete_error_schema` generated from model 'filesUnderscorecommentsUnderscoredeleteUnderscoreerrorUnderscoreschema'
-- Schema for error response files.comments.delete method
--

CREATE TABLE IF NOT EXISTS `files_comments_delete_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('cant_delete', 'comment_not_found', 'not_authed', 'invalid_auth', 'account_inactive', 'no_permission', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response files.comments.delete method';

--
-- Table structure for table `files_comments_delete_request` generated from model 'filesUnderscorecommentsUnderscoredeleteUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `files_comments_delete_request` (
  `file` TEXT DEFAULT NULL COMMENT 'File to delete a comment from.',
  `id` TEXT DEFAULT NULL COMMENT 'The comment to delete.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `files_comments_delete_schema` generated from model 'filesUnderscorecommentsUnderscoredeleteUnderscoreschema'
-- Schema for successful response files.comments.delete method
--

CREATE TABLE IF NOT EXISTS `files_comments_delete_schema` (
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response files.comments.delete method';

--
-- Table structure for table `files_delete_error_schema` generated from model 'filesUnderscoredeleteUnderscoreerrorUnderscoreschema'
-- Schema for error response files.delete method
--

CREATE TABLE IF NOT EXISTS `files_delete_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('file_not_found', 'file_deleted', 'cant_delete_file', 'not_authed', 'invalid_auth', 'account_inactive', 'no_permission', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response files.delete method';

--
-- Table structure for table `files_delete_request` generated from model 'filesUnderscoredeleteUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `files_delete_request` (
  `file` TEXT DEFAULT NULL COMMENT 'ID of file to delete.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `files_delete_schema` generated from model 'filesUnderscoredeleteUnderscoreschema'
-- Schema for successful response files.delete method
--

CREATE TABLE IF NOT EXISTS `files_delete_schema` (
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response files.delete method';

--
-- Table structure for table `files_info_error_schema` generated from model 'filesUnderscoreinfoUnderscoreerrorUnderscoreschema'
-- Schema for error response from files.info method
--

CREATE TABLE IF NOT EXISTS `files_info_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('file_not_found', 'file_deleted', 'timezone_count_failed', 'not_authed', 'invalid_auth', 'account_inactive', 'no_permission', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from files.info method';

--
-- Table structure for table `files_info_schema` generated from model 'filesUnderscoreinfoUnderscoreschema'
-- Schema for successful response from files.info method
--

CREATE TABLE IF NOT EXISTS `files_info_schema` (
  `comments` JSON NOT NULL,
  `editor` TEXT DEFAULT NULL,
  `file` TEXT NOT NULL,
  `ok` TINYINT(1) NOT NULL,
  `paging` TEXT DEFAULT NULL,
  `response_metadata` JSON DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from files.info method';

--
-- Table structure for table `files_list_error_schema` generated from model 'filesUnderscorelistUnderscoreerrorUnderscoreschema'
-- Schema for error response from files.list method
--

CREATE TABLE IF NOT EXISTS `files_list_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('user_not_found', 'unknown_type', 'not_authed', 'invalid_auth', 'account_inactive', 'no_permission', 'user_is_bot', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from files.list method';

--
-- Table structure for table `files_list_schema` generated from model 'filesUnderscorelistUnderscoreschema'
-- Schema for successful response from files.list method
--

CREATE TABLE IF NOT EXISTS `files_list_schema` (
  `files` JSON NOT NULL,
  `ok` TINYINT(1) NOT NULL,
  `paging` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from files.list method';

--
-- Table structure for table `files_revokePublicURL_error_schema` generated from model 'filesUnderscorerevokePublicURLUnderscoreerrorUnderscoreschema'
-- Schema for error response from files.revokePublicURL method
--

CREATE TABLE IF NOT EXISTS `files_revokePublicURL_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('file_not_found', 'not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'user_is_bot', 'user_is_restricted', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from files.revokePublicURL method';

--
-- Table structure for table `files_revokePublicURL_request` generated from model 'filesUnderscorerevokePublicURLUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `files_revokePublicURL_request` (
  `file` TEXT DEFAULT NULL COMMENT 'File to revoke'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `files_revokePublicURL_schema` generated from model 'filesUnderscorerevokePublicURLUnderscoreschema'
-- Schema for successful response from files.revokePublicURL method
--

CREATE TABLE IF NOT EXISTS `files_revokePublicURL_schema` (
  `file` TEXT NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from files.revokePublicURL method';

--
-- Table structure for table `files_sharedPublicURL_error_schema` generated from model 'filesUnderscoresharedPublicURLUnderscoreerrorUnderscoreschema'
-- Schema for error response from files.sharedPublicURL method
--

CREATE TABLE IF NOT EXISTS `files_sharedPublicURL_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('file_not_found', 'not_allowed', 'not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'user_is_bot', 'user_is_restricted', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from files.sharedPublicURL method';

--
-- Table structure for table `files_sharedPublicURL_request` generated from model 'filesUnderscoresharedPublicURLUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `files_sharedPublicURL_request` (
  `file` TEXT DEFAULT NULL COMMENT 'File to share'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `files_sharedPublicURL_schema` generated from model 'filesUnderscoresharedPublicURLUnderscoreschema'
-- Schema for successful response from files.sharedPublicURL method
--

CREATE TABLE IF NOT EXISTS `files_sharedPublicURL_schema` (
  `file` TEXT NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from files.sharedPublicURL method';

--
-- Table structure for table `files_upload_error_schema` generated from model 'filesUnderscoreuploadUnderscoreerrorUnderscoreschema'
-- Schema for error response files.upload method
--

CREATE TABLE IF NOT EXISTS `files_upload_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('posting_to_general_channel_denied', 'invalid_channel', 'file_uploads_disabled', 'file_uploads_except_images_disabled', 'storage_limit_reached', 'not_authed', 'invalid_auth', 'account_inactive', 'no_permission', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response files.upload method';

--
-- Table structure for table `files_upload_schema` generated from model 'filesUnderscoreuploadUnderscoreschema'
-- Schema for successful response files.upload method
--

CREATE TABLE IF NOT EXISTS `files_upload_schema` (
  `file` TEXT NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response files.upload method';

--
-- Table structure for table `Message_object` generated from model 'MessageUnderscoreobject'
--

CREATE TABLE IF NOT EXISTS `Message_object` (
  `attachments` JSON DEFAULT NULL,
  `blocks` JSON DEFAULT NULL,
  `text` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `migration_exchange_error_schema` generated from model 'migrationUnderscoreexchangeUnderscoreerrorUnderscoreschema'
-- Schema for error response from migration.exchange method
--

CREATE TABLE IF NOT EXISTS `migration_exchange_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('not_enterprise_team', 'too_many_users', 'not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from migration.exchange method';

--
-- Table structure for table `migration_exchange_success_schema` generated from model 'migrationUnderscoreexchangeUnderscoresuccessUnderscoreschema'
-- Schema for successful response from migration.exchange method
--

CREATE TABLE IF NOT EXISTS `migration_exchange_success_schema` (
  `enterprise_id` TEXT NOT NULL,
  `invalid_user_ids` JSON DEFAULT NULL,
  `ok` TINYINT(1) NOT NULL,
  `team_id` TEXT NOT NULL,
  `user_id_map` JSON DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from migration.exchange method';

--
-- Table structure for table `objs_bot_profile` generated from model 'objsUnderscorebotUnderscoreprofile'
--

CREATE TABLE IF NOT EXISTS `objs_bot_profile` (
  `app_id` TEXT NOT NULL,
  `deleted` TINYINT(1) NOT NULL,
  `icons` JSON NOT NULL,
  `id` TEXT NOT NULL,
  `name` TEXT NOT NULL,
  `team_id` TEXT NOT NULL,
  `updated` INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `objs_channel` generated from model 'objsUnderscorechannel'
--

CREATE TABLE IF NOT EXISTS `objs_channel` (
  `accepted_user` TEXT DEFAULT NULL,
  `created` INT NOT NULL,
  `creator` TEXT NOT NULL,
  `id` TEXT NOT NULL,
  `is_archived` TINYINT(1) DEFAULT NULL,
  `is_channel` TINYINT(1) NOT NULL,
  `is_frozen` TINYINT(1) DEFAULT NULL,
  `is_general` TINYINT(1) DEFAULT NULL,
  `is_member` TINYINT(1) DEFAULT NULL,
  `is_moved` INT DEFAULT NULL,
  `is_mpim` TINYINT(1) NOT NULL,
  `is_non_threadable` TINYINT(1) DEFAULT NULL,
  `is_org_shared` TINYINT(1) NOT NULL,
  `is_pending_ext_shared` TINYINT(1) DEFAULT NULL,
  `is_private` TINYINT(1) NOT NULL,
  `is_read_only` TINYINT(1) DEFAULT NULL,
  `is_shared` TINYINT(1) NOT NULL,
  `is_thread_only` TINYINT(1) DEFAULT NULL,
  `last_read` TEXT DEFAULT NULL,
  `latest` JSON DEFAULT NULL,
  `members` JSON NOT NULL,
  `name` TEXT NOT NULL,
  `name_normalized` TEXT NOT NULL,
  `num_members` INT DEFAULT NULL,
  `pending_shared` JSON DEFAULT NULL,
  `previous_names` JSON DEFAULT NULL,
  `priority` DECIMAL(20, 9) DEFAULT NULL,
  `purpose` JSON NOT NULL,
  `topic` JSON NOT NULL,
  `unlinked` INT DEFAULT NULL,
  `unread_count` INT DEFAULT NULL,
  `unread_count_display` INT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `objs_comment` generated from model 'objsUnderscorecomment'
--

CREATE TABLE IF NOT EXISTS `objs_comment` (
  `comment` TEXT NOT NULL,
  `created` INT NOT NULL,
  `id` TEXT NOT NULL,
  `is_intro` TINYINT(1) NOT NULL,
  `is_starred` TINYINT(1) DEFAULT NULL,
  `num_stars` INT DEFAULT NULL,
  `pinned_info` JSON DEFAULT NULL,
  `pinned_to` JSON DEFAULT NULL,
  `reactions` JSON DEFAULT NULL,
  `timestamp` INT NOT NULL,
  `user` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `objs_enterprise_user` generated from model 'objsUnderscoreenterpriseUnderscoreuser'
--

CREATE TABLE IF NOT EXISTS `objs_enterprise_user` (
  `enterprise_id` TEXT NOT NULL,
  `enterprise_name` TEXT NOT NULL,
  `id` TEXT NOT NULL,
  `is_admin` TINYINT(1) NOT NULL,
  `is_owner` TINYINT(1) NOT NULL,
  `teams` JSON NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `objs_external_org_migrations` generated from model 'objsUnderscoreexternalUnderscoreorgUnderscoremigrations'
--

CREATE TABLE IF NOT EXISTS `objs_external_org_migrations` (
  `current` JSON NOT NULL,
  `date_updated` INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `objs_external_org_migrations_current_inner` generated from model 'objsUnderscoreexternalUnderscoreorgUnderscoremigrationsUnderscorecurrentUnderscoreinner'
--

CREATE TABLE IF NOT EXISTS `objs_external_org_migrations_current_inner` (
  `date_started` INT NOT NULL,
  `team_id` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `objs_file` generated from model 'objsUnderscorefile'
--

CREATE TABLE IF NOT EXISTS `objs_file` (
  `channels` JSON DEFAULT NULL,
  `comments_count` INT DEFAULT NULL,
  `created` INT DEFAULT NULL,
  `date_delete` INT DEFAULT NULL,
  `display_as_bot` TINYINT(1) DEFAULT NULL,
  `editable` TINYINT(1) DEFAULT NULL,
  `editor` TEXT DEFAULT NULL,
  `external_id` TEXT DEFAULT NULL,
  `external_type` TEXT DEFAULT NULL,
  `external_url` TEXT DEFAULT NULL,
  `filetype` TEXT DEFAULT NULL,
  `groups` JSON DEFAULT NULL,
  `has_rich_preview` TINYINT(1) DEFAULT NULL,
  `id` TEXT DEFAULT NULL,
  `image_exif_rotation` INT DEFAULT NULL,
  `ims` JSON DEFAULT NULL,
  `is_external` TINYINT(1) DEFAULT NULL,
  `is_public` TINYINT(1) DEFAULT NULL,
  `is_starred` TINYINT(1) DEFAULT NULL,
  `is_tombstoned` TINYINT(1) DEFAULT NULL,
  `last_editor` TEXT DEFAULT NULL,
  `mimetype` TEXT DEFAULT NULL,
  `mode` TEXT DEFAULT NULL,
  `name` TEXT DEFAULT NULL,
  `non_owner_editable` TINYINT(1) DEFAULT NULL,
  `num_stars` INT DEFAULT NULL,
  `original_h` INT DEFAULT NULL,
  `original_w` INT DEFAULT NULL,
  `permalink` TEXT DEFAULT NULL,
  `permalink_public` TEXT DEFAULT NULL,
  `pinned_info` JSON DEFAULT NULL,
  `pinned_to` JSON DEFAULT NULL,
  `pretty_type` TEXT DEFAULT NULL,
  `preview` TEXT DEFAULT NULL,
  `public_url_shared` TINYINT(1) DEFAULT NULL,
  `reactions` JSON DEFAULT NULL,
  `shares` JSON DEFAULT NULL,
  `size` INT DEFAULT NULL,
  `source_team` TEXT DEFAULT NULL,
  `state` TEXT DEFAULT NULL,
  `thumb_1024` TEXT DEFAULT NULL,
  `thumb_1024_h` INT DEFAULT NULL,
  `thumb_1024_w` INT DEFAULT NULL,
  `thumb_160` TEXT DEFAULT NULL,
  `thumb_360` TEXT DEFAULT NULL,
  `thumb_360_h` INT DEFAULT NULL,
  `thumb_360_w` INT DEFAULT NULL,
  `thumb_480` TEXT DEFAULT NULL,
  `thumb_480_h` INT DEFAULT NULL,
  `thumb_480_w` INT DEFAULT NULL,
  `thumb_64` TEXT DEFAULT NULL,
  `thumb_720` TEXT DEFAULT NULL,
  `thumb_720_h` INT DEFAULT NULL,
  `thumb_720_w` INT DEFAULT NULL,
  `thumb_80` TEXT DEFAULT NULL,
  `thumb_800` TEXT DEFAULT NULL,
  `thumb_800_h` INT DEFAULT NULL,
  `thumb_800_w` INT DEFAULT NULL,
  `thumb_960` TEXT DEFAULT NULL,
  `thumb_960_h` INT DEFAULT NULL,
  `thumb_960_w` INT DEFAULT NULL,
  `thumb_tiny` TEXT DEFAULT NULL,
  `timestamp` INT DEFAULT NULL,
  `title` TEXT DEFAULT NULL,
  `updated` INT DEFAULT NULL,
  `url_private` TEXT DEFAULT NULL,
  `url_private_download` TEXT DEFAULT NULL,
  `user` TEXT DEFAULT NULL,
  `user_team` TEXT DEFAULT NULL,
  `username` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `objs_icon` generated from model 'objsUnderscoreicon'
--

CREATE TABLE IF NOT EXISTS `objs_icon` (
  `image_102` TEXT DEFAULT NULL,
  `image_132` TEXT DEFAULT NULL,
  `image_230` TEXT DEFAULT NULL,
  `image_34` TEXT DEFAULT NULL,
  `image_44` TEXT DEFAULT NULL,
  `image_68` TEXT DEFAULT NULL,
  `image_88` TEXT DEFAULT NULL,
  `image_default` TINYINT(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `objs_message` generated from model 'objsUnderscoremessage'
--

CREATE TABLE IF NOT EXISTS `objs_message` (
  `attachments` JSON DEFAULT NULL,
  `blocks` JSON DEFAULT NULL COMMENT 'This is a very loose definition, in the future, we&#39;ll populate this with deeper schema in this definition namespace.',
  `bot_id` JSON DEFAULT NULL,
  `bot_profile` TEXT DEFAULT NULL,
  `client_msg_id` TEXT DEFAULT NULL,
  `comment` TEXT DEFAULT NULL,
  `display_as_bot` TINYINT(1) DEFAULT NULL,
  `file` TEXT DEFAULT NULL,
  `files` JSON DEFAULT NULL,
  `icons` JSON DEFAULT NULL,
  `inviter` TEXT DEFAULT NULL,
  `is_delayed_message` TINYINT(1) DEFAULT NULL,
  `is_intro` TINYINT(1) DEFAULT NULL,
  `is_starred` TINYINT(1) DEFAULT NULL,
  `last_read` TEXT DEFAULT NULL,
  `latest_reply` TEXT DEFAULT NULL,
  `name` TEXT DEFAULT NULL,
  `old_name` TEXT DEFAULT NULL,
  `parent_user_id` TEXT DEFAULT NULL,
  `permalink` TEXT DEFAULT NULL,
  `pinned_to` JSON DEFAULT NULL,
  `purpose` TEXT DEFAULT NULL,
  `reactions` JSON DEFAULT NULL,
  `reply_count` INT DEFAULT NULL,
  `reply_users` JSON DEFAULT NULL,
  `reply_users_count` INT DEFAULT NULL,
  `source_team` TEXT DEFAULT NULL,
  `subscribed` TINYINT(1) DEFAULT NULL,
  `subtype` TEXT DEFAULT NULL,
  `team` TEXT DEFAULT NULL,
  `text` TEXT NOT NULL,
  `thread_ts` TEXT DEFAULT NULL,
  `topic` TEXT DEFAULT NULL,
  `ts` TEXT NOT NULL,
  `type` TEXT NOT NULL,
  `unread_count` INT DEFAULT NULL,
  `upload` TINYINT(1) DEFAULT NULL,
  `user` TEXT DEFAULT NULL,
  `user_profile` TEXT DEFAULT NULL,
  `user_team` TEXT DEFAULT NULL,
  `username` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `objs_paging` generated from model 'objsUnderscorepaging'
--

CREATE TABLE IF NOT EXISTS `objs_paging` (
  `count` INT DEFAULT NULL,
  `page` INT NOT NULL,
  `pages` INT DEFAULT NULL,
  `per_page` INT DEFAULT NULL,
  `spill` INT DEFAULT NULL,
  `total` INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `objs_primary_owner` generated from model 'objsUnderscoreprimaryUnderscoreowner'
--

CREATE TABLE IF NOT EXISTS `objs_primary_owner` (
  `email` TEXT NOT NULL,
  `id` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `objs_reaction` generated from model 'objsUnderscorereaction'
--

CREATE TABLE IF NOT EXISTS `objs_reaction` (
  `count` INT NOT NULL,
  `name` TEXT NOT NULL,
  `users` JSON NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `objs_reminder` generated from model 'objsUnderscorereminder'
--

CREATE TABLE IF NOT EXISTS `objs_reminder` (
  `complete_ts` INT DEFAULT NULL,
  `creator` TEXT NOT NULL,
  `id` TEXT NOT NULL,
  `recurring` TINYINT(1) NOT NULL,
  `text` TEXT NOT NULL,
  `time` INT DEFAULT NULL,
  `user` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `objs_resources` generated from model 'objsUnderscoreresources'
--

CREATE TABLE IF NOT EXISTS `objs_resources` (
  `excluded_ids` JSON DEFAULT NULL,
  `ids` JSON NOT NULL,
  `wildcard` TINYINT(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `objs_subteam` generated from model 'objsUnderscoresubteam'
--

CREATE TABLE IF NOT EXISTS `objs_subteam` (
  `auto_provision` TINYINT(1) NOT NULL,
  `auto_type` JSON NOT NULL,
  `channel_count` INT DEFAULT NULL,
  `created_by` TEXT NOT NULL,
  `date_create` INT NOT NULL,
  `date_delete` INT NOT NULL,
  `date_update` INT NOT NULL,
  `deleted_by` JSON NOT NULL,
  `description` TEXT NOT NULL,
  `enterprise_subteam_id` TEXT NOT NULL,
  `handle` TEXT NOT NULL,
  `id` TEXT NOT NULL,
  `is_external` TINYINT(1) NOT NULL,
  `is_subteam` TINYINT(1) NOT NULL,
  `is_usergroup` TINYINT(1) NOT NULL,
  `name` TEXT NOT NULL,
  `prefs` JSON NOT NULL,
  `team_id` TEXT NOT NULL,
  `updated_by` TEXT NOT NULL,
  `user_count` INT DEFAULT NULL,
  `users` JSON DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `objs_team` generated from model 'objsUnderscoreteam'
--

CREATE TABLE IF NOT EXISTS `objs_team` (
  `archived` TINYINT(1) DEFAULT NULL,
  `avatar_base_url` TEXT DEFAULT NULL,
  `created` INT DEFAULT NULL,
  `date_create` INT DEFAULT NULL,
  `deleted` TINYINT(1) DEFAULT NULL,
  `discoverable` JSON DEFAULT NULL,
  `domain` TEXT NOT NULL,
  `email_domain` TEXT NOT NULL,
  `enterprise_id` TEXT DEFAULT NULL,
  `enterprise_name` TEXT DEFAULT NULL,
  `external_org_migrations` TEXT DEFAULT NULL,
  `has_compliance_export` TINYINT(1) DEFAULT NULL,
  `icon` TEXT NOT NULL,
  `id` TEXT NOT NULL,
  `is_assigned` TINYINT(1) DEFAULT NULL,
  `is_enterprise` INT DEFAULT NULL,
  `is_over_storage_limit` TINYINT(1) DEFAULT NULL,
  `limit_ts` INT DEFAULT NULL,
  `locale` TEXT DEFAULT NULL,
  `messages_count` INT DEFAULT NULL,
  `msg_edit_window_mins` INT DEFAULT NULL,
  `name` TEXT NOT NULL,
  `over_integrations_limit` TINYINT(1) DEFAULT NULL,
  `over_storage_limit` TINYINT(1) DEFAULT NULL,
  `pay_prod_cur` TEXT DEFAULT NULL,
  `plan` ENUM('', 'std', 'plus', 'compliance', 'enterprise') DEFAULT NULL,
  `primary_owner` TEXT DEFAULT NULL,
  `sso_provider` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `objs_team_profile_field` generated from model 'objsUnderscoreteamUnderscoreprofileUnderscorefield'
--

CREATE TABLE IF NOT EXISTS `objs_team_profile_field` (
  `hint` TEXT NOT NULL,
  `id` TEXT NOT NULL,
  `is_hidden` TINYINT(1) DEFAULT NULL,
  `label` TEXT NOT NULL,
  `options` JSON DEFAULT NULL,
  `ordering` DECIMAL(20, 9) NOT NULL,
  `type` ENUM('text', 'date', 'link', 'mailto', 'options_list', 'user') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `objs_team_sso_provider` generated from model 'objsUnderscoreteamUnderscoressoUnderscoreprovider'
--

CREATE TABLE IF NOT EXISTS `objs_team_sso_provider` (
  `label` TEXT DEFAULT NULL,
  `name` TEXT DEFAULT NULL,
  `type` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `objs_user_profile` generated from model 'objsUnderscoreuserUnderscoreprofile'
--

CREATE TABLE IF NOT EXISTS `objs_user_profile` (
  `always_active` TINYINT(1) DEFAULT NULL,
  `api_app_id` TEXT DEFAULT NULL,
  `avatar_hash` TEXT NOT NULL,
  `bot_id` TEXT DEFAULT NULL,
  `display_name` TEXT NOT NULL,
  `display_name_normalized` TEXT NOT NULL,
  `is_app_user` TINYINT(1) DEFAULT NULL,
  `is_custom_image` TINYINT(1) DEFAULT NULL,
  `last_avatar_image_hash` TEXT DEFAULT NULL,
  `memberships_count` INT DEFAULT NULL,
  `phone` TEXT NOT NULL,
  `pronouns` TEXT DEFAULT NULL,
  `real_name` TEXT NOT NULL,
  `real_name_normalized` TEXT NOT NULL,
  `skype` TEXT NOT NULL,
  `status_default_emoji` TEXT DEFAULT NULL,
  `status_default_text` TEXT DEFAULT NULL,
  `status_emoji` TEXT NOT NULL,
  `status_expiration` INT DEFAULT NULL,
  `status_text` TEXT NOT NULL,
  `team` TEXT DEFAULT NULL,
  `title` TEXT NOT NULL,
  `updated` INT DEFAULT NULL,
  `user_id` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `objs_user_profile_short` generated from model 'objsUnderscoreuserUnderscoreprofileUnderscoreshort'
--

CREATE TABLE IF NOT EXISTS `objs_user_profile_short` (
  `avatar_hash` TEXT NOT NULL,
  `display_name` TEXT NOT NULL,
  `display_name_normalized` TEXT DEFAULT NULL,
  `image_72` TEXT NOT NULL,
  `is_restricted` TINYINT(1) NOT NULL,
  `is_ultra_restricted` TINYINT(1) NOT NULL,
  `name` TEXT NOT NULL,
  `real_name` TEXT NOT NULL,
  `real_name_normalized` TEXT DEFAULT NULL,
  `team` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `pins_add_error_schema` generated from model 'pinsUnderscoreaddUnderscoreerrorUnderscoreschema'
-- Schema for error response from pins.add method
--

CREATE TABLE IF NOT EXISTS `pins_add_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('bad_timestamp', 'message_not_found', 'channel_not_found', 'no_item_specified', 'already_pinned', 'permission_denied', 'file_not_shared', 'not_pinnable', 'not_authed', 'invalid_auth', 'account_inactive', 'no_permission', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from pins.add method';

--
-- Table structure for table `pins_add_request` generated from model 'pinsUnderscoreaddUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `pins_add_request` (
  `channel` TEXT NOT NULL COMMENT 'Channel to pin the item in.',
  `timestamp` TEXT DEFAULT NULL COMMENT 'Timestamp of the message to pin.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `pins_add_schema` generated from model 'pinsUnderscoreaddUnderscoreschema'
-- Schema for successful response from pins.add method
--

CREATE TABLE IF NOT EXISTS `pins_add_schema` (
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from pins.add method';

--
-- Table structure for table `pins_list_error_schema` generated from model 'pinsUnderscorelistUnderscoreerrorUnderscoreschema'
-- Schema for error response from pins.list method
--

CREATE TABLE IF NOT EXISTS `pins_list_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('channel_not_found', 'not_authed', 'invalid_auth', 'account_inactive', 'no_permission', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from pins.list method';

--
-- Table structure for table `pins_remove_error_schema` generated from model 'pinsUnderscoreremoveUnderscoreerrorUnderscoreschema'
-- Schema for error response from pins.remove method
--

CREATE TABLE IF NOT EXISTS `pins_remove_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('bad_timestamp', 'file_not_found', 'file_comment_not_found', 'message_not_found', 'no_item_specified', 'not_pinned', 'permission_denied', 'not_authed', 'invalid_auth', 'account_inactive', 'no_permission', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_typ', 'missing_post_typ', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeou', 'upgrade_required') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from pins.remove method';

--
-- Table structure for table `pins_remove_request` generated from model 'pinsUnderscoreremoveUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `pins_remove_request` (
  `channel` TEXT NOT NULL COMMENT 'Channel where the item is pinned to.',
  `timestamp` TEXT DEFAULT NULL COMMENT 'Timestamp of the message to un-pin.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `pins_remove_schema` generated from model 'pinsUnderscoreremoveUnderscoreschema'
-- Schema for successful response from pins.remove method
--

CREATE TABLE IF NOT EXISTS `pins_remove_schema` (
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from pins.remove method';

--
-- Table structure for table `reactions_add_error_schema` generated from model 'reactionsUnderscoreaddUnderscoreerrorUnderscoreschema'
-- Schema for error response from reactions.add method
--

CREATE TABLE IF NOT EXISTS `reactions_add_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('bad_timestamp', 'message_not_found', 'no_item_specified', 'invalid_name', 'already_reacted', 'too_many_emoji', 'too_many_reactions', 'not_authed', 'invalid_auth', 'account_inactive', 'no_permission', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from reactions.add method';

--
-- Table structure for table `reactions_add_request` generated from model 'reactionsUnderscoreaddUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `reactions_add_request` (
  `channel` TEXT NOT NULL COMMENT 'Channel where the message to add reaction to was posted.',
  `name` TEXT NOT NULL COMMENT 'Reaction (emoji) name.',
  `timestamp` TEXT NOT NULL COMMENT 'Timestamp of the message to add reaction to.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `reactions_add_schema` generated from model 'reactionsUnderscoreaddUnderscoreschema'
-- Schema for successful response from reactions.add method
--

CREATE TABLE IF NOT EXISTS `reactions_add_schema` (
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from reactions.add method';

--
-- Table structure for table `reactions_get_error_schema` generated from model 'reactionsUnderscoregetUnderscoreerrorUnderscoreschema'
-- Schema for error response from reactions.get method
--

CREATE TABLE IF NOT EXISTS `reactions_get_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('bad_timestamp', 'file_not_found', 'file_comment_not_found', 'message_not_found', 'no_item_specified', 'not_authed', 'invalid_auth', 'account_inactive', 'no_permission', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from reactions.get method';

--
-- Table structure for table `reactions_list_error_schema` generated from model 'reactionsUnderscorelistUnderscoreerrorUnderscoreschema'
-- Schema for error response from reactions.list method
--

CREATE TABLE IF NOT EXISTS `reactions_list_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('user_not_found', 'not_authed', 'invalid_auth', 'account_inactiv', 'no_permission', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from reactions.list method';

--
-- Table structure for table `reactions_list_schema` generated from model 'reactionsUnderscorelistUnderscoreschema'
-- Schema for successful response from reactions.list method
--

CREATE TABLE IF NOT EXISTS `reactions_list_schema` (
  `items` JSON NOT NULL,
  `ok` TINYINT(1) NOT NULL,
  `paging` TEXT DEFAULT NULL,
  `response_metadata` JSON DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from reactions.list method';

--
-- Table structure for table `reactions_remove_error_schema` generated from model 'reactionsUnderscoreremoveUnderscoreerrorUnderscoreschema'
-- Schema for error response from reactions.remove method
--

CREATE TABLE IF NOT EXISTS `reactions_remove_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('bad_timestamp', 'file_not_found', 'file_comment_not_found', 'message_not_found', 'no_item_specified', 'invalid_name', 'no_reaction', 'not_authed', 'invalid_auth', 'account_inactive', 'no_permission', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from reactions.remove method';

--
-- Table structure for table `reactions_remove_request` generated from model 'reactionsUnderscoreremoveUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `reactions_remove_request` (
  `name` TEXT NOT NULL COMMENT 'Reaction (emoji) name.',
  `file` TEXT DEFAULT NULL COMMENT 'File to remove reaction from.',
  `file_comment` TEXT DEFAULT NULL COMMENT 'File comment to remove reaction from.',
  `channel` TEXT DEFAULT NULL COMMENT 'Channel where the message to remove reaction from was posted.',
  `timestamp` TEXT DEFAULT NULL COMMENT 'Timestamp of the message to remove reaction from.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `reactions_remove_schema` generated from model 'reactionsUnderscoreremoveUnderscoreschema'
-- Schema for successful response from reactions.remove method
--

CREATE TABLE IF NOT EXISTS `reactions_remove_schema` (
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from reactions.remove method';

--
-- Table structure for table `reminders_add_error_schema` generated from model 'remindersUnderscoreaddUnderscoreerrorUnderscoreschema'
-- Schema for error response from reminders.add method
--

CREATE TABLE IF NOT EXISTS `reminders_add_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('cannot_parse', 'user_not_found', 'cannot_add_bot', 'cannot_add_slackbot', 'cannot_add_others', 'cannot_add_others_recurring', 'not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'user_is_bot', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from reminders.add method';

--
-- Table structure for table `reminders_add_request` generated from model 'remindersUnderscoreaddUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `reminders_add_request` (
  `text` TEXT NOT NULL COMMENT 'The content of the reminder',
  `time` TEXT NOT NULL COMMENT 'When this reminder should happen: the Unix timestamp (up to five years from now), the number of seconds until the reminder (if within 24 hours), or a natural language description (Ex. \&quot;in 15 minutes,\&quot; or \&quot;every Thursday\&quot;)',
  `user` TEXT DEFAULT NULL COMMENT 'The user who will receive the reminder. If no user is specified, the reminder will go to user who created it.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `reminders_add_schema` generated from model 'remindersUnderscoreaddUnderscoreschema'
-- Schema for successful response from reminders.add method
--

CREATE TABLE IF NOT EXISTS `reminders_add_schema` (
  `ok` TINYINT(1) NOT NULL,
  `reminder` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from reminders.add method';

--
-- Table structure for table `reminders_complete_error_schema` generated from model 'remindersUnderscorecompleteUnderscoreerrorUnderscoreschema'
-- Schema for error response from reminders.complete method
--

CREATE TABLE IF NOT EXISTS `reminders_complete_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('not_found', 'cannot_complete_recurring', 'cannot_complete_others', 'not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'user_is_bot', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from reminders.complete method';

--
-- Table structure for table `reminders_complete_request` generated from model 'remindersUnderscorecompleteUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `reminders_complete_request` (
  `reminder` TEXT DEFAULT NULL COMMENT 'The ID of the reminder to be marked as complete'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `reminders_complete_schema` generated from model 'remindersUnderscorecompleteUnderscoreschema'
-- Schema for successful response from reminders.complete method
--

CREATE TABLE IF NOT EXISTS `reminders_complete_schema` (
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from reminders.complete method';

--
-- Table structure for table `reminders_delete_error_schema` generated from model 'remindersUnderscoredeleteUnderscoreerrorUnderscoreschema'
-- Schema for error response from reminders.delete method
--

CREATE TABLE IF NOT EXISTS `reminders_delete_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('not_found', 'not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'user_is_bot', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from reminders.delete method';

--
-- Table structure for table `reminders_delete_request` generated from model 'remindersUnderscoredeleteUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `reminders_delete_request` (
  `reminder` TEXT DEFAULT NULL COMMENT 'The ID of the reminder'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `reminders_delete_schema` generated from model 'remindersUnderscoredeleteUnderscoreschema'
-- Schema for successful response from reminders.delete method
--

CREATE TABLE IF NOT EXISTS `reminders_delete_schema` (
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from reminders.delete method';

--
-- Table structure for table `reminders_info_error_schema` generated from model 'remindersUnderscoreinfoUnderscoreerrorUnderscoreschema'
-- Schema for error response from reminders.info method
--

CREATE TABLE IF NOT EXISTS `reminders_info_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('not_found', 'not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'user_is_bot', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from reminders.info method';

--
-- Table structure for table `reminders_info_schema` generated from model 'remindersUnderscoreinfoUnderscoreschema'
-- Schema for successful response from reminders.info method
--

CREATE TABLE IF NOT EXISTS `reminders_info_schema` (
  `ok` TINYINT(1) NOT NULL,
  `reminder` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from reminders.info method';

--
-- Table structure for table `reminders_list_error_schema` generated from model 'remindersUnderscorelistUnderscoreerrorUnderscoreschema'
-- Schema for error response from reminders.list method
--

CREATE TABLE IF NOT EXISTS `reminders_list_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'user_is_bot', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from reminders.list method';

--
-- Table structure for table `reminders_list_schema` generated from model 'remindersUnderscorelistUnderscoreschema'
-- Schema for successful response from reminders.list method
--

CREATE TABLE IF NOT EXISTS `reminders_list_schema` (
  `ok` TINYINT(1) NOT NULL,
  `reminders` JSON NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from reminders.list method';

--
-- Table structure for table `Response_metadata` generated from model 'ResponseUnderscoremetadata'
--

CREATE TABLE IF NOT EXISTS `Response_metadata` (
  `warnings` JSON DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `rtm_connect_error_schema` generated from model 'rtmUnderscoreconnectUnderscoreerrorUnderscoreschema'
-- Schema for error response from rtm.connect method
--

CREATE TABLE IF NOT EXISTS `rtm_connect_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from rtm.connect method';

--
-- Table structure for table `rtm_connect_schema` generated from model 'rtmUnderscoreconnectUnderscoreschema'
-- Schema for successful response from rtm.connect method
--

CREATE TABLE IF NOT EXISTS `rtm_connect_schema` (
  `ok` TINYINT(1) NOT NULL,
  `self` JSON NOT NULL,
  `team` JSON NOT NULL,
  `url` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from rtm.connect method';

--
-- Table structure for table `stars_add_error_schema` generated from model 'starsUnderscoreaddUnderscoreerrorUnderscoreschema'
-- Schema for error response from stars.add method
--

CREATE TABLE IF NOT EXISTS `stars_add_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('bad_timestamp', 'message_not_found', 'file_not_found', 'file_comment_not_found', 'channel_not_found', 'no_item_specified', 'already_starred', 'not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from stars.add method';

--
-- Table structure for table `stars_add_request` generated from model 'starsUnderscoreaddUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `stars_add_request` (
  `channel` TEXT DEFAULT NULL COMMENT 'Channel to add star to, or channel where the message to add star to was posted (used with &#x60;timestamp&#x60;).',
  `file` TEXT DEFAULT NULL COMMENT 'File to add star to.',
  `file_comment` TEXT DEFAULT NULL COMMENT 'File comment to add star to.',
  `timestamp` TEXT DEFAULT NULL COMMENT 'Timestamp of the message to add star to.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `stars_add_schema` generated from model 'starsUnderscoreaddUnderscoreschema'
-- Schema for successful response from stars.add method
--

CREATE TABLE IF NOT EXISTS `stars_add_schema` (
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from stars.add method';

--
-- Table structure for table `stars_list_error_schema` generated from model 'starsUnderscorelistUnderscoreerrorUnderscoreschema'
-- Schema for error response from stars.list method
--

CREATE TABLE IF NOT EXISTS `stars_list_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'user_is_bot', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from stars.list method';

--
-- Table structure for table `stars_list_schema` generated from model 'starsUnderscorelistUnderscoreschema'
-- Schema for successful response from stars.list method
--

CREATE TABLE IF NOT EXISTS `stars_list_schema` (
  `items` JSON NOT NULL,
  `ok` TINYINT(1) NOT NULL,
  `paging` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from stars.list method';

--
-- Table structure for table `stars_remove_error_schema` generated from model 'starsUnderscoreremoveUnderscoreerrorUnderscoreschema'
-- Schema for error response from stars.remove method
--

CREATE TABLE IF NOT EXISTS `stars_remove_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('bad_timestamp', 'message_not_found', 'file_not_found', 'file_comment_not_found', 'channel_not_found', 'no_item_specified', 'not_starred', 'not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from stars.remove method';

--
-- Table structure for table `stars_remove_request` generated from model 'starsUnderscoreremoveUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `stars_remove_request` (
  `channel` TEXT DEFAULT NULL COMMENT 'Channel to remove star from, or channel where the message to remove star from was posted (used with &#x60;timestamp&#x60;).',
  `file` TEXT DEFAULT NULL COMMENT 'File to remove star from.',
  `file_comment` TEXT DEFAULT NULL COMMENT 'File comment to remove star from.',
  `timestamp` TEXT DEFAULT NULL COMMENT 'Timestamp of the message to remove star from.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `stars_remove_schema` generated from model 'starsUnderscoreremoveUnderscoreschema'
-- Schema for successful response from stars.remove method
--

CREATE TABLE IF NOT EXISTS `stars_remove_schema` (
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from stars.remove method';

--
-- Table structure for table `team_accessLogs_error_schema` generated from model 'teamUnderscoreaccessLogsUnderscoreerrorUnderscoreschema'
-- Schema for error response from team.accessLogs method
--

CREATE TABLE IF NOT EXISTS `team_accessLogs_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('paid_only', 'over_pagination_limit', 'not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'user_is_bot', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from team.accessLogs method';

--
-- Table structure for table `team_accessLogs_schema` generated from model 'teamUnderscoreaccessLogsUnderscoreschema'
-- Schema for successful response from team.accessLogs method
--

CREATE TABLE IF NOT EXISTS `team_accessLogs_schema` (
  `logins` JSON NOT NULL,
  `ok` TINYINT(1) NOT NULL,
  `paging` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from team.accessLogs method';

--
-- Table structure for table `team_info_error_schema` generated from model 'teamUnderscoreinfoUnderscoreerrorUnderscoreschema'
-- Schema for error response from team.info method
--

CREATE TABLE IF NOT EXISTS `team_info_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from team.info method';

--
-- Table structure for table `team_info_schema` generated from model 'teamUnderscoreinfoUnderscoreschema'
-- Schema for successful response from team.info method
--

CREATE TABLE IF NOT EXISTS `team_info_schema` (
  `ok` TINYINT(1) NOT NULL,
  `team` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from team.info method';

--
-- Table structure for table `team_integrationLogs_error_schema` generated from model 'teamUnderscoreintegrationLogsUnderscoreerrorUnderscoreschema'
-- Schema for error response from team.integrationLogs method
--

CREATE TABLE IF NOT EXISTS `team_integrationLogs_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'user_is_bot', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from team.integrationLogs method';

--
-- Table structure for table `team_integrationLogs_schema` generated from model 'teamUnderscoreintegrationLogsUnderscoreschema'
-- Schema for successful response from team.integrationLogs method
--

CREATE TABLE IF NOT EXISTS `team_integrationLogs_schema` (
  `logs` JSON NOT NULL,
  `ok` TINYINT(1) NOT NULL,
  `paging` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from team.integrationLogs method';

--
-- Table structure for table `team_profile_get_error_schema` generated from model 'teamUnderscoreprofileUnderscoregetUnderscoreerrorUnderscoreschema'
-- Schema for error response from team.profile.get method
--

CREATE TABLE IF NOT EXISTS `team_profile_get_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('not_authed', 'invalid_auth', 'account_inactive', 'no_permission', 'user_is_bot', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_typ', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeou', 'upgrade_required') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from team.profile.get method';

--
-- Table structure for table `team_profile_get_success_schema` generated from model 'teamUnderscoreprofileUnderscoregetUnderscoresuccessUnderscoreschema'
-- Schema for successful response from team.profile.get method
--

CREATE TABLE IF NOT EXISTS `team_profile_get_success_schema` (
  `ok` TINYINT(1) NOT NULL,
  `profile` JSON NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from team.profile.get method';

--
-- Table structure for table `usergroups_create_error_schema` generated from model 'usergroupsUnderscorecreateUnderscoreerrorUnderscoreschema'
-- Schema for error response from usergroups.create method
--

CREATE TABLE IF NOT EXISTS `usergroups_create_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('permission_denied', 'not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'user_is_bot', 'user_is_restricted', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from usergroups.create method';

--
-- Table structure for table `usergroups_create_request` generated from model 'usergroupsUnderscorecreateUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `usergroups_create_request` (
  `channels` TEXT DEFAULT NULL COMMENT 'A comma separated string of encoded channel IDs for which the User Group uses as a default.',
  `description` TEXT DEFAULT NULL COMMENT 'A short description of the User Group.',
  `handle` TEXT DEFAULT NULL COMMENT 'A mention handle. Must be unique among channels, users and User Groups.',
  `include_count` TINYINT(1) DEFAULT NULL COMMENT 'Include the number of users in each User Group.',
  `name` TEXT NOT NULL COMMENT 'A name for the User Group. Must be unique among User Groups.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `usergroups_create_schema` generated from model 'usergroupsUnderscorecreateUnderscoreschema'
-- Schema for successful response from usergroups.create method
--

CREATE TABLE IF NOT EXISTS `usergroups_create_schema` (
  `ok` TINYINT(1) NOT NULL,
  `usergroup` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from usergroups.create method';

--
-- Table structure for table `usergroups_disable_error_schema` generated from model 'usergroupsUnderscoredisableUnderscoreerrorUnderscoreschema'
-- Schema for error response from usergroups.disable method
--

CREATE TABLE IF NOT EXISTS `usergroups_disable_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('permission_denied', 'not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'user_is_bot', 'user_is_restricted', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from usergroups.disable method';

--
-- Table structure for table `usergroups_disable_request` generated from model 'usergroupsUnderscoredisableUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `usergroups_disable_request` (
  `include_count` TINYINT(1) DEFAULT NULL COMMENT 'Include the number of users in the User Group.',
  `usergroup` TEXT NOT NULL COMMENT 'The encoded ID of the User Group to disable.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `usergroups_disable_schema` generated from model 'usergroupsUnderscoredisableUnderscoreschema'
-- Schema for successful response from usergroups.disable method
--

CREATE TABLE IF NOT EXISTS `usergroups_disable_schema` (
  `ok` TINYINT(1) NOT NULL,
  `usergroup` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from usergroups.disable method';

--
-- Table structure for table `usergroups_enable_error_schema` generated from model 'usergroupsUnderscoreenableUnderscoreerrorUnderscoreschema'
-- Schema for error response from usergroups.enable method
--

CREATE TABLE IF NOT EXISTS `usergroups_enable_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'user_is_bot', 'user_is_restricted', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_require', 'fatal_error', 'missing_charset', 'superfluous_charset') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from usergroups.enable method';

--
-- Table structure for table `usergroups_enable_request` generated from model 'usergroupsUnderscoreenableUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `usergroups_enable_request` (
  `include_count` TINYINT(1) DEFAULT NULL COMMENT 'Include the number of users in the User Group.',
  `usergroup` TEXT NOT NULL COMMENT 'The encoded ID of the User Group to enable.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `usergroups_enable_schema` generated from model 'usergroupsUnderscoreenableUnderscoreschema'
-- Schema for successful response from usergroups.enable method
--

CREATE TABLE IF NOT EXISTS `usergroups_enable_schema` (
  `ok` TINYINT(1) NOT NULL,
  `usergroup` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from usergroups.enable method';

--
-- Table structure for table `usergroups_list_error_schema` generated from model 'usergroupsUnderscorelistUnderscoreerrorUnderscoreschema'
-- Schema for error response from usergroups.list method
--

CREATE TABLE IF NOT EXISTS `usergroups_list_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'user_is_bot', 'user_is_restricted', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_require', 'fatal_error', 'missing_charset', 'superfluous_charset') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from usergroups.list method';

--
-- Table structure for table `usergroups_list_schema` generated from model 'usergroupsUnderscorelistUnderscoreschema'
-- Schema for successful response from usergroups.list method
--

CREATE TABLE IF NOT EXISTS `usergroups_list_schema` (
  `ok` TINYINT(1) NOT NULL,
  `usergroups` JSON NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from usergroups.list method';

--
-- Table structure for table `usergroups_update_error_schema` generated from model 'usergroupsUnderscoreupdateUnderscoreerrorUnderscoreschema'
-- Schema for error response from usergroups.update method
--

CREATE TABLE IF NOT EXISTS `usergroups_update_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('permission_denied', 'not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'user_is_bot', 'user_is_restricted', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_require', 'fatal_error', 'missing_charset', 'superfluous_charset') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from usergroups.update method';

--
-- Table structure for table `usergroups_update_request` generated from model 'usergroupsUnderscoreupdateUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `usergroups_update_request` (
  `handle` TEXT DEFAULT NULL COMMENT 'A mention handle. Must be unique among channels, users and User Groups.',
  `description` TEXT DEFAULT NULL COMMENT 'A short description of the User Group.',
  `channels` TEXT DEFAULT NULL COMMENT 'A comma separated string of encoded channel IDs for which the User Group uses as a default.',
  `include_count` TINYINT(1) DEFAULT NULL COMMENT 'Include the number of users in the User Group.',
  `usergroup` TEXT NOT NULL COMMENT 'The encoded ID of the User Group to update.',
  `name` TEXT DEFAULT NULL COMMENT 'A name for the User Group. Must be unique among User Groups.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `usergroups_update_schema` generated from model 'usergroupsUnderscoreupdateUnderscoreschema'
-- Schema for successful response from usergroups.update method
--

CREATE TABLE IF NOT EXISTS `usergroups_update_schema` (
  `ok` TINYINT(1) NOT NULL,
  `usergroup` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from usergroups.update method';

--
-- Table structure for table `usergroups_users_list_error_schema` generated from model 'usergroupsUnderscoreusersUnderscorelistUnderscoreerrorUnderscoreschema'
-- Schema for error response from usergroups.users.list method
--

CREATE TABLE IF NOT EXISTS `usergroups_users_list_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'user_is_bot', 'user_is_restricted', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_require', 'fatal_error', 'missing_charset', 'superfluous_charset') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from usergroups.users.list method';

--
-- Table structure for table `usergroups_users_list_schema` generated from model 'usergroupsUnderscoreusersUnderscorelistUnderscoreschema'
-- Schema for successful response from usergroups.users.list method
--

CREATE TABLE IF NOT EXISTS `usergroups_users_list_schema` (
  `ok` TINYINT(1) NOT NULL,
  `users` JSON NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from usergroups.users.list method';

--
-- Table structure for table `usergroups_users_update_error_schema` generated from model 'usergroupsUnderscoreusersUnderscoreupdateUnderscoreerrorUnderscoreschema'
-- Schema for error response from usergroups.users.update method
--

CREATE TABLE IF NOT EXISTS `usergroups_users_update_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('permission_denied', 'not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'user_is_bot', 'user_is_restricted', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_require', 'fatal_error', 'missing_charset', 'superfluous_charset') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from usergroups.users.update method';

--
-- Table structure for table `usergroups_users_update_request` generated from model 'usergroupsUnderscoreusersUnderscoreupdateUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `usergroups_users_update_request` (
  `include_count` TINYINT(1) DEFAULT NULL COMMENT 'Include the number of users in the User Group.',
  `usergroup` TEXT NOT NULL COMMENT 'The encoded ID of the User Group to update.',
  `users` TEXT NOT NULL COMMENT 'A comma separated string of encoded user IDs that represent the entire list of users for the User Group.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `usergroups_users_update_schema` generated from model 'usergroupsUnderscoreusersUnderscoreupdateUnderscoreschema'
-- Schema for successful response from usergroups.users.update method
--

CREATE TABLE IF NOT EXISTS `usergroups_users_update_schema` (
  `ok` TINYINT(1) NOT NULL,
  `usergroup` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from usergroups.users.update method';

--
-- Table structure for table `users_conversations_error_schema` generated from model 'usersUnderscoreconversationsUnderscoreerrorUnderscoreschema'
-- Schema for error response from users.conversations method
--

CREATE TABLE IF NOT EXISTS `users_conversations_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('method_not_supported_for_channel_type', 'missing_scope', 'invalid_types', 'invalid_cursor', 'invalid_limit', 'not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from users.conversations method';

--
-- Table structure for table `users_conversations_success_schema` generated from model 'usersUnderscoreconversationsUnderscoresuccessUnderscoreschema'
-- Schema for successful response from users.conversations method. Returned conversation objects do not include &#x60;num_members&#x60; or &#x60;is_member&#x60;
--

CREATE TABLE IF NOT EXISTS `users_conversations_success_schema` (
  `channels` JSON NOT NULL,
  `ok` TINYINT(1) NOT NULL,
  `response_metadata` JSON DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from users.conversations method. Returned conversation objects do not include &#x60;num_members&#x60; or &#x60;is_member&#x60;';

--
-- Table structure for table `users_counts_error_schema` generated from model 'usersUnderscorecountsUnderscoreerrorUnderscoreschema'
-- Schema for error response users.getPresence method
--

CREATE TABLE IF NOT EXISTS `users_counts_error_schema` (
  `error` TEXT NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response users.getPresence method';

--
-- Table structure for table `users_deletePhoto_error_schema` generated from model 'usersUnderscoredeletePhotoUnderscoreerrorUnderscoreschema'
-- Schema for error response from users.deletePhoto method
--

CREATE TABLE IF NOT EXISTS `users_deletePhoto_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'user_is_bot', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from users.deletePhoto method';

--
-- Table structure for table `users_deletePhoto_schema` generated from model 'usersUnderscoredeletePhotoUnderscoreschema'
-- Schema for successful response from users.deletePhoto method
--

CREATE TABLE IF NOT EXISTS `users_deletePhoto_schema` (
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from users.deletePhoto method';

--
-- Table structure for table `users_identity_error_schema` generated from model 'usersUnderscoreidentityUnderscoreerrorUnderscoreschema'
-- Schema for error response from users.identity method
--

CREATE TABLE IF NOT EXISTS `users_identity_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'user_is_bot', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from users.identity method';

--
-- Table structure for table `users_info_error_schema` generated from model 'usersUnderscoreinfoUnderscoreerrorUnderscoreschema'
-- Schema for error response from users.info method
--

CREATE TABLE IF NOT EXISTS `users_info_error_schema` (
  `callstack` TEXT DEFAULT NULL,
  `error` ENUM('user_not_found', 'user_not_visible', 'not_authed', 'invalid_auth', 'account_inactive', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from users.info method';

--
-- Table structure for table `users_info_success_schema` generated from model 'usersUnderscoreinfoUnderscoresuccessUnderscoreschema'
-- Schema for successful response from users.info method
--

CREATE TABLE IF NOT EXISTS `users_info_success_schema` (
  `ok` TINYINT(1) NOT NULL,
  `user` JSON NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from users.info method';

--
-- Table structure for table `users_list_error_schema` generated from model 'usersUnderscorelistUnderscoreerrorUnderscoreschema'
-- Schema for error response from users.list method
--

CREATE TABLE IF NOT EXISTS `users_list_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('limit_required', 'invalid_cursor', 'not_authed', 'invalid_auth', 'account_inactive', 'no_permission', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from users.list method';

--
-- Table structure for table `users_list_schema` generated from model 'usersUnderscorelistUnderscoreschema'
-- Schema for successful response from users.list method
--

CREATE TABLE IF NOT EXISTS `users_list_schema` (
  `cache_ts` INT NOT NULL,
  `members` JSON NOT NULL,
  `ok` TINYINT(1) NOT NULL,
  `response_metadata` JSON DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from users.list method';

--
-- Table structure for table `users_lookupByEmail_error_schema` generated from model 'usersUnderscorelookupByEmailUnderscoreerrorUnderscoreschema'
-- Schema for error response from users.lookupByEmail method
--

CREATE TABLE IF NOT EXISTS `users_lookupByEmail_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('users_not_found', 'enterprise_is_restricted', 'not_authed', 'invalid_auth', 'account_inactive', 'no_permission', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from users.lookupByEmail method';

--
-- Table structure for table `users_lookupByEmail_success_schema` generated from model 'usersUnderscorelookupByEmailUnderscoresuccessUnderscoreschema'
-- Schema for successful response from users.lookupByEmail method
--

CREATE TABLE IF NOT EXISTS `users_lookupByEmail_success_schema` (
  `ok` TINYINT(1) NOT NULL,
  `user` JSON NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from users.lookupByEmail method';

--
-- Table structure for table `users_profile_get_error_schema` generated from model 'usersUnderscoreprofileUnderscoregetUnderscoreerrorUnderscoreschema'
-- Schema for error response from users.profile.get method
--

CREATE TABLE IF NOT EXISTS `users_profile_get_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('user_not_found', 'not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'user_is_bot', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from users.profile.get method';

--
-- Table structure for table `users_profile_get_schema` generated from model 'usersUnderscoreprofileUnderscoregetUnderscoreschema'
-- Schema for successful response from users.profile.get method
--

CREATE TABLE IF NOT EXISTS `users_profile_get_schema` (
  `ok` TINYINT(1) NOT NULL,
  `profile` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from users.profile.get method';

--
-- Table structure for table `users_profile_set_error_schema` generated from model 'usersUnderscoreprofileUnderscoresetUnderscoreerrorUnderscoreschema'
-- Schema for error response from users.profile.set method
--

CREATE TABLE IF NOT EXISTS `users_profile_set_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('reserved_name', 'invalid_profile', 'profile_set_failed', 'not_admin', 'not_app_admin', 'cannot_update_admin_user', 'not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'user_is_bot', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from users.profile.set method';

--
-- Table structure for table `users_profile_set_request` generated from model 'usersUnderscoreprofileUnderscoresetUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `users_profile_set_request` (
  `name` TEXT DEFAULT NULL COMMENT 'Name of a single key to set. Usable only if &#x60;profile&#x60; is not passed.',
  `profile` TEXT DEFAULT NULL COMMENT 'Collection of key:value pairs presented as a URL-encoded JSON hash. At most 50 fields may be set. Each field name is limited to 255 characters.',
  `user` TEXT DEFAULT NULL COMMENT 'ID of user to change. This argument may only be specified by team admins on paid teams.',
  `value` TEXT DEFAULT NULL COMMENT 'Value to set a single key to. Usable only if &#x60;profile&#x60; is not passed.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `users_profile_set_schema` generated from model 'usersUnderscoreprofileUnderscoresetUnderscoreschema'
-- Schema for successful response from users.profile.set method
--

CREATE TABLE IF NOT EXISTS `users_profile_set_schema` (
  `email_pending` TEXT DEFAULT NULL,
  `ok` TINYINT(1) NOT NULL,
  `profile` TEXT NOT NULL,
  `username` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from users.profile.set method';

--
-- Table structure for table `users_setActive_error_schema` generated from model 'usersUnderscoresetActiveUnderscoreerrorUnderscoreschema'
-- Schema for error response from users.setActive method
--

CREATE TABLE IF NOT EXISTS `users_setActive_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'ekm_access_denied', 'missing_scope', 'invalid_arguments', 'invalid_arg_name', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'request_timeout', 'fatal_error', 'internal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from users.setActive method';

--
-- Table structure for table `users_setActive_schema` generated from model 'usersUnderscoresetActiveUnderscoreschema'
-- Schema for successful response from users.setActive method
--

CREATE TABLE IF NOT EXISTS `users_setActive_schema` (
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from users.setActive method';

--
-- Table structure for table `users_setPhoto_error_schema` generated from model 'usersUnderscoresetPhotoUnderscoreerrorUnderscoreschema'
-- Schema for error response from users.setPhoto method
--

CREATE TABLE IF NOT EXISTS `users_setPhoto_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `debug_step` TEXT DEFAULT NULL COMMENT 'possibly DEV/QA only',
  `dims` TEXT DEFAULT NULL COMMENT 'possibly DEV/QA only',
  `error` ENUM('bad_image', 'too_large', 'too_many_frames', 'not_found', 'not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'user_is_bot', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL,
  `time_ident` INT DEFAULT NULL COMMENT 'possibly DEV/QA only'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from users.setPhoto method';

--
-- Table structure for table `users_setPhoto_schema` generated from model 'usersUnderscoresetPhotoUnderscoreschema'
-- Schema for successful response from users.setPhoto method
--

CREATE TABLE IF NOT EXISTS `users_setPhoto_schema` (
  `ok` TINYINT(1) NOT NULL,
  `profile` JSON NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from users.setPhoto method';

--
-- Table structure for table `users_setPresence_error_schema` generated from model 'usersUnderscoresetPresenceUnderscoreerrorUnderscoreschema'
-- Schema for error response from users.setPresence method
--

CREATE TABLE IF NOT EXISTS `users_setPresence_error_schema` (
  `callstack` TEXT DEFAULT NULL COMMENT 'Note: PHP callstack is only visible in dev/qa',
  `error` ENUM('invalid_presence', 'not_authed', 'invalid_auth', 'account_inactive', 'token_revoked', 'no_permission', 'org_login_required', 'invalid_arg_name', 'invalid_array_arg', 'invalid_charset', 'invalid_form_data', 'invalid_post_type', 'missing_post_type', 'team_added_to_org', 'invalid_json', 'json_not_object', 'request_timeout', 'upgrade_required', 'fatal_error') NOT NULL,
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for error response from users.setPresence method';

--
-- Table structure for table `users_setPresence_request` generated from model 'usersUnderscoresetPresenceUnderscorerequest'
--

CREATE TABLE IF NOT EXISTS `users_setPresence_request` (
  `presence` TEXT NOT NULL COMMENT 'Either &#x60;auto&#x60; or &#x60;away&#x60;'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `users_setPresence_schema` generated from model 'usersUnderscoresetPresenceUnderscoreschema'
-- Schema for successful response from users.setPresence method
--

CREATE TABLE IF NOT EXISTS `users_setPresence_schema` (
  `ok` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Schema for successful response from users.setPresence method';


--
-- OAuth2 framework tables
-- Thanks to https://github.com/dsquier/oauth2-server-php-mysql repo
--

--
-- Table structure for table `oauth_clients`
--
CREATE TABLE IF NOT EXISTS `oauth_clients` (
  `client_id`            VARCHAR(80)    NOT NULL,
  `client_secret`        VARCHAR(80)    DEFAULT NULL,
  `redirect_uri`         VARCHAR(2000)  DEFAULT NULL,
  `grant_types`          VARCHAR(80)    DEFAULT NULL,
  `scope`                VARCHAR(4000)  DEFAULT NULL,
  `user_id`              VARCHAR(80)    DEFAULT NULL,
  PRIMARY KEY (`client_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `oauth_access_tokens`
--
CREATE TABLE IF NOT EXISTS `oauth_access_tokens` (
  `access_token`         VARCHAR(40)    NOT NULL,
  `client_id`            VARCHAR(80)    DEFAULT NULL,
  `user_id`              VARCHAR(80)    DEFAULT NULL,
  `expires`              TIMESTAMP      NOT NULL,
  `scope`                VARCHAR(4000)  DEFAULT NULL,
  PRIMARY KEY (`access_token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `oauth_authorization_codes`
--
CREATE TABLE IF NOT EXISTS `oauth_authorization_codes` (
  `authorization_code`  VARCHAR(40)    NOT NULL,
  `client_id`           VARCHAR(80)    DEFAULT NULL,
  `user_id`             VARCHAR(80)    DEFAULT NULL,
  `redirect_uri`        VARCHAR(2000)  NOT NULL,
  `expires`             TIMESTAMP      NOT NULL,
  `scope`               VARCHAR(4000)  DEFAULT NULL,
  `id_token`            VARCHAR(1000)  DEFAULT NULL,
  PRIMARY KEY (`authorization_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `oauth_refresh_tokens`
--
CREATE TABLE IF NOT EXISTS `oauth_refresh_tokens` (
  `refresh_token`       VARCHAR(40)    NOT NULL,
  `client_id`           VARCHAR(80)    DEFAULT NULL,
  `user_id`             VARCHAR(80)    DEFAULT NULL,
  `expires`             TIMESTAMP      on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `scope`               VARCHAR(4000)  DEFAULT NULL,
  PRIMARY KEY (`refresh_token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `oauth_users`
--
CREATE TABLE IF NOT EXISTS `oauth_users` (
  `username`            VARCHAR(80)    DEFAULT NULL,
  `password`            VARCHAR(255)   DEFAULT NULL,
  `first_name`          VARCHAR(80)    DEFAULT NULL,
  `last_name`           VARCHAR(80)    DEFAULT NULL,
  `email`               VARCHAR(2000)  DEFAULT NULL,
  `email_verified`      TINYINT(1)     DEFAULT NULL,
  `scope`               VARCHAR(4000)  DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `oauth_scopes`
--
CREATE TABLE IF NOT EXISTS `oauth_scopes` (
  `scope`               VARCHAR(80)  NOT NULL,
  `is_default`          TINYINT(1)   DEFAULT NULL,
  PRIMARY KEY (`scope`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `oauth_jwt`
--
CREATE TABLE IF NOT EXISTS `oauth_jwt` (
  `client_id`           VARCHAR(80)    NOT NULL,
  `subject`             VARCHAR(80)    DEFAULT NULL,
  `public_key`          VARCHAR(2000)  NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `oauth_jti`
--
CREATE TABLE IF NOT EXISTS `oauth_jti` (
  `issuer`              VARCHAR(80)    NOT NULL,
  `subject`             VARCHAR(80)    DEFAULT NULL,
  `audience`            VARCHAR(80)    DEFAULT NULL,
  `expires`             TIMESTAMP      NOT NULL,
  `jti`                 VARCHAR(2000)  NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `oauth_public_keys`
--
CREATE TABLE IF NOT EXISTS `oauth_public_keys` (
  `client_id`            VARCHAR(80)    DEFAULT NULL,
  `public_key`           VARCHAR(2000)  DEFAULT NULL,
  `private_key`          VARCHAR(2000)  DEFAULT NULL,
  `encryption_algorithm` VARCHAR(100)   DEFAULT 'RS256'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
