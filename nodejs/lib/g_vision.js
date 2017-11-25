const gcloud = require('google-cloud')

const vision = gcloud.vision({
  keyFilename: 'junction-ad-8c0658b12405.json'
})

exports.getAnnotations = function (filename) {
  const request = {
    image: {source: {filename}},
    features: [
      {
        type: 'LANDMARK_DETECTION'
      },
      {
        type: 'LOGO_DETECTION'
      },
      {
        type: 'LABEL_DETECTION'
      },
      {
        type: 'TEXT_DETECTION'
      },
      {
        type: 'DOCUMENT_TEXT_DETECTION'
      },
      {
        type: 'IMAGE_PROPERTIES'
      },
      {
        type: 'WEB_DETECTION'
      }
    ]
  }

  return vision.annotateImage(request)
}
