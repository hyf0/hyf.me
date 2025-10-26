---
layout: page
---

<script setup>
import { useData } from 'vitepress'

// Format date to be more readable
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Get HTML content from frontmatter
const { frontmatter } = useData()
const htmlContent = frontmatter.value.htmlContent || ''
</script>

<article class="max-w-3xl mx-auto py-12 px-8">
  <header class="box-border mx-auto mb-5 border-b border-gray-200 dark:border-gray-700" style="width: var(--notion-max-width); padding-left: calc(min(16px, 8vw)); padding-right: calc(min(16px, 8vw));">
    <h1 class="text-4xl font-bold text-gray-900 dark:text-white m-0 mb-4 leading-tight">
      {{ $params.title }}
    </h1>
    <time class="text-sm text-gray-500 dark:text-gray-400">
      {{ formatDate($params.date) }}
    </time>
  </header>

  <div v-html="htmlContent" class="leading-relaxed" />
</article>