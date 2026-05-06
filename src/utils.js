import fs from 'node:fs'
import _ from 'lodash'

function getIriName(iri) {
  if (iri.includes('#')) {
    return iri.split('#').at(-1)
  } else {
    return iri.split('/').at(-1)
  }
}

function isPropertyIdFn(text) {
  return /^b\d+$/.test(text)
}

function getNamespace(iri) {
  if (iri.includes('#')) {
    return iri.split('#')[0]
  } else {
    return iri.substring(0, iri.lastIndexOf('/'));
  }
}

function printNamespaces(shaclPath) {
  let shaclText;

  try {
    shaclText = fs.readFileSync(shaclPath, 'utf8')
    //console.log(data)
  } catch (err) {
    console.error('Error reading file:', err)
  }

  let namespaces = []

  const regex = /<(http[^>]*)>/g
  let matchesIt = shaclText.matchAll(regex)
  namespaces = [...matchesIt].map(x => getNamespace(x[1]))

  let namespaceGrouped = _.groupBy(namespaces, n => n)

  let namespacesToPut = []

  for (let key in namespaceGrouped) {
    if (namespaceGrouped[key].length > 1) {
      namespacesToPut.push({ name: key, count: namespaceGrouped[key].length })
    }
  }

  for (const namespace of namespacesToPut) {
    console.log(`(skaits: ${namespace.count}): ${namespace.name}`)
  }
}

export { getIriName, isPropertyIdFn, printNamespaces }