import {test, expect} from '@playwright/test'
import {PageManager} from '../page-objects/pageManager'
import {faker} from '@faker-js/faker'
import { __core_private_testing_placeholder__ } from '@angular/core/testing'

// test.beforeEach(async ({page}) => {
//     await page.goto('/')
// })

test('navigate to Form Layouts @smoke', async({page}) => {
    const pm = new PageManager(page)

    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datePickerPage()
    await pm.navigateTo().dialogPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
})

test('parametrized methods', async({page}) => {
    const pm = new PageManager(page)
    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(1000)}@test.com`

    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingGridFormWithCredentialsAndSelectOption(process.env.USERNAME!, process.env.PASSWORD!, 'Option 2')
    await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true)
    //await page.locator('nb-card', {hasText: 'Inline form'}).screenshot({path: 'screenshot/inlineForm.png'})
    //const buffer = await page.screenshot()
    //console.log(buffer.toString('base64'))
    
    //await page.screenshot({path: 'screenshot/formLayoutsPage.png'})
    // await pm.navigateTo().datePickerPage()
    // await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(3)
    // await pm.onDatePickerPage().selectDatePickerWithRangeFromToday(1, 4)
})