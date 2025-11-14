-- Sample Data for SAT Platform MVP
-- This migration inserts sample data for testing and development

-- ========================================
-- SAMPLE MAJOR TOPICS
-- ========================================
INSERT INTO major_topics (id, name, description, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440000'::uuid, 'Algebra', 'Fundamental algebraic concepts including equations, functions, and polynomial operations', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440001'::uuid, 'Geometry', 'Geometric principles including shapes, angles, proofs, and spatial reasoning', NOW(), NOW());

-- ========================================
-- SAMPLE SUBTOPICS FOR ALGEBRA
-- ========================================
INSERT INTO subtopics (id, major_topic_id, name, description, tutorial_video_url, order_index, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440010'::uuid, '550e8400-e29b-41d4-a716-446655440000'::uuid, 'Linear Equations', 'Solving one-variable and two-variable linear equations', 'https://example.com/videos/linear-equations', 1, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440011'::uuid, '550e8400-e29b-41d4-a716-446655440000'::uuid, 'Quadratic Functions', 'Understanding parabolas, roots, and quadratic formula', 'https://example.com/videos/quadratic-functions', 2, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440012'::uuid, '550e8400-e29b-41d4-a716-446655440000'::uuid, 'Exponential and Logarithmic Functions', 'Growth and decay patterns, logarithm properties', 'https://example.com/videos/exponential-log', 3, NOW(), NOW());

-- ========================================
-- SAMPLE SUBTOPICS FOR GEOMETRY
-- ========================================
INSERT INTO subtopics (id, major_topic_id, name, description, tutorial_video_url, order_index, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440020'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, 'Triangles and Angles', 'Triangle classification, angle relationships, trigonometry basics', 'https://example.com/videos/triangles-angles', 1, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440021'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, 'Circles', 'Circle properties, arcs, chords, and circumference', 'https://example.com/videos/circles', 2, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440022'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, 'Solid Geometry', '3D shapes, surface area, and volume calculations', 'https://example.com/videos/solid-geometry', 3, NOW(), NOW());

-- ========================================
-- SAMPLE TUTORIALS
-- ========================================
INSERT INTO tutorials (id, subtopic_id, title, content, video_url, order_index, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440100'::uuid, '550e8400-e29b-41d4-a716-446655440010'::uuid, 'Introduction to Linear Equations', 'Learn how to solve simple linear equations step by step', 'https://example.com/videos/intro-linear-eq', 1, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440101'::uuid, '550e8400-e29b-41d4-a716-446655440010'::uuid, 'Systems of Linear Equations', 'Solving systems with substitution and elimination methods', 'https://example.com/videos/systems-linear-eq', 2, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440102'::uuid, '550e8400-e29b-41d4-a716-446655440011'::uuid, 'Understanding Quadratic Formula', 'Deriving and applying the quadratic formula', 'https://example.com/videos/quadratic-formula', 1, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440103'::uuid, '550e8400-e29b-41d4-a716-446655440012'::uuid, 'Exponential Growth and Decay', 'Modeling real-world scenarios with exponential functions', 'https://example.com/videos/exp-growth-decay', 1, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440104'::uuid, '550e8400-e29b-41d4-a716-446655440020'::uuid, 'Triangle Types and Properties', 'Classifying triangles and understanding angle relationships', 'https://example.com/videos/triangle-properties', 1, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440105'::uuid, '550e8400-e29b-41d4-a716-446655440021'::uuid, 'Circle Theorems', 'Key theorems about circles and their applications', 'https://example.com/videos/circle-theorems', 1, NOW(), NOW());

-- ========================================
-- SAMPLE PRACTICE PROBLEMS
-- ========================================
-- Algebra: Linear Equations
INSERT INTO practice_problems (id, subtopic_id, question_text, options, correct_answer, explanation, difficulty_level, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440200'::uuid, '550e8400-e29b-41d4-a716-446655440010'::uuid, 
'Solve for x: 2x + 5 = 13', 
'{"A": "x = 3", "B": "x = 4", "C": "x = 5", "D": "x = 6"}', 
'B', 
'Subtract 5 from both sides: 2x = 8. Divide both sides by 2: x = 4', 
'easy', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440201'::uuid, '550e8400-e29b-41d4-a716-446655440010'::uuid,
'Solve for x: 3x - 7 = 2x + 4',
'{"A": "x = 8", "B": "x = 9", "C": "x = 10", "D": "x = 11"}',
'D',
'Subtract 2x from both sides: x - 7 = 4. Add 7 to both sides: x = 11',
'medium', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440202'::uuid, '550e8400-e29b-41d4-a716-446655440010'::uuid,
'Solve for x: (2x + 3)/5 = 3',
'{"A": "x = 5", "B": "x = 6", "C": "x = 5.5", "D": "x = 6.5"}',
'D',
'Multiply both sides by 5: 2x + 3 = 15. Subtract 3: 2x = 12. Divide by 2: x = 6',
'hard', NOW(), NOW());

-- Algebra: Quadratic Functions
INSERT INTO practice_problems (id, subtopic_id, question_text, options, correct_answer, explanation, difficulty_level, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440203'::uuid, '550e8400-e29b-41d4-a716-446655440011'::uuid,
'What is the vertex of the parabola y = x² - 4x + 3?',
'{"A": "(2, -1)", "B": "(2, 1)", "C": "(4, 3)", "D": "(1, 0)"}',
'A',
'For y = ax² + bx + c, x = -b/2a = 4/2 = 2. Then y = 4 - 8 + 3 = -1',
'medium', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440204'::uuid, '550e8400-e29b-41d4-a716-446655440011'::uuid,
'Find the roots of x² - 5x + 6 = 0',
'{"A": "x = 2, 3", "B": "x = 1, 6", "C": "x = 2, 4", "D": "x = 3, 4"}',
'A',
'Factor: (x - 2)(x - 3) = 0, so x = 2 or x = 3',
'medium', NOW(), NOW());

-- Algebra: Exponential Functions
INSERT INTO practice_problems (id, subtopic_id, question_text, options, correct_answer, explanation, difficulty_level, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440205'::uuid, '550e8400-e29b-41d4-a716-446655440012'::uuid,
'If 2^x = 32, what is x?',
'{"A": "4", "B": "5", "C": "6", "D": "7"}',
'B',
'32 = 2^5, therefore x = 5',
'easy', NOW(), NOW());

-- Geometry: Triangles
INSERT INTO practice_problems (id, subtopic_id, question_text, options, correct_answer, explanation, difficulty_level, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440206'::uuid, '550e8400-e29b-41d4-a716-446655440020'::uuid,
'In a right triangle, if one leg is 3 and the hypotenuse is 5, what is the other leg?',
'{"A": "3", "B": "4", "C": "5", "D": "6"}',
'B',
'Using Pythagorean theorem: 3² + b² = 5². So 9 + b² = 25, b² = 16, b = 4',
'medium', NOW(), NOW());

-- Geometry: Circles
INSERT INTO practice_problems (id, subtopic_id, question_text, options, correct_answer, explanation, difficulty_level, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440207'::uuid, '550e8400-e29b-41d4-a716-446655440021'::uuid,
'What is the circumference of a circle with radius 5?',
'{"A": "10π", "B": "25π", "C": "5π", "D": "15π"}',
'A',
'Circumference = 2πr = 2π(5) = 10π',
'easy', NOW(), NOW());

-- Geometry: Solid Geometry
INSERT INTO practice_problems (id, subtopic_id, question_text, options, correct_answer, explanation, difficulty_level, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440208'::uuid, '550e8400-e29b-41d4-a716-446655440022'::uuid,
'What is the volume of a sphere with radius 3?',
'{"A": "27π", "B": "36π", "C": "48π", "D": "64π"}',
'B',
'Volume = (4/3)πr³ = (4/3)π(27) = 36π',
'hard', NOW(), NOW());
