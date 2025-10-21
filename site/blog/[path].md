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

<style scoped>
.post-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.post-header {
    box-sizing: border-box;
    margin: 0 auto;
    margin-bottom: 20px;
    width: var(--notion-max-width);
    padding-left: calc(min(16px, 8vw));
    padding-right: calc(min(16px, 8vw));
    border-bottom: 1px solid #f0f0f0;
}

.post-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 1rem 0;
  line-height: 1.2;
}

.post-date {
  font-size: 0.9rem;
  color: #999;
}

.post-content {
  color: #333;
  line-height: 1.7;
}
</style>

<article class="post-container">
  <header class="post-header">
    <h1 class="post-title">{{ $params.title }}</h1>
    <time class="post-date">{{ formatDate($params.date) }}</time>
  </header>

  <div v-html="htmlContent" />
</article>