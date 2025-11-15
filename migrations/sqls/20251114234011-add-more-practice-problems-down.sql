-- Rollback: Remove additional practice problems
-- This removes all problems added in the 20251114234011 migration

-- Delete by question text patterns to identify the new problems
DELETE FROM practice_problems WHERE question_text = 'If 5x - 3 = 2x + 12, what is the value of x?';
DELETE FROM practice_problems WHERE question_text = 'Solve for y: 4(y - 2) = 3y + 5';
DELETE FROM practice_problems WHERE question_text = 'If 2(3x - 4) - 5x = 10, what is x?';
DELETE FROM practice_problems WHERE question_text = 'Solve for x: (x + 5)/3 - (x - 2)/2 = 1';

DELETE FROM practice_problems WHERE question_text = 'What is the axis of symmetry for y = 2x² + 8x + 3?';
DELETE FROM practice_problems WHERE question_text = 'If a parabola has x-intercepts at x = 1 and x = 5, what is one possible equation?';
DELETE FROM practice_problems WHERE question_text = 'Solve using the quadratic formula: x² + 6x + 5 = 0';
DELETE FROM practice_problems WHERE question_text = 'What is the minimum value of y = x² - 6x + 11?';
DELETE FROM practice_problems WHERE question_text = 'For what value of k does x² - 8x + k = 0 have exactly one solution?';

DELETE FROM practice_problems WHERE question_text = 'If 3^x = 27, what is x?';
DELETE FROM practice_problems WHERE question_text = 'Solve for x: 4^(x+1) = 64';
DELETE FROM practice_problems WHERE question_text = 'If log₂(x) = 4, what is x?';
DELETE FROM practice_problems WHERE question_text = 'A population doubles every 3 years. If the initial population is 1000, what is the population after 9 years?';
DELETE FROM practice_problems WHERE question_text = 'Simplify: log₅(25) + log₅(5)';

DELETE FROM practice_problems WHERE question_text = 'In a triangle, two angles measure 45° and 75°. What is the third angle?';
DELETE FROM practice_problems WHERE question_text = 'An isosceles triangle has a base angle of 70°. What is the vertex angle?';
DELETE FROM practice_problems WHERE question_text = 'If the sides of a triangle are 5, 12, and 13, what type of triangle is it?';
DELETE FROM practice_problems WHERE question_text = 'In a right triangle, if sin(θ) = 3/5, what is cos(θ)?';
DELETE FROM practice_problems WHERE question_text = 'Two similar triangles have corresponding sides of 4 and 8. If the area of the smaller triangle is 12, what is the area of the larger?';

DELETE FROM practice_problems WHERE question_text = 'What is the area of a circle with radius 4?';
DELETE FROM practice_problems WHERE question_text = 'If a circle has a diameter of 12, what is its circumference?';
DELETE FROM practice_problems WHERE question_text = 'A circle has an area of 36π. What is its radius?';
DELETE FROM practice_problems WHERE question_text = 'What is the length of an arc with central angle 60° in a circle with radius 6?';
DELETE FROM practice_problems WHERE question_text = 'A chord is 8 units from the center of a circle with radius 10. What is the length of the chord?';

DELETE FROM practice_problems WHERE question_text = 'What is the volume of a cube with side length 4?';
DELETE FROM practice_problems WHERE question_text = 'What is the surface area of a cube with side length 3?';
DELETE FROM practice_problems WHERE question_text = 'A cylinder has radius 2 and height 5. What is its volume?';
DELETE FROM practice_problems WHERE question_text = 'What is the volume of a cone with radius 3 and height 4?';
DELETE FROM practice_problems WHERE question_text = 'A rectangular prism has dimensions 3 × 4 × 5. What is its surface area?';
