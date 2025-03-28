import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    heroImage: z.string()
  }),
  slug: ({ defaultSlug }) => defaultSlug.replace(/\.md$/, '')
});

export const collections = { blog };