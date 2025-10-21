---
title: Blog
description: A collection of my thoughts and writings on various topics.
layout: page
---

<script setup>
import { data as posts } from '../src/posts.data'

// Format date to be more readable
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
.blog-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.blog-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.blog-item {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 2rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.blog-item:last-child {
  border-bottom: none;
}

.blog-title {
  flex: 1;
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: #1a1a1a;
}

.blog-title a {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s ease;
}

.blog-title a:hover {
  color: #666;
}

.blog-date {
  flex-shrink: 0;
  font-size: 0.875rem;
  color: #999;
  white-space: nowrap;
}
</style>

<div class="blog-container">
  <ul class="blog-list">
    <li v-for="post in posts" :key="post.url" class="blog-item">
      <h2 class="blog-title">
        <a :href="post.url">{{ post.title }}</a>
      </h2>
      <span class="blog-date">{{ formatDate(post.date) }}</span>
    </li>
  </ul>
</div>
