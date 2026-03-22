-- barterly Database Schema for Azure SQL Edge / SQL Server

CREATE TABLE users (
    id            INT IDENTITY(1,1) PRIMARY KEY,
    name          NVARCHAR(100) NOT NULL,
    email         NVARCHAR(255) NOT NULL UNIQUE,
    university    NVARCHAR(150) NOT NULL,
    year          NVARCHAR(20),
    bio           NVARCHAR(MAX) DEFAULT '',
    password_hash NVARCHAR(255) NOT NULL,
    credits       INT DEFAULT 100,
    trust_score   FLOAT DEFAULT 0.0,
    is_active     BIT DEFAULT 1,
    created_at    DATETIME2 DEFAULT GETDATE()
);

CREATE TABLE skills_offered (
    id         INT IDENTITY(1,1) PRIMARY KEY,
    user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_name NVARCHAR(100) NOT NULL,
    category   NVARCHAR(50)
);

CREATE TABLE skills_sought (
    id         INT IDENTITY(1,1) PRIMARY KEY,
    user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_name NVARCHAR(100) NOT NULL,
    category   NVARCHAR(50)
);

CREATE TABLE sessions (
    id            INT IDENTITY(1,1) PRIMARY KEY,
    learner_id    INT NOT NULL REFERENCES users(id),
    tutor_id      INT NOT NULL REFERENCES users(id),
    skill         NVARCHAR(100) NOT NULL,
    scheduled_at  DATETIME2 NOT NULL,
    duration_min  INT NOT NULL,
    credits_cost  INT NOT NULL,
    status        NVARCHAR(20) DEFAULT 'scheduled',
    attended      BIT DEFAULT 0,
    on_time       BIT DEFAULT 0,
    created_at    DATETIME2 DEFAULT GETDATE()
);

CREATE TABLE reviews (
    id                  INT IDENTITY(1,1) PRIMARY KEY,
    session_id          INT NOT NULL REFERENCES sessions(id),
    reviewer_id         INT NOT NULL REFERENCES users(id),
    reviewee_id         INT NOT NULL REFERENCES users(id),
    overall_rating      INT NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
    quality_score       INT CHECK (quality_score BETWEEN 1 AND 5),
    punctuality_score   INT CHECK (punctuality_score BETWEEN 1 AND 5),
    preparation_score   INT CHECK (preparation_score BETWEEN 1 AND 5),
    communication_score INT CHECK (communication_score BETWEEN 1 AND 5),
    comment             NVARCHAR(MAX) DEFAULT '',
    created_at          DATETIME2 DEFAULT GETDATE()
);
```

---

## 5. Connect in VS Code SQLTools

Use these settings:
```
Driver:    MSSQL
Host:      localhost
Port:      1433
Database:  master
Username:  sa
Password:  RandomPassword110