import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

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
    primaryTopic: z.string().regex(/^DE\.\d{2}$/).optional(),
    relatedTopics: z.array(z.string().regex(/^DE\.\d{2}$/)).default([]),
    tags: z.array(z.string()).default([]),
    relatedEntries: z.array(z.string()).default([])
  })
});
export const collections = { knowledge };
