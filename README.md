# Attendance Management System (NUST)

## Overview
This web-based application allows teachers and students at NUST to manage and track attendance for classes. Teachers can mark attendance for students and view all sessions (previous, current, and upcoming). Students can view their attendance and monitor their attendance percentages, with color-coded statuses for better clarity.

## Features
- **Authentication**: Users (teachers, students, and admins) are authenticated before accessing the system based on their roles.
- **Attendance Management**:
  - **Teachers** can mark attendance for students in different sessions.
  - **Students** can view their own attendance records.
- **Color-Coding**: Attendance status is color-coded based on percentage:
  - **Red**: Below 75% attendance.
  - **Yellow**: Below 85% attendance.
  - **Green**: 85% or above attendance.
- **User Interface**: A clean, user-friendly interface is used with a master view layout inherited by all pages.

## Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: PHP
- **Database**: MySQL

## Database Structure
The following tables are used to store the data:
1. **attendance**: Records student attendance with session details.
2. **class**: Contains class schedules and teacher information.
3. **user**: Stores user details (teachers, students, admins).

### SQL Schema:
```sql
-- Table structure for table `attendance`
CREATE TABLE IF NOT EXISTS `attendance` (
  `classid` int(50) NOT NULL,
  `studentid` int(50) NOT NULL,
  `isPresent` tinyint(1) NOT NULL,
  `comments` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Table structure for table `class`
CREATE TABLE IF NOT EXISTS `class` (
  `id` int(50) NOT NULL,
  `teacherid` int(50) NOT NULL,
  `starttime` time NOT NULL,
  `endtime` time NOT NULL,
  `credit_hours` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Table structure for table `user`
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(50) NOT NULL AUTO_INCREMENT,
  `fullname` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL,
  `class` varchar(10) NOT NULL,
  `role` enum('teacher','student','admin') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;
