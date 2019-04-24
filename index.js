const fsPr = require('fs').promises
const path = require('path')
const argv = require('minimist')(process.argv.slice(2))
const puppeteer = require('puppeteer')

async function main(buildTemplate) {

}

async function getScreenshot() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(/* BT link to 3-traffic */)
  await page.screenshot({ path: '' })

  await browser.close()
}

const buildTemplate = argv[0]

if (!buildTemplate) {
  throw new Error('Please provide a build template as the first arg')
}

main(buildTemplate)
