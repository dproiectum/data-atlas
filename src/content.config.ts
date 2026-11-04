import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { allTopicIds } from './lib/knowledge';
const allowedTopics = allTopicIds();
const topicId = z.string().refine(id => allowedTopics.has(id), { message: 'Unknown taxonomy topic' });

const knowledge = defineCollection({
  loader: glob({ base: './src/content/entries', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string().min(3),
    description: z.string().min(8),
    space: z.enum(['tech-watch', 'job-seeking', 'learning-lab']),
    kind: z.enum(['article', 'market-report', 'ebook', 'note', 'concept']),
    status: z.enum(['inbox', 'reading', 'reviewed', 'connected', 'needs-update']),
    source: z.string().min(1),
    sourceUrl: z.string().url().optional(),
    sourceLocation: z.string().optional(),
    author: z.string().optional(),
    publishedAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date(),
    primaryTopic: topicId.optional(),
    relatedTopics: z.array(topicId).default([]),
    tags: z.array(z.string()).default([]),
    relatedEntries: z.array(z.string()).default([])
  })
});
export const collections = { knowledge };
