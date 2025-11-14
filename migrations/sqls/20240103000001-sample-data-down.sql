-- Rollback Sample Data

-- Delete sample data in reverse order of insertion (respecting foreign keys)
DELETE FROM practice_problems WHERE subtopic_id IN (
  SELECT id FROM subtopics WHERE major_topic_id IN ('550e8400-e29b-41d4-a716-446655440000'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid)
);

DELETE FROM tutorials WHERE subtopic_id IN (
  SELECT id FROM subtopics WHERE major_topic_id IN ('550e8400-e29b-41d4-a716-446655440000'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid)
);

DELETE FROM subtopics WHERE major_topic_id IN ('550e8400-e29b-41d4-a716-446655440000'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid);

DELETE FROM major_topics WHERE id IN ('550e8400-e29b-41d4-a716-446655440000'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid);
