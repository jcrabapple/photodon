import { foobarRole } from '../roles'
import {
  composeInput, getNthReplyButton, getNthStatus, getUrl, homeNavButton, notificationsNavButton,
  postStatusButton
} from '../utils'

fixture`103-compose.js`
  .page`http://localhost:4002`

test('statuses show up in home timeline', async t => {
  await t.useRole(foobarRole)
    .typeText(composeInput, 'hello world', {paste: true})
    .click(postStatusButton)
    .expect(getNthStatus(0).innerText).contains('hello world')
    .click(notificationsNavButton)
    .expect(getUrl()).contains('/notifications')
    .click(homeNavButton)
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(getNthStatus(0).innerText).contains('hello world')
    .navigateTo('/')
    .expect(getNthStatus(0).innerText).contains('hello world')
})

test('statuses in threads show up in right order', async t => {
  await t.useRole(foobarRole)
    .navigateTo('/accounts/5')
    .click(getNthStatus(2))
    .expect(getUrl()).contains('/statuses')
    .click(getNthReplyButton(3))
    .expect(getUrl()).contains('/reply')
    .typeText(composeInput, 'my reply!', {paste: true})
    .click(postStatusButton)
    .expect(getUrl()).match(/statuses\/[^/]+$/)
    .expect(getNthStatus(5).innerText).contains('@baz my reply!')
    .navigateTo('/accounts/5')
    .click(getNthStatus(2))
    .expect(getNthStatus(5).innerText).contains('@baz my reply!')
})
