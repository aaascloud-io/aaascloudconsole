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
-- Table structure for table `cloud_company`
--

DROP TABLE IF EXISTS `cloud_company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cloud_company` (
  `companyId` int(8) NOT NULL AUTO_INCREMENT,
  `corporateNumber` varchar(20) NOT NULL,
  `companyName` varchar(50) NOT NULL,
  `address` varchar(100) DEFAULT NULL,
  `industry` varchar(50) DEFAULT NULL,
  `mail` varchar(50) DEFAULT NULL,
  `tel` varchar(13) DEFAULT NULL,
  `fax` varchar(13) DEFAULT NULL,
  `level` int(1) DEFAULT 0,
  `alive` tinyint(4) NOT NULL,
  `deleteFlag` tinyint(4) NOT NULL,
  `i_uid` int(8) NOT NULL,
  `i_time` datetime NOT NULL,
  `u_uid` int(8) NOT NULL,
  `u_time` datetime NOT NULL,
  PRIMARY KEY (`companyId`),
  UNIQUE KEY `company_UNIQUE` (`corporateNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='会社テーブル';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cloud_company`
--

LOCK TABLES `cloud_company` WRITE;
/*!40000 ALTER TABLE `cloud_company` DISABLE KEYS */;
/*!40000 ALTER TABLE `cloud_company` ENABLE KEYS */;
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
