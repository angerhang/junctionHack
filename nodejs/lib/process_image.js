const fastLevenshtein = require('fast-levenshtein')
const Bluebird = require('bluebird')
const cmd = require('node-cmd')

const gVision = require('./g_vision')

const getAsync = Bluebird.promisify(cmd.get, { multiArgs: true, context: cmd })

function annotationsToText (annotations) {
  let resultText = ''
  const annotation = annotations[0] // consider first obj only for now

  const type = annotation.labelAnnotations
    .sort((a, b) => b.score - a.score)[0].description

  if (type) {
    resultText = type
  }

  if (annotation.textAnnotations && annotation.textAnnotations.length > 0) {
    let text = annotation.textAnnotations[0].description

    if (text) {
      const webEntities = annotation.webDetection.webEntities
      const relaventEntities = annotation.webDetection.webEntities.filter(e => {
        return fastLevenshtein.get(e.description, text) < (text.length / 2)
      })

      if (webEntities.length > 0 && (relaventEntities.length / webEntities.length) > .1) {
        resultText = `${resultText} ${text}`
      }
    }

  } else {
    const eDesc = annotation.webDetection.webEntities[0].description

    if(eDesc.indexOf(type) !== -1 && fastLevenshtein.get(eDesc, text) > 2) {
      resultText = `${resultText} ${eDesc}`
    }
  }

  return resultText
}

exports.getObjectDesc = function (filePath) {
  return gVision.getAnnotations(filePath)
    .then((annotations) => {
      const desc = annotationsToText(annotations)

      let cmd = `python ../scripts/getItem.py "${desc}" "${filePath}"`
      if (process.env.NODE_ENV !== 'production') {
        cmd = 'source ../scripts/facebookenv/bin/activate && ${cmd}'
      }
      return getAsync(cmd)
        .then(data => {
          let fullDesc
          console.log('cmd data', data)
          data[0].split('\n').forEach(a => {
            if(/RESULT.*RESULT/g.test(a)) {
              fullDesc = a.replace(/RESULT/g, '')
            }
          })

          return JSON.parse(fullDesc)
        })
    })
}
