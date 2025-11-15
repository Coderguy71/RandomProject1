-- Additional Practice Problems for SAT Platform MVP
-- This migration adds more problems to reach 5-10 per subtopic

-- ========================================
-- LINEAR EQUATIONS (Additional Problems)
-- Currently has 3, adding 4 more = 7 total
-- ========================================
INSERT INTO practice_problems (subtopic_id, question_text, options, correct_answer, explanation, difficulty_level, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440010'::uuid,
'If 5x - 3 = 2x + 12, what is the value of x?',
'{"A": "x = 3", "B": "x = 4", "C": "x = 5", "D": "x = 6"}',
'C',
'Subtract 2x from both sides: 3x - 3 = 12. Add 3 to both sides: 3x = 15. Divide by 3: x = 5',
'easy', NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440010'::uuid,
'Solve for y: 4(y - 2) = 3y + 5',
'{"A": "y = 11", "B": "y = 12", "C": "y = 13", "D": "y = 14"}',
'C',
'Expand: 4y - 8 = 3y + 5. Subtract 3y: y - 8 = 5. Add 8: y = 13',
'medium', NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440010'::uuid,
'If 2(3x - 4) - 5x = 10, what is x?',
'{"A": "x = -18", "B": "x = 18", "C": "x = -15", "D": "x = 15"}',
'B',
'Expand: 6x - 8 - 5x = 10. Simplify: x - 8 = 10. Add 8: x = 18',
'medium', NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440010'::uuid,
'Solve for x: (x + 5)/3 - (x - 2)/2 = 1',
'{"A": "x = 7", "B": "x = 8", "C": "x = 9", "D": "x = 10"}',
'D',
'Multiply by LCD 6: 2(x + 5) - 3(x - 2) = 6. Expand: 2x + 10 - 3x + 6 = 6. Simplify: -x + 16 = 6, so x = 10',
'hard', NOW(), NOW());

-- ========================================
-- QUADRATIC FUNCTIONS (Additional Problems)
-- Currently has 2, adding 5 more = 7 total
-- ========================================
INSERT INTO practice_problems (subtopic_id, question_text, options, correct_answer, explanation, difficulty_level, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440011'::uuid,
'What is the axis of symmetry for y = 2x² + 8x + 3?',
'{"A": "x = -2", "B": "x = -1", "C": "x = 1", "D": "x = 2"}',
'A',
'For y = ax² + bx + c, axis of symmetry is x = -b/(2a) = -8/(2×2) = -8/4 = -2',
'easy', NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440011'::uuid,
'If a parabola has x-intercepts at x = 1 and x = 5, what is one possible equation?',
'{"A": "y = (x - 1)(x - 5)", "B": "y = (x + 1)(x + 5)", "C": "y = x² - 4", "D": "y = x² + 6x + 5"}',
'A',
'If x-intercepts are 1 and 5, then (x-1) and (x-5) are factors, so y = (x-1)(x-5)',
'medium', NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440011'::uuid,
'Solve using the quadratic formula: x² + 6x + 5 = 0',
'{"A": "x = -1, -5", "B": "x = 1, 5", "C": "x = -2, -3", "D": "x = 2, 3"}',
'A',
'x = (-6 ± √(36-20))/2 = (-6 ± 4)/2. So x = -1 or x = -5',
'medium', NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440011'::uuid,
'What is the minimum value of y = x² - 6x + 11?',
'{"A": "y = 1", "B": "y = 2", "C": "y = 3", "D": "y = 4"}',
'B',
'Complete the square: y = (x-3)² + 2. Minimum is at vertex, y = 2',
'hard', NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440011'::uuid,
'For what value of k does x² - 8x + k = 0 have exactly one solution?',
'{"A": "k = 8", "B": "k = 12", "C": "k = 16", "D": "k = 20"}',
'C',
'One solution when discriminant = 0: b² - 4ac = 0. So 64 - 4k = 0, k = 16',
'hard', NOW(), NOW());

-- ========================================
-- EXPONENTIAL AND LOGARITHMIC FUNCTIONS (Additional Problems)
-- Currently has 1, adding 5 more = 6 total
-- ========================================
INSERT INTO practice_problems (subtopic_id, question_text, options, correct_answer, explanation, difficulty_level, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440012'::uuid,
'If 3^x = 27, what is x?',
'{"A": "x = 2", "B": "x = 3", "C": "x = 4", "D": "x = 9"}',
'B',
'27 = 3³, therefore x = 3',
'easy', NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440012'::uuid,
'Solve for x: 4^(x+1) = 64',
'{"A": "x = 1", "B": "x = 2", "C": "x = 3", "D": "x = 4"}',
'B',
'64 = 4³, so x + 1 = 3, therefore x = 2',
'medium', NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440012'::uuid,
'If log₂(x) = 4, what is x?',
'{"A": "x = 8", "B": "x = 16", "C": "x = 32", "D": "x = 64"}',
'B',
'log₂(x) = 4 means 2⁴ = x, so x = 16',
'medium', NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440012'::uuid,
'A population doubles every 3 years. If the initial population is 1000, what is the population after 9 years?',
'{"A": "3000", "B": "6000", "C": "8000", "D": "9000"}',
'C',
'After 9 years = 3 doubling periods. Population = 1000 × 2³ = 1000 × 8 = 8000',
'medium', NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440012'::uuid,
'Simplify: log₅(25) + log₅(5)',
'{"A": "2", "B": "3", "C": "4", "D": "5"}',
'B',
'log₅(25) = 2 (since 5² = 25), log₅(5) = 1 (since 5¹ = 5). Sum = 2 + 1 = 3',
'hard', NOW(), NOW());

-- ========================================
-- TRIANGLES AND ANGLES (Additional Problems)
-- Currently has 1, adding 5 more = 6 total
-- ========================================
INSERT INTO practice_problems (subtopic_id, question_text, options, correct_answer, explanation, difficulty_level, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440020'::uuid,
'In a triangle, two angles measure 45° and 75°. What is the third angle?',
'{"A": "50°", "B": "55°", "C": "60°", "D": "65°"}',
'C',
'Sum of angles in a triangle = 180°. Third angle = 180° - 45° - 75° = 60°',
'easy', NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440020'::uuid,
'An isosceles triangle has a base angle of 70°. What is the vertex angle?',
'{"A": "30°", "B": "35°", "C": "40°", "D": "45°"}',
'C',
'Two base angles = 70° each. Vertex angle = 180° - 70° - 70° = 40°',
'easy', NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440020'::uuid,
'If the sides of a triangle are 5, 12, and 13, what type of triangle is it?',
'{"A": "Acute", "B": "Right", "C": "Obtuse", "D": "Equilateral"}',
'B',
'Check Pythagorean theorem: 5² + 12² = 25 + 144 = 169 = 13². This is a right triangle',
'medium', NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440020'::uuid,
'In a right triangle, if sin(θ) = 3/5, what is cos(θ)?',
'{"A": "3/5", "B": "4/5", "C": "5/3", "D": "5/4"}',
'B',
'Using sin²(θ) + cos²(θ) = 1: (3/5)² + cos²(θ) = 1. So cos²(θ) = 16/25, cos(θ) = 4/5',
'medium', NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440020'::uuid,
'Two similar triangles have corresponding sides of 4 and 8. If the area of the smaller triangle is 12, what is the area of the larger?',
'{"A": "24", "B": "36", "C": "48", "D": "96"}',
'C',
'Scale factor = 8/4 = 2. Area scales by the square: 2² = 4. Area = 12 × 4 = 48',
'hard', NOW(), NOW());

-- ========================================
-- CIRCLES (Additional Problems)
-- Currently has 1, adding 5 more = 6 total
-- ========================================
INSERT INTO practice_problems (subtopic_id, question_text, options, correct_answer, explanation, difficulty_level, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440021'::uuid,
'What is the area of a circle with radius 4?',
'{"A": "8π", "B": "12π", "C": "16π", "D": "20π"}',
'C',
'Area = πr² = π(4²) = 16π',
'easy', NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440021'::uuid,
'If a circle has a diameter of 12, what is its circumference?',
'{"A": "6π", "B": "12π", "C": "18π", "D": "24π"}',
'B',
'Circumference = πd = π(12) = 12π',
'easy', NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440021'::uuid,
'A circle has an area of 36π. What is its radius?',
'{"A": "4", "B": "6", "C": "8", "D": "12"}',
'B',
'Area = πr² = 36π. So r² = 36, r = 6',
'medium', NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440021'::uuid,
'What is the length of an arc with central angle 60° in a circle with radius 6?',
'{"A": "π", "B": "2π", "C": "3π", "D": "4π"}',
'B',
'Arc length = (θ/360) × 2πr = (60/360) × 2π(6) = (1/6) × 12π = 2π',
'medium', NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440021'::uuid,
'A chord is 8 units from the center of a circle with radius 10. What is the length of the chord?',
'{"A": "10", "B": "12", "C": "14", "D": "16"}',
'B',
'Using Pythagorean theorem: half-chord = √(10² - 8²) = √(100 - 64) = √36 = 6. Full chord = 2 × 6 = 12',
'hard', NOW(), NOW());

-- ========================================
-- SOLID GEOMETRY (Additional Problems)
-- Currently has 1, adding 5 more = 6 total
-- ========================================
INSERT INTO practice_problems (subtopic_id, question_text, options, correct_answer, explanation, difficulty_level, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440022'::uuid,
'What is the volume of a cube with side length 4?',
'{"A": "16", "B": "32", "C": "48", "D": "64"}',
'D',
'Volume of cube = s³ = 4³ = 64',
'easy', NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440022'::uuid,
'What is the surface area of a cube with side length 3?',
'{"A": "27", "B": "36", "C": "54", "D": "81"}',
'C',
'Surface area = 6s² = 6(3²) = 6(9) = 54',
'easy', NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440022'::uuid,
'A cylinder has radius 2 and height 5. What is its volume?',
'{"A": "10π", "B": "15π", "C": "20π", "D": "25π"}',
'C',
'Volume = πr²h = π(2²)(5) = π(4)(5) = 20π',
'medium', NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440022'::uuid,
'What is the volume of a cone with radius 3 and height 4?',
'{"A": "12π", "B": "16π", "C": "18π", "D": "24π"}',
'A',
'Volume of cone = (1/3)πr²h = (1/3)π(3²)(4) = (1/3)π(36) = 12π',
'medium', NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440022'::uuid,
'A rectangular prism has dimensions 3 × 4 × 5. What is its surface area?',
'{"A": "60", "B": "94", "C": "120", "D": "150"}',
'B',
'Surface area = 2(lw + lh + wh) = 2(3×4 + 3×5 + 4×5) = 2(12 + 15 + 20) = 2(47) = 94',
'hard', NOW(), NOW());
