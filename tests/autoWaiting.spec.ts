import {test, expect} from '@playwright/test'

test.beforeEach(async ({page}, testInfo) => {
    await page.goto(process.env.URL!)
    await page.getByText('Button Triggering AJAX Request').click()
    testInfo.setTimeout(testInfo.timeout + 2000)
})


test('autowaiting', async ({page}) => {
    const successButton = page.locator('.bg-success')
    //await successButton.click()

    // await successButton.waitFor({state: "attached"})
    // const text = await successButton.allTextContents()
    // expect(text).toContain('Data loaded with AJAX get request.')

    await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout: 20000})
})

test.skip('alternative waits', async ({page}) => {
    const successButton = page.locator('.bg-success')


    //__wait for element
    //await page.waitForSelector('.bg-success')

    //_wait for particular response
    //await page.waitForResponse('http://uitestingplayground.com/ajaxdata')


    //_wait for network calls to be completed (NOT RECOMMENDED)
    await page.waitFor

    const text = await successButton.allTextContents()
    expect(text).toContain('Data loaded with AJAX get request.')
})

test.skip('timeouts', async ({page}) => {
    //test.setTimeout(10000)
    test.slow()

    const successButton = page.locator('.bg-success')
    await successButton.click()

})