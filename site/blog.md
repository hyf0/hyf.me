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

<div class="max-w-3xl mx-auto py-16 px-8">
  <ul class="list-none p-0 m-0">
    <li
      v-for="post in posts"
      :key="post.url"
      class="flex justify-between items-baseline gap-8 py-6 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
    >
      <h2 class="flex-1 m-0 text-lg font-bold">
        <a
          :href="post.url"
          class="relative no-underline text-gray-900 dark:text-gray-100 transition-colors duration-200 hover:text-blue-600 dark:hover:text-blue-400 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-blue-600 dark:after:bg-blue-400 after:transition-all after:duration-300 hover:after:w-full"
        >
          {{ post.title }}
        </a>
      </h2>
      <span class="flex-shrink-0 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
        {{ formatDate(post.date) }}
      </span>
    </li>
  </ul>
</div>
