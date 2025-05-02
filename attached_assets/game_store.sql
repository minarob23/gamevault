-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 28, 2025 at 03:35 AM
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
-- Database: `game_store`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_login` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fullName`, `email`, `username`, `password`, `created_at`, `last_login`) VALUES
(1, 'moahmed', 'moahmed@gmail.com', 'moahmed@gmail.com', '$2y$10$Eump1yoIeoCrQFFhO5QSqekeLDxMstvyJxTnoTiv7ZUkbsz/.Uvi6', '2025-03-13 16:49:10', '2025-03-13 16:53:55'),
(2, 'adminq', 'adminq@gmail.com', 'adminq@gmail.com', '$2y$10$4XRPXzlIxN2mWFyxuNHHj.hxdWe.TNqe71.YjtU5OaKOwTnpwrxc2', '2025-03-13 16:52:47', '2025-03-13 16:53:05'),
(3, 'f', 'f', 'f', '$2y$10$pj6Jcf8wLcoMcYOctRD3eupdqgva3IXZ0cUgk05gmzddGo5VamdSS', '2025-04-20 11:33:47', NULL),
(4, 'd', 'd', 'd', '$2y$10$L3z8kSPQb/SXoU6pljeZCuVb.urXHQFtwEIwTlqRNdENxRdE5gKUy', '2025-04-25 12:44:52', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `idx_users_email` (`email`),
  ADD KEY `idx_users_username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
