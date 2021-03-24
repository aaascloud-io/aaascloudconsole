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
-- Table structure for table `cloud_device`
--

DROP TABLE IF EXISTS `cloud_device`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cloud_device` (
  `deviceId` int(8) NOT NULL AUTO_INCREMENT,
  `projectId` int(8) DEFAULT NULL,
  `groupId` int(8) DEFAULT NULL,
  `deviceName` varchar(50) DEFAULT NULL,
  `SN` varchar(20) NOT NULL,
  `IMEI` varchar(20) NOT NULL,
  `SIM_ICCID` varchar(20) DEFAULT NULL,
  `SIM_IMSI` varchar(20) DEFAULT NULL,
  `SIM_TEL` varchar(20) DEFAULT NULL,
  `encryptedCommunications` int(1) DEFAULT 0,
  `encryptedKey` text DEFAULT NULL,
  `connectServerURL` varchar(50) DEFAULT NULL,
  `connectServerPort` varchar(4) DEFAULT NULL,
  `bindingFlag` int(1) DEFAULT 0,
  `fmLastestVersion` varchar(50) DEFAULT NULL,
  `versionComfirmTime` datetime DEFAULT NULL,
  `productId` int(8) NOT NULL,
  `companyId` int(8) ,
  `userId` int(8) NOT NULL,
  `lastProjectId` int(8) ,
  `lastGroupId` int(8) ,
  `alive` tinyint(4) NOT NULL,
  `deleteFlag` tinyint(4) NOT NULL,
  `i_uid` int(8) NOT NULL,
  `i_time` datetime NOT NULL,
  `u_uid` int(8) NOT NULL,
  `u_time` datetime NOT NULL,
  PRIMARY KEY (`deviceId`) USING BTREE,
  UNIQUE KEY `device_UNIQUE` (`IMEI`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='デバイステーブル';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cloud_device`
--

LOCK TABLES `cloud_device` WRITE;
/*!40000 ALTER TABLE `cloud_device` DISABLE KEYS */;
/*!40000 ALTER TABLE `cloud_device` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-12-04 16:06:43
