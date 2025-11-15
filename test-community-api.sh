#!/bin/bash

# Community API Test Script
# This script tests all community discussion board endpoints

BASE_URL="http://localhost:3000/api"

echo "=========================================="
echo "Community Discussion Board API Test"
echo "=========================================="

# Step 1: Login to get token
echo -e "\n1. Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "password123"
  }')

echo "$LOGIN_RESPONSE" | jq '.'

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.tokens.accessToken')

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo "ERROR: Failed to get access token"
  exit 1
fi

echo "Access token obtained successfully"

# Step 2: Create a new post
echo -e "\n2. Creating a new discussion post..."
CREATE_POST_RESPONSE=$(curl -s -X POST "$BASE_URL/community/posts" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "How to solve quadratic equations efficiently?",
    "content": "I am struggling with quadratic equations. Can someone explain when to use the quadratic formula versus factoring?",
    "topic": "algebra"
  }')

echo "$CREATE_POST_RESPONSE" | jq '.'

POST_ID=$(echo "$CREATE_POST_RESPONSE" | jq -r '.data.id')

if [ -z "$POST_ID" ] || [ "$POST_ID" = "null" ]; then
  echo "ERROR: Failed to create post"
  exit 1
fi

echo "Post created with ID: $POST_ID"

# Step 3: Get all posts
echo -e "\n3. Getting all posts..."
curl -s -X GET "$BASE_URL/community/posts" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Step 4: Get post by ID
echo -e "\n4. Getting post by ID..."
curl -s -X GET "$BASE_URL/community/posts/$POST_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Step 5: Create a reply to the post
echo -e "\n5. Creating a reply to the post..."
CREATE_REPLY_RESPONSE=$(curl -s -X POST "$BASE_URL/community/posts/$POST_ID/replies" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "The quadratic formula is best when the equation cannot be easily factored. Try factoring first if you see simple factors!"
  }')

echo "$CREATE_REPLY_RESPONSE" | jq '.'

REPLY_ID=$(echo "$CREATE_REPLY_RESPONSE" | jq -r '.data.id')

if [ -z "$REPLY_ID" ] || [ "$REPLY_ID" = "null" ]; then
  echo "ERROR: Failed to create reply"
  exit 1
fi

echo "Reply created with ID: $REPLY_ID"

# Step 6: Create a nested reply
echo -e "\n6. Creating a nested reply (reply to reply)..."
CREATE_NESTED_REPLY_RESPONSE=$(curl -s -X POST "$BASE_URL/community/posts/$POST_ID/replies" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"content\": \"Thanks! That makes sense. So I should check for simple factors first?\",
    \"parentId\": \"$REPLY_ID\"
  }")

echo "$CREATE_NESTED_REPLY_RESPONSE" | jq '.'

NESTED_REPLY_ID=$(echo "$CREATE_NESTED_REPLY_RESPONSE" | jq -r '.data.id')

# Step 7: Get post with all replies
echo -e "\n7. Getting post with nested replies..."
curl -s -X GET "$BASE_URL/community/posts/$POST_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Step 8: Update the reply
echo -e "\n8. Updating the reply..."
curl -s -X PUT "$BASE_URL/community/replies/$REPLY_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "The quadratic formula is best when the equation cannot be easily factored. Try factoring first if you see simple factors! Also consider completing the square."
  }' | jq '.'

# Step 9: Update the post
echo -e "\n9. Updating the post..."
curl -s -X PUT "$BASE_URL/community/posts/$POST_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "How to solve quadratic equations efficiently? [UPDATED]",
    "content": "I am struggling with quadratic equations. Can someone explain when to use the quadratic formula versus factoring? Also, when should I complete the square?",
    "topic": "algebra"
  }' | jq '.'

# Step 10: Search posts
echo -e "\n10. Searching posts with keyword 'quadratic'..."
curl -s -X GET "$BASE_URL/community/posts?search=quadratic" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Step 11: Filter posts by topic
echo -e "\n11. Filtering posts by topic 'algebra'..."
curl -s -X GET "$BASE_URL/community/posts?topic=algebra" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Step 12: Sort by most-replied
echo -e "\n12. Getting posts sorted by most-replied..."
curl -s -X GET "$BASE_URL/community/posts?sort=most-replied&limit=5" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Step 13: Get trending posts
echo -e "\n13. Getting trending posts..."
curl -s -X GET "$BASE_URL/community/trending?limit=5" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Step 14: Pagination test
echo -e "\n14. Testing pagination (page 1, limit 10)..."
curl -s -X GET "$BASE_URL/community/posts?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN" | jq '.pagination'

# Step 15: Create another post with different topic
echo -e "\n15. Creating a post with 'geometry' topic..."
CREATE_GEOMETRY_POST=$(curl -s -X POST "$BASE_URL/community/posts" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Best way to remember circle formulas?",
    "content": "I always forget the formulas for circumference and area. Any tips?",
    "topic": "geometry"
  }')

echo "$CREATE_GEOMETRY_POST" | jq '.'

GEOMETRY_POST_ID=$(echo "$CREATE_GEOMETRY_POST" | jq -r '.data.id')

# Step 16: Delete nested reply
echo -e "\n16. Deleting nested reply..."
if [ ! -z "$NESTED_REPLY_ID" ] && [ "$NESTED_REPLY_ID" != "null" ]; then
  curl -s -X DELETE "$BASE_URL/community/replies/$NESTED_REPLY_ID" \
    -H "Authorization: Bearer $TOKEN" | jq '.'
fi

# Step 17: Delete reply
echo -e "\n17. Deleting reply..."
curl -s -X DELETE "$BASE_URL/community/replies/$REPLY_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Step 18: Delete posts
echo -e "\n18. Deleting posts..."
curl -s -X DELETE "$BASE_URL/community/posts/$POST_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

if [ ! -z "$GEOMETRY_POST_ID" ] && [ "$GEOMETRY_POST_ID" != "null" ]; then
  curl -s -X DELETE "$BASE_URL/community/posts/$GEOMETRY_POST_ID" \
    -H "Authorization: Bearer $TOKEN" | jq '.'
fi

echo -e "\n=========================================="
echo "Community API Test Completed!"
echo "=========================================="
