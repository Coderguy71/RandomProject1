-- Enhanced Tutorial Content Migration
-- This migration clears existing tutorials and inserts comprehensive content

-- First, clear existing tutorials
DELETE FROM tutorials;

-- Insert enhanced tutorial content
INSERT INTO tutorials (id, subtopic_id, title, content, video_url, order_index, created_at, updated_at) VALUES
-- Linear Equations Tutorials
('550e8400-e29b-41d4-a716-446655440100'::uuid, '550e8400-e29b-41d4-a716-446655440010'::uuid, 
 'Introduction to Linear Equations', 
 '# Linear Equations: The Foundation of Algebra

Linear equations are mathematical statements that show the equality between two expressions. They are called "linear" because they form a straight line when graphed.

## What is a Linear Equation?
A linear equation is an equation that can be written in the form:
**ax + b = c**

Where:
- **x** is the variable we want to solve for
- **a**, **b**, and **c** are constants
- **a** cannot be zero

## Solving One-Step Linear Equations

### Example 1: x + 5 = 12
To solve for x, we need to isolate x on one side of the equation.

Step 1: Subtract 5 from both sides
x + 5 - 5 = 12 - 5
x = 7

### Example 2: 3x = 15
Step 1: Divide both sides by 3
3x ÷ 3 = 15 ÷ 3
x = 5

## Solving Two-Step Linear Equations

### Example 3: 2x + 3 = 11
Step 1: Subtract 3 from both sides
2x + 3 - 3 = 11 - 3
2x = 8

Step 2: Divide both sides by 2
2x ÷ 2 = 8 ÷ 2
x = 4

## Key Principles
1. **Balance**: Whatever you do to one side, you must do to the other
2. **Isolation**: Get the variable by itself on one side
3. **Inverse Operations**: Use opposite operations to undo
   - Addition ↔ Subtraction
   - Multiplication ↔ Division

## Practice Tips
- Always check your answer by plugging it back into the original equation
- Work step by step and show all your work
- Be patient with complex problems

## Common Mistakes to Avoid
- Forgetting to perform the same operation on both sides
- Making calculation errors
- Not checking your final answer', 
 'https://www.youtube.com/embed/8B7q1645q3k', 1, NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440101'::uuid, '550e8400-e29b-41d4-a716-446655440010'::uuid, 
 'Systems of Linear Equations', 
 '# Systems of Linear Equations

A system of linear equations consists of two or more linear equations that share the same variables. We look for values that satisfy all equations simultaneously.

## Methods for Solving Systems

### 1. Substitution Method

**Example:**
2x + y = 7  (Equation 1)
x - y = 2   (Equation 2)

Step 1: Solve Equation 2 for x
x = y + 2

Step 2: Substitute into Equation 1
2(y + 2) + y = 7
2y + 4 + y = 7
3y + 4 = 7
3y = 3
y = 1

Step 3: Find x
x = 1 + 2 = 3

Solution: (3, 1)

### 2. Elimination Method

**Example:**
3x + 2y = 11  (Equation 1)
2x - 2y = -2  (Equation 2)

Step 1: Add the equations
(3x + 2x) + (2y - 2y) = 11 + (-2)
5x = 9
x = 9/5

Step 2: Substitute back
3(9/5) + 2y = 11
27/5 + 2y = 55/5
2y = 28/5
y = 14/5

## Real-World Applications
- **Business**: Finding break-even points
- **Physics**: Solving for unknown forces
- **Chemistry**: Balancing chemical equations
- **Economics**: Supply and demand analysis

## Graphical Interpretation
The solution represents the intersection point of the lines when graphed.', 
 'https://www.youtube.com/embed/42ObM92Q6yE', 2, NOW(), NOW()),

-- Quadratic Functions Tutorials
('550e8400-e29b-41d4-a716-446655440102'::uuid, '550e8400-e29b-41d4-a716-446655440011'::uuid, 
 'Understanding Quadratic Formula', 
 '# The Quadratic Formula

The quadratic formula is a powerful tool for solving quadratic equations of the form:
**ax² + bx + c = 0**

## The Formula

x = (-b ± √(b² - 4ac)) / 2a

## Understanding Each Component

### The Discriminant (b² - 4ac)
The discriminant tells us about the nature of the solutions:
- **Positive**: Two real solutions
- **Zero**: One real solution
- **Negative**: Two complex solutions

### Step-by-Step Application

**Example:** Solve 2x² + 5x - 3 = 0

Step 1: Identify a, b, and c
a = 2, b = 5, c = -3

Step 2: Calculate the discriminant
b² - 4ac = 5² - 4(2)(-3) = 25 + 24 = 49

Step 3: Apply the formula
x = (-5 ± √49) / 2(2)
x = (-5 ± 7) / 4

Step 4: Find both solutions
x₁ = (-5 + 7) / 4 = 2/4 = 1/2
x₂ = (-5 - 7) / 4 = -12/4 = -3

## When to Use the Quadratic Formula
- When factoring is difficult or impossible
- When the equation has irrational roots
- When you need exact answers

## Connection to Graphing
The solutions correspond to the x-intercepts of the parabola y = ax² + bx + c.

## Tips for Success
- Be careful with signs
- Simplify the discriminant first
- Check your answers by substituting back', 
 'https://www.youtube.com/embed/E747rLNGpIc', 1, NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440103'::uuid, '550e8400-e29b-41d4-a716-446655440011'::uuid, 
 'Graphing Quadratic Functions', 
 '# Graphing Quadratic Functions

Quadratic functions create U-shaped curves called parabolas. Understanding how to graph them is essential for visualizing their behavior.

## Key Features of a Parabola

### 1. Vertex
The vertex is the turning point of the parabola.
- **For y = ax² + bx + c**: x = -b/2a
- **For y = a(x - h)² + k**: Vertex is (h, k)

### 2. Axis of Symmetry
The vertical line that passes through the vertex.
x = -b/2a

### 3. Direction
- **a > 0**: Opens upward (minimum)
- **a < 0**: Opens downward (maximum)

## Step-by-Step Graphing

**Example:** Graph y = x² - 4x + 3

Step 1: Find the vertex
x = -(-4)/2(1) = 2
y = 2² - 4(2) + 3 = 4 - 8 + 3 = -1
Vertex: (2, -1)

Step 2: Find the y-intercept
y = 0² - 4(0) + 3 = 3
Point: (0, 3)

Step 3: Find the x-intercepts (roots)
Factor: (x - 1)(x - 3) = 0
x = 1 and x = 3
Points: (1, 0) and (3, 0)

Step 4: Plot additional points
x = 4: y = 16 - 16 + 3 = 3
Point: (4, 3)

## Transformations

### Vertical Shifts
y = x² + k: Shift up by k units
y = x² - k: Shift down by k units

### Horizontal Shifts
y = (x - h)²: Shift right by h units
y = (x + h)²: Shift left by h units

### Vertical Stretch/Compression
y = ax²: Stretch if |a| > 1, compress if |a| < 1

## Real-World Applications
- **Physics**: Projectile motion
- **Business**: Profit maximization
- **Engineering**: Optimization problems', 
 'https://www.youtube.com/embed/0t7Qp3s6x7M', 2, NOW(), NOW()),

-- Exponential Functions Tutorials
('550e8400-e29b-41d4-a716-446655440104'::uuid, '550e8400-e29b-41d4-a716-446655440012'::uuid, 
 'Exponential Growth and Decay', 
 '# Exponential Growth and Decay

Exponential functions model situations where quantities increase or decrease at a rate proportional to their current value.

## The Exponential Function
The general form is:
**y = a · bˣ**

Where:
- **a** is the initial value (y-intercept)
- **b** is the growth/decay factor
- **x** is the time variable

## Growth vs. Decay

### Exponential Growth (b > 1)
When b > 1, the function represents growth.

**Example:** Population growth
P(t) = 1000 · 1.05ᵗ
Initial population: 1000
Growth rate: 5% per time period

### Exponential Decay (0 < b < 1)
When 0 < b < 1, the function represents decay.

**Example:** Radioactive decay
A(t) = 100 · 0.95ᵗ
Initial amount: 100
Decay rate: 5% per time period

## Real-World Examples

### 1. Compound Interest
A = P(1 + r/n)^(nt)
- P: Principal amount
- r: Annual interest rate
- n: Times compounded per year
- t: Time in years

### 2. Population Growth
P(t) = P₀ · e^(kt)
- P₀: Initial population
- k: Growth constant
- e: Euler's number (≈2.718)

### 3. Radioactive Decay
A(t) = A₀ · (1/2)^(t/h)
- A₀: Initial amount
- h: Half-life
- t: Time elapsed

## Solving Exponential Equations

**Example:** Solve 3ˣ = 81

Step 1: Express both sides with same base
3ˣ = 3⁴

Step 2: Equate exponents
x = 4

**Example:** Solve 2ˣ⁺¹ = 32

Step 1: Express 32 as power of 2
2ˣ⁺¹ = 2⁵

Step 2: Equate exponents
x + 1 = 5
x = 4

## Applications in SAT Math
- Doubling time problems
- Half-life calculations
- Financial mathematics
- Population dynamics', 
 'https://www.youtube.com/embed/K0aO7J3kY7g', 1, NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440105'::uuid, '550e8400-e29b-41d4-a716-446655440012'::uuid, 
 'Logarithms and Their Properties', 
 '# Logarithms: The Inverse of Exponentials

Logarithms are the inverse operation of exponentiation. They help us solve equations where the variable is in the exponent.

## Definition of Logarithm

If bˣ = y, then log_b(y) = x

In words: "log base b of y equals x"

## Common Logarithm Bases

### 1. Base 10 (Common Log)
log₁₀(x) = log(x)

### 2. Base e (Natural Log)
log_e(x) = ln(x)

### 3. Base 2 (Binary Log)
log₂(x)

## Key Properties

### 1. Product Rule
log_b(xy) = log_b(x) + log_b(y)

### 2. Quotient Rule
log_b(x/y) = log_b(x) - log_b(y)

### 3. Power Rule
log_b(xⁿ) = n · log_b(x)

### 4. Change of Base Formula
log_b(x) = log_c(x) / log_c(b)

## Solving Logarithmic Equations

**Example 1:** Solve log₂(x) = 3

2³ = x
8 = x

**Example 2:** Solve log₃(x + 2) = 2

3² = x + 2
9 = x + 2
x = 7

**Example 3:** Solve log(x) + log(x - 3) = 1

log[x(x - 3)] = 1
x(x - 3) = 10¹
x² - 3x = 10
x² - 3x - 10 = 0
(x - 5)(x + 2) = 0
x = 5 or x = -2

Check: x > 0 and x - 3 > 0, so x = 5

## Applications

### 1. pH Scale
pH = -log[H⁺]

### 2. Earthquake Magnitude
M = log(I/I₀)

### 3. Sound Intensity
dB = 10 · log(I/I₀)

### 4. Radioactive Dating
t = (1/k) · ln(N₀/N)

## Tips for Success
- Remember that log of a negative number is undefined
- Always check your solutions in the original equation
- Use the change of base formula for calculators
- Practice converting between exponential and logarithmic forms', 
 'https://www.youtube.com/embed/AZ_6GmB8C9U', 2, NOW(), NOW()),

-- Triangles and Angles Tutorials
('550e8400-e29b-41d4-a716-446655440106'::uuid, '550e8400-e29b-41d4-a716-446655440020'::uuid, 
 'Triangle Types and Properties', 
 '# Triangle Types and Properties

Triangles are fundamental shapes in geometry with unique properties that make them essential for SAT Math.

## Classification by Sides

### 1. Equilateral Triangle
- All three sides are equal
- All three angles are 60°
- Symmetrical and stable

### 2. Isosceles Triangle
- Two sides are equal
- Two angles are equal (base angles)
- Line of symmetry through the vertex

### 3. Scalene Triangle
- All sides are different lengths
- All angles are different measures
- No lines of symmetry

## Classification by Angles

### 1. Acute Triangle
- All angles are less than 90°
- Can be equilateral, isosceles, or scalene

### 2. Right Triangle
- One angle is exactly 90°
- Follows the Pythagorean theorem
- Special ratios (30-60-90, 45-45-90)

### 3. Obtuse Triangle
- One angle is greater than 90°
- The other two angles must be acute

## Essential Triangle Properties

### Angle Sum Property
The sum of interior angles is always 180°:
∠A + ∠B + ∠C = 180°

### Triangle Inequality Theorem
The sum of any two sides is greater than the third side:
a + b > c
a + c > b
b + c > a

### Exterior Angle Theorem
An exterior angle equals the sum of the two opposite interior angles.

## Special Right Triangles

### 30-60-90 Triangle
Sides ratio: 1 : √3 : 2
- Short leg = x
- Long leg = x√3
- Hypotenuse = 2x

### 45-45-90 Triangle
Sides ratio: 1 : 1 : √2
- Legs = x
- Hypotenuse = x√2

## Pythagorean Theorem
For right triangles:
a² + b² = c²

Where c is the hypotenuse (longest side).

**Example:** Find the missing side
If a = 3 and b = 4:
3² + 4² = c²
9 + 16 = c²
25 = c²
c = 5

## Area and Perimeter

### Area
Area = (1/2) × base × height

### Perimeter
Perimeter = sum of all three sides

## Similar Triangles
Triangles are similar if:
- All corresponding angles are equal
- All corresponding sides are proportional

**Ratio of areas = (ratio of sides)²**

## SAT Math Applications
- Finding missing angles
- Calculating areas and perimeters
- Solving word problems with triangles
- Working with similar triangles
- Using special right triangle ratios', 
 'https://www.youtube.com/embed/J5t9t8Q2iZ4', 1, NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440107'::uuid, '550e8400-e29b-41d4-a716-446655440020'::uuid, 
 'Trigonometry Basics', 
 '# Trigonometry Basics for SAT Math

Trigonometry studies the relationships between angles and sides in triangles, particularly right triangles.

## The Three Primary Trigonometric Ratios

### 1. Sine (sin)
sin(θ) = opposite / hypotenuse

### 2. Cosine (cos)
cos(θ) = adjacent / hypotenuse

### 3. Tangent (tan)
tan(θ) = opposite / adjacent

## SOH-CAH-TOA Mnemonic
- **SOH**: Sine = Opposite / Hypotenuse
- **CAH**: Cosine = Adjacent / Hypotenuse
- **TOA**: Tangent = Opposite / Adjacent

## Applying Trigonometric Ratios

**Example:** In a right triangle with angle A = 30°, adjacent = 8, find the opposite side.

tan(30°) = opposite / 8
0.577 = opposite / 8
opposite = 8 × 0.577 = 4.62

## Special Angle Values

### 30° Triangle
- sin(30°) = 1/2
- cos(30°) = √3/2
- tan(30°) = 1/√3

### 45° Triangle
- sin(45°) = √2/2
- cos(45°) = √2/2
- tan(45°) = 1

### 60° Triangle
- sin(60°) = √3/2
- cos(60°) = 1/2
- tan(60°) = √3

## Inverse Trigonometric Functions

### arcsin (sin⁻¹)
Finds the angle when given the sine value.

### arccos (cos⁻¹)
Finds the angle when given the cosine value.

### arctan (tan⁻¹)
Finds the angle when given the tangent value.

**Example:** Find angle A if sin(A) = 0.6
A = arcsin(0.6) ≈ 36.9°

## Applications in SAT Math

### 1. Finding Missing Sides
Use the appropriate trigonometric ratio.

### 2. Finding Missing Angles
Use inverse trigonometric functions.

### 3. Word Problems
- Height and distance problems
- Angle of elevation/depression
- Navigation problems

## Common Mistakes to Avoid
- Mixing up opposite and adjacent sides
- Using degrees when radians are required
- Forgetting to check if the triangle is right-angled
- Not using the correct trigonometric ratio

## Tips for Success
- Draw and label diagrams clearly
- Remember SOH-CAH-TOA
- Memorize special angle values
- Practice with real-world problems', 
 'https://www.youtube.com/embed/8B7q1645q3k', 2, NOW(), NOW()),

-- Circles Tutorials
('550e8400-e29b-41d4-a716-446655440108'::uuid, '550e8400-e29b-41d4-a716-446655440021'::uuid, 
 'Circle Properties and Formulas', 
 '# Circle Properties and Formulas

Circles are perfectly round shapes with every point equidistant from the center. Mastering circle properties is crucial for SAT Math success.

## Basic Circle Terminology

### Key Parts of a Circle
- **Center**: The fixed point from which all points are equidistant
- **Radius**: Distance from center to any point on the circle
- **Diameter**: Distance across the circle through the center (d = 2r)
- **Chord**: Line segment connecting two points on the circle
- **Secant**: Line that intersects the circle at two points
- **Tangent**: Line that touches the circle at exactly one point

## Essential Formulas

### 1. Circumference
C = 2πr  or  C = πd

**Example:** Find circumference of a circle with radius 5
C = 2π(5) = 10π units

### 2. Area
A = πr²

**Example:** Find area of a circle with radius 3
A = π(3)² = 9π square units

### 3. Arc Length
Arc Length = (θ/360°) × 2πr

Where θ is the central angle in degrees.

### 4. Sector Area
Sector Area = (θ/360°) × πr²

## Circle Theorems

### 1. Tangent-Radius Theorem
A tangent to a circle is perpendicular to the radius at the point of tangency.

### 2. Inscribed Angle Theorem
An inscribed angle equals half the measure of its intercepted arc.

### 3. Central Angle Theorem
A central angle equals the measure of its intercepted arc.

### 4. Chord Properties
- Perpendicular from center to chord bisects the chord
- Equal chords are equidistant from the center
- The perpendicular bisector of a chord passes through the center

## Working with Circles in Coordinate Geometry

### Standard Equation
(x - h)² + (y - k)² = r²

Where:
- (h, k) is the center
- r is the radius

**Example:** Find center and radius of (x - 2)² + (y + 3)² = 25
Center: (2, -3)
Radius: √25 = 5

## SAT Math Problem Types

### 1. Finding Circumference and Area
Direct application of formulas.

### 2. Arc and Sector Problems
Using proportions to find partial measurements.

### 3. Inscribed and Central Angles
Applying angle theorems.

### 4. Tangent Problems
Using the tangent-radius relationship.

### 5. Coordinate Geometry
Working with circle equations.

## Common Mistakes to Avoid
- Confusing radius and diameter
- Using diameter instead of radius in area formula
- Forgetting to square the radius in area calculations
- Mixing up arc length and sector area formulas

## Problem-Solving Strategies
1. Draw and label diagrams
2. Identify given information
3. Choose the appropriate formula
4. Show all calculations
5. Check units and reasonableness

## Real-World Applications
- Wheels and gears
- Pizza and cake slices
- Clock faces
- Circular tracks
- Planetary orbits', 
 'https://www.youtube.com/embed/dQ3jS9k8JjI', 1, NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440109'::uuid, '550e8400-e29b-41d4-a716-446655440021'::uuid, 
 'Circle Theorems and Applications', 
 '# Advanced Circle Theorems and Applications

Beyond basic properties, circles have several important theorems that frequently appear on the SAT Math test.

## Power of a Point Theorems

### 1. Two Secants
If two secants intersect outside a circle:
PA × PB = PC × PD

### 2. Secant and Tangent
If a secant and tangent intersect outside a circle:
PT² = PA × PB

### 3. Two Chords
If two chords intersect inside a circle:
PA × PB = PC × PD

## Angle Relationships

### 1. Central Angles
- Measure equals the intercepted arc
- Vertex at the circle''s center

### 2. Inscribed Angles
- Measure equals half the intercepted arc
- Vertex on the circle

### 3. Angles Formed by:
- **Two chords**: Half the sum of intercepted arcs
- **Tangent and chord**: Half the intercepted arc
- **Two secants**: Half the difference of intercepted arcs
- **Tangent and secant**: Half the difference of intercepted arcs

## Special Properties

### 1. Cyclic Quadrilaterals
A quadrilateral inscribed in a circle has:
- Opposite angles sum to 180°
- Exterior angle equals interior opposite angle

### 2. Tangent Properties
- Tangents from a point to a circle are equal
- Tangent is perpendicular to radius at point of tangency

### 3. Chord Properties
- Equal chords subtend equal arcs
- Equal arcs subtend equal chords
- Perpendicular from center to chord bisects the chord

## Advanced Problem Types

### 1. Finding Angles
**Example:** Find angle x formed by two intersecting chords
If intercepted arcs are 80° and 120°:
x = (80° + 120°)/2 = 100°

### 2. Finding Lengths
**Example:** Find length of tangent segment
If secant segments are 4 and 16:
PT² = 4 × 16 = 64
PT = 8

### 3. Coordinate Geometry
**Example:** Find if a point is inside a circle
Circle: (x - 2)² + (y - 1)² = 25
Point: (4, 3)
(4 - 2)² + (3 - 1)² = 4 + 4 = 8 < 25
Point is inside the circle.

## SAT Math Strategies

### 1. Diagram Analysis
- Label all given information
- Draw auxiliary lines when needed
- Mark equal lengths and angles

### 2. Formula Selection
- Choose the appropriate theorem
- Apply correct angle relationships
- Use power of a point when applicable

### 3. Verification
- Check angle sums
- Verify length relationships
- Confirm geometric constraints

## Common Pitfalls
- Applying theorems to wrong configurations
- Forgetting angle-arc relationships
- Misidentifying inscribed vs. central angles
- Incorrect use of power of a point

## Practice Tips
- Memorize all angle theorems
- Practice identifying configurations
- Work through progressively harder problems
- Review coordinate geometry connections', 
 'https://www.youtube.com/embed/X9l_9xI8fJc', 2, NOW(), NOW()),

-- Solid Geometry Tutorials
('550e8400-e29b-41d4-a716-446655440110'::uuid, '550e8400-e29b-41d4-a716-446655440022'::uuid, 
 '3D Shapes: Surface Area and Volume', 
 '# Solid Geometry: Surface Area and Volume

Solid geometry deals with three-dimensional shapes and their properties. SAT Math frequently tests surface area and volume calculations.

## Basic 3D Shapes

### 1. Rectangular Prism (Box)
**Volume:** V = l × w × h
**Surface Area:** SA = 2(lw + lh + wh)

### 2. Cube
**Volume:** V = s³
**Surface Area:** SA = 6s²

### 3. Cylinder
**Volume:** V = πr²h
**Surface Area:** SA = 2πr² + 2πrh

### 4. Sphere
**Volume:** V = (4/3)πr³
**Surface Area:** SA = 4πr²

### 5. Cone
**Volume:** V = (1/3)πr²h
**Surface Area:** SA = πr² + πrl (where l is slant height)

### 6. Pyramid
**Volume:** V = (1/3) × Base Area × h
**Surface Area:** SA = Base Area + Lateral Area

## Detailed Examples

### Example 1: Rectangular Prism
Find volume and surface area of a box with dimensions 3 × 4 × 5.

Volume: V = 3 × 4 × 5 = 60 cubic units
Surface Area: SA = 2(3×4 + 3×5 + 4×5) = 2(12 + 15 + 20) = 2(47) = 94 square units

### Example 2: Cylinder
Find volume of a cylinder with radius 3 and height 8.

Volume: V = π(3)²(8) = 72π cubic units

### Example 3: Sphere
Find surface area of a sphere with radius 4.

Surface Area: SA = 4π(4)² = 64π square units

## Advanced Concepts

### 1. Similar Solids
If solids are similar with scale factor k:
- Ratio of surface areas = k²
- Ratio of volumes = k³

### 2. Composite Solids
Break complex shapes into simpler components.

**Example:** Find volume of a cylinder with a cone on top.
Total Volume = Cylinder Volume + Cone Volume

### 3. Cross-Sections
The shape formed by cutting a solid with a plane.

- **Sphere cross-section**: Always a circle
- **Cylinder cross-section**: Rectangle or circle
- **Cone cross-section**: Triangle, circle, or ellipse

## SAT Math Problem Types

### 1. Direct Calculations
Apply formulas directly with given dimensions.

### 2. Missing Dimensions
Use given information to find missing measurements.

### 3. Comparing Solids
Compare volumes or surface areas of different shapes.

### 4. Real-World Applications
Apply concepts to practical situations.

## Common Mistakes to Avoid
- Confusing surface area and volume formulas
- Using diameter instead of radius
- Forgetting to square or cube as required
- Incorrect unit conversions

## Problem-Solving Strategies
1. Identify the shape and its dimensions
2. Choose the correct formula
3. Substitute values carefully
4. Check units and reasonableness
5. Round appropriately if needed

## Tips for Success
- Memorize all basic formulas
- Practice with different units
- Draw diagrams when helpful
- Break complex problems into simpler parts
- Verify your calculations', 
 'https://www.youtube.com/embed/3m9p_5LwN6I', 1, NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440111'::uuid, '550e8400-e29b-41d4-a716-446655440022'::uuid, 
 'Advanced Solid Geometry Applications', 
 '# Advanced Solid Geometry Applications

This tutorial covers complex solid geometry problems that require deeper understanding and creative problem-solving approaches.

## Composite Solids

### Definition
Composite solids are formed by combining two or more basic 3D shapes.

### Strategy
1. **Decompose**: Break the solid into familiar shapes
2. **Calculate**: Find volume/surface area of each part
3. **Combine**: Add or subtract as appropriate

### Example 1: Cylinder with Hemisphere
A cylinder of height 8 and radius 3 has a hemisphere on top.

**Volume Calculation:**
- Cylinder: V₁ = π(3)²(8) = 72π
- Hemisphere: V₂ = (1/2)(4/3)π(3)³ = 18π
- Total: V = 72π + 18π = 90π

### Example 2: Box with Spherical Cavity
A 10×10×10 cube has a spherical cavity of radius 3.

**Volume Calculation:**
- Cube: V₁ = 10³ = 1000
- Sphere: V₂ = (4/3)π(3)³ = 36π
- Remaining: V = 1000 - 36π

## Water Displacement Problems

### Principle
When an object is submerged in water, it displaces water equal to its volume.

### Example:
A rectangular tank 20×15×10 is filled with water to height 8. A sphere of radius 4 is dropped in. What is the new water level?

**Solution:**
1. Initial water volume: 20 × 15 × 8 = 2400
2. Sphere volume: (4/3)π(4)³ ≈ 268
3. New water volume: 2400 + 268 = 2668
4. New height: 2668 ÷ (20 × 15) = 8.89

## Optimization Problems

### Maximum Volume
**Example:** Find dimensions of a box with maximum volume given surface area.

For a box with square base (x×x×h) and surface area S:
S = 2x² + 4xh
h = (S - 2x²)/4x

V = x²h = x²(S - 2x²)/4x = x(S - 2x²)/4

To maximize, set derivative to zero and solve.

## Similarity and Scale

### Scale Factor Effects
If dimensions are multiplied by k:
- Surface area multiplies by k²
- Volume multiplies by k³

### Example:
A model has scale factor 1:10. If the model has surface area 25 cm²:
- Actual surface area: 25 × 10² = 2500 cm²
- Actual volume: Need original volume first

## Cross-Sections and Nets

### Cross-Section Analysis
**Example:** Find the area of the largest cross-section of a cylinder.

For a cylinder with radius r and height h:
- Maximum cross-section is a rectangle: 2r × h
- Area = 2rh

### Net Construction
Unfold 3D shapes into 2D nets to understand surface area.

## Advanced Problem Types

### 1. Rate Problems
**Example:** Water fills a tank at 2 L/min. How long to fill a cylindrical tank?

Convert tank volume to liters and divide by rate.

### 2. Cost Problems
**Example:** Find cost to paint a cylindrical tank at $5/m².

Calculate surface area and multiply by cost per unit.

### 3. Density Problems
**Example:** Find mass of a solid given its density.

Mass = Volume × Density

## SAT Math Strategies

### 1. Visualization
- Draw cross-sections
- Sketch nets
- Label all dimensions

### 2. Formula Application
- Choose appropriate formulas
- Handle units consistently
- Check for composite shapes

### 3. Verification
- Estimate reasonable answers
- Check unit consistency
- Verify calculations

## Common Pitfalls
- Missing parts of composite solids
- Incorrect unit conversions
- Forgetting to subtract cavities
- Wrong formula selection

## Practice Tips
- Work with diverse problems
- Master all basic formulas
- Practice decomposition skills
- Review real-world applications', 
 'https://www.youtube.com/embed/mZ7n5m9j2Ys', 2, NOW(), NOW());