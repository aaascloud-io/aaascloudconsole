CREATE TABLE IF NOT EXISTS `card_information` (
  `no` INT(10) NOT NULL AUTO_INCREMENT,
  `ukeirebi` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `kubun` VARCHAR(10) NOT NULL,
  `iccid` VARCHAR(20) NOT NULL,
  `kanribango` VARCHAR(15) NOT NULL,
  `imsi` VARCHAR(20) NULL DEFAULT NULL,
  `tenwabango` VARCHAR(11) NULL DEFAULT NULL,
  `hakkotanto` VARCHAR(20) NULL DEFAULT NULL,
  `hakkobi` DATETIME NULL DEFAULT NULL,
  `hakkosaki` VARCHAR(400) NULL DEFAULT NULL,
  `hakkosakitantosha` VARCHAR(20) NULL DEFAULT NULL,
  `renrakusen` VARCHAR(20) NULL DEFAULT NULL,
  `riyokaishibi` DATETIME NULL DEFAULT NULL,
  `riyomokuteki` VARCHAR(400) NULL DEFAULT NULL,
  `gaiyo` VARCHAR(400) NULL DEFAULT NULL,
  `biko` VARCHAR(400) NULL DEFAULT NULL,
  `deleteflg` INT(10) NOT NULL,
  PRIMARY KEY (`no`))
ENGINE = InnoDB DEFAULT CHARSET=utf8 COMMENT='SIMカードテーブル';