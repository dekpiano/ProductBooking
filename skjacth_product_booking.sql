-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 04, 2025 at 01:03 PM
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
  `status` enum('รอชำระเงิน','รอตรวจสอบการชำระเงิน','รอจัดส่ง','จัดส่งแล้ว','สำเร็จ','ยกเลิก') DEFAULT 'รอชำระเงิน' COMMENT 'สถานะคำสั่งซื้อ',
  `payment_method` enum('bank-transfer','promptpay','cash') DEFAULT NULL COMMENT 'วิธีชำระเงิน',
  `shipping_address` text DEFAULT NULL COMMENT 'ที่อยู่จัดส่ง',
  `tracking_number` varchar(50) DEFAULT NULL COMMENT 'หมายเลขติดตามพัสดุ',
  `notes` text DEFAULT NULL COMMENT 'หมายเหตุ',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='ตารางคำสั่งซื้อ';

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
  `size` varchar(50) DEFAULT NULL COMMENT 'ไซส์ที่เลือก',
  `color` varchar(50) DEFAULT NULL COMMENT 'สีที่เลือก',
  `subtotal` decimal(10,2) NOT NULL COMMENT 'ยอดรวมรายการ',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='ตารางรายการสินค้าในคำสั่งซื้อ';

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

-- --------------------------------------------------------

--
-- Table structure for table `tb_products`
--

CREATE TABLE `tb_products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL COMMENT 'ชื่อสินค้า',
  `category` enum('bracelet','shirt','combo') NOT NULL COMMENT 'ประเภทสินค้า',
  `price` decimal(10,2) NOT NULL COMMENT 'ราคา',
  `description` text DEFAULT NULL COMMENT 'รายละเอียดสินค้า',
  `material` varchar(255) DEFAULT NULL COMMENT 'วัสดุ',
  `sizes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'ไซส์ที่มี (JSON Array)' CHECK (json_valid(`sizes`)),
  `colors` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'สีที่มี (JSON Array)' CHECK (json_valid(`colors`)),
  `stock` int(11) DEFAULT 0 COMMENT 'จำนวนสต็อก',
  `discount_amount` decimal(10,2) DEFAULT 0.00 COMMENT 'ส่วนลด (สำหรับคอมโบ)',
  `is_active` tinyint(1) DEFAULT 1 COMMENT 'สถานะใช้งาน',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='ตารางสินค้า';

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
-- Indexes for table `tb_products`
--
ALTER TABLE `tb_products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_is_active` (`is_active`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_customers`
--
ALTER TABLE `tb_customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_order_items`
--
ALTER TABLE `tb_order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_payments`
--
ALTER TABLE `tb_payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_payment_confirmations`
--
ALTER TABLE `tb_payment_confirmations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_products`
--
ALTER TABLE `tb_products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
