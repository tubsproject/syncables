--
-- Slack Web API.
-- Prepared SQL queries for 'auth_revoke_schema' definition.
--


--
-- SELECT template for table `auth_revoke_schema`
--
SELECT `ok`, `revoked` FROM `auth_revoke_schema` WHERE 1;

--
-- INSERT template for table `auth_revoke_schema`
--
INSERT INTO `auth_revoke_schema`(`ok`, `revoked`) VALUES (?, ?);

--
-- UPDATE template for table `auth_revoke_schema`
--
UPDATE `auth_revoke_schema` SET `ok` = ?, `revoked` = ? WHERE 1;

--
-- DELETE template for table `auth_revoke_schema`
--
DELETE FROM `auth_revoke_schema` WHERE 0;

