import {defineField, defineType} from 'sanity'
import {MdTheaterComedy as icon} from 'react-icons/md'
export default defineType({
  name: 'genre',
  title: 'genre',
  type: 'document',
  icon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'add genre',
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
