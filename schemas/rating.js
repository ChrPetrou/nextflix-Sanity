import {defineField, defineType} from 'sanity'
import {TbRating12Plus as icon} from 'react-icons/tb'

export default defineType({
  name: 'rating',
  title: 'Rating',
  type: 'document',
  icon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'add rating',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 100,
      },
    }),
  ],
})
