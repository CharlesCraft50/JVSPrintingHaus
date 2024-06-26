-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 26, 2024 at 03:07 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `jvsdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `customimages`
--

CREATE TABLE `customimages` (
  `ImageId` int(11) NOT NULL,
  `OrderId` int(11) DEFAULT NULL,
  `ImageUrl` varchar(255) DEFAULT NULL,
  `ImagePrice` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customimages`
--

INSERT INTO `customimages` (`ImageId`, `OrderId`, `ImageUrl`, `ImagePrice`) VALUES
(3, 13, 'uploads/customImages/customImage0_6678e2f020a13.png', 80.00),
(4, 13, 'uploads/customImages/customImage1_6678e2f0210d0.png', 40.00),
(5, 14, 'uploads/customImages/customImage0_6678e7d59e5e0.png', 40.00),
(6, 15, 'uploads/customImages/customImage0_667967ba19a47.png', 80.00),
(7, 15, 'uploads/customImages/customImage1_667967ba1c282.png', 40.00),
(8, 17, 'uploads/customImages/customImage0_667b53fda620c.png', 80.00),
(9, 17, 'uploads/customImages/customImage1_667b53fda9aa5.png', 40.00);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `NotifId` int(11) NOT NULL,
  `UserId` int(11) NOT NULL,
  `Title` varchar(20) DEFAULT NULL,
  `Message` varchar(255) NOT NULL,
  `ReferenceKey` varchar(20) DEFAULT NULL,
  `Seen` tinyint(1) DEFAULT 0,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`NotifId`, `UserId`, `Title`, `Message`, `ReferenceKey`, `Seen`, `CreatedAt`) VALUES
(1, 1, 'New Order - ', 'Admin - ORDER_6678df87e9f009.60630321', 'ORDER_6678df87e9f009', 0, '2024-06-24 02:52:55'),
(2, 1, 'New Order - ', 'Admin - ORDER_6678e076b8bd08.75217858', 'ORDER_6678e076b8bd08', 0, '2024-06-24 02:56:54'),
(3, 1, 'New Order - ', 'Admin - ORDER_6678e0793f32c5.14807257', 'ORDER_6678e0793f32c5', 0, '2024-06-24 02:56:57'),
(4, 1, 'New Order - ', 'Admin - ORDER_6678e07a9da2a0.70274337', 'ORDER_6678e07a9da2a0', 0, '2024-06-24 02:56:58'),
(5, 1, 'New Order - ', 'Admin - ORDER_6678e07b985bb1.99363563', 'ORDER_6678e07b985bb1', 0, '2024-06-24 02:56:59'),
(6, 1, 'New Order - ', 'Admin - ORDER_6678e07fdf96b7.74672212', 'ORDER_6678e07fdf96b7', 0, '2024-06-24 02:57:03'),
(7, 1, 'New Order - ', 'Admin - ORDER_6678e0812d7b04.37145859', 'ORDER_6678e0812d7b04', 0, '2024-06-24 02:57:05'),
(8, 1, 'New Order - ', 'Admin - ORDER_6678e0826160d1.58856813', 'ORDER_6678e0826160d1', 0, '2024-06-24 02:57:06'),
(9, 1, 'New Order - ', 'Admin - ORDER_6678e098857c30.67240763', 'ORDER_6678e098857c30', 0, '2024-06-24 02:57:28'),
(10, 1, 'New Order - ', 'Admin - ORDER_6678e0999dad01.09581922', 'ORDER_6678e0999dad01', 0, '2024-06-24 02:57:29'),
(11, 1, 'New Order - ', 'Admin - ORDER_6678e0b54e3d51.37214844', 'ORDER_6678e0b54e3d51', 0, '2024-06-24 02:57:57'),
(12, 1, 'New Order - ', 'Admin - ORDER_6678e247c80425.26648067', 'ORDER_6678e247c80425', 0, '2024-06-24 03:04:39'),
(13, 1, 'New Order - ', 'Admin - ORDER_6678e2f01f97c3.55442227', 'ORDER_6678e2f01f97c3', 0, '2024-06-24 03:07:28'),
(14, 1, 'New Reply - ', 'Ok', 'ORDER_6678e2f01f97c3', 0, '2024-06-24 03:17:12'),
(15, 1, 'New Remarks - ', '', 'ORDER_6678e2f01f97c3', 0, '2024-06-24 03:17:44'),
(16, 1, 'New Remarks - ', '', 'ORDER_6678e2f01f97c3', 0, '2024-06-24 03:17:59'),
(17, 1, 'New Remarks - ', 'er', 'ORDER_6678e2f01f97c3', 0, '2024-06-24 03:18:26'),
(18, 1, 'New Remarks - ', '', 'ORDER_6678e2f01f97c3', 0, '2024-06-24 03:19:10'),
(19, 1, 'New Remarks - ', '', 'ORDER_6678e2f01f97c3', 0, '2024-06-24 03:19:50'),
(20, 1, 'New Remarks - ', '', 'ORDER_6678e2f01f97c3', 0, '2024-06-24 03:20:36'),
(21, 1, 'New Remarks - ', '', 'ORDER_6678e2f01f97c3', 0, '2024-06-24 03:21:20'),
(22, 1, 'New Order - ', 'Admin - ORDER_6678e7d547e5b4.74160151', 'ORDER_6678e7d547e5b4', 0, '2024-06-24 03:28:21'),
(23, 1, 'New Order - ', 'Admin - ORDER_667967b9f002c7.49631669', 'ORDER_667967b9f002c7', 0, '2024-06-24 12:34:02'),
(24, 1, 'New Reply - ', 'Tests', 'ORDER_667967b9f002c7', 0, '2024-06-24 12:34:21'),
(25, 1, 'New Order - ', 'Code - ORDER_667968167d7167.16410888', 'ORDER_667968167d7167', 1, '2024-06-24 12:35:34'),
(26, 1, 'New Reply - ', 'Test', 'ORDER_667968167d7167', 1, '2024-06-24 12:35:41'),
(27, 2, 'New Reply - ', 'Ok', 'ORDER_6678e2f01f97c3', 0, '2024-06-24 12:36:50'),
(28, 2, 'New Remarks - ', '', 'ORDER_667968167d7167', 0, '2024-06-24 12:36:55'),
(29, 1, 'Status Update - ', 'Your order status has been updated to Processing!', 'ORDER_6678e2f01f97c3', 1, '2024-06-24 12:37:21'),
(30, 1, 'Status Update - ', 'Your order status has been updated to Shipped!', 'ORDER_6678e2f01f97c3', 1, '2024-06-24 12:38:14'),
(31, 1, 'Status Update - ', 'Your order status has been updated to Deleted!', 'ORDER_6678e2f01f97c3', 1, '2024-06-24 12:39:48'),
(32, 1, 'Status Update - ', 'Your order status has been updated to Cancelled!', 'ORDER_6678e2f01f97c3', 1, '2024-06-24 12:40:08'),
(33, 1, 'New Order - ', 'John - ORDER_667b53fd99b240.59872785', 'ORDER_667b53fd99b240', 1, '2024-06-25 23:34:21'),
(34, 1, 'New Reply - ', 'Hello', 'ORDER_667b53fd99b240', 0, '2024-06-25 23:36:13'),
(35, 1, 'New Reply - ', 'Like', 'ORDER_667b53fd99b240', 0, '2024-06-25 23:37:26'),
(36, 3, 'New Remarks - ', '', 'ORDER_667b53fd99b240', 0, '2024-06-25 23:39:19'),
(37, 1, 'Status Update - ', 'Your order status has been updated to Pending!', 'ORDER_667967b9f002c7', 0, '2024-06-25 23:40:14'),
(38, 1, 'Status Update - ', 'Your order status has been updated to Pending!', 'ORDER_667967b9f002c7', 0, '2024-06-25 23:40:38'),
(39, 1, 'Status Update - ', 'Your order status has been updated to Shipped!', 'ORDER_667967b9f002c7', 0, '2024-06-25 23:41:26');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `OrderId` int(11) NOT NULL,
  `FrontImageUrl` varchar(255) DEFAULT NULL,
  `BackImageUrl` varchar(255) DEFAULT NULL,
  `RightImageUrl` varchar(255) DEFAULT NULL,
  `LeftImageUrl` varchar(255) DEFAULT NULL,
  `TotalDetails` text DEFAULT NULL,
  `OrderDate` datetime DEFAULT NULL,
  `TotalAmount` decimal(10,2) DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL,
  `OrderStatus` varchar(50) DEFAULT NULL,
  `DownPayment` decimal(10,2) DEFAULT NULL,
  `AdjustmentPrice` decimal(10,2) DEFAULT NULL,
  `AdjustmentType` varchar(10) DEFAULT NULL,
  `CustomImageCount` int(11) DEFAULT NULL,
  `ClothType` varchar(255) DEFAULT NULL,
  `ReferenceKey` varchar(20) DEFAULT NULL,
  `Address` text DEFAULT NULL,
  `ContactNumber` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`OrderId`, `FrontImageUrl`, `BackImageUrl`, `RightImageUrl`, `LeftImageUrl`, `TotalDetails`, `OrderDate`, `TotalAmount`, `UserId`, `OrderStatus`, `DownPayment`, `AdjustmentPrice`, `AdjustmentType`, `CustomImageCount`, `ClothType`, `ReferenceKey`, `Address`, `ContactNumber`) VALUES
(13, 'uploads/shirtImages/tShirtImage0_6678e2f01f9f1.png', 'uploads/shirtImages/tShirtImage1_6678e2f01fda1.png', 'uploads/shirtImages/tShirtImage2_6678e2f02021d.png', 'uploads/shirtImages/tShirtImage3_6678e2f0204f4.png', '\r\n		    	<div class=\"total-row\">\r\n		    	<p><span id=\"sizeCount\">1</span> item(s) selected</p>\r\n		    	<div class=\"space2\"></div>\r\n		    	<p id=\"seeDetails\">Details</p>\r\n			    </div>\r\n			    <div class=\"detailsArea\" style=\"display: block;\">\r\n			    	<h2>Details</h2>\r\n				    <table>\r\n				        <thead>\r\n				            <tr>\r\n				                <th>Size</th>\r\n				                <th>Subtotal</th>\r\n				                <th>Total Amount</th>\r\n				            </tr>\r\n				        </thead>\r\n				        <tbody id=\"detailsTableBody\"><tr><td>Medium</td><td>1</td><td>₱250</td></tr></tbody>\r\n				    </table>\r\n			    </div>\r\n			    <div class=\"otherCharges total-row\">\r\n					<h3 data-price=\"50\">Color:</h3>\r\n					<div class=\"space2\"></div>\r\n					<h3>₱50</h3>\r\n				</div>\r\n				<div class=\"otherCharges total-row\">\r\n					<h3 data-price=\"120\" id=\"designPrice\">Design:</h3>\r\n					<div class=\"space2\"></div>\r\n					<h3>₱<span id=\"designPriceContainer\">120</span></h3>\r\n				</div>\r\n				<div class=\"otherCharges total-row\">\r\n					<h3 data-price=\"300\" id=\"clothTypePrice\">Type (<span id=\"clothTypeChose\">pure cotton</span>):</h3>\r\n					<div class=\"space2\"></div>\r\n					<h3>₱<span id=\"clothTypeAmount\">300</span></h3>\r\n				</div>\r\n			    <div class=\"total-row\">\r\n			    	<h2>Total:</h2>\r\n			    	<div class=\"space2\"></div>\r\n			    	<h2>₱<span id=\"totalSum\">720</span></h2>\r\n			    </div>\r\n		    ', '2024-06-24 05:07:28', 720.00, 1, 'Cancelled', 0.00, 0.00, 'Added', 2, 'pure cotton', 'ORDER_6678e2f01f97c3', '{}', '09954609624'),
(14, 'uploads/shirtImages/tShirtImage0_6678e7d547ed9.png', 'uploads/shirtImages/tShirtImage1_6678e7d59dc47.png', 'uploads/shirtImages/tShirtImage2_6678e7d59df7e.png', 'uploads/shirtImages/tShirtImage3_6678e7d59e353.png', '\r\n		    	<div class=\"total-row\">\r\n		    	<p><span id=\"sizeCount\">1</span> item(s) selected</p>\r\n		    	<div class=\"space2\"></div>\r\n		    	<p id=\"seeDetails\">Details</p>\r\n			    </div>\r\n			    <div class=\"detailsArea\" style=\"display: block;\">\r\n			    	<h2>Details</h2>\r\n				    <table>\r\n				        <thead>\r\n				            <tr>\r\n				                <th>Size</th>\r\n				                <th>Subtotal</th>\r\n				                <th>Total Amount</th>\r\n				            </tr>\r\n				        </thead>\r\n				        <tbody id=\"detailsTableBody\"><tr><td>Small</td><td>1</td><td>₱250</td></tr></tbody>\r\n				    </table>\r\n			    </div>\r\n			    <div class=\"otherCharges total-row\">\r\n					<h3 data-price=\"50\">Color:</h3>\r\n					<div class=\"space2\"></div>\r\n					<h3>₱50</h3>\r\n				</div>\r\n				<div class=\"otherCharges total-row\">\r\n					<h3 data-price=\"40\" id=\"designPrice\">Design:</h3>\r\n					<div class=\"space2\"></div>\r\n					<h3>₱<span id=\"designPriceContainer\">40</span></h3>\r\n				</div>\r\n				<div class=\"otherCharges total-row\">\r\n					<h3 data-price=\"300\" id=\"clothTypePrice\">Type (<span id=\"clothTypeChose\">pure cotton</span>):</h3>\r\n					<div class=\"space2\"></div>\r\n					<h3>₱<span id=\"clothTypeAmount\">300</span></h3>\r\n				</div>\r\n			    <div class=\"total-row\">\r\n			    	<h2>Total:</h2>\r\n			    	<div class=\"space2\"></div>\r\n			    	<h2>₱<span id=\"totalSum\">640</span></h2>\r\n			    </div>\r\n		    ', '2024-06-24 05:28:21', 640.00, 1, 'Pending', 0.00, 0.00, 'Added', 1, 'pure cotton', 'ORDER_6678e7d547e5b4', '{}', '09954609624'),
(15, 'uploads/shirtImages/tShirtImage0_667967b9f016d.png', 'uploads/shirtImages/tShirtImage1_667967b9f06f3.png', 'uploads/shirtImages/tShirtImage2_667967ba16c24.png', 'uploads/shirtImages/tShirtImage3_667967ba1964d.png', '\r\n		    	<div class=\"total-row\">\r\n		    	<p><span id=\"sizeCount\">1</span> item(s) selected</p>\r\n		    	<div class=\"space2\"></div>\r\n		    	<p id=\"seeDetails\">Details</p>\r\n			    </div>\r\n			    <div class=\"detailsArea\" style=\"display: block;\">\r\n			    	<h2>Details</h2>\r\n				    <table>\r\n				        <thead>\r\n				            <tr>\r\n				                <th>Size</th>\r\n				                <th>Subtotal</th>\r\n				                <th>Total Amount</th>\r\n				            </tr>\r\n				        </thead>\r\n				        <tbody id=\"detailsTableBody\"><tr><td>Medium</td><td>1</td><td>₱250</td></tr></tbody>\r\n				    </table>\r\n			    </div>\r\n			    <div class=\"otherCharges total-row\">\r\n					<h3 data-price=\"50\">Color:</h3>\r\n					<div class=\"space2\"></div>\r\n					<h3>₱50</h3>\r\n				</div>\r\n				<div class=\"otherCharges total-row\">\r\n					<h3 data-price=\"120\" id=\"designPrice\">Design:</h3>\r\n					<div class=\"space2\"></div>\r\n					<h3>₱<span id=\"designPriceContainer\">120</span></h3>\r\n				</div>\r\n				<div class=\"otherCharges total-row\">\r\n					<h3 data-price=\"300\" id=\"clothTypePrice\">Type (<span id=\"clothTypeChose\">pure cotton</span>):</h3>\r\n					<div class=\"space2\"></div>\r\n					<h3>₱<span id=\"clothTypeAmount\">300</span></h3>\r\n				</div>\r\n			    <div class=\"total-row\">\r\n			    	<h2>Total:</h2>\r\n			    	<div class=\"space2\"></div>\r\n			    	<h2>₱<span id=\"totalSum\">720</span></h2>\r\n			    </div>\r\n		    ', '2024-06-24 14:34:01', 720.00, 1, 'Shipped', 100.00, 10.00, 'Added', 2, 'pure cotton', 'ORDER_667967b9f002c7', '{}', '09954609624'),
(16, 'uploads/shirtImages/tShirtImage0_667968167d79f.png', 'uploads/shirtImages/tShirtImage1_6679681698f8e.png', 'uploads/shirtImages/tShirtImage2_66796816991ea.png', 'uploads/shirtImages/tShirtImage3_6679681699580.png', '\r\n		    	<div class=\"total-row\">\r\n		    	<p><span id=\"sizeCount\">1</span> item(s) selected</p>\r\n		    	<div class=\"space2\"></div>\r\n		    	<p id=\"seeDetails\">Details</p>\r\n			    </div>\r\n			    <div class=\"detailsArea\" style=\"display: block;\">\r\n			    	<h2>Details</h2>\r\n				    <table>\r\n				        <thead>\r\n				            <tr>\r\n				                <th>Size</th>\r\n				                <th>Subtotal</th>\r\n				                <th>Total Amount</th>\r\n				            </tr>\r\n				        </thead>\r\n				        <tbody id=\"detailsTableBody\"><tr><td>Medium</td><td>1</td><td>₱250</td></tr></tbody>\r\n				    </table>\r\n			    </div>\r\n			    <div class=\"otherCharges total-row\">\r\n					<h3 data-price=\"50\">Color:</h3>\r\n					<div class=\"space2\"></div>\r\n					<h3>₱50</h3>\r\n				</div>\r\n				<div class=\"otherCharges total-row\" style=\"display: none;\">\r\n					<h3 data-price=\"0\" id=\"designPrice\">Design:</h3>\r\n					<div class=\"space2\"></div>\r\n					<h3>₱<span id=\"designPriceContainer\"></span></h3>\r\n				</div>\r\n				<div class=\"otherCharges total-row\">\r\n					<h3 data-price=\"300\" id=\"clothTypePrice\">Type (<span id=\"clothTypeChose\">pure cotton</span>):</h3>\r\n					<div class=\"space2\"></div>\r\n					<h3>₱<span id=\"clothTypeAmount\">300</span></h3>\r\n				</div>\r\n			    <div class=\"total-row\">\r\n			    	<h2>Total:</h2>\r\n			    	<div class=\"space2\"></div>\r\n			    	<h2>₱<span id=\"totalSum\">600</span></h2>\r\n			    </div>\r\n		    ', '2024-06-24 14:35:34', 600.00, 2, 'Cancelled', 0.00, 0.00, 'Added', 0, 'pure cotton', 'ORDER_667968167d7167', '{}', '09954609624'),
(17, 'uploads/shirtImages/tShirtImage0_667b53fd99b67.png', 'uploads/shirtImages/tShirtImage1_667b53fda2f82.png', 'uploads/shirtImages/tShirtImage2_667b53fda5f92.png', 'uploads/shirtImages/tShirtImage3_667b53fda60cd.png', '\r\n		    	<div class=\"total-row\">\r\n		    	<p><span id=\"sizeCount\">1</span> item(s) selected</p>\r\n		    	<div class=\"space2\"></div>\r\n		    	<p id=\"seeDetails\">Details</p>\r\n			    </div>\r\n			    <div class=\"detailsArea\" style=\"display: block;\">\r\n			    	<h2>Details</h2>\r\n				    <table>\r\n				        <thead>\r\n				            <tr>\r\n				                <th>Size</th>\r\n				                <th>Subtotal</th>\r\n				                <th>Total Amount</th>\r\n				            </tr>\r\n				        </thead>\r\n				        <tbody id=\"detailsTableBody\"><tr><td>Small</td><td>1</td><td>₱250</td></tr></tbody>\r\n				    </table>\r\n			    </div>\r\n			    <div class=\"otherCharges total-row\">\r\n					<h3 data-price=\"50\">Color:</h3>\r\n					<div class=\"space2\"></div>\r\n					<h3>₱50</h3>\r\n				</div>\r\n				<div class=\"otherCharges total-row\">\r\n					<h3 data-price=\"120\" id=\"designPrice\">Design:</h3>\r\n					<div class=\"space2\"></div>\r\n					<h3>₱<span id=\"designPriceContainer\">120</span></h3>\r\n				</div>\r\n				<div class=\"otherCharges total-row\">\r\n					<h3 data-price=\"300\" id=\"clothTypePrice\">Type (<span id=\"clothTypeChose\">pure cotton</span>):</h3>\r\n					<div class=\"space2\"></div>\r\n					<h3>₱<span id=\"clothTypeAmount\">300</span></h3>\r\n				</div>\r\n			    <div class=\"total-row\">\r\n			    	<h2>Total:</h2>\r\n			    	<div class=\"space2\"></div>\r\n			    	<h2>₱<span id=\"totalSum\">720</span></h2>\r\n			    </div>\r\n		    ', '2024-06-26 01:34:21', 720.00, 3, 'Cancelled', 0.00, 0.00, 'Added', 2, 'pure cotton', 'ORDER_667b53fd99b240', '{}', '09954609624');

-- --------------------------------------------------------

--
-- Table structure for table `remarkimages`
--

CREATE TABLE `remarkimages` (
  `ImageId` int(11) NOT NULL,
  `RemarkId` int(11) DEFAULT NULL,
  `ImagePath` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `remarkimages`
--

INSERT INTO `remarkimages` (`ImageId`, `RemarkId`, `ImagePath`) VALUES
(7, 24, 'uploads/remarksImages/customImage_0_667968676c89b.png'),
(8, 26, 'uploads/remarksImages/customImage_0_667b55274ada5.png');

-- --------------------------------------------------------

--
-- Table structure for table `remarks`
--

CREATE TABLE `remarks` (
  `RemarkId` int(11) NOT NULL,
  `OrderId` int(11) DEFAULT NULL,
  `RemarkText` text DEFAULT NULL,
  `RemarkDate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `remarks`
--

INSERT INTO `remarks` (`RemarkId`, `OrderId`, `RemarkText`, `RemarkDate`) VALUES
(13, 13, 'Thank you for your purchase!\nIf you have any concerns or problems, please reply to this comment or contact our customer service.\nBest regards, JVS Printing Haus\n\nGCash Payment: 09498831039\n\nPlease provide your reference number in the comments after making your payment.', '2024-06-24 03:07:28'),
(21, 14, 'Thank you for your purchase!\nIf you have any concerns or problems, please reply to this comment or contact our customer service.\nBest regards, JVS Printing Haus\n\nGCash Payment: 09498831039\n\nPlease provide your reference number in the comments after making your payment.', '2024-06-24 03:28:21'),
(22, 15, 'Thank you for your purchase!\nIf you have any concerns or problems, please reply to this comment or contact our customer service.\nBest regards, JVS Printing Haus\n\nGCash Payment: 09498831039\n\nPlease provide your reference number in the comments after making your payment.', '2024-06-24 12:34:02'),
(23, 16, 'Thank you for your purchase!\nIf you have any concerns or problems, please reply to this comment or contact our customer service.\nBest regards, JVS Printing Haus\n\nGCash Payment: 09498831039\n\nPlease provide your reference number in the comments after making your payment.', '2024-06-24 12:35:34'),
(24, 16, '', '2024-06-24 12:36:55'),
(25, 17, 'Thank you for your purchase!\nIf you have any concerns or problems, please reply to this comment or contact our customer service.\nBest regards, JVS Printing Haus\n\nGCash Payment: 09498831039\n\nPlease provide your reference number in the comments after making your payment.', '2024-06-25 23:34:21'),
(26, 17, '', '2024-06-25 23:39:19');

-- --------------------------------------------------------

--
-- Table structure for table `replies`
--

CREATE TABLE `replies` (
  `ReplyId` int(11) NOT NULL,
  `RemarkId` int(11) DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL,
  `ReplyText` text DEFAULT NULL,
  `ReplyDate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `replies`
--

INSERT INTO `replies` (`ReplyId`, `RemarkId`, `UserId`, `ReplyText`, `ReplyDate`) VALUES
(2, 22, 1, 'Tests', '2024-06-24 12:34:21'),
(4, 23, 1, 'Ok', '2024-06-24 12:36:50'),
(6, 25, 3, 'Like', '2024-06-25 23:37:26');

-- --------------------------------------------------------

--
-- Table structure for table `shirts`
--

CREATE TABLE `shirts` (
  `ShirtId` int(11) NOT NULL,
  `FrontImage` varchar(255) NOT NULL,
  `BackImage` varchar(255) NOT NULL,
  `RightImage` varchar(255) NOT NULL,
  `LeftImage` varchar(255) NOT NULL,
  `ShirtType` varchar(22) NOT NULL,
  `ShirtColor` varchar(22) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shirts`
--

INSERT INTO `shirts` (`ShirtId`, `FrontImage`, `BackImage`, `RightImage`, `LeftImage`, `ShirtType`, `ShirtColor`) VALUES
(12, 'frontImage-clothes-test-1.png', 'backImage-', 'rightImage-', 'leftImage-', 'design', 'Black'),
(13, 'frontImage-Design-Short-Sleeve-Tee-Shirt-3D-Cool-T-Shirts-Designs-Best-Selling-Men-Cafe-Racer-Club.webp', 'backImage-', 'rightImage-', 'leftImage-', 'design', 'Navy Blue'),
(14, 'frontImage-il_fullxfull.1191962314_h58g.webp', 'backImage-', 'rightImage-', 'leftImage-', 'design', 'Black'),
(15, 'frontImage-e5dd8b64-3212-4d3b-9f8e-d17a9936aceb_1.669dc5b958fedeb76f2c23f57634671b.webp', 'backImage-', 'rightImage-', 'leftImage-', 'design', 'Black'),
(16, 'frontImage-613TCvERoGL._AC_UL1500_.jpg', 'backImage-', 'rightImage-', 'leftImage-', 'design', 'Black'),
(18, 'frontImage-A13usaonutL._CLa_2140,2000_91Xz6n4HzqL.png_0,0,2140,2000+0.0,0.0,2140.0,2000.0_AC_UL1500_.jpg', 'backImage-', 'rightImage-', 'leftImage-', 'design', ''),
(19, 'frontImage-2,width=800,height=800.png', 'backImage-2,width=800,height=800 (1).png', 'rightImage-2,width=800,height=800 (2).png', 'leftImage-2,width=800,height=800 (3).png', 'color', 'Black'),
(21, 'frontImage-231,width=800,height=800.png', 'backImage-231,width=800,height=800 (1).png', 'rightImage-231,width=800,height=800 (2).png', 'leftImage-231,width=800,height=800 (3).png', 'color', 'White'),
(22, 'frontImage-259,width=800,height=800.png', 'backImage-259,width=800,height=800 (1).png', 'rightImage-259,width=800,height=800 (2).png', 'leftImage-259,width=800,height=800 (3).png', 'color', 'Bright Green'),
(23, 'frontImage-695,width=800,height=800.png', 'backImage-695,width=800,height=800 (1).png', 'rightImage-695,width=800,height=800 (2).png', 'leftImage-695,width=800,height=800 (3).png', 'color', 'Turquoise'),
(24, 'frontImage-66,width=800,height=800.png', 'backImage-66,width=800,height=800 (1).png', 'rightImage-66,width=800,height=800 (2).png', 'leftImage-66,width=800,height=800 (3).png', 'color', 'Forest Green'),
(25, 'frontImage-715,width=800,height=800.png', 'backImage-715,width=800,height=800 (1).png', 'rightImage-715,width=800,height=800 (2).png', 'leftImage-715,width=800,height=800 (3).png', 'color', 'Olive Green'),
(26, 'frontImage-7,width=800,height=800.png', 'backImage-7,width=800,height=800 (1).png', 'rightImage-7,width=800,height=800 (2).png', 'leftImage-7,width=800,height=800 (3).png', 'color', 'Yellow'),
(27, 'frontImage-228,width=800,height=800.png', 'backImage-228,width=800,height=800 (1).png', 'rightImage-228,width=800,height=800 (2).png', 'leftImage-33,width=800,height=800.png', 'color', 'Charcoal Black'),
(28, 'frontImage-140,width=800,height=800.png', 'backImage-140,width=800,height=800 (1).png', 'rightImage-140,width=800,height=800 (2).png', 'leftImage-140,width=800,height=800 (3).png', 'color', 'Natural'),
(29, 'frontImage-196,width=800,height=800.png', 'backImage-196,width=800,height=800 (1).png', 'rightImage-196,width=800,height=800 (2).png', 'leftImage-196,width=800,height=800 (3).png', 'color', 'Red'),
(30, 'frontImage-295,width=800,height=800.png', 'backImage-295,width=800,height=800 (1).png', 'rightImage-295,width=800,height=800 (2).png', 'leftImage-295,width=800,height=800 (3).png', 'color', 'Dark Red'),
(31, 'frontImage-258,width=800,height=800.png', 'backImage-258,width=800,height=800 (1).png', 'rightImage-258,width=800,height=800 (2).png', 'leftImage-258,width=800,height=800 (3).png', 'color', 'Royal Blue'),
(34, 'frontImage-386,width=800,height=800.png', 'backImage-386,width=800,height=800 (1).png', 'rightImage-386,width=800,height=800 (2).png', 'leftImage-386,width=800,height=800 (3).png', 'color', 'Pink'),
(35, 'frontImage-OIP (1).jpg', 'backImage-', 'rightImage-', 'leftImage-', 'design', '');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `UserId` int(11) NOT NULL,
  `FirstName` varchar(50) NOT NULL,
  `LastName` varchar(50) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `ContactNumber` varchar(100) DEFAULT NULL,
  `Address` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UserId`, `FirstName`, `LastName`, `Email`, `Password`, `ContactNumber`, `Address`) VALUES
(1, 'Admin', '', 'admin', '$2y$10$JW9cDOzh4MDKbxbLvAh3eeCTxm1pjXh5TvDk/5GhT9KKrujYSVwK2', '09954609624', NULL),
(2, 'Code', 'Santos', 'charlescraft50yt@gmail.com', '$2y$10$ktCPfS/aBdkUO.h5QEQHyOjFLZF21Z1tbnnV5s84Yre8FfSlnLmUC', '09954609624', NULL),
(3, 'John', 'Doe', 'johndoe@gmail.com', '$2y$10$uZuxqq/JiH3rHnj20DQCE.7Rdoqt1fGXNxoYPYhLZ8f7A91EZel2a', '09954609624', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customimages`
--
ALTER TABLE `customimages`
  ADD PRIMARY KEY (`ImageId`),
  ADD KEY `OrderId` (`OrderId`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`NotifId`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`OrderId`),
  ADD KEY `UserId` (`UserId`);

--
-- Indexes for table `remarkimages`
--
ALTER TABLE `remarkimages`
  ADD PRIMARY KEY (`ImageId`),
  ADD KEY `RemarkId` (`RemarkId`);

--
-- Indexes for table `remarks`
--
ALTER TABLE `remarks`
  ADD PRIMARY KEY (`RemarkId`),
  ADD KEY `OrderId` (`OrderId`);

--
-- Indexes for table `replies`
--
ALTER TABLE `replies`
  ADD PRIMARY KEY (`ReplyId`),
  ADD KEY `RemarkId` (`RemarkId`),
  ADD KEY `UserId` (`UserId`);

--
-- Indexes for table `shirts`
--
ALTER TABLE `shirts`
  ADD PRIMARY KEY (`ShirtId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserId`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customimages`
--
ALTER TABLE `customimages`
  MODIFY `ImageId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `NotifId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `OrderId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `remarkimages`
--
ALTER TABLE `remarkimages`
  MODIFY `ImageId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `remarks`
--
ALTER TABLE `remarks`
  MODIFY `RemarkId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `replies`
--
ALTER TABLE `replies`
  MODIFY `ReplyId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `shirts`
--
ALTER TABLE `shirts`
  MODIFY `ShirtId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `UserId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `customimages`
--
ALTER TABLE `customimages`
  ADD CONSTRAINT `customimages_ibfk_1` FOREIGN KEY (`OrderId`) REFERENCES `orders` (`OrderId`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`UserId`);

--
-- Constraints for table `remarkimages`
--
ALTER TABLE `remarkimages`
  ADD CONSTRAINT `remarkimages_ibfk_1` FOREIGN KEY (`RemarkId`) REFERENCES `remarks` (`RemarkId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `remarks`
--
ALTER TABLE `remarks`
  ADD CONSTRAINT `remarks_ibfk_1` FOREIGN KEY (`OrderId`) REFERENCES `orders` (`OrderId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `replies`
--
ALTER TABLE `replies`
  ADD CONSTRAINT `replies_ibfk_1` FOREIGN KEY (`RemarkId`) REFERENCES `remarks` (`RemarkId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `replies_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `users` (`UserId`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
