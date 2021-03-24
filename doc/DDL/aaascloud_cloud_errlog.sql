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
-- Table structure for table `cloud_errlog`
--

DROP TABLE IF EXISTS `cloud_errlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cloud_errlog` (
  `ROWID` int(11) NOT NULL DEFAULT '1',
  `userId` int(11) DEFAULT NULL,
  `device` varchar(50)  DEFAULT NULL,
  `statusFlag` int(11) DEFAULT NULL,
  `dataTime` datetime DEFAULT NULL,
  `systemSort` varchar(2)  DEFAULT NULL,
  `systemID` varchar(16)  DEFAULT NULL,
  `componentID` varchar(4)  DEFAULT NULL,
  `messageID` varchar(4)  DEFAULT NULL,
  `messageSort` varchar(1)  DEFAULT NULL,
  `errCode` varchar(4)  DEFAULT NULL,
  `errMessage` text COLLATE utf8mb4_bin,
  `alive` tinyint(4) DEFAULT NULL,
   `deleteFlag` tinyint(4) NOT NULL,
  `i_uid` varchar(8)  DEFAULT NULL,
  `i_time` datetime DEFAULT NULL,
  `u_uid` varchar(8)  DEFAULT NULL,
  `u_time` datetime DEFAULT NULL,
  PRIMARY KEY (`ROWID`)
) ENGINE=InnoDB DEFAULT  CHARSET=utf8 COMMENT='エラーログテーブル';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cloud_errlog`
--

LOCK TABLES `cloud_errlog` WRITE;
/*!40000 ALTER TABLE `cloud_errlog` DISABLE KEYS */;
/*!40000 ALTER TABLE `cloud_errlog` ENABLE KEYS */;
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
