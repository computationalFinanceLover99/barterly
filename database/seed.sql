
use barterly;
go
INSERT INTO users 
(name, email, university, year, bio, password_hash, credits, trust_score) 
VALUES
('Arfa',      'arfa@nu.edu.pk',      'FAST-NUCES', 'Year 3', '...', 'pw', 150, 4.8),
('Doureesha',  'doureesha@nu.edu.pk', 'FAST-NUCES', 'Year 3', '...', 'pw', 120, 4.7),
('Sara Ahmed',     'sara@lums.edu.pk',    'LUMS',       'Year 2', '...', 'pw', 200, 4.9),
('Ali Hassan',     'ali@itu.edu.pk',      'ITU',        'Year 4', '...', 'pw', 80,  4.5);

INSERT INTO skills_offered (user_id, skill_name, category) VALUES
(1, 'Python Programming', 'Tech'),
(1, 'FastAPI Development', 'Tech'),
(2, 'React Development',  'Tech'),
(2, 'Figma UI Design',    'Design'),
(3, 'Statistics',         'Science'),
(3, 'Data Analysis',      'Tech'),
(4, 'JavaScript',         'Tech'),
(4, 'Node.js',            'Tech');

SELECT id, name FROM users;

DELETE FROM skills_offered;
DELETE FROM skills_sought;
DELETE FROM users;
DBCC CHECKIDENT ('users', RESEED, 0);
INSERT INTO skills_sought (user_id, skill_name, category) VALUES
(1, 'UI/UX Design',       'Design'),
(1, 'Machine Learning',   'Tech'),
(2, 'Data Science',       'Tech'),
(2, 'Public Speaking',    'Soft Skills'),
(3, 'Web Development',    'Tech'),
(3, 'Spanish',            'Languages'),
(4, 'Machine Learning',   'Tech'),
(4, 'Statistics',         'Science');
