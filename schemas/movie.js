import {defineField, defineType} from 'sanity'
import {MdLocalMovies as icon} from 'react-icons/md'
export default defineType({
  name: 'movie',
  title: 'Movie',
  type: 'document',
  icon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 100,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
        layout: 'radio',
      },
      fields: [
        {
          type: 'string',
          name: 'alt',
          title: 'alt',
        },
      ],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
    }),
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'string',
    }),
    defineField({
      name: 'parent',
      title: 'Parent',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'parentYear',
      title: 'Parent Year',
      type: 'string',
    }),
    defineField({
      name: 'videoID',
      title: 'Video ID',
      type: 'string',
    }),
    defineField({
      name: 'genre',
      title: 'Genre',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'genre'}]}],
    }),
    {
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: ['movie', 'tv series'],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'runtime',
      title: 'Runtime (minutes)',
      type: 'string',
      validation: (Rule) => Rule.required().min(0),
    },
    defineField({
      name: 'poster',
      title: 'Poster Image',
      type: 'image',
      options: {
        hotspot: true,
        layout: 'radio',
      },
      fields: [
        {
          type: 'string',
          name: 'alt',
          title: 'alt',
        },
      ],
    }),
    defineField({
      name: 'rate',
      title: 'Rate',
      type: 'reference',
      to: [{type: 'rating'}],
    }),
    defineField({
      name: 'cast',
      title: 'Cast',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'director',
      title: 'Director',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'credit',
      title: 'Credit',
      type: 'string',
    }),
    defineField({
      name: 'scenes',
      title: 'Scenes',
      type: 'array',
      of: [
        {
          type: 'image',
          fields: [
            {
              type: 'string',
              name: 'alt',
              title: 'alt',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'preview',
      title: 'Preview',
      type: 'image',
    }),
  ],
})
