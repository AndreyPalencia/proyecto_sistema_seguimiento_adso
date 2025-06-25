-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: sistema_seguimiento
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `agendamiento`
--

DROP TABLE IF EXISTS `agendamiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agendamiento` (
  `id_agendamiento` int unsigned NOT NULL AUTO_INCREMENT,
  `herramienta_reunion` varchar(30) NOT NULL,
  `enlace_reunion` varchar(255) NOT NULL,
  `fecha_inicio` datetime NOT NULL,
  `fecha_fin` datetime NOT NULL,
  `estado_visita` varchar(30) NOT NULL,
  `tipo_visita` varchar(30) NOT NULL,
  `numero_visita` int unsigned NOT NULL,
  `id_ficha_aprendiz` int unsigned NOT NULL,
  `id_instructor` int unsigned NOT NULL,
  PRIMARY KEY (`id_agendamiento`),
  KEY `fk_id_instructor_agendamiento_idx` (`id_instructor`),
  KEY `fk_id_ficha_aprendiz_agendamiento_idx` (`id_ficha_aprendiz`),
  CONSTRAINT `fk_id_ficha_aprendiz_agendamiento` FOREIGN KEY (`id_ficha_aprendiz`) REFERENCES `ficha_aprendiz` (`id_ficha_aprendiz`),
  CONSTRAINT `fk_id_instructor_agendamiento` FOREIGN KEY (`id_instructor`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=290 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `bitacora`
--

DROP TABLE IF EXISTS `bitacora`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bitacora` (
  `id_bitacora` int unsigned NOT NULL AUTO_INCREMENT,
  `numero_bitacora` int unsigned NOT NULL,
  `observacion` text,
  `bitacora` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `estado_bitacora` tinyint(1) DEFAULT '0',
  `fecha_ultima_actualizacion` datetime NOT NULL,
  `id_ficha_aprendiz` int unsigned NOT NULL,
  PRIMARY KEY (`id_bitacora`,`numero_bitacora`),
  KEY `fk_id_ficha_aprendiz_bitacora_idx` (`id_ficha_aprendiz`),
  CONSTRAINT `fk_id_ficha_aprendiz_bitacora` FOREIGN KEY (`id_ficha_aprendiz`) REFERENCES `ficha_aprendiz` (`id_ficha_aprendiz`)
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `documento`
--

DROP TABLE IF EXISTS `documento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documento` (
  `id_documento` int unsigned NOT NULL AUTO_INCREMENT,
  `id_ficha_aprendiz` int unsigned NOT NULL,
  `tipo_documento` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `nombre_documento` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `estado_documento` tinyint(1) NOT NULL DEFAULT '0',
  `observacion` varchar(500) DEFAULT NULL,
  `fecha_ultima_actualizacion` datetime NOT NULL,
  PRIMARY KEY (`id_documento`),
  KEY `fk_id_ficha_aprendiz_documento_idx` (`id_ficha_aprendiz`),
  CONSTRAINT `fk_id_ficha_aprendiz_documento` FOREIGN KEY (`id_ficha_aprendiz`) REFERENCES `ficha_aprendiz` (`id_ficha_aprendiz`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `empresa`
--

DROP TABLE IF EXISTS `empresa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empresa` (
  `id_empresa` int unsigned NOT NULL AUTO_INCREMENT,
  `nit` varchar(18) NOT NULL,
  `razon_social` varchar(25) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `telefono` int unsigned NOT NULL,
  `correo_electronico` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `direccion` varchar(150) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  PRIMARY KEY (`id_empresa`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ficha`
--

DROP TABLE IF EXISTS `ficha`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ficha` (
  `id_ficha` int unsigned NOT NULL AUTO_INCREMENT,
  `numero_ficha` int unsigned NOT NULL,
  `nombre_programa` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `termino_programa` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `estado_ficha` tinyint(1) NOT NULL DEFAULT '0',
  `inicio_etapa_productiva` date NOT NULL,
  `fin_etapa_productiva` date NOT NULL,
  `id_instructor` int unsigned NOT NULL,
  `fecha_notificacion_envio` date DEFAULT NULL,
  PRIMARY KEY (`id_ficha`),
  UNIQUE KEY `numero_ficha_UNIQUE` (`numero_ficha`),
  KEY `fk_id_instructor_idx` (`id_instructor`),
  CONSTRAINT `id_instructor_ficha` FOREIGN KEY (`id_instructor`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ficha_aprendiz`
--

DROP TABLE IF EXISTS `ficha_aprendiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ficha_aprendiz` (
  `id_ficha_aprendiz` int unsigned NOT NULL AUTO_INCREMENT,
  `id_usuario` int unsigned NOT NULL,
  `id_ficha` int unsigned NOT NULL,
  `id_empresa` int unsigned NOT NULL,
  `alternativa` varchar(45) NOT NULL,
  `cargo_empresa` varchar(45) NOT NULL,
  `jefe_inmediato` varchar(45) NOT NULL,
  `correo_electronico_jefe` varchar(50) NOT NULL,
  `telefono_jefe` int unsigned NOT NULL,
  `cargo_Jefe` varchar(45) NOT NULL,
  PRIMARY KEY (`id_ficha_aprendiz`),
  UNIQUE KEY `unique_usuario_ficha` (`id_usuario`,`id_ficha`),
  KEY `fk_id_ficha_fichaAprendiz_idx` (`id_ficha`),
  KEY `fk_id_usuario_fichaAprendiz_idx` (`id_usuario`),
  KEY `fk_id_empresa_fichaAprendiz_idx` (`id_empresa`),
  CONSTRAINT `fk_id_empresa_fichaAprendiz` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`),
  CONSTRAINT `fk_id_ficha_fichaAprendiz` FOREIGN KEY (`id_ficha`) REFERENCES `ficha` (`id_ficha`),
  CONSTRAINT `fk_id_usuario_fichaAprendiz` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notificacion`
--

DROP TABLE IF EXISTS `notificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificacion` (
  `id_notificacion` int NOT NULL AUTO_INCREMENT,
  `tipo` varchar(50) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `mensaje` varchar(500) NOT NULL,
  `fecha_creacion` date NOT NULL,
  `estado` varchar(45) NOT NULL,
  `id_usuario` int unsigned NOT NULL,
  PRIMARY KEY (`id_notificacion`,`titulo`),
  KEY `fk_id_usuario_notificacion_idx` (`id_usuario`),
  CONSTRAINT `fk_id_usuario_notificacion` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=203 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `observacion`
--

DROP TABLE IF EXISTS `observacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `observacion` (
  `id_observacion` int unsigned NOT NULL AUTO_INCREMENT,
  `observacion` text NOT NULL,
  `mostrar_observacion` tinyint NOT NULL DEFAULT '0',
  `fecha_ultima_actualizacion` date NOT NULL,
  `id_ficha_aprendiz` int unsigned NOT NULL,
  PRIMARY KEY (`id_observacion`),
  KEY `fk_id_ficha_aprendiz_observacion_idx` (`id_ficha_aprendiz`),
  CONSTRAINT `fk_id_ficha_aprendiz_observacion` FOREIGN KEY (`id_ficha_aprendiz`) REFERENCES `ficha_aprendiz` (`id_ficha_aprendiz`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reporte_gfipf`
--

DROP TABLE IF EXISTS `reporte_gfipf`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reporte_gfipf` (
  `id_reporte` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre_reporte` varchar(50) NOT NULL,
  `fecha_ultima_actualizacion` date NOT NULL,
  `tipo_reporte` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `id_ficha_aprendiz` int unsigned NOT NULL,
  PRIMARY KEY (`id_reporte`),
  KEY `fk_id_ficha_aprendiz_reporte_idx` (`id_ficha_aprendiz`),
  CONSTRAINT `fk_id_ficha_aprendiz_reporte` FOREIGN KEY (`id_ficha_aprendiz`) REFERENCES `ficha_aprendiz` (`id_ficha_aprendiz`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int unsigned NOT NULL AUTO_INCREMENT,
  `tipo_documento` varchar(20) NOT NULL,
  `numero_documento` int unsigned NOT NULL,
  `nombre` varchar(125) NOT NULL,
  `apellido` varchar(125) NOT NULL,
  `telefono` int unsigned NOT NULL,
  `correo_electronico` varchar(50) NOT NULL,
  `firma` varchar(255) DEFAULT NULL,
  `rol` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `estado_usuario` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `correo_electronico_UNIQUE` (`correo_electronico`),
  UNIQUE KEY `numero_documento_UNIQUE` (`numero_documento`)
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'CC',123456789,'Admin','Administrador ',123456789,'sistemasoportesaep@gmail.com','img_tranparente.png','admin','$2a$10$WKuoTDIWJ1qKwheEaNhHVel5lXEiB8WL9/5PfmlTZ92h3nMKH.yY.',1);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'sistema_seguimiento'
--
/*!50106 SET @save_time_zone= @@TIME_ZONE */ ;
/*!50106 DROP EVENT IF EXISTS `desactivar_fichas_por_fecha` */;
DELIMITER ;;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;;
/*!50003 SET character_set_client  = utf8mb4 */ ;;
/*!50003 SET character_set_results = utf8mb4 */ ;;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;;
/*!50003 SET @saved_time_zone      = @@time_zone */ ;;
/*!50003 SET time_zone             = 'SYSTEM' */ ;;
/*!50106 CREATE*/ /*!50117 DEFINER=`root`@`localhost`*/ /*!50106 EVENT `desactivar_fichas_por_fecha` ON SCHEDULE EVERY 1 DAY STARTS '2025-06-19 21:49:17' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
  UPDATE ficha
  SET estado_ficha = 0
  WHERE fin_etapa_productiva < CURDATE()
    AND estado_ficha = 1;
END */ ;;
/*!50003 SET time_zone             = @saved_time_zone */ ;;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;;
/*!50003 SET character_set_client  = @saved_cs_client */ ;;
/*!50003 SET character_set_results = @saved_cs_results */ ;;
/*!50003 SET collation_connection  = @saved_col_connection */ ;;
/*!50106 DROP EVENT IF EXISTS `eliminar_notificaciones_archivadas` */;;
DELIMITER ;;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;;
/*!50003 SET character_set_client  = utf8mb4 */ ;;
/*!50003 SET character_set_results = utf8mb4 */ ;;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;;
/*!50003 SET @saved_time_zone      = @@time_zone */ ;;
/*!50003 SET time_zone             = 'SYSTEM' */ ;;
/*!50106 CREATE*/ /*!50117 DEFINER=`root`@`localhost`*/ /*!50106 EVENT `eliminar_notificaciones_archivadas` ON SCHEDULE EVERY 1 MONTH STARTS '2025-06-01 00:00:00' ON COMPLETION NOT PRESERVE ENABLE DO DELETE FROM notificacion
  WHERE estado = 'Archivada'
    AND fecha_creacion <= CURDATE() - INTERVAL 30 DAY */ ;;
/*!50003 SET time_zone             = @saved_time_zone */ ;;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;;
/*!50003 SET character_set_client  = @saved_cs_client */ ;;
/*!50003 SET character_set_results = @saved_cs_results */ ;;
/*!50003 SET collation_connection  = @saved_col_connection */ ;;
/*!50106 DROP EVENT IF EXISTS `generar_notificaciones_envio` */;;
DELIMITER ;;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;;
/*!50003 SET character_set_client  = utf8mb4 */ ;;
/*!50003 SET character_set_results = utf8mb4 */ ;;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;;
/*!50003 SET @saved_time_zone      = @@time_zone */ ;;
/*!50003 SET time_zone             = 'SYSTEM' */ ;;
/*!50106 CREATE*/ /*!50117 DEFINER=`root`@`localhost`*/ /*!50106 EVENT `generar_notificaciones_envio` ON SCHEDULE EVERY 1 DAY STARTS '2025-05-26 00:00:00' ON COMPLETION NOT PRESERVE ENABLE DO INSERT INTO notificacion (tipo, titulo, mensaje, fecha_creacion, estado, id_usuario)
  SELECT
    'Informacion',
    CONCAT('Notificación de Certificación - ', u.nombre, ' ', u.apellido),
    CONCAT(
      'Se informa que todos los documentos han sido enviados para certificación. ',
      'Los aprendices que no hayan subido o hayan subido parcialmente sus documentos ',
      'pueden no haber sido incluidos en el envío.'
    ),
    CURDATE(),
    'NoLeida',
    u.id_usuario
  FROM ficha f
  JOIN ficha_aprendiz fa ON fa.id_ficha = f.id_ficha
  JOIN usuario u ON u.id_usuario = fa.id_usuario
  WHERE f.fecha_notificacion_envio = CURDATE() */ ;;
/*!50003 SET time_zone             = @saved_time_zone */ ;;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;;
/*!50003 SET character_set_client  = @saved_cs_client */ ;;
/*!50003 SET character_set_results = @saved_cs_results */ ;;
/*!50003 SET collation_connection  = @saved_col_connection */ ;;
DELIMITER ;
/*!50106 SET TIME_ZONE= @save_time_zone */ ;

--
-- Dumping routines for database 'sistema_seguimiento'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-25 17:24:44
