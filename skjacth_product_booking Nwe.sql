-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 08, 2025 at 10:51 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `skjacth_product_booking`
--

-- --------------------------------------------------------

--
-- Table structure for table `tb_admin_users`
--

CREATE TABLE `tb_admin_users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `role` enum('admin','staff') DEFAULT 'staff',
  `is_active` tinyint(1) DEFAULT 1,
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='ตารางผู้ดูแลระบบ';

--
-- Dumping data for table `tb_admin_users`
--

INSERT INTO `tb_admin_users` (`id`, `username`, `password_hash`, `full_name`, `email`, `role`, `is_active`, `last_login`, `created_at`, `updated_at`) VALUES
(1, 'admin', '$2y$10$z6z6aK3YrsMzVMUgDMOvreyx5JONdC1KT07bUYbz0/h.zUw9xLJM2', 'Admin', NULL, 'admin', 1, '2025-10-08 07:42:54', '2025-10-06 04:17:37', '2025-10-08 07:42:54'),
(2, 'panisara', '$2y$10$NV5qIEsIEBWZUzCEtWjEbeOPun.Xh/qZDMCa7kHx/yHjsD18tduim', 'นางสาวปาณิสรา เรืองสอน', NULL, 'admin', 1, '2025-10-07 08:04:40', '2025-10-06 04:17:37', '2025-10-07 08:04:40');

-- --------------------------------------------------------

--
-- Table structure for table `tb_categories`
--

CREATE TABLE `tb_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL COMMENT 'ชื่อหมวดหมู่',
  `slug` varchar(255) NOT NULL COMMENT 'Slug สำหรับ URL',
  `description` text DEFAULT NULL COMMENT 'รายละเอียดหมวดหมู่',
  `icon` varchar(50) DEFAULT NULL COMMENT 'ไอคอนหมวดหมู่',
  `order_display` int(11) DEFAULT 0 COMMENT 'ลำดับการแสดงผล',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='ตารางหมวดหมู่สินค้า';

--
-- Dumping data for table `tb_categories`
--

INSERT INTO `tb_categories` (`id`, `name`, `slug`, `description`, `icon`, `order_display`, `created_at`, `updated_at`) VALUES
(1, 'กำไลข้อมือ', 'bracelet', NULL, '📿', 1, '2025-10-08 05:58:55', '2025-10-08 05:58:55'),
(2, 'เสื้อผ้า', 'shirt', NULL, '👕', 2, '2025-10-08 05:58:55', '2025-10-08 05:58:55'),
(3, 'คอมโบ', 'combo', NULL, '🎁', 3, '2025-10-08 05:58:55', '2025-10-08 05:58:55'),
(4, 'สติกเกอร์', 'sticker', NULL, '🏷️', 4, '2025-10-08 05:58:55', '2025-10-08 05:58:55');

-- --------------------------------------------------------

--
-- Table structure for table `tb_contact`
--

CREATE TABLE `tb_contact` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `icon` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_contact`
--

INSERT INTO `tb_contact` (`id`, `name`, `value`, `icon`) VALUES
(2, 'เบอร์โทรศัพท์', '08-0615-3954 (ครูออฟ นันทกานต์ จิรังกรณ์)', 'fas fa-phone'),
(4, 'Facebook โรงเรียนสวนกุหลาบวิทยาลัย (จิรประวัติ) นครสวรรค์', 'facebook.com/SKJNS160', 'fab fa-facebook');

-- --------------------------------------------------------

--
-- Table structure for table `tb_customers`
--

CREATE TABLE `tb_customers` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL COMMENT 'ชื่อ',
  `last_name` varchar(100) NOT NULL COMMENT 'นามสกุล',
  `phone` varchar(20) NOT NULL COMMENT 'เบอร์โทรศัพท์',
  `email` varchar(255) DEFAULT NULL COMMENT 'อีเมล',
  `address` text DEFAULT NULL COMMENT 'ที่อยู่',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='ตารางลูกค้า';

--
-- Dumping data for table `tb_customers`
--

INSERT INTO `tb_customers` (`id`, `first_name`, `last_name`, `phone`, `email`, `address`, `created_at`, `updated_at`) VALUES
(2, 'นายประกาศิต ', 'สุขเกษม', 'sefsef', NULL, NULL, '2025-10-06 11:15:33', '2025-10-06 11:15:33'),
(3, 'นายประกาศิต ', 'สุขเกษม', '06123153', NULL, NULL, '2025-10-06 11:22:35', '2025-10-06 11:22:35'),
(4, 'นายอชิรวัฒน์', 'สุขเกษม', 'awd', NULL, NULL, '2025-10-06 11:24:03', '2025-10-06 11:24:03'),
(5, 'นายอชิรวัฒน์', 'สุขเกษม', '123', NULL, NULL, '2025-10-06 11:26:22', '2025-10-06 11:26:22'),
(6, 'wee', 'wer', '0000000000', NULL, NULL, '2025-10-07 02:39:45', '2025-10-07 02:39:45');

-- --------------------------------------------------------

--
-- Table structure for table `tb_orders`
--

CREATE TABLE `tb_orders` (
  `id` varchar(20) NOT NULL COMMENT 'หมายเลขคำสั่งซื้อ (ORD + timestamp)',
  `customer_id` int(11) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL COMMENT 'ยอดรวมก่อนส่วนลด',
  `discount_amount` decimal(10,2) DEFAULT 0.00 COMMENT 'ส่วนลด',
  `final_amount` decimal(10,2) NOT NULL COMMENT 'ยอดสุทธิ',
  `status` enum('รอชำระเงิน','รอตรวจสอบการชำระเงิน','ชำระเงินแล้ว') DEFAULT 'รอชำระเงิน' COMMENT 'สถานะคำสั่งซื้อ',
  `payment_method` varchar(30) DEFAULT NULL COMMENT 'วิธีชำระเงิน',
  `shipping_address` text DEFAULT NULL COMMENT 'ที่อยู่จัดส่ง',
  `tracking_number` varchar(50) DEFAULT NULL COMMENT 'หมายเลขติดตามพัสดุ',
  `notes` text DEFAULT NULL COMMENT 'หมายเหตุ',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='ตารางคำสั่งซื้อ';

--
-- Dumping data for table `tb_orders`
--

INSERT INTO `tb_orders` (`id`, `customer_id`, `total_amount`, `discount_amount`, `final_amount`, `status`, `payment_method`, `shipping_address`, `tracking_number`, `notes`, `created_at`, `updated_at`) VALUES
('ORD1759751143', 4, 400.00, 50.00, 350.00, 'ชำระเงินแล้ว', 'promptpay', NULL, NULL, NULL, '2025-10-06 11:45:43', '2025-10-07 02:13:48'),
('ORD1759804785', 6, 400.00, 50.00, 350.00, 'ชำระเงินแล้ว', 'bank_transfer', NULL, NULL, NULL, '2025-10-07 02:39:45', '2025-10-07 08:04:52'),
('ORD1759808151', 6, 400.00, 50.00, 350.00, 'ชำระเงินแล้ว', 'bank_transfer', NULL, NULL, NULL, '2025-10-07 03:35:51', '2025-10-07 03:36:13'),
('ORD1759822557', 6, 300.00, 0.00, 300.00, 'รอตรวจสอบการชำระเงิน', 'bank_transfer', NULL, NULL, NULL, '2025-10-07 07:35:57', '2025-10-07 07:35:57'),
('ORD1759830886', 5, 2400.00, 150.00, 2250.00, 'ชำระเงินแล้ว', 'bank_transfer', NULL, NULL, NULL, '2025-10-07 09:54:46', '2025-10-07 09:56:01');

-- --------------------------------------------------------

--
-- Table structure for table `tb_order_items`
--

CREATE TABLE `tb_order_items` (
  `id` int(11) NOT NULL,
  `order_id` varchar(20) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL COMMENT 'ชื่อสินค้า (เก็บไว้เผื่อสินค้าถูกลบ)',
  `quantity` int(11) NOT NULL DEFAULT 1 COMMENT 'จำนวน',
  `unit_price` decimal(10,2) NOT NULL COMMENT 'ราคาต่อหน่วย',
  `gender` varchar(20) NOT NULL COMMENT 'เพศ',
  `size` varchar(50) DEFAULT NULL COMMENT 'ไซส์ที่เลือก',
  `color` varchar(50) DEFAULT NULL COMMENT 'สีที่เลือก',
  `subtotal` decimal(10,2) NOT NULL COMMENT 'ยอดรวมรายการ',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='ตารางรายการสินค้าในคำสั่งซื้อ';

--
-- Dumping data for table `tb_order_items`
--

INSERT INTO `tb_order_items` (`id`, `order_id`, `product_id`, `product_name`, `quantity`, `unit_price`, `gender`, `size`, `color`, `subtotal`, `created_at`) VALUES
(17, 'ORD1759751143', 3, 'คอมโบ เสื้อยืด + ริสแบนด์ข้อมือ', 1, 350.00, 'หญิง', 'SS', NULL, 350.00, '2025-10-06 11:45:43'),
(18, 'ORD1759804785', 3, 'คอมโบ เสื้อยืด + ริสแบนด์ข้อมือ', 1, 350.00, 'หญิง', 'L', NULL, 350.00, '2025-10-07 02:39:45'),
(19, 'ORD1759808151', 3, 'คอมโบ เสื้อยืด + ริสแบนด์ข้อมือ', 1, 350.00, 'ชาย', 'L', NULL, 350.00, '2025-10-07 03:35:51'),
(20, 'ORD1759822557', 2, 'เสื้อยืด', 1, 300.00, 'หญิง', 'M', NULL, 300.00, '2025-10-07 07:35:57'),
(21, 'ORD1759830886', 1, 'ริสแบนด์ข้อมือ', 3, 100.00, '', NULL, NULL, 300.00, '2025-10-07 09:54:46'),
(22, 'ORD1759830886', 2, 'เสื้อยืด', 3, 300.00, 'ชาย', 'S', NULL, 900.00, '2025-10-07 09:54:46'),
(23, 'ORD1759830886', 2, 'เสื้อยืด', 4, 300.00, 'หญิง', 'M', NULL, 1200.00, '2025-10-07 09:54:46');

-- --------------------------------------------------------

--
-- Table structure for table `tb_payments`
--

CREATE TABLE `tb_payments` (
  `id` int(11) NOT NULL,
  `order_id` varchar(20) NOT NULL,
  `amount` decimal(10,2) NOT NULL COMMENT 'จำนวนเงินที่ชำระ',
  `payment_method` enum('bank-transfer','promptpay','cash') NOT NULL,
  `payment_status` enum('pending','completed','failed','refunded') DEFAULT 'pending',
  `transaction_id` varchar(100) DEFAULT NULL COMMENT 'รหัสธุรกรรม',
  `payment_date` timestamp NULL DEFAULT NULL COMMENT 'วันที่ชำระเงิน',
  `notes` text DEFAULT NULL COMMENT 'หมายเหตุ',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='ตารางการชำระเงิน';

-- --------------------------------------------------------

--
-- Table structure for table `tb_payment_confirmations`
--

CREATE TABLE `tb_payment_confirmations` (
  `id` int(11) NOT NULL,
  `order_id` varchar(20) NOT NULL,
  `transfer_amount` decimal(10,2) NOT NULL COMMENT 'จำนวนเงินที่โอน',
  `transfer_date` date NOT NULL COMMENT 'วันที่โอน',
  `transfer_time` time NOT NULL COMMENT 'เวลาที่โอน',
  `from_bank` varchar(100) DEFAULT NULL COMMENT 'ธนาคารที่โอนจาก',
  `from_account_name` varchar(255) DEFAULT NULL COMMENT 'ชื่อบัญชีที่โอนจาก',
  `slip_filename` varchar(255) DEFAULT NULL COMMENT 'ชื่อไฟล์สลิป',
  `slip_path` varchar(500) DEFAULT NULL COMMENT 'path ของไฟล์สลิป',
  `status` enum('รอตรวจสอบ','อนุมัติ','ปฏิเสธ') DEFAULT 'รอตรวจสอบ',
  `verified_by` int(11) DEFAULT NULL COMMENT 'ผู้ตรวจสอบ (admin user id)',
  `verified_at` timestamp NULL DEFAULT NULL COMMENT 'วันที่ตรวจสอบ',
  `notes` text DEFAULT NULL COMMENT 'หมายเหตุจากผู้ตรวจสอบ',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='ตารางการยืนยันการชำระเงิน';

--
-- Dumping data for table `tb_payment_confirmations`
--

INSERT INTO `tb_payment_confirmations` (`id`, `order_id`, `transfer_amount`, `transfer_date`, `transfer_time`, `from_bank`, `from_account_name`, `slip_filename`, `slip_path`, `status`, `verified_by`, `verified_at`, `notes`, `created_at`, `updated_at`) VALUES
(12, 'ORD1759751143', 360.00, '2025-10-06', '20:45:00', 'ทหารไทยธนชาต', 'นายประกาศิต สุขเกษม', 'slip_ORD1759751143_1759751143.jpg', 'uploads/slips/slip_ORD1759751143_1759751143.jpg', 'อนุมัติ', 1, '2025-10-07 02:13:48', NULL, '2025-10-06 11:45:43', '2025-10-07 02:13:48'),
(13, 'ORD1759804785', 360.00, '2025-10-07', '01:39:00', 'กรุงศรีอยุธยา', 'ทดสอบ', 'slip_ORD1759804785_1759804785.jpg', 'uploads/slips/slip_ORD1759804785_1759804785.jpg', 'อนุมัติ', 2, '2025-10-07 08:04:52', NULL, '2025-10-07 02:39:45', '2025-10-07 08:04:52'),
(14, 'ORD1759808151', 350.00, '2025-10-07', '01:35:00', 'กรุงไทย', 'ทดสอบ', 'slip_ORD1759808151_1759808151.jpg', 'uploads/slips/slip_ORD1759808151_1759808151.jpg', 'อนุมัติ', 1, '2025-10-07 03:36:13', NULL, '2025-10-07 03:35:51', '2025-10-07 03:36:13'),
(15, 'ORD1759822557', 350.00, '2025-10-07', '17:35:00', 'ออมสิน', 'ทดสอบ', 'slip_ORD1759822557_1759822557.jpg', 'uploads/slips/slip_ORD1759822557_1759822557.jpg', 'รอตรวจสอบ', NULL, NULL, NULL, '2025-10-07 07:35:57', '2025-10-07 07:35:57'),
(16, 'ORD1759830886', 360.00, '2025-10-07', '20:54:00', 'อาคารสงเคราะห์', 'นายประกาศิต สุขเกษม', 'slip_ORD1759830886_1759830886.jpg', 'uploads/slips/slip_ORD1759830886_1759830886.jpg', 'อนุมัติ', 1, '2025-10-07 09:56:01', NULL, '2025-10-07 09:54:46', '2025-10-07 09:56:01');

-- --------------------------------------------------------

--
-- Table structure for table `tb_payment_methods`
--

CREATE TABLE `tb_payment_methods` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(50) NOT NULL,
  `account_name` varchar(255) DEFAULT NULL,
  `account_number` varchar(255) DEFAULT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `promptpay_id` varchar(255) DEFAULT NULL,
  `qr_code_image` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_payment_methods`
--

INSERT INTO `tb_payment_methods` (`id`, `name`, `type`, `account_name`, `account_number`, `bank_name`, `promptpay_id`, `qr_code_image`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'ธนาคารกสิกรไทย', 'bank_transfer', 'นางสาวปาณิสรา เรืองสอน', '418-2-76888-5', 'กสิกรไทย', '', '', 1, '2025-10-06 04:40:24', '2025-10-06 07:43:27'),
(6, 'พร้อมเพย์', 'promptpay', '', '', '', 'xxx-x-x6888-x', 'qrcode_84614ef9a8274b61ecc7e1a690475292.jpg', 1, '2025-10-06 08:16:08', '2025-10-06 08:57:45');

-- --------------------------------------------------------

--
-- Table structure for table `tb_products`
--

CREATE TABLE `tb_products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL COMMENT 'ชื่อสินค้า',
  `category_id` int(11) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL COMMENT 'ราคา',
  `description` text DEFAULT NULL COMMENT 'รายละเอียดสินค้า',
  `image_url` varchar(255) DEFAULT NULL COMMENT 'URL หรือ Path ของรูปภาพสินค้า',
  `material` varchar(255) DEFAULT NULL COMMENT 'วัสดุ',
  `sizes` longtext DEFAULT NULL COMMENT 'ไซส์ที่มี (Comma Separated)',
  `colors` longtext DEFAULT NULL COMMENT 'สีที่มี (Comma Separated)',
  `stock` int(11) DEFAULT 0 COMMENT 'จำนวนสต็อก',
  `discount_amount` decimal(10,2) DEFAULT 0.00 COMMENT 'ส่วนลด (สำหรับคอมโบ)',
  `is_active` tinyint(1) DEFAULT 1 COMMENT 'สถานะใช้งาน',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='ตารางสินค้า';

--
-- Dumping data for table `tb_products`
--

INSERT INTO `tb_products` (`id`, `name`, `category_id`, `price`, `description`, `image_url`, `material`, `sizes`, `colors`, `stock`, `discount_amount`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'ริสแบนด์ข้อมือ', 1, 100.00, 'ริสแบนด์ข้อมือ รุ่นพิเศษ \"ร้อยดวงใจแห่งรัก\"', '559fe977f404161579f23c2a837300be.png', '0', 'One Size', 'ขาว,ชมพู,ฟ้า', 100, 0.00, 1, '2025-10-06 03:32:14', '2025-10-08 08:20:34'),
(2, 'เสื้อยืด', 2, 300.00, 'เสื้อยืด รุ่นพิเศษ \"ร้อยดวงใจแห่งรัก\"', 'e7b6f83254899789847f32dc60bbc133.png', '0', 'SS,S,M,L,XL,2XL,3XL,4XL,5XL,6XL,7XL,8XL,9XL', 'ขาว,ชมพู,ฟ้า', 100, 0.00, 1, '2025-10-06 03:33:28', '2025-10-08 08:20:49'),
(3, 'คอมโบ เสื้อยืด + ริสแบนด์ข้อมือ', 3, 350.00, '', '676f22dfc81315bfbead827cdf1b4bc6.png', '0', 'SS,M,L,XL,2XL,3XL', 'ขาว,ชมพู,ฟ้า', 100, 50.00, 1, '2025-10-06 03:35:58', '2025-10-08 08:21:03');

-- --------------------------------------------------------

--
-- Table structure for table `tb_system_settings`
--

CREATE TABLE `tb_system_settings` (
  `id` int(11) NOT NULL,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='ตารางการตั้งค่าระบบ';

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_admin_users`
--
ALTER TABLE `tb_admin_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `idx_username` (`username`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- Indexes for table `tb_categories`
--
ALTER TABLE `tb_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `tb_contact`
--
ALTER TABLE `tb_contact`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_customers`
--
ALTER TABLE `tb_customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD KEY `idx_phone` (`phone`),
  ADD KEY `idx_email` (`email`);

--
-- Indexes for table `tb_orders`
--
ALTER TABLE `tb_orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_customer_id` (`customer_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `tb_order_items`
--
ALTER TABLE `tb_order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_order_id` (`order_id`),
  ADD KEY `idx_product_id` (`product_id`);

--
-- Indexes for table `tb_payments`
--
ALTER TABLE `tb_payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_order_id` (`order_id`),
  ADD KEY `idx_payment_status` (`payment_status`);

--
-- Indexes for table `tb_payment_confirmations`
--
ALTER TABLE `tb_payment_confirmations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_order_id` (`order_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_transfer_date` (`transfer_date`);

--
-- Indexes for table `tb_payment_methods`
--
ALTER TABLE `tb_payment_methods`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_products`
--
ALTER TABLE `tb_products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_is_active` (`is_active`),
  ADD KEY `fk_product_category` (`category_id`);

--
-- Indexes for table `tb_system_settings`
--
ALTER TABLE `tb_system_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`),
  ADD KEY `idx_setting_key` (`setting_key`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tb_admin_users`
--
ALTER TABLE `tb_admin_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tb_categories`
--
ALTER TABLE `tb_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tb_contact`
--
ALTER TABLE `tb_contact`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tb_customers`
--
ALTER TABLE `tb_customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tb_order_items`
--
ALTER TABLE `tb_order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `tb_payments`
--
ALTER TABLE `tb_payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_payment_confirmations`
--
ALTER TABLE `tb_payment_confirmations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `tb_payment_methods`
--
ALTER TABLE `tb_payment_methods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tb_products`
--
ALTER TABLE `tb_products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tb_system_settings`
--
ALTER TABLE `tb_system_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tb_orders`
--
ALTER TABLE `tb_orders`
  ADD CONSTRAINT `tb_orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `tb_customers` (`id`);

--
-- Constraints for table `tb_order_items`
--
ALTER TABLE `tb_order_items`
  ADD CONSTRAINT `tb_order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `tb_orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tb_order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `tb_products` (`id`);

--
-- Constraints for table `tb_payments`
--
ALTER TABLE `tb_payments`
  ADD CONSTRAINT `tb_payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `tb_orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tb_payment_confirmations`
--
ALTER TABLE `tb_payment_confirmations`
  ADD CONSTRAINT `tb_payment_confirmations_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `tb_orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tb_products`
--
ALTER TABLE `tb_products`
  ADD CONSTRAINT `fk_product_category` FOREIGN KEY (`category_id`) REFERENCES `tb_categories` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
