-- MySQL dump 10.13  Distrib 8.4.6, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: ecohome360
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `registros_residuos`
--

DROP TABLE IF EXISTS `registros_residuos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registros_residuos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL,
  `tipo_residuo` enum('plastico','papel','vidrio','metal','organico','electronico','textil') NOT NULL,
  `cantidad` decimal(10,2) NOT NULL,
  `unidad` enum('kg','unidades','litros') DEFAULT 'kg',
  `fecha` date NOT NULL,
  `descripcion` text,
  `fecha_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `registros_residuos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registros_residuos`
--

/*!40000 ALTER TABLE `registros_residuos` DISABLE KEYS */;
INSERT INTO `registros_residuos` VALUES (1,4,'plastico',2.50,'kg','2026-05-01','Botellas PET','2026-05-01 20:29:44'),(2,11,'papel',1.00,'kg','2026-05-02','cajas carton','2026-05-01 21:00:51'),(3,4,'plastico',2.00,'unidades','2026-05-02','botella','2026-05-01 21:26:17'),(4,4,'vidrio',2.00,'kg','2026-05-02','botella de vino','2026-05-01 21:52:50'),(5,5,'organico',5.00,'kg','2026-05-02','cascaras de frutas','2026-05-01 21:54:05'),(6,4,'papel',3.00,'kg','2026-05-03','Caja de carton','2026-05-02 19:58:25'),(7,4,'plastico',2.00,'kg','2026-05-08','botellas pet','2026-05-07 20:27:34'),(8,11,'plastico',0.90,'kg','2026-05-27','Botella pet','2026-05-26 21:20:39');
/*!40000 ALTER TABLE `registros_residuos` ENABLE KEYS */;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_completo` varchar(150) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `fecha_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  `activo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (4,'Andres Toro','andres@prueba.com','123456','3001234567','2026-05-01 11:43:10',1),(5,'Maria Lopez','maria@prueba.com','123456','3009876543','2026-05-01 11:43:10',1),(6,'Carlos Ruiz','carlos@prueba.com','123456','3011111111','2026-05-01 11:43:10',1),(8,'Andres Toro','andres1@prueba.com','$2b$10$GyVZfgMUaLucOPqim/hfLO/JbzC2/YwgxKW3.WJOQwvVCbN1oZkva','3001234567','2026-05-01 14:45:26',1),(9,'Laura Garcia','laura@prueba.com','$2b$10$knFLXIHSmOtKeK2HQ3h8l.IEeTr1JsAFeDOnDcQB/R.kL3NfRdC.G','3157654321','2026-05-01 16:04:45',1),(10,'Pepito Fernandez','pepito1@prueba.com','$2b$10$FkFCYuNsq./73mH.K/U5SuV7PF6uGorgr6Eqq4N9Ko6C.osYStdLa','3113004000','2026-05-01 16:05:31',1),(11,'usuario prueba','prueba1@prueba.com','$2b$10$mfRIekXt0wzOOBOKfV3ldekLj.lqjBzNNVnI9f4d7/x5kvktNLGjO','3334445566','2026-05-01 20:55:58',1);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;

--
-- Dumping routines for database 'ecohome360'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-29 21:49:59
