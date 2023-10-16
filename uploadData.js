import {createClient} from '@sanity/client'
import {createReadStream} from 'fs'
import {basename} from 'path'
import {} from 'dotenv/config'
import fs from 'fs'

// a file i use to upload predefined documents to sanity

const client = createClient({
  projectId: process.env.PROJECT_ID,
  dataset: process.env.DATASET,
  token: process.env.EDIT_TOKEN,
  useCdn: false, // Set to true if you want to use the Content Delivery API
  apiVersion: 'v2021-10-21',
})

let proccessMoviesFilePath = process.env.GLOBAL_PATH + '/config/movies.json'

let mergedArray = JSON.parse(fs.readFileSync(proccessMoviesFilePath, 'utf-8'))

const importData = () => {
  try {
    mergedArray.slice(0, 1).forEach((element, index) => {
      const filePath = process.env.GLOBAL_PATH + `/public/assets/images/${element.slug}-thumb.jpg`
      const logoFilePath =
        process.env.GLOBAL_PATH + `/public/assets/_logos/logo-${element.slug}.svg`
      const previewFilePath = process.env.GLOBAL_PATH + `/public/assets/images/${element.slug}.jpg`
      let genreArray = element.labels.map((label, index) => ({
        _ref: label.split(' ').join('-'),
        _type: 'reference',
        _key: `${index}${label}`,
      }))

      //create a new document if not exist or replace it with the new data
      client.createIfNotExists({
        _type: 'movie',
        _id: element.slug,
        title: element.title,
        slug: {
          current: element.slug,
        },
        description: element.description,
        quote: element.quote,
        parent: element.parent,
        parentYear: element.parentYear,
        genre: genreArray,
        type: element.tags[1].toLowerCase(),
        runtime: element.runtime,
        rate: {
          _type: 'reference',
          _ref: element.rating,
        },
        cast: element.starring,
        director: element.director,
        credit: element.credit,
      })

      client.assets
        .upload('image', createReadStream(filePath), {
          filename: basename(filePath),
        })
        .then((imageAsset) => {
          // Here you can decide what to do with the returned asset document.
          // If you want to set a specific asset field you can to the following:
          return client
            .patch(element.slug)
            .set({
              poster: {
                _type: 'image',
                asset: {
                  _type: 'reference',
                  _ref: imageAsset._id,
                },
                alt: element.altHero,
              },
            })
            .commit()
        })

      client.assets
        .upload('image', createReadStream(previewFilePath), {
          filename: basename(previewFilePath),
        })
        .then((imageAsset) => {
          // Here you can decide what to do with the returned asset document.
          // If you want to set a specific asset field you can to the following:
          return client
            .patch(element.slug)
            .set({
              preview: {
                _type: 'image',
                asset: {
                  _type: 'reference',
                  _ref: imageAsset._id,
                },
                alt: element.altHero,
              },
            })
            .commit()
        })
        .then((e) => {
          console.log('Image Preview -> Done!')
        })

      client.assets
        .upload('image', createReadStream(logoFilePath), {
          filename: basename(logoFilePath),
        })
        .then((imageAsset) => {
          return client
            .patch(element.slug)
            .set({
              logo: {
                _type: 'image',
                asset: {
                  _type: 'reference',
                  _ref: imageAsset._id,
                },
                alt: `${element.slug}-logo`,
              },
            })
            .commit()
        })
      //create an array of images (the max scenes will be 4)
      const array = []
      Array.from({length: 4}).forEach((e, i) => {
        let filePath =
          process.env.GLOBAL_PATH + `public/assets/images/${element.slug}-still${i + 1}.jpg`

        if (fs.existsSync(filePath)) {
          client.assets
            .upload('image', createReadStream(filePath), {
              filename: basename(`${element.slug}-still${i + 1}`),
            })
            .then((imageAsset) => {
              array.push({
                _type: 'image',
                alt: element[`alt${i + 1}`],
                asset: {
                  _ref: imageAsset._id,
                  _type: 'reference',
                },
              })
            })
            .then(() => {
              // Here you can decide what to do with the returned asset document.
              // If you want to set a specific asset field you can to the following:
              const validArray = array.filter((item) => item !== null)
              return client
                .patch(element.slug)
                .set({
                  scenes: validArray,
                })
                .commit({autoGenerateArrayKeys: true})
            })
        }
      })

      //a file to write the movies that i created in sanity
      let finishedMoviesFilePath = process.env.GLOBAL_PATH + '/config/merged.json'
      let x = fs.readFileSync(finishedMoviesFilePath, 'utf-8')
      let finishedArray = JSON.parse(x)
      finishedArray.push(element)
      console.log()
      fs.writeFileSync(finishedMoviesFilePath, JSON.stringify(finishedArray, null, 6))

      //remove first item of merged array
      mergedArray.splice(0, 1)
      //then write it the array without that value back to its original file
      fs.writeFileSync(proccessMoviesFilePath, JSON.stringify(mergedArray, null, 6))
    })
  } catch (err) {
    console.log(err)
  }
}

// interval because of rate limit
// if (mergedArray.length > 0) {
//   setInterval(() => {
//     importData()
//   }, 1000)
// } else {
//   console.log('All documents Inserted')
// }

//import rating documents to sanity
const importRating = () => {
  let test = merged.map((mv) => mv.rating)
  const labels = Array.from(new Set(test.flat()))
  console.log(labels)
  try {
    labels.map((element) =>
      client.createOrReplace({
        _type: 'rating',
        _id: element,
        name: element,
        slug: {
          current: element,
        },
      }),
    )
  } catch (err) {
    console.log(err)
  }
}

// // Call the function to insert all documents
// importRating()

// a function to delete all documents from sanity of type movie
async function deleteAllDocuments() {
  try {
    // Fetch all documents from the dataset
    const allDocuments = await client.fetch('*[_type == "movie"]')

    // Delete each document
    for (const document of allDocuments) {
      await client.delete(document._id)
      console.log(`Deleted document with ID: ${document._id}`)
    }

    console.log('All documents deleted successfully.')
  } catch (error) {
    console.error(`Error deleting documents: ${error.message}`)
  }
}

// // Call the function to delete all documents
// deleteAllDocuments()

let proccessVideosFilePath = process.env.GLOBAL_PATH + '/config/videos.json'

let videoArray = JSON.parse(fs.readFileSync(proccessVideosFilePath, 'utf-8'))

const imporVideos = () => {
  try {
    videoArray.slice(0, 1).forEach((element, index) => {
      //create a new document if not exist or replace it with the new data
      const res = client
        .patch(element.slug)
        .set({
          videoID: element?.video || '',
        })
        .commit()
        .then((response) => {
          console.log('Entry patched successfully:', response)
        })
        .catch((error) => {
          console.error('Error patching entry:', error)
        })

      //a file to write the movies that i created in sanity
      let finishedMoviesFilePath = process.env.GLOBAL_PATH + '/config/videosMerged.json'
      let x = fs.readFileSync(finishedMoviesFilePath, 'utf-8')
      let finishedArray = JSON.parse(x)
      finishedArray.push(element)
      console.log(element)
      fs.writeFileSync(finishedMoviesFilePath, JSON.stringify(finishedArray, null, 6))

      //remove first item of merged array
      videoArray.splice(0, 1)
      //then write it the array without that value back to its original file
      fs.writeFileSync(proccessVideosFilePath, JSON.stringify(videoArray, null, 6))
    })
  } catch (err) {
    console.log(err)
  }
}

if (videoArray.length > 0) {
  setInterval(() => {
    imporVideos()
  }, 3000)
} else {
  console.log('All documents Inserted')
}
