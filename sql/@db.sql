 CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    creator VARCHAR(255) NOT NULL,
    status INTEGER NOT NULL DEFAULT 1,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

 CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    tel VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    bankName VARCHAR(255) NOT NULL,
    bankNumber VARCHAR(255) NOT NULL,
    bankCode VARCHAR(255) NOT NULL,
    code VARCHAR(255) NOT NULL,
    commission DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    recommend DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    cashback DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    quantity INTEGER NOT NULL DEFAULT 0,
    promotion INTEGER NOT NULL DEFAULT 0,
    description TEXT NOT NULL,
    promotionType VARCHAR(255) NOT NULL,
    new INTEGER NOT NULL DEFAULT 1,
    onceDay INTEGER NOT NULL DEFAULT 0,
    withdrawal VARCHAR(255) NOT NULL,
    deposit DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    depositType VARCHAR(255) NOT NULL,
    bonus DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    bonusType VARCHAR(255) NOT NULL,
    maxBonus DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    maxBonusType VARCHAR(255) NOT NULL,
    turnover DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    turnoverType VARCHAR(255) NOT NULL,
    maxWithdraw DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    running INTEGER NOT NULL DEFAULT 0,
    turn_value DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    turnoverA DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    turnoverB DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    turn_withdraw DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    turn_status INTEGER NOT NULL DEFAULT 0,
    status INTEGER NOT NULL DEFAULT 1,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS banks (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    bankName VARCHAR(255) NOT NULL,
    bankNumber VARCHAR(255) NOT NULL,
    bankCode VARCHAR(255) NOT NULL,
    deviceid VARCHAR(255) NOT NULL,
    pin VARCHAR(255) NOT NULL,
    status INTEGER NOT NULL DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 
CREATE TABLE IF NOT EXISTS deposit (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    bankName VARCHAR(255) NOT NULL,
    bankNumber VARCHAR(255) NOT NULL,
    bankCode VARCHAR(255) NOT NULL,
    toBankName VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    referenceNo VARCHAR(255) NOT NULL,
    note TEXT NOT NULL,
    created INTEGER NOT NULL DEFAULT 0,
    status INTEGER NOT NULL DEFAULT 0,
     createdAt VARCHAR(255) NOT NULL
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 

CREATE TABLE IF NOT EXISTS withdraw (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    bankName VARCHAR(255) NOT NULL,
    bankNumber VARCHAR(255) NOT NULL,
    bankCode VARCHAR(255) NOT NULL,
    toBankName VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    referenceNo VARCHAR(255) NOT NULL,
    note TEXT NOT NULL,
    created INTEGER NOT NULL DEFAULT 0,
    status INTEGER NOT NULL DEFAULT 0,
    createdAt VARCHAR(255) NOT NULL
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS transfer (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    fromName VARCHAR(255) NOT NULL,
    fromBankName VARCHAR(255) NOT NULL,
    fromBankNumber VARCHAR(255) NOT NULL,
    toName VARCHAR(255) NOT NULL,
    toBankName VARCHAR(255) NOT NULL,
    toBankNumber VARCHAR(255) NOT NULL,
    toBankCode VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    note TEXT NOT NULL,
    status INTEGER NOT NULL DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ref (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    ref VARCHAR(255) NOT NULL,
    active INTEGER NOT NULL DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS code (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(255) NOT NULL,
    credit DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    turn DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    max_withdraw DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status INTEGER NOT NULL DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS promotion (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    img VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    happyTime VARCHAR(255) NOT NULL,
    withdraw VARCHAR(255) NOT NULL,
    deposit DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    depositType VARCHAR(255) NOT NULL,
    bonus DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    bonusType VARCHAR(255) NOT NULL,
    maxBonus DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    maxBonusType VARCHAR(255) NOT NULL,
    turnover DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    turnoverType VARCHAR(255) NOT NULL,
    maxWithdraw DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status INTEGER NOT NULL DEFAULT 1,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    data TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS setting (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    data TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;