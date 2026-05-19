
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `sunspot_db`;

USE `sunspot_db`;

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `item_id` int(11) NOT NULL,
  `cart_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `image` varchar(1000) NOT NULL,
  `name` varchar(30) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `ordered` int(1) NOT NULL DEFAULT 0,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `cart_id` int(11) DEFAULT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `total_amount` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `manufacturer` varchar(50) NOT NULL,
  `model` varchar(50) NOT NULL,
  `year` year(4) DEFAULT NULL,
  `price` double NOT NULL,
  `processor` varchar(50) DEFAULT NULL,
  `ram_size` varchar(50) DEFAULT NULL,
  `storage` varchar(50) DEFAULT NULL,
  `display` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`display`)),
  `os` varchar(50) DEFAULT NULL,
  `battery` varchar(50) DEFAULT NULL,
  `weight` varchar(50) DEFAULT NULL,
  `dimensions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dimensions`)),
  `keyboard` varchar(50) DEFAULT NULL,
  `ports` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`ports`)),
  `connectivity` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`connectivity`)),
  `camera` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`camera`)),
  `additional_features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`additional_features`)),
  `image` varchar(200) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO
  `products` (
    `id`,
    `name`,
    `manufacturer`,
    `model`,
    `year`,
    `price`,
    `processor`,
    `ram_size`,
    `storage`,
    `display`,
    `os`,
    `battery`,
    `weight`,
    `dimensions`,
    `keyboard`,
    `ports`,
    `connectivity`,
    `camera`,
    `additional_features`,
    `image`,

    `description`
  )
VALUES
  (
    1,
    'Lenovo L15 I7',
    'Lenovo',
    'L15 I7',
    '2019',
    349.99,
    'Intel Core i7-8650U 1.9GHz Quad-Core Processor',
    '16GB (DDR4) RAM',
    'SSD Storage: 512GB SSD + 1TB HDD',
    '{\"width\": 15.6, \"height\": 9.6}',
    'Windows 10 Home Edition',
    'BAT0: 13.7V 10.1Wh Battery',
    '2.7kg',
    '{\"length\": 27.5, \"width\": 20.5, \"depth\": 1.5}',
    'Backlit keyboard with touchpad and media controls.',
    '{\"usb\": \"Type C USB port, Type A USB ports x2, HDMI port, Ethernet port, SD card slot\"}',
    '{\"wifi\": \"WiFi 802.11ac\", \"bluetooth\": \"Bluetooth v5\"}',
    '{\"front\": \"Webcam: 720p front camera\", \"rear\": null}',
    '[\"Fingerprint sensor\", \"Touchscreen display\", \"TPM module\", \"Intel UHD Graphics 620 graphics\"]',
    'https://www.westcoast.co.uk/Images/Product/Default/large/ecc050e8ccd192d4cd723e6fbe652951.jpg',

    'Powerful Lenovo laptop featuring an Intel Core i7 processor, 16GB RAM, and a spacious 512GB SSD + 1TB HDD storage. Backlit keyboard, 15.6-inch display, and various connectivity options.'
  ),
  (
    2,
    'HP Spectre XT Ultrabook',
    'HP',
    'Spectre XT Ultrabook',
    '2019',
    349.99,
    'Intel Core i7-8550U 1.8GHz Quad-Core Processor',
    '16GB (DDR4) RAM',
    'SSD Storage: 512GB SSD + 1TB HDD',
    '{\"width\": 15.6, \"height\": 9.6}',
    'Windows 10 Home Edition',
    'BAT0: 13.7V 10.1Wh Battery',
    '2.7kg',
    '{\"length\": 27.5, \"width\": 20.5, \"depth\": 1.5}',
    'Backlit keyboard with touchpad and media controls.',
    '{\"usb\": \"Type C USB port, Type A USB ports x2, HDMI port, Ethernet port, SD card slot\"}',
    '{\"wifi\": \"WiFi 802.11ac\", \"bluetooth\": \"Bluetooth v5\"}',
    '{\"front\": \"Webcam: 720p front camera\", \"rear\": null}',
    '[\"Fingerprint sensor\", \"Touchscreen display\", \"TPM module\", \"Intel UHD Graphics 620 graphics\"]',
    'https://support.hp.com/doc-images/813/c03406488.jpg',

    'Stylish HP Ultrabook with Intel Core i7 processor, 16GB RAM, and a generous 512GB SSD + 1TB HDD storage. Backlit keyboard, 15.6-inch display, and advanced features.'
  ),
  (
    3,
    'Dell Inspiron 14',
    'Dell',
    'Inspiron 14',
    '2020',
    899.99,
    'Intel Core i5-10210U 1.6GHz Quad-Core Processor',
    '8GB (DDR4) RAM',
    'SSD Storage: 256GB SSD',
    '{\"width\": 14, \"height\": 8.8}',
    'Windows 10 Home Edition',
    'BAT0: 11.1V 6.6Wh Battery',
    '1.8kg',
    '{\"length\": 22.7, \"width\": 16.5, \"depth\": 1.8}',
    'Chiclet-style keyboard with touchpad',
    '{\"usb\": \"Type C USB port, Type A USB ports x2, HDMI port, SD card slot\"}',
    '{\"wifi\": \"WiFi 802.11ax\", \"bluetooth\": \"Bluetooth v4.2\"}',
    '{\"front\": \"Webcam: 720p front camera\", \"rear\": null}',
    '[\"LED-backlit display\", \"Intel UHD Graphics\", \"Waves MaxxAudio Pro\"]',
    'https://www.gollo.com/media/catalog/product/1/0/1002010024-nuev-_2__0sxfcyq14j5niokb.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=&width=&canvas=:',

    'Dell laptop with Intel Core i5 processor, 8GB RAM, and a fast 256GB SSD. Compact 14-inch design, LED-backlit display, and reliable performance.'
  ),
  (
    4,
    'Acer Aspire 5',
    'Acer',
    'Aspire 5',
    '2021',
    599.99,
    'AMD Ryzen 5 4500U 2.3GHz Hexa-Core Processor',
    '12GB (DDR4) RAM',
    'SSD Storage: 512GB SSD',
    '{\"width\": 15.6, \"height\": 9.6}',
    'Windows 10 Home Edition',
    'BAT0: 14.8V 8.8Wh Battery',
    '2.2kg',
    '{\"length\": 36.3, \"width\": 24.7, \"depth\": 1.8}',
    'Full-size keyboard with numeric keypad and multi-g',
    '{\"usb\": \"Type C USB port, Type A USB ports x3, HDMI port, Ethernet port, SD card slot\"}',
    '{\"wifi\": \"WiFi 802.11ac\", \"bluetooth\": \"Bluetooth v5.0\"}',
    '{\"front\": \"Webcam: HD webcam\", \"rear\": null}',
    '[\"Acer TrueHarmony technology\", \"Precision Touchpad\", \"Radeon Graphics\"]',
    'https://hnsgsfp.imgix.net/9/images/detailed/78/Acer_Aspire_5_15.6-inch_Laptop_-_Silver_(IMG_1).jpg?fit=fill&bg=0FFF&w=1536&h=900&auto=format,compress',

    'Acer laptop powered by AMD Ryzen 5 processor, 12GB RAM, and a large 512GB SSD. Full-size keyboard, 15.6-inch display, and Radeon Graphics for enhanced visuals.'
  ),
  (
    5,
    'Samsung Galaxy S21',
    'Samsung',
    'Galaxy S21',
    '2021',
    799.99,
    'Exynos 2100 (Global) / Snapdragon 888 (USA)',
    '8GB RAM',
    '128GB / 256GB internal storage',
    '{\"width\": 6.2, \"height\": 13.4}',
    'Android 11 with One UI 3.1',
    'Li-Ion 4000 mAh, non-removable',
    '171g',
    '{\"length\": 15.7, \"width\": 7.4, \"depth\": 0.8}',
    NULL,
    NULL,
    NULL,
    '{\"front\": \"10 MP, f/2.2\", \"rear\": \"Triple - 12 MP (wide), 12 MP (ultrawide), 64 MP (telephoto)\"}',
    '[\"IP68 dust/water resistant\", \"5G connectivity\", \"Wireless charging\", \"Ultrasonic fingerprint sensor\"]',
    'https://i.ebayimg.com/images/g/Jh8AAOSwk9pie--O/s-l500.jpg',

    'Samsung smartphone with Exynos 2100/Snapdragon 888, 8GB RAM, and 128GB/256GB storage. Stunning 6.2-inch display, triple rear cameras, and advanced features like 5G connectivity.'
  ),
  (
    6,
    'Apple iPad Pro (2022)',
    'Apple',
    'iPad Pro (2022)',
    '2022',
    1099.99,
    'Apple M2 chip',
    '8GB RAM',
    '256GB / 512GB / 1TB / 2TB internal storage',
    '{\"width\": 11, \"height\": 8.5}',
    'iPadOS 16',
    'Li-Po 7538 mAh, non-removable',
    '466g',
    '{\"length\": 24.7, \"width\": 17.9, \"depth\": 0.6}',
    NULL,
    NULL,
    NULL,
    '{\"front\": \"12 MP (ultrawide), TOF 3D LiDAR scanner\", \"rear\": \"12 MP (wide), 10 MP (ultrawide)\"}',
    '[\"Face ID facial recognition\", \"ProMotion technology\", \"USB-C connectivity\", \"5G (select models)\"]',
    'https://ducttape.co.nz/media/cache/45/f4/45f44df6b27fe71a78846791a20fe1ff.jpg',

    'Apple tablet featuring the M2 chip, 8GB RAM, and storage options of 256GB, 512GB, 1TB, or 2TB. 11-inch display, dual cameras, Face ID, and compatibility with iPadOS 16.'
  ),
  (
    7,
    'Sony Alpha A7III',
    'Sony',
    'Alpha A7III',
    '2018',
    1999.99,
    NULL,
    NULL,
    NULL,
    '{\"width\": null, \"height\": null}',
    NULL,
    NULL,
    '650g',
    '{\"length\": \"12.7cm\", \"width\": \"9.6cm\", \"depth\": \"6.0cm\"}',
    NULL,
    NULL,
    NULL,
    '{\"front\": null, \"rear\": null}',
    '[\"Fast hybrid AF\", \"Eye AF, Weather-sealed body\"]',
    'https://www.bhphotovideo.com/images/images2500x2500/sony_ilce_7m3k_b_alpha_a7_iii_mirrorless_1394219.jpg',

    'High-performance Sony camera with a weather-sealed body, fast hybrid AF, and additional features. Lightweight design at 650g, making it suitable for various photography scenarios.'
  ),
  (
    8,
    'Fitbit Charge 5',
    'Fitbit',
    'Charge 5',
    '2022',
    149.99,
    NULL,
    NULL,
    NULL,
    '{\"width\": null, \"height\": null}',
    NULL,
    'Up to 7 days',
    '28g',
    '{\"length\": \"25.8cm\", \"width\": \"2.2cm\", \"depth\": \"1.2cm\"}',
    NULL,
    NULL,
    NULL,
    '{\"front\": null, \"rear\": null}',
    '[\"Built-in GPS\", \"EDA sensor for stress tracking\", \"SpO2 sensor\", \"ECG app (pending FDA approval)\"]',
    'https://m.media-amazon.com/images/I/41MOVNsGMbL.jpg',

    'Fitbit fitness tracker with built-in GPS, stress tracking, SpO2 sensor, and up to 7 days of battery life. Lightweight at 28g, offering comprehensive health and activity monitoring.'
  );

-- --------------------------------------------------------

--
-- Table structure for table `shopping_cart`
--

CREATE TABLE `shopping_cart` (
  `cart_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shopping_cart`
--

INSERT INTO `shopping_cart` (`cart_id`, `user_id`) VALUES
(1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(50) NOT NULL UNIQUE,
  `username` varchar(30) NOT NULL,
  `password` text NOT NULL,
  `role` varchar(30) NOT NULL DEFAULT 'user',
  `active` int(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO
  `users` (
    `id`,
    `email`,
    `username`,
    `password`,
    `role`,
    `active`
  )
VALUES
  (
    1,
    'diongjakova06@gmail.com',
    'diongjakova',
    '12345678',
    'admin',
    0
  );

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart_items`
--
ALTER TABLE
  `cart_items`
ADD
  PRIMARY KEY (`item_id`),
ADD
  KEY `cart_id` (`cart_id`),
ADD
  KEY `product_id` (`product_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE
  `orders`
ADD
  PRIMARY KEY (`order_id`),
ADD
  KEY `cart_id` (`cart_id`);

--
-- Indexes for table `products`
--
ALTER TABLE
  `products`
ADD
  PRIMARY KEY (`id`);

--
-- Indexes for table `shopping_cart`
--
ALTER TABLE
  `shopping_cart`
ADD
  PRIMARY KEY (`cart_id`),
ADD
  UNIQUE KEY `user_id` (`user_id`) USING BTREE;

--
-- Indexes for table `users`
--
ALTER TABLE
  `users`
ADD
  PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE
  `cart_items`
MODIFY
  `item_id` int(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 70;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE
  `orders`
MODIFY
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 35;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE
  `products`
MODIFY
  `id` int(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 9;

--
-- AUTO_INCREMENT for table `shopping_cart`
--
ALTER TABLE
  `shopping_cart`
MODIFY
  `cart_id` int(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE
  `users`
MODIFY
  `id` int(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 9;

--
-- Constraints for table `cart_items`
--
ALTER TABLE
  `orders`
ADD
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`cart_id`) REFERENCES `shopping_cart` (`cart_id`) ON DELETE CASCADE;

ALTER TABLE
  `cart_items`
ADD
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `shopping_cart` (`cart_id`) ON DELETE CASCADE,
ADD
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;


--
-- Constraints for table `shopping_cart`
--
ALTER TABLE
  `shopping_cart`
ADD
  CONSTRAINT `shopping_cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

COMMIT;