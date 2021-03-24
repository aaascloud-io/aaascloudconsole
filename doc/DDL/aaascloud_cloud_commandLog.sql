-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: localhost    Database: aaascloud
-- ------------------------------------------------------
-- Server version	5.7.25

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cloud_commandLog`
--

DROP TABLE IF EXISTS `cloud_commandLog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cloud_commandLog` (
  `ROWID` int(8) NOT NULL AUTO_INCREMENT,
  `commandId` int(8) NOT NULL,
  `deviceId` int(8) NOT NULL,
  `deviceNo` varchar(150) NOT NULL,
  `jsonCommand` text ,
  `confirmStatus` int(8) ,
  `confirmUserName` varchar(50) ,
  `confirmTime` varchar(20) ,
  `confirmMemo` varchar(100) ,
  `upgradedVersionName` varchar(50) ,
  `deleteFlag` tinyint(4) NOT NULL,
  `alive` tinyint(4) NOT NULL DEFAULT '1',
  `i_uid` int(8) DEFAULT NULL,
  `i_time` datetime DEFAULT NULL,
  `u_uid` int(8) DEFAULT NULL,
  `u_time` datetime DEFAULT NULL,
  PRIMARY KEY (`ROWID`) USING BTREE,
  UNIQUE KEY `commandLog_UNIQUE` (`commandId`,`deviceId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='グループテーブル';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cloud_commandLog`
--

LOCK TABLES `cloud_commandLog` WRITE;
/*!40000 ALTER TABLE `cloud_commandLog` DISABLE KEYS */;
/*!40000 ALTER TABLE `cloud_commandLog` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-12-04 16:06:44
