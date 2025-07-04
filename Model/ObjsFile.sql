--
-- Slack Web API.
-- Prepared SQL queries for 'objs_file' definition.
--


--
-- SELECT template for table `objs_file`
--
SELECT `channels`, `comments_count`, `created`, `date_delete`, `display_as_bot`, `editable`, `editor`, `external_id`, `external_type`, `external_url`, `filetype`, `groups`, `has_rich_preview`, `id`, `image_exif_rotation`, `ims`, `is_external`, `is_public`, `is_starred`, `is_tombstoned`, `last_editor`, `mimetype`, `mode`, `name`, `non_owner_editable`, `num_stars`, `original_h`, `original_w`, `permalink`, `permalink_public`, `pinned_info`, `pinned_to`, `pretty_type`, `preview`, `public_url_shared`, `reactions`, `shares`, `size`, `source_team`, `state`, `thumb_1024`, `thumb_1024_h`, `thumb_1024_w`, `thumb_160`, `thumb_360`, `thumb_360_h`, `thumb_360_w`, `thumb_480`, `thumb_480_h`, `thumb_480_w`, `thumb_64`, `thumb_720`, `thumb_720_h`, `thumb_720_w`, `thumb_80`, `thumb_800`, `thumb_800_h`, `thumb_800_w`, `thumb_960`, `thumb_960_h`, `thumb_960_w`, `thumb_tiny`, `timestamp`, `title`, `updated`, `url_private`, `url_private_download`, `user`, `user_team`, `username` FROM `objs_file` WHERE 1;

--
-- INSERT template for table `objs_file`
--
INSERT INTO `objs_file`(`channels`, `comments_count`, `created`, `date_delete`, `display_as_bot`, `editable`, `editor`, `external_id`, `external_type`, `external_url`, `filetype`, `groups`, `has_rich_preview`, `id`, `image_exif_rotation`, `ims`, `is_external`, `is_public`, `is_starred`, `is_tombstoned`, `last_editor`, `mimetype`, `mode`, `name`, `non_owner_editable`, `num_stars`, `original_h`, `original_w`, `permalink`, `permalink_public`, `pinned_info`, `pinned_to`, `pretty_type`, `preview`, `public_url_shared`, `reactions`, `shares`, `size`, `source_team`, `state`, `thumb_1024`, `thumb_1024_h`, `thumb_1024_w`, `thumb_160`, `thumb_360`, `thumb_360_h`, `thumb_360_w`, `thumb_480`, `thumb_480_h`, `thumb_480_w`, `thumb_64`, `thumb_720`, `thumb_720_h`, `thumb_720_w`, `thumb_80`, `thumb_800`, `thumb_800_h`, `thumb_800_w`, `thumb_960`, `thumb_960_h`, `thumb_960_w`, `thumb_tiny`, `timestamp`, `title`, `updated`, `url_private`, `url_private_download`, `user`, `user_team`, `username`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

--
-- UPDATE template for table `objs_file`
--
UPDATE `objs_file` SET `channels` = ?, `comments_count` = ?, `created` = ?, `date_delete` = ?, `display_as_bot` = ?, `editable` = ?, `editor` = ?, `external_id` = ?, `external_type` = ?, `external_url` = ?, `filetype` = ?, `groups` = ?, `has_rich_preview` = ?, `id` = ?, `image_exif_rotation` = ?, `ims` = ?, `is_external` = ?, `is_public` = ?, `is_starred` = ?, `is_tombstoned` = ?, `last_editor` = ?, `mimetype` = ?, `mode` = ?, `name` = ?, `non_owner_editable` = ?, `num_stars` = ?, `original_h` = ?, `original_w` = ?, `permalink` = ?, `permalink_public` = ?, `pinned_info` = ?, `pinned_to` = ?, `pretty_type` = ?, `preview` = ?, `public_url_shared` = ?, `reactions` = ?, `shares` = ?, `size` = ?, `source_team` = ?, `state` = ?, `thumb_1024` = ?, `thumb_1024_h` = ?, `thumb_1024_w` = ?, `thumb_160` = ?, `thumb_360` = ?, `thumb_360_h` = ?, `thumb_360_w` = ?, `thumb_480` = ?, `thumb_480_h` = ?, `thumb_480_w` = ?, `thumb_64` = ?, `thumb_720` = ?, `thumb_720_h` = ?, `thumb_720_w` = ?, `thumb_80` = ?, `thumb_800` = ?, `thumb_800_h` = ?, `thumb_800_w` = ?, `thumb_960` = ?, `thumb_960_h` = ?, `thumb_960_w` = ?, `thumb_tiny` = ?, `timestamp` = ?, `title` = ?, `updated` = ?, `url_private` = ?, `url_private_download` = ?, `user` = ?, `user_team` = ?, `username` = ? WHERE 1;

--
-- DELETE template for table `objs_file`
--
DELETE FROM `objs_file` WHERE 0;

