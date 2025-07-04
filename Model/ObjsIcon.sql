--
-- Slack Web API.
-- Prepared SQL queries for 'objs_icon' definition.
--


--
-- SELECT template for table `objs_icon`
--
SELECT `image_102`, `image_132`, `image_230`, `image_34`, `image_44`, `image_68`, `image_88`, `image_default` FROM `objs_icon` WHERE 1;

--
-- INSERT template for table `objs_icon`
--
INSERT INTO `objs_icon`(`image_102`, `image_132`, `image_230`, `image_34`, `image_44`, `image_68`, `image_88`, `image_default`) VALUES (?, ?, ?, ?, ?, ?, ?, ?);

--
-- UPDATE template for table `objs_icon`
--
UPDATE `objs_icon` SET `image_102` = ?, `image_132` = ?, `image_230` = ?, `image_34` = ?, `image_44` = ?, `image_68` = ?, `image_88` = ?, `image_default` = ? WHERE 1;

--
-- DELETE template for table `objs_icon`
--
DELETE FROM `objs_icon` WHERE 0;

