CREATE DATABASE jvsdb;

CREATE TABLE Shirts ( 
	ShirtId INT NOT NULL AUTO_INCREMENT, 
	FrontImage VARCHAR(255) NOT NULL, 
	BackImage VARCHAR(255) NOT NULL, 
	RightImage VARCHAR(255) NOT NULL, 
	LeftImage VARCHAR(255) NOT NULL, 
    ShirtType VARCHAR(22) NOT NULL,
	PRIMARY KEY (ShirtId) 
);

ALTER TABLE Shirts
ADD ShirtColor VARCHAR(22);

/*CREATE TABLE Sizes (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Size VARCHAR(10) NOT NULL,
    Price INT NOT NULL
);

INSERT INTO Sizes (Size, Price) VALUES
    ('S', 50),
    ('M', 50),
    ('L', 50),
    ('XL', 50),
    ('2XL', 50),
    ('3XL', 60);*/

/*CREATE TABLE Orders (
    OrderId INT PRIMARY KEY AUTO_INCREMENT,
    FrontImage MEDIUMBLOB,
    BackImage MEDIUMBLOB,
    RightImage MEDIUMBLOB,
    LeftImage MEDIUMBLOB,
    TotalDetails TEXT,
    OrderDate DATE,
    TotalAmount DECIMAL(10, 2),
    Username VARCHAR(255),
);*/

CREATE TABLE Users (
    UserId INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    ContactNumber VARCHAR(100),
    Address TEXT
);

INSERT INTO Users (FirstName, Email, Password) VALUES ('Admin', 'admin', '$2y$10$JW9cDOzh4MDKbxbLvAh3eeCTxm1pjXh5TvDk/5GhT9KKrujYSVwK2');


CREATE TABLE Orders (
    OrderId INT PRIMARY KEY AUTO_INCREMENT,
    FrontImageUrl VARCHAR(255),
    BackImageUrl VARCHAR(255),
    RightImageUrl VARCHAR(255),
    LeftImageUrl VARCHAR(255),
    TotalDetails TEXT,
    OrderDate DATETIME,
    TotalAmount DECIMAL(10, 2),
    UserId INT,
    OrderStatus VARCHAR(50),
    DownPayment DECIMAL(10, 2),
    AdjustmentPrice DECIMAL(10, 2),
    AdjustmentType VARCHAR(10),
    CustomImageCount INT,
    ClothType VARCHAR(255),
    ReferenceKey VARCHAR(20),
    Address TEXT,
    ContactNumber VARCHAR(100),
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

CREATE TABLE CustomImages (
    ImageId INT PRIMARY KEY AUTO_INCREMENT,
    OrderId INT,
    ImageUrl VARCHAR(255), -- URL to the high-quality custom image
    ImagePrice DECIMAL(10, 2),
    FOREIGN KEY (OrderId) REFERENCES Orders(OrderId)
);

DROP TABLE RemarkImages;
DROP TABLE Remarks;
DROP TABLE CustomImages;
DROP TABLE Orders;

CREATE TABLE Notifications (
    NotifId INT PRIMARY KEY AUTO_INCREMENT,
    UserId INT NOT NULL,
    Title VARCHAR(20),
    Message VARCHAR(255) NOT NULL,
    ReferenceKey VARCHAR(20),
    Seen BOOLEAN DEFAULT FALSE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Remarks (
    RemarkId INT PRIMARY KEY AUTO_INCREMENT,
    OrderId INT,
    RemarkText TEXT,
    RemarkDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (OrderId) REFERENCES Orders(OrderId) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Replies (
    ReplyId INT PRIMARY KEY AUTO_INCREMENT,
    RemarkId INT,
    UserId INT,
    ReplyText TEXT,
    ReplyDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (RemarkId) REFERENCES Remarks(RemarkId) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE RemarkImages (
    ImageId INT PRIMARY KEY AUTO_INCREMENT,
    RemarkId INT,
    ImagePath VARCHAR(255),
    FOREIGN KEY (RemarkId) REFERENCES Remarks(RemarkId) ON DELETE CASCADE ON UPDATE CASCADE
);