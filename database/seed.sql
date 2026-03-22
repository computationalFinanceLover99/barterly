-- barterly Sample Data
-- Run AFTER schema.sql
-- Run: psql -U postgres -d barterly -f database/seed.sql
-- Note: passwords are all "password123" hashed with bcrypt

INSERT INTO users (name, email, university, year, bio, credits, trust_score) VALUES
('Arfa Khan',      'arfa@nu.edu.pk',      'FAST-NUCES', 'Year 3', 'CS student passionate about backend development.', 150, 4.8),
('Doureesha Ali',  'doureesha@nu.edu.pk', 'FAST-NUCES', 'Year 3', 'Frontend developer and UI/UX enthusiast.',          120, 4.7),
('Sara Ahmed',     'sara@lums.edu.pk',    'LUMS',       'Year 2', 'Math tutor and data science learner.',              200, 4.9),
('Ali Hassan',     'ali@itu.edu.pk',      'ITU',        'Year 4', 'Full stack developer. Loves open source.',          80,  4.5);

INSERT INTO skills_offered (user_id, skill_name, category) VALUES
(1, 'Python Programming', 'Tech'),
(1, 'FastAPI Development', 'Tech'),
(2, 'React Development',  'Tech'),
(2, 'Figma UI Design',    'Design'),
(3, 'Statistics',         'Science'),
(3, 'Data Analysis',      'Tech'),
(4, 'JavaScript',         'Tech'),
(4, 'Node.js',            'Tech');

INSERT INTO skills_sought (user_id, skill_name, category) VALUES
(1, 'UI/UX Design',       'Design'),
(1, 'Machine Learning',   'Tech'),
(2, 'Data Science',       'Tech'),
(2, 'Public Speaking',    'Soft Skills'),
(3, 'Web Development',    'Tech'),
(3, 'Spanish',            'Languages'),
(4, 'Machine Learning',   'Tech'),
(4, 'Statistics',         'Science');
