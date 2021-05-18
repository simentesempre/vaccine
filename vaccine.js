require('dotenv').config()
const puppeteer = require('puppeteer')

const vaccine = async () => {
    const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage()
    await page.goto('https://www.ilpiemontetivaccina.it/preadesione/#/adesione/nuova')

    const cf = await page.$('input[aria-label="Codice fiscale"]')
    await cf.type(process.env.FP_CF)

    const ts = await page.$('input[aria-label="Numero tessera sanitaria"]')
    await ts.type(process.env.FP_TS)

    const ageSelect = await page.$x("//div[contains(text(), 'Seleziona categoria')]")
    if(ageSelect.length > 0) {
        await ageSelect[0].click()
        sleep(200)
        const ageSelected = await page.$x("//div[contains(text(), '40-49 anni')]")
        if(ageSelected.length > 0) {
            await ageSelected[0].click()
            sleep(200)
            const continua = await page.$('button[type="submit"]')
            await continua.click()
            sleep(1000)

            await page.waitForSelector('input[name="last-minute"]')
            await page.evaluate(() => {
                document.querySelector('input[name="last-minute"]').parentElement.click()
            })
            const mobile = await page.$('input[aria-label="Numero di telefono mobile"]')
            await mobile.type(process.env.FP_PHONE)
            const email = await page.$('input[aria-label="Email"]')
            await email.type(process.env.FP_EMAIL)

            await page.waitForSelector('input[name="privacy-policy"]')
            await page.evaluate(() => {
                document.querySelector('input[name="privacy-policy"]').parentElement.click()
            })
            
            const continua2 = await page.$('button[type="submit"]')
            await continua2.click()
            sleep(1000) 
            
            /* const continua3 = await page.$('button[type="button"]')
            await continua3.click()
            sleep(1000) */ 
        }
    }
}
vaccine()

const sleep = (miliseconds) => {
    var currentTime = new Date().getTime();
    while (currentTime + miliseconds >= new Date().getTime()) {}
}