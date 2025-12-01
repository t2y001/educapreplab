-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: educa_prep_lab
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Table structure for table `areas`
--

DROP TABLE IF EXISTS `areas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `areas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `audiencia_id` int NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `slug` varchar(150) NOT NULL,
  `descripcion` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `audiencia_id` (`audiencia_id`,`slug`),
  UNIQUE KEY `areas_audiencia_slug_unique` (`audiencia_id`,`slug`),
  CONSTRAINT `areas_ibfk_1` FOREIGN KEY (`audiencia_id`) REFERENCES `audiencias` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `areas`
--

LOCK TABLES `areas` WRITE;
/*!40000 ALTER TABLE `areas` DISABLE KEYS */;
INSERT INTO `areas` VALUES (1,1,'Ciencia y Tecnología','ciencia-y-tecnologia','Casuísticas basadas en el temario del examen de ascenso 2025 de: EBR Nivel Secundaria Ciencia y Tecnología.','2025-10-06 19:20:11',NULL),(2,1,'Matemática','matematica','Casuísticas basadas en el temario del examen de ascenso 2025 de: EBR Nivel Secundaria Matemática.','2025-10-06 19:20:11',NULL);
/*!40000 ALTER TABLE `areas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audiencias`
--

DROP TABLE IF EXISTS `audiencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audiencias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audiencias`
--

LOCK TABLES `audiencias` WRITE;
/*!40000 ALTER TABLE `audiencias` DISABLE KEYS */;
INSERT INTO `audiencias` VALUES (1,'Docentes MINEDU','Docentes que postulan a exámenes de ascenso o nombramiento del MINEDU'),(2,'Estudiantes IB','Estudiantes que se encuentran en el programa de diploma del Bachillerato Internacional'),(3,'Preuniversitarios','Estudiantes que se preparan para ingresar a la universidad');
/*!40000 ALTER TABLE `audiencias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
INSERT INTO `cache` VALUES ('laravel-cache-1b6453892473a467d07372d45eb05abc2031647a','i:1;',1761459950),('laravel-cache-1b6453892473a467d07372d45eb05abc2031647a:timer','i:1761459950;',1761459950),('laravel-cache-356a192b7913b04c54574d18c28d46e6395428ab','i:1;',1761460933),('laravel-cache-356a192b7913b04c54574d18c28d46e6395428ab:timer','i:1761460933;',1761460933),('laravel-cache-77de68daecd823babbb58edb1c8e14d7106e83bb','i:1;',1761458579),('laravel-cache-77de68daecd823babbb58edb1c8e14d7106e83bb:timer','i:1761458579;',1761458579),('laravel-cache-ac3478d69a3c81fa62e60f5c3696165a4e5e6ac4','i:2;',1761462701),('laravel-cache-ac3478d69a3c81fa62e60f5c3696165a4e5e6ac4:timer','i:1761462701;',1761462701),('laravel-cache-c1dfd96eea8cc2b62785275bca38ac261256e278','i:1;',1761806700),('laravel-cache-c1dfd96eea8cc2b62785275bca38ac261256e278:timer','i:1761806700;',1761806700),('laravel-cache-da4b9237bacccdf19c0760cab7aec4a8359010b0','i:1;',1761458354),('laravel-cache-da4b9237bacccdf19c0760cab7aec4a8359010b0:timer','i:1761458354;',1761458354);
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `choices`
--

DROP TABLE IF EXISTS `choices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `choices` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `item_id` bigint unsigned NOT NULL,
  `label` enum('A','B','C') NOT NULL,
  `content_json` json NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `choices_item_label_unique` (`item_id`,`label`),
  KEY `item_id` (`item_id`),
  CONSTRAINT `choices_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `choices`
--

LOCK TABLES `choices` WRITE;
/*!40000 ALTER TABLE `choices` DISABLE KEYS */;
INSERT INTO `choices` VALUES (1,1,'A','[{\"data\": {\"text\": \"Una persona descendiendo en un ascensor.\"}, \"type\": \"paragraph\"}]','2025-10-11 20:06:06','2025-10-11 20:06:06'),(2,1,'B','[{\"data\": {\"text\": \"La Luna mientras da vuelta alrededor de la Tierra.\"}, \"type\": \"paragraph\"}]','2025-10-11 20:06:06','2025-10-11 20:06:06'),(3,1,'C','[{\"data\": {\"text\": \"Una pelota tras ser lanzada hacia arriba, pero solo mientras baja.\"}, \"type\": \"paragraph\"}]','2025-10-11 20:06:06','2025-10-11 20:06:06'),(4,2,'A','[{\"data\": {\"text\": \"La fuerza presenta la misma dirección y sentido del movimiento de la Luna.\"}, \"type\": \"paragraph\"}]','2025-10-11 20:06:06','2025-10-11 20:06:06'),(5,2,'B','[{\"data\": {\"text\": \"La fuerza presenta una dirección perpendicular a la del movimiento de la Luna.\"}, \"type\": \"paragraph\"}]','2025-10-11 20:06:06','2025-10-11 20:06:06'),(6,2,'C','[{\"data\": {\"text\": \"La fuerza presenta la misma dirección pero en sentido opuesto al sentido del movimiento de la Luna.\"}, \"type\": \"paragraph\"}]','2025-10-11 20:06:06','2025-10-11 20:06:06'),(7,3,'A','[{\"data\": {\"text\": \"La Tierra realiza un trabajo positivo sobre la Luna y, por ende, aumenta su energía cinética.\"}, \"type\": \"paragraph\"}]','2025-10-11 20:06:06','2025-10-11 20:06:06'),(8,3,'B','[{\"data\": {\"text\": \"La Tierra realiza un trabajo negativo sobre la Luna y, por ende, disminuye su energía cinética.\"}, \"type\": \"paragraph\"}]','2025-10-11 20:06:06','2025-10-11 20:06:06'),(9,3,'C','[{\"data\": {\"text\": \"La Tierra ejerce una fuerza sobre la Luna, pero no realiza trabajo sobre esta, por tanto, no le da ni le quita energía cinética.\"}, \"type\": \"paragraph\"}]','2025-10-11 20:06:06','2025-10-11 20:06:06'),(10,4,'A','[{\"data\": {\"text\": \"La magnitud del peso de un cuerpo es siempre la misma.\"}, \"type\": \"paragraph\"}]','2025-10-11 20:06:06','2025-10-11 20:06:06'),(11,4,'B','[{\"data\": {\"text\": \"La magnitud del peso de un cuerpo es nula en el punto más alto de su trayectoria tras ser lanzado hacia arriba.\"}, \"type\": \"paragraph\"}]','2025-10-11 20:06:06','2025-10-11 20:06:06'),(12,4,'C','[{\"data\": {\"text\": \"La magnitud del peso de un cuerpo que es soltado a 10 metros del suelo aumenta cuando este desciende y gana rapidez.\"}, \"type\": \"paragraph\"}]','2025-10-11 20:06:06','2025-10-11 20:06:06'),(13,5,'A','[{\"data\": {\"text\": \"Iría alejándose cada vez más del punto donde se situaba la Tierra, girando con un radio cada vez mayor, es decir, una trayectoria espiral.\"}, \"type\": \"paragraph\"}]','2025-10-11 20:06:06','2025-10-11 20:06:06'),(14,5,'B','[{\"data\": {\"text\": \"Realizaría un movimiento parabólico, de acuerdo con las condiciones iniciales de movimiento al momento de ya no estar la Tierra.\"}, \"type\": \"paragraph\"}]','2025-10-11 20:06:06','2025-10-11 20:06:06'),(15,5,'C','[{\"data\": {\"text\": \"Avanzaría en línea recta respecto del punto donde se situaba la Tierra.\"}, \"type\": \"paragraph\"}]','2025-10-11 20:06:06','2025-10-11 20:06:06');
/*!40000 ALTER TABLE `choices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cursos`
--

DROP TABLE IF EXISTS `cursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cursos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `area_id` int NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `slug` varchar(150) NOT NULL,
  `descripcion` text,
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `area_id` (`area_id`,`slug`),
  CONSTRAINT `cursos_ibfk_1` FOREIGN KEY (`area_id`) REFERENCES `areas` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cursos`
--

LOCK TABLES `cursos` WRITE;
/*!40000 ALTER TABLE `cursos` DISABLE KEYS */;
/*!40000 ALTER TABLE `cursos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ejes_tematicos`
--

DROP TABLE IF EXISTS `ejes_tematicos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ejes_tematicos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tema_id` int NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `nombre_corto` varchar(150) DEFAULT NULL,
  `slug` varchar(150) NOT NULL,
  `descripcion` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tema_id` (`tema_id`,`slug`),
  CONSTRAINT `ejes_tematicos_ibfk_1` FOREIGN KEY (`tema_id`) REFERENCES `temas` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ejes_tematicos`
--

LOCK TABLES `ejes_tematicos` WRITE;
/*!40000 ALTER TABLE `ejes_tematicos` DISABLE KEYS */;
INSERT INTO `ejes_tematicos` VALUES (1,3,'Mecanismos de los seres vivos','Seres vivos','mecanismos-de-los-seres-vivos',NULL),(2,3,'Materia y energía','Materia y energía','materia-y-energia',NULL),(3,3,'Biodiversidad, Tierra y Universo','Biodiversidad, Tierra y Universo','biodiversidad-tierra-y-universo',NULL);
/*!40000 ALTER TABLE `ejes_tematicos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estadisticas_problemas`
--

DROP TABLE IF EXISTS `estadisticas_problemas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estadisticas_problemas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `area_id` int DEFAULT NULL,
  `curso_id` int DEFAULT NULL,
  `total_problemas` int DEFAULT '0',
  `ultima_actualizacion` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `area_id` (`area_id`,`curso_id`),
  KEY `curso_id` (`curso_id`),
  CONSTRAINT `estadisticas_problemas_ibfk_1` FOREIGN KEY (`area_id`) REFERENCES `areas` (`id`),
  CONSTRAINT `estadisticas_problemas_ibfk_2` FOREIGN KEY (`curso_id`) REFERENCES `cursos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estadisticas_problemas`
--

LOCK TABLES `estadisticas_problemas` WRITE;
/*!40000 ALTER TABLE `estadisticas_problemas` DISABLE KEYS */;
INSERT INTO `estadisticas_problemas` VALUES (1,1,NULL,5,'2025-10-06 16:29:45');
/*!40000 ALTER TABLE `estadisticas_problemas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exam_block_items`
--

DROP TABLE IF EXISTS `exam_block_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_block_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `exam_block_id` bigint unsigned NOT NULL,
  `item_id` bigint unsigned NOT NULL,
  `position` smallint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `exam_block_item_unique` (`exam_block_id`,`item_id`),
  UNIQUE KEY `exam_block_item_order_unique` (`exam_block_id`,`position`),
  KEY `item_id` (`item_id`),
  CONSTRAINT `exam_block_items_ibfk_1` FOREIGN KEY (`exam_block_id`) REFERENCES `exam_blocks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `exam_block_items_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam_block_items`
--

LOCK TABLES `exam_block_items` WRITE;
/*!40000 ALTER TABLE `exam_block_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `exam_block_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exam_blocks`
--

DROP TABLE IF EXISTS `exam_blocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_blocks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `exam_id` bigint unsigned NOT NULL,
  `position` smallint unsigned NOT NULL,
  `stimulus_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `exam_block_order_unique` (`exam_id`,`position`),
  KEY `stimulus_id` (`stimulus_id`),
  CONSTRAINT `exam_blocks_ibfk_1` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`) ON DELETE CASCADE,
  CONSTRAINT `exam_blocks_ibfk_2` FOREIGN KEY (`stimulus_id`) REFERENCES `stimuli` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam_blocks`
--

LOCK TABLES `exam_blocks` WRITE;
/*!40000 ALTER TABLE `exam_blocks` DISABLE KEYS */;
/*!40000 ALTER TABLE `exam_blocks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exams`
--

DROP TABLE IF EXISTS `exams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exams` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text,
  `visibility` enum('public','subscribers','private') NOT NULL DEFAULT 'subscribers',
  `status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
  `created_by` bigint unsigned DEFAULT NULL,
  `published_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `visibility` (`visibility`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exams`
--

LOCK TABLES `exams` WRITE;
/*!40000 ALTER TABLE `exams` DISABLE KEYS */;
/*!40000 ALTER TABLE `exams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inquiries`
--

DROP TABLE IF EXISTS `inquiries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inquiries` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `area_id` int DEFAULT NULL,
  `tema_id` int DEFAULT NULL,
  `subtema_id` int DEFAULT NULL,
  `status` enum('draft','published') NOT NULL DEFAULT 'draft',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `area_id` (`area_id`),
  KEY `tema_id` (`tema_id`),
  KEY `subtema_id` (`subtema_id`),
  CONSTRAINT `inquiries_ibfk_1` FOREIGN KEY (`area_id`) REFERENCES `areas` (`id`) ON DELETE SET NULL,
  CONSTRAINT `inquiries_ibfk_2` FOREIGN KEY (`tema_id`) REFERENCES `temas` (`id`) ON DELETE SET NULL,
  CONSTRAINT `inquiries_ibfk_3` FOREIGN KEY (`subtema_id`) REFERENCES `subtemas` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inquiries`
--

LOCK TABLES `inquiries` WRITE;
/*!40000 ALTER TABLE `inquiries` DISABLE KEYS */;
/*!40000 ALTER TABLE `inquiries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inquiry_options`
--

DROP TABLE IF EXISTS `inquiry_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inquiry_options` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `inquiry_step_id` bigint unsigned NOT NULL,
  `option_label` varchar(10) DEFAULT NULL,
  `option_text` text NOT NULL,
  `is_correct` tinyint(1) NOT NULL DEFAULT '0',
  `feedback` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `inquiry_step_id` (`inquiry_step_id`),
  CONSTRAINT `inquiry_options_ibfk_1` FOREIGN KEY (`inquiry_step_id`) REFERENCES `inquiry_steps` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inquiry_options`
--

LOCK TABLES `inquiry_options` WRITE;
/*!40000 ALTER TABLE `inquiry_options` DISABLE KEYS */;
/*!40000 ALTER TABLE `inquiry_options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inquiry_steps`
--

DROP TABLE IF EXISTS `inquiry_steps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inquiry_steps` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `inquiry_id` bigint unsigned NOT NULL,
  `order` smallint unsigned NOT NULL,
  `step_text` text NOT NULL,
  `step_type` enum('multiple_choice','open_ended','simulation_result','conclusion') NOT NULL,
  `ai_prompt` text,
  `simulation_data` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `inquiry_order_unique` (`inquiry_id`,`order`),
  CONSTRAINT `inquiry_steps_ibfk_1` FOREIGN KEY (`inquiry_id`) REFERENCES `inquiries` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inquiry_steps`
--

LOCK TABLES `inquiry_steps` WRITE;
/*!40000 ALTER TABLE `inquiry_steps` DISABLE KEYS */;
/*!40000 ALTER TABLE `inquiry_steps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inquiry_user_history`
--

DROP TABLE IF EXISTS `inquiry_user_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inquiry_user_history` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `inquiry_step_id` bigint unsigned NOT NULL,
  `selected_option_id` bigint unsigned DEFAULT NULL,
  `open_answer_text` text,
  `ai_feedback_text` text,
  `is_correct` tinyint(1) DEFAULT NULL,
  `answered_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `inquiry_step_id` (`inquiry_step_id`),
  KEY `selected_option_id` (`selected_option_id`),
  CONSTRAINT `inquiry_user_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `inquiry_user_history_ibfk_2` FOREIGN KEY (`inquiry_step_id`) REFERENCES `inquiry_steps` (`id`) ON DELETE CASCADE,
  CONSTRAINT `inquiry_user_history_ibfk_3` FOREIGN KEY (`selected_option_id`) REFERENCES `inquiry_options` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inquiry_user_history`
--

LOCK TABLES `inquiry_user_history` WRITE;
/*!40000 ALTER TABLE `inquiry_user_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `inquiry_user_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_contents`
--

DROP TABLE IF EXISTS `item_contents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_contents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `item_id` bigint unsigned NOT NULL,
  `content_json` json NOT NULL,
  `version` smallint unsigned NOT NULL DEFAULT '1',
  `is_current` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `item_id` (`item_id`,`is_current`),
  CONSTRAINT `item_contents_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_contents`
--

LOCK TABLES `item_contents` WRITE;
/*!40000 ALTER TABLE `item_contents` DISABLE KEYS */;
INSERT INTO `item_contents` VALUES (1,1,'[{\"data\": {\"text\": \"Un cuerpo se encuentra en “caída libre” cuando la única fuerza actuando sobre dicho cuerpo es la fuerza gravitatoria. ¿Cuál de los siguientes cuerpos se encuentra en caída libre?\"}, \"type\": \"paragraph\"}]',1,1,'2025-10-11 20:06:06'),(2,2,'[{\"data\": {\"text\": \"El centro de masa de la Luna da una vuelta completa, es decir, realiza una trayectoria casi circular, alrededor de la Tierra cada 28 días. Este centro de masa se traslada con rapidez constante. ¿Cómo es la fuerza que ejerce la Tierra sobre la Luna?\"}, \"type\": \"paragraph\"}]',1,1,'2025-10-11 20:06:06'),(3,3,'[{\"data\": {\"text\": \"¿Cómo afecta la Tierra a la energía cinética de la Luna?\"}, \"type\": \"paragraph\"}]',1,1,'2025-10-11 20:06:06'),(4,4,'[{\"data\": {\"html\": \"Respecto de la magnitud del peso de un cuerpo <strong>cerca de la superficie de la Tierra</strong>, ¿cuál de las siguientes afirmaciones es <strong><u>correcta</u></strong>?\"}, \"type\": \"html\"}]',1,1,'2025-10-11 20:06:06'),(5,5,'[{\"data\": {\"text\": \"¿Qué sucedería con la Luna si, repentinamente, no existiera la Tierra?\"}, \"type\": \"paragraph\"}]',1,1,'2025-10-11 20:06:06');
/*!40000 ALTER TABLE `item_contents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_solutions`
--

DROP TABLE IF EXISTS `item_solutions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_solutions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `item_id` bigint unsigned NOT NULL,
  `explanation_json` json NOT NULL,
  `misconception_json` json DEFAULT NULL,
  `visibility` enum('inherit','public','subscribers','private') NOT NULL DEFAULT 'inherit',
  `created_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `item_solution_unique` (`item_id`),
  CONSTRAINT `item_solutions_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_solutions`
--

LOCK TABLES `item_solutions` WRITE;
/*!40000 ALTER TABLE `item_solutions` DISABLE KEYS */;
INSERT INTO `item_solutions` VALUES (1,1,'[{\"data\": {\"text\": \"La Luna está en caída libre porque la única fuerza que actúa sobre ella es la gravitatoria terrestre. Aunque describe una órbita circular, su aceleración es centrípeta, proveniente exclusivamente de la fuerza gravitacional, cumpliendo la definición de caída libre. El ascensor (a) experimenta fuerzas adicionales (tensión del cable), y la pelota (c) tiene resistencia del aire en la subida y bajada.\"}, \"type\": \"paragraph\"}]','[{\"data\": {\"text\": \"Creer que \'caída libre\' solo aplica a movimientos rectilíneos hacia la Tierra (como la manzana), ignorando que órbitas circulares son casos de caída libre con trayectoria curva.\"}, \"type\": \"paragraph\"}]','inherit',NULL,'2025-10-11 20:06:06','2025-10-11 20:06:06'),(2,2,'[{\"data\": {\"text\": \"La fuerza gravitatoria es centrípeta: perpendicular al movimiento orbital de la Luna. En un movimiento circular uniforme, la fuerza apunta hacia el centro de la trayectoria (Tierra), formando 90° con la velocidad tangencial.\"}, \"type\": \"paragraph\"}]','[{\"data\": {\"text\": \"Pensar que la fuerza sigue la dirección del movimiento (a) o se opone a él (c), confundiendo gravitación con fuerzas disipativas como la fricción.\"}, \"type\": \"paragraph\"}]','inherit',NULL,'2025-10-11 20:06:06','2025-10-11 20:06:06'),(3,3,'[{\"data\": {\"text\": \"La fuerza gravitatoria es centrípeta y perpendicular al desplazamiento orbital, por lo que el trabajo es cero. Por tanto, la energía cinética de la Luna no cambia.\"}, \"type\": \"paragraph\"}]','[{\"data\": {\"text\": \"Creer que cualquier fuerza realiza trabajo (a o b), sin considerar la perpendicularidad entre fuerza y desplazamiento en órbitas circulares.\"}, \"type\": \"paragraph\"}]','inherit',NULL,'2025-10-11 20:06:06','2025-10-11 20:06:06'),(4,4,'[{\"data\": {\"text\": \"Cerca de la superficie terrestre, la gravedad prácticamente no cambia, por lo tanto el peso será el mismo y no depende del estado de movimiento del cuerpo.\"}, \"type\": \"paragraph\"}]','[{\"data\": {\"text\": \"Confundir peso con sensación de peso (ej: pensar que en caída libre el peso \'desaparece\' o que aumenta con la velocidad).\"}, \"type\": \"paragraph\"}]','inherit',NULL,'2025-10-11 20:06:06','2025-10-11 20:06:06'),(5,5,'[{\"data\": {\"text\": \"Por la primera ley de Newton, si la fuerza gravitatoria desaparece, la Luna seguiría moviéndose en línea recta con la velocidad tangencial que tenía en el instante de desaparición de la Tierra.\"}, \"type\": \"paragraph\"}]','[{\"data\": {\"text\": \"Creer que la Luna se alejaría en espiral (a) por inercia o que caería en parábola (b), ignorando que sin fuerza neta el movimiento es rectilíneo uniforme.\"}, \"type\": \"paragraph\"}]','inherit',NULL,'2025-10-11 20:06:06','2025-10-11 20:06:06');
/*!40000 ALTER TABLE `item_solutions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `stimulus_id` bigint unsigned DEFAULT NULL,
  `area_id` bigint unsigned DEFAULT NULL,
  `tema_id` bigint unsigned DEFAULT NULL,
  `eje_id` bigint unsigned DEFAULT NULL,
  `subtema_id` bigint unsigned DEFAULT NULL,
  `difficulty` enum('easy','medium','hard') DEFAULT NULL,
  `time_estimate_sec` smallint unsigned DEFAULT NULL,
  `answer_key` enum('A','B','C') NOT NULL,
  `visibility` enum('public','subscribers','private') NOT NULL DEFAULT 'public',
  `status` enum('draft','review','published','archived') NOT NULL DEFAULT 'draft',
  `source` varchar(191) NOT NULL,
  `origin` enum('human','ai') NOT NULL DEFAULT 'human',
  `author` varchar(150) DEFAULT NULL,
  `ai_model` varchar(100) DEFAULT NULL,
  `parent_item_id` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `published_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_items_source` (`source`),
  KEY `parent_item_id` (`parent_item_id`),
  KEY `stimulus_id` (`stimulus_id`),
  KEY `tema_id` (`tema_id`,`eje_id`,`subtema_id`),
  KEY `status` (`status`),
  KEY `visibility` (`visibility`),
  CONSTRAINT `items_ibfk_1` FOREIGN KEY (`stimulus_id`) REFERENCES `stimuli` (`id`) ON DELETE SET NULL,
  CONSTRAINT `items_ibfk_2` FOREIGN KEY (`parent_item_id`) REFERENCES `items` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` VALUES (1,3,1,3,2,53,'easy',NULL,'B','public','published','cyt-minedu-t00084_q01','human','minedu: Ascenso 2024',NULL,NULL,NULL,NULL,'2025-10-11 15:06:06','2025-10-11 20:06:06','2025-10-11 20:06:06'),(2,3,1,3,2,53,'easy',NULL,'B','public','published','cyt-minedu-t00084_q02','human','minedu: Ascenso 2024',NULL,NULL,NULL,NULL,'2025-10-11 15:06:06','2025-10-11 20:06:06','2025-10-11 20:06:06'),(3,3,1,3,2,54,'easy',NULL,'C','public','published','cyt-minedu-t00084_q03','human','minedu: Ascenso 2024',NULL,NULL,NULL,NULL,'2025-10-11 15:06:06','2025-10-11 20:06:06','2025-10-11 20:06:06'),(4,3,1,3,2,53,'easy',NULL,'A','public','published','cyt-minedu-t00084_q04','human','minedu: Ascenso 2024',NULL,NULL,NULL,NULL,'2025-10-11 15:06:06','2025-10-11 20:06:06','2025-10-11 20:06:06'),(5,3,1,3,2,53,'easy',NULL,'C','public','published','cyt-minedu-t00084_q05','human','minedu: Ascenso 2024',NULL,NULL,NULL,NULL,'2025-10-11 15:06:06','2025-10-11 20:06:06','2025-10-11 20:06:06');
/*!40000 ALTER TABLE `items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2025_10_07_052341_create_areas_table',2),(5,'2025_10_07_053214_create_audiences_table',2),(6,'2025_10_08_000000_drop_usuario_tables',2),(7,'2025_10_08_000010_areas_timestamps_unique',2),(8,'2025_10_08_000011_temas_timestamps',2);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plans`
--

DROP TABLE IF EXISTS `plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plans` (
  `id` tinyint unsigned NOT NULL,
  `name` varchar(50) NOT NULL,
  `audiencia_id` int DEFAULT NULL,
  `monthly_simulacros_limit` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_plans_audiencia` (`audiencia_id`),
  CONSTRAINT `fk_plans_audiencia` FOREIGN KEY (`audiencia_id`) REFERENCES `audiencias` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plans`
--

LOCK TABLES `plans` WRITE;
/*!40000 ALTER TABLE `plans` DISABLE KEYS */;
INSERT INTO `plans` VALUES (1,'Plan inicial',NULL,2),(2,'Plan experto',NULL,NULL);
/*!40000 ALTER TABLE `plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_user`
--

DROP TABLE IF EXISTS `role_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_user` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `role_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_user` (`user_id`,`role_id`),
  KEY `fk_role_user_role` (`role_id`),
  CONSTRAINT `fk_role_user_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_role_user_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_user`
--

LOCK TABLES `role_user` WRITE;
/*!40000 ALTER TABLE `role_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `role_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_roles_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('3shvT525MQpcHLzr0I9mhIIqUEeqaHH4rv3pQt3c',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36','YToyOntzOjY6Il90b2tlbiI7czo0MDoiWkx1YnlNRzUyS2VWWlNSVXpjR1Vnb0VBQmZBMW96VXJWN2RVTnE0VyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1764421578),('KbwE4CVgafKuOGQOteKwHxWh8ru0pdaRVqg2NSLD',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36','YToyOntzOjY6Il90b2tlbiI7czo0MDoialdDV21nZUpkZ240elJnaUZIdDcyZlpYRXQ4eVZwNUVqWlk2MjE4aiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1764435826);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stimuli`
--

DROP TABLE IF EXISTS `stimuli`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stimuli` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) DEFAULT NULL,
  `area_id` bigint unsigned DEFAULT NULL,
  `tema_id` bigint unsigned DEFAULT NULL,
  `eje_id` bigint unsigned DEFAULT NULL,
  `subtema_id` bigint unsigned DEFAULT NULL,
  `visibility` enum('public','subscribers','private') NOT NULL DEFAULT 'public',
  `status` enum('draft','review','published','archived') NOT NULL DEFAULT 'draft',
  `source` varchar(255) DEFAULT NULL,
  `origin` enum('human','ai') NOT NULL DEFAULT 'human',
  `author` varchar(150) DEFAULT NULL,
  `ai_model` varchar(100) DEFAULT NULL,
  `tags` json DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `published_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_stimuli_source` (`source`),
  KEY `tema_id` (`tema_id`,`eje_id`,`subtema_id`),
  KEY `status` (`status`),
  KEY `visibility` (`visibility`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stimuli`
--

LOCK TABLES `stimuli` WRITE;
/*!40000 ALTER TABLE `stimuli` DISABLE KEYS */;
INSERT INTO `stimuli` VALUES (3,'cyt-minedu-t00084',1,NULL,NULL,NULL,'public','published','cyt-minedu-t00084','human','minedu: Ascenso 2024',NULL,NULL,NULL,NULL,'2025-10-11 15:06:06','2025-10-11 20:06:06','2025-10-11 20:06:06');
/*!40000 ALTER TABLE `stimuli` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stimulus_contents`
--

DROP TABLE IF EXISTS `stimulus_contents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stimulus_contents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `stimulus_id` bigint unsigned NOT NULL,
  `content_json` json NOT NULL,
  `version` smallint unsigned NOT NULL DEFAULT '1',
  `is_current` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `stimulus_id` (`stimulus_id`,`is_current`),
  CONSTRAINT `stimulus_contents_ibfk_1` FOREIGN KEY (`stimulus_id`) REFERENCES `stimuli` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stimulus_contents`
--

LOCK TABLES `stimulus_contents` WRITE;
/*!40000 ALTER TABLE `stimulus_contents` DISABLE KEYS */;
INSERT INTO `stimulus_contents` VALUES (3,3,'[{\"data\": {\"blocks\": [{\"data\": {\"text\": \"Se dice que Newton vio caer una manzana de un árbol y relacionó este hecho con el movimiento de la Luna alrededor de la Tierra y el de los planetas alrededor del Sol. A partir de esta relación, Newton propuso que la fuerza con que la Tierra “jalaba” a la manzana era la misma fuerza con que la Tierra “jalaba” a la Luna, y denominó a esta fuerza como la “fuerza gravitatoria”.\", \"shaded\": false}, \"type\": \"paragraph\"}, {\"data\": {\"html\": \"<strong>Para responder a las siguientes preguntas:</strong>\"}, \"type\": \"html\"}, {\"data\": {\"items\": [\"Considerar el centro de masa de la Tierra como si estuviera en reposo.\", \"No considerar efectos del aire en la superficie de la Tierra.\", \"No considerar influencias de otros cuerpos (Sol, planetas, asteroides, etc.) sobre la Tierra y la Luna.\"], \"style\": \"bulleted\"}, \"type\": \"list\"}], \"variant\": \"muted\"}, \"type\": \"callout\"}]',1,1,'2025-10-11 20:06:06');
/*!40000 ALTER TABLE `stimulus_contents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subtemas`
--

DROP TABLE IF EXISTS `subtemas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subtemas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tema_id` int NOT NULL,
  `eje_id` int DEFAULT NULL,
  `nombre` varchar(250) NOT NULL,
  `nombre_corto` varchar(150) DEFAULT NULL,
  `slug` varchar(250) NOT NULL,
  `descripcion` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tema_id` (`tema_id`,`slug`),
  KEY `eje_id` (`eje_id`),
  CONSTRAINT `subtemas_ibfk_1` FOREIGN KEY (`tema_id`) REFERENCES `temas` (`id`),
  CONSTRAINT `subtemas_ibfk_2` FOREIGN KEY (`eje_id`) REFERENCES `ejes_tematicos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subtemas`
--

LOCK TABLES `subtemas` WRITE;
/*!40000 ALTER TABLE `subtemas` DISABLE KEYS */;
INSERT INTO `subtemas` VALUES (1,1,NULL,'Principios de la educación peruana','Principios de la educación','principios-de-la-educacion-peruana',NULL),(2,1,NULL,'Constructivismo y socioconstructivismo','(Socio)constructivismo','constructivismo-y-socioconstructivismo',NULL),(3,1,NULL,'Enfoque por competencias en el Currículo Nacional de la Educación Básica','Competencias en el CNEB','enfoque-por-competencias-en-el-curriculo-nacional-de-la-educacion-basica',NULL),(4,1,NULL,'Enfoques del área','Enfoques del área','enfoques-del-area',NULL),(5,1,NULL,'Enfoques transversales en el Currículo Nacional de la Educación Básica','Enfoques transversales (CNEB)','enfoques-transversales-en-el-curriculo-nacional-de-la-educacion-basica',NULL),(6,1,NULL,'Aprendizajes significativos','Aprendizaje significativo','aprendizajes-significativos',NULL),(7,1,NULL,'Planificación pedagógica','Planificación pedagógica','planificacion-pedagogica',NULL),(8,1,NULL,'Activación y recojo de saberes previos','Saberes previos','activacion-y-recojo-de-saberes-previos',NULL),(9,1,NULL,'Conflicto o disonancia cognitiva','Disonancia cognitiva','conflicto-o-disonancia-cognitiva',NULL),(10,1,NULL,'Demanda cognitiva','Demanda cognitiva','demanda-cognitiva',NULL),(11,1,NULL,'Evaluación y retroalimentación','Evaluación y retroalimentación','evaluacion-y-retroalimentacion',NULL),(12,1,NULL,'Gestión de los aprendizajes','Gestión del aprendizaje','gestion-de-los-aprendizajes',NULL),(13,1,NULL,'Procesos auxiliares del aprendizaje','Procesos auxiliares','procesos-auxiliares-del-aprendizaje',NULL),(14,1,NULL,'Convivencia democrática y clima de aula','Convivencia y clima de aula','convivencia-democratica-y-clima-de-aula',NULL),(15,1,NULL,'Uso de las TIC para el aprendizaje','TIC para el aprendizaje','uso-de-las-tic-para-el-aprendizaje',NULL),(16,1,NULL,'Trabajo colaborativo','Trabajo colaborativo','trabajo-colaborativo',NULL),(17,1,NULL,'Características y desarrollo del estudiante en relación a su aprendizaje','Desarrollo del estudiante','caracteristicas-y-desarrollo-del-estudiante-en-relacion-a-su-aprendizaje',NULL),(18,2,NULL,'Características de la ciencia y el conocimiento científico','Ciencia y conocimiento','caracteristicas-de-la-ciencia-y-el-conocimiento-cientifico',NULL),(19,2,NULL,'La indagación científica y sus características. Ética en la indagación','Indagación y ética','indagacion-cientifica-y-etica',NULL),(20,2,NULL,'Delimitación de situaciones problemáticas pertinentes para desarrollar una indagación','Delimitación del problema','delimitacion-del-problema-de-indagacion',NULL),(21,2,NULL,'Identificación de variables. Relación entre las variables de indagación','Variables y relaciones','identificacion-de-variables-y-relaciones-de-indagacion',NULL),(22,2,NULL,'Identificación de fuentes confiables de información científica','Fuentes confiables','identificacion-de-fuentes-confiables-de-informacion-cientifica',NULL),(23,2,NULL,'Formulación de hipótesis e identificación de evidencia que la sustente','Hipótesis y evidencia','formulacion-de-hipotesis-e-identificacion-de-evidencia',NULL),(24,2,NULL,'Diseño de estrategias de indagación. Procedimientos para probar hipótesis. Grupos experimentales, control y ensayos científicos','Diseño y prueba de hipótesis','diseno-y-prueba-de-hipotesis-indagacion',NULL),(25,2,NULL,'Identificación de materiales e instrumentos para la indagación. Medidas de seguridad. Ajustes en la propuesta','Materiales y seguridad','materiales-seguridad-y-ajustes-en-indagacion',NULL),(26,2,NULL,'Registro de datos. Minimización de la incertidumbre. Identificación de fuentes de error','Datos, incertidumbre y errores','registro-de-datos-incertidumbre-y-fuentes-de-error',NULL),(27,2,NULL,'Concepto de medida. Manejo y conversión de unidades','Medida y unidades','concepto-de-medida-manejo-y-conversion-de-unidades',NULL),(28,2,NULL,'Resultados de indagación. Representación e interpretación de datos (tablas, gráficos, diagramas, esquemas)','Resultados y análisis de datos','resultados-de-indagacion-representacion-e-analisis-de-datos',NULL),(29,2,NULL,'Identificación y elaboración de conclusiones coherentes con la evidencia científica','Conclusiones con evidencia','conclusiones-coherentes-con-evidencia-cientifica',NULL),(30,2,NULL,'Identificación de los alcances y limitaciones de una indagación','Alcances y limitaciones','alcances-y-limitaciones-de-una-indagacion',NULL),(31,3,1,'Niveles de organización y clasificación de los seres vivos. La diversidad y características de procariontes y virus, protistas, plantas, hongos, animales','Niveles y clasificación','niveles-clasificacion-seres-vivos-y-diversidad',NULL),(32,3,1,'Funciones de los seres vivos: nutrición, reproducción y relación. Sistemas involucrados. Homeostasis. Salud, alimentación balanceada y enfermedad','Funciones y homeostasis','funciones-de-los-seres-vivos-homeostasis-salud',NULL),(33,3,1,'Química de los seres vivos: elementos necesarios para la vida. Función y características estructurales de biomoléculas orgánicas: carbohidratos, lípidos, proteínas y ácidos nucleicos (ADN y ARN). Identificación de biomoléculas en los alimentos','Química y biomoléculas','quimica-de-los-seres-vivos-biomoleculas',NULL),(34,3,1,'Distinción de células procariota y eucariota. La célula eucariota: organización, estructura y función especializada de distintos tipos de célula. Mecanismos de intercambio entre célula y ambiente','Células y transporte','celulas-procariotas-y-eucariotas-organizacion-y-transporte',NULL),(35,3,1,'Metabolismo celular: respiración (glicólisis y fermentación, respiración aeróbica). Fotosíntesis (estructura de los sistemas fotosintéticos, pigmentos fotosintéticos, reacciones luminosas)','Metabolismo y fotosíntesis','metabolismo-celular-respiracion-y-fotosintesis',NULL),(36,3,1,'Fases del ciclo celular, incluyendo etapas de la mitosis','Ciclo celular y mitosis','ciclo-celular-y-mitosis',NULL),(37,3,1,'Reproducción sexual: comportamiento cromosómico durante la meiosis y su función (gametogénesis y variabilidad del material genético). Alteraciones genéticas','Meiosis y genética','meiosis-gametogenesis-y-alteraciones-geneticas',NULL),(38,3,1,'Mutación y su efecto en las proteínas y las posibles alteraciones asociadas','Mutaciones y proteínas','mutacion-efecto-en-proteinas-y-alteraciones',NULL),(39,3,1,'Etapas del flujo de información genética, desde el gen hasta la proteína','Flujo de información genética','flujo-de-informacion-genetica-del-gen-a-la-proteina',NULL),(40,3,1,'Aplicaciones de la biotecnología','Biotecnología aplicada','aplicaciones-de-la-biotecnologia',NULL),(41,3,2,'Cantidades físicas: magnitudes fundamentales y derivadas. Escalares y vectores','Magnitudes físicas','cantidades-fisicas-magnitudes-y-vectores',NULL),(42,3,2,'Propiedades y clasificación de la materia. Separación de mezclas','Materia y mezclas','propiedades-y-clasificacion-de-la-materia-separacion-de-mezclas',NULL),(43,3,2,'Teoría atómica de la materia: estructura del átomo. Estabilidad de los átomos','Átomo y estructura','teoria-atomica-estructura-del-atomo-estabilidad',NULL),(44,3,2,'Modelo mecánico–cuántico: configuración electrónica, números cuánticos y propiedades periódicas de los elementos','Modelo cuántico','modelo-mecanico-cuantico-configuracion-numeros-cuanticos-propiedades-periodicas',NULL),(45,3,2,'Enlace químico: formación y propiedades de enlaces iónicos, covalentes y metálicos. Representaciones de Lewis. Geometría molecular y polaridad','Enlace químico','enlace-quimico-ionico-covalente-metalico-lewis-geometria-polaridad',NULL),(46,3,2,'Estados de agregación de la materia: teoría cinético–molecular. Leyes de los gases ideales. Fuerzas intermoleculares en líquidos y sólidos. Cambios de estado de agregación','Estados y gases','estados-de-agregacion-teoria-cinetico-molecular-leyes-de-gases-fuerzas-intermoleculares',NULL),(47,3,2,'Reacciones químicas: ley de conservación de la masa. Relación entre masa y cantidad de sustancia','Reacciones químicas','reacciones-quimicas-conservacion-de-la-masa-cantidad-de-sustancia',NULL),(48,3,2,'Información cuantitativa a partir de ecuaciones balanceadas. Reactivo limitante y reactivo en exceso','Estequiometría básica','informacion-cuantitativa-ecuaciones-balanceadas-reactivo-limitante-y-exceso',NULL),(49,3,2,'Transformaciones energéticas en procesos químicos. Efecto de catalizadores en la velocidad de reacciones químicas','Energía y catalizadores','transformaciones-energeticas-procesos-quimicos-catalizadores-velocidad',NULL),(50,3,2,'Fenómenos nucleares y su aplicación: radioactividad, fisión y fusión nuclear','Nuclear','fenomenos-nucleares-radioactividad-fision-fusion',NULL),(51,3,2,'Soluciones: proceso de formación de soluciones iónicas y moleculares. Unidades de concentración. Conductividad eléctrica de soluciones. pH de soluciones','Soluciones y pH','soluciones-formacion-unidades-de-concentracion-conductividad-ph',NULL),(52,3,2,'Cinemática. MRU. MRUV. MVCL. Movimiento parabólico. Movimiento circular uniforme. Representación gráfica del movimiento','Cinemática','cinematica-mru-mruv-mvcl-parabolico-circular-uniforme-graficas',NULL),(53,3,2,'Leyes del movimiento de Newton. Fuerzas fundamentales de la naturaleza. Ley de la gravitación de Newton. Diagrama de cuerpo libre. Aplicación de las leyes de Newton para partículas en equilibrio y bajo acción de una fuerza resultante constante','Leyes de Newton','leyes-de-newton-fuerzas-gravitacion-diagrama-de-cuerpo-libre-aplicaciones',NULL),(54,3,2,'Trabajo y energía: trabajo de una fuerza. Concepto de energía. Energía cinética. Energía potencial gravitatoria. Energía mecánica. Conservación y transformación de la energía','Trabajo y energía','trabajo-y-energia-cinetica-potencial-mecanica-conservacion',NULL),(55,3,2,'Termodinámica: temperatura y escalas. Definición de calor. Intercambio de calor. Calor específico. Procesos de transferencia de calor. Definición de sistema. Tipos de sistema (abierto, cerrado, aislado)','Termodinámica','termodinamica-temperatura-calor-transferencia-sistemas',NULL),(56,3,2,'Electricidad y magnetismo. Corriente eléctrica y resistencia. Circuitos eléctricos','Electricidad y circuitos','electricidad-y-magnetismo-corriente-resistencia-circuitos',NULL),(57,3,2,'Ondas mecánicas y electromagnéticas. Espectro electromagnético','Ondas y espectro','ondas-mecanicas-y-electromagneticas-espectro-electromagnetico',NULL),(58,3,3,'Teorías sobre el origen y evolución de la vida. Mecanismos de evolución. Registros fósiles. Árboles filogenéticos. Especie','Origen y evolución de la vida','teorias-origen-y-evolucion-de-la-vida-mecanismos-fosiles-arboles-filogeneticos',NULL),(59,3,3,'Variabilidad y herencia: genética mendeliana, relación genotipo – fenotipo, herencia ligada al sexo','Variabilidad y herencia','variabilidad-y-herencia-genetica-mendeliana-genotipo-fenotipo-ligada-al-sexo',NULL),(60,3,3,'Biósfera: componentes y dinámica de ecosistemas. Flujos de materia y energía. Ciclos biogeoquímicos. Cadenas tróficas. Interacciones intra e interespecíficas','Biósfera y ecosistemas','biosfera-ecosistemas-flujos-ciclos-cadenas-troficas-interacciones',NULL),(61,3,3,'Diversidad de los seres vivos. Bases celulares y morfológicas de la diversidad','Diversidad biológica','diversidad-de-los-seres-vivos-bases-celulares-y-morfologicas',NULL),(62,3,3,'Recursos naturales. Fuente de energía alternativa','Recursos y energías','recursos-naturales-y-fuentes-de-energia-alternativa',NULL),(63,3,3,'El hombre y el medio ambiente: alteración del equilibrio ecosistémico, causas y consecuencias de la depredación de especies, contaminación ambiental, cambio climático y calentamiento global, desarrollo sostenible','Ambiente y sostenibilidad','hombre-y-medio-ambiente-depredacion-contaminacion-cambio-climatico-sostenibilidad',NULL),(64,3,3,'Teorías sobre el origen y evolución del Universo y del sistema solar','Origen del Universo','teorias-origen-y-evolucion-del-universo-y-del-sistema-solar',NULL),(65,3,3,'Características estructurales de la Tierra: capas terrestres, procesos geológicos, movimientos e interacciones con otros cuerpos celestes y sus implicancias para la vida en el planeta. Fenómenos meteorológicos y efecto invernadero','Tierra y procesos','caracteristicas-de-la-tierra-procesos-geologicos-movimientos-fenomenos-efecto-invernadero',NULL),(66,4,NULL,'Determinación de una alternativa de solución tecnológica. Identificación de problemas y estrategias de solución basadas en conocimientos científico, tecnológico y prácticas locales','Definir alternativa y problema','determinacion-alternativa-solucion-identificacion-problemas-estrategias',NULL),(67,4,NULL,'Caracterización y justificación de las especificaciones de diseño, beneficios propios y colaterales de una alternativa de solución','Especificaciones y justificación','caracterizacion-y-justificacion-de-especificaciones-y-beneficios',NULL),(68,4,NULL,'Diseño de alternativas de solución. Selección de herramientas y materiales','Diseño y selección de herramientas y materiales','diseno-de-alternativas-seleccion-de-herramientas-y-materiales',NULL),(69,4,NULL,'Implementación de alternativas de solución. Estructura y funcionamiento de la solución tecnológica','Implementación y funcionamiento','implementacion-de-alternativas-estructura-y-funcionamiento',NULL),(70,4,NULL,'Evaluación y comunicación de la eficiencia, confiabilidad y los posibles impactos de una solución tecnológica','Evaluación e impactos','evaluacion-comunicacion-eficiencia-confiabilidad-impactos',NULL);
/*!40000 ALTER TABLE `subtemas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `temas`
--

DROP TABLE IF EXISTS `temas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `temas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `area_id` int DEFAULT NULL,
  `curso_id` int DEFAULT NULL,
  `nombre` varchar(150) NOT NULL,
  `nombre_corto` varchar(100) DEFAULT NULL,
  `slug` varchar(150) NOT NULL,
  `descripcion` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`,`area_id`,`curso_id`),
  KEY `area_id` (`area_id`),
  KEY `curso_id` (`curso_id`),
  CONSTRAINT `temas_ibfk_1` FOREIGN KEY (`area_id`) REFERENCES `areas` (`id`),
  CONSTRAINT `temas_ibfk_2` FOREIGN KEY (`curso_id`) REFERENCES `cursos` (`id`),
  CONSTRAINT `temas_chk_1` CHECK ((((`area_id` is not null) and (`curso_id` is null)) or ((`area_id` is null) and (`curso_id` is not null))))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `temas`
--

LOCK TABLES `temas` WRITE;
/*!40000 ALTER TABLE `temas` DISABLE KEYS */;
INSERT INTO `temas` VALUES (1,1,NULL,'Principios, teorías y enfoques vinculados a la práctica pedagógica','Práctica pedagógica','principios-practica-pedagogica',NULL,'2025-10-06 19:27:19',NULL),(2,1,NULL,'Conocimiento didáctico para favorecer la indagación mediante métodos científicos','Didáctica de la indagación','didactica-indagacion',NULL,'2025-10-06 19:27:19',NULL),(3,1,NULL,'Conocimiento didáctico para favorecer la explicación del mundo físico basado en conocimientos científicos','Didáctica de la explicación','didactica-explicacion',NULL,'2025-10-06 19:27:19',NULL),(4,1,NULL,'Conocimiento didáctico para favorecer el diseño y construcción de soluciones tecnológicas para resolver problemas','Didáctica del diseño','didactica-diseno-soluciones',NULL,'2025-10-06 19:27:19',NULL);
/*!40000 ALTER TABLE `temas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_item_history`
--

DROP TABLE IF EXISTS `user_item_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_item_history` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `item_id` bigint unsigned NOT NULL,
  `is_correct` tinyint(1) NOT NULL,
  `time_sec` smallint unsigned DEFAULT NULL,
  `answered_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_user_item_once` (`user_id`,`item_id`),
  KEY `user_id` (`user_id`,`answered_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_item_history`
--

LOCK TABLES `user_item_history` WRITE;
/*!40000 ALTER TABLE `user_item_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_item_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_simulacro_usage`
--

DROP TABLE IF EXISTS `user_simulacro_usage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_simulacro_usage` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `period_month` date NOT NULL,
  `used` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_user_month` (`user_id`,`period_month`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_simulacro_usage`
--

LOCK TABLES `user_simulacro_usage` WRITE;
/*!40000 ALTER TABLE `user_simulacro_usage` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_simulacro_usage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_subscriptions`
--

DROP TABLE IF EXISTS `user_subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_subscriptions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `plan_id` tinyint unsigned NOT NULL,
  `status` enum('active','past_due','canceled') NOT NULL DEFAULT 'active',
  `current_period_start` date NOT NULL,
  `current_period_end` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_active_period` (`user_id`,`current_period_start`,`current_period_end`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_subscriptions`
--

LOCK TABLES `user_subscriptions` WRITE;
/*!40000 ALTER TABLE `user_subscriptions` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prioritized_area_id` int DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `fk_users_prioritized_area` (`prioritized_area_id`),
  CONSTRAINT `fk_users_prioritized_area` FOREIGN KEY (`prioritized_area_id`) REFERENCES `areas` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'heisemberg','heisembergtc@gmail.com',NULL,'$2y$12$XZacDY8udUw/vMf7Fr0HGO6nXyqoefaFStUaM5Ajzb81AOYkCwtVG',NULL,NULL,'2025-10-25 23:41:52','2025-10-25 23:41:52'),(4,'test','test@test.com',NULL,'$2y$12$/ffgwPOcg9P03Z6sit7cAuJwveCggx3Fpf4DpU4cyKUHpx/6ZFgm6',NULL,NULL,'2025-10-26 11:22:26','2025-10-26 11:22:26'),(5,'prueba','prueba@hola.com','2025-10-26 12:10:51','$2y$12$dlc3akizL.6MslMsQ.xkUuJF4Yl3E0WPEdipojAyqBOfW4tIMlM8q',NULL,NULL,'2025-10-26 12:08:21','2025-10-26 12:10:51'),(6,'pedro','pedro@gmail.com','2025-10-30 11:44:00','$2y$12$K00vhPhWYGbX0PCmjd5eOONaLIOuZKWXuY.AhMLl1.hc.GVWaKXyy',NULL,NULL,'2025-10-30 11:41:21','2025-10-30 11:44:00');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-29 12:16:34
