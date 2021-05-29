CREATE TABLE IF NOT EXISTS `sc_user` (
  `uid` INT(8) NOT NULL AUTO_INCREMENT,
  `loginid` VARCHAR(45) NOT NULL,
  `password` VARCHAR(32) NOT NULL,
  `company` VARCHAR(100) NULL DEFAULT NULL,
  `address` VARCHAR(400) NULL DEFAULT NULL,
  `industry` INT(2) NULL DEFAULT NULL,
  `mail` VARCHAR(45) NULL DEFAULT NULL,
  `tel` VARCHAR(20) NULL DEFAULT NULL,
  PRIMARY KEY (`uid`, `loginid`))
ENGINE = InnoDB DEFAULT CHARSET=utf8 COMMENT='SIMカードユーザーテーブル';