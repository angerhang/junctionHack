const gcloud = require('google-cloud')

const vision = gcloud.vision({
  keyFilename: 'junction-ad-8c0658b12405.json'
})

exports.getAnnotations = function (filename) {
  const request = {
    image: {source: {filename}},
    features: [
      {
        type: 'LABEL_DETECTION'
      }
    ]
  }

  return vision.annotateImage(request)
}
