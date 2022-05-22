# Tabs

The tabs component lets users navigate between related sections of content, displaying one section at a time.

## How it works

### When to use this component

Tabs can be a helpful way of letting users quickly switch between related information if:

- your content can be usefully separated into clearly labelled sections
- the first section is more relevant than the others for most users
- users will not need to view all the sections at once

Tabs can work well for showing multiple categories or subsets of products such as New, Recently Added, Most Popular. Users can browse through each category without leaving the page.

### When to not use this component

Do not use tabs if your users might need to:

- read through all of the content in order, for example, to understand a step-by-step process
- compare information in different tabs - having to memorise the information and switch backwards and forwards can be frustrating and difficult

---

## Development

See https://material.angular.io/components/tabs/ for full documentation.

The "Single Route" example uses the pattern for lazy loading (https://material.angular.io/components/tabs/overview#lazy-loading).

The "Navigation" example uses the pattern for navigation (https://material.angular.io/components/tabs/overview#tabs-and-navigation).

---

### Use clear labels

Tabs hide content, so the tab labels need to make it very clear what they link to, otherwise users will not know if they need to click on them.

If you struggle to come up with clear labels, it might be because the way you’ve separated the content is not clear.

### Order the tabs according to user needs

The first tab should be the most commonly-needed section. Arrange the other tabs in the order that makes most sense for your users.

### Do not disable tabs

Disabling elements is normally confusing for users. If there is no content for a tab, either remove the tab or, if that would be confusing for your users, explain why there is no content when the tab is selected.

### Avoid tabs that wrap over more than one line

If you use too many tabs or they have long labels then they may wrap over more than one line. This makes it harder for users to see the connection between the selected tab and its content.

---

## Visual Details

### Typography

| State    | Type                | Color         |
| -------- | ------------------- | ------------- |
| Active   | Barlow Bold 16px    | G88 Mineshaft |
| Inactive | Barlow Regular 16px | G64 Shark     |
| Focus    | Barlow Regular 16px | G77 Smoke     |
| Hover    | Barlow Regular 16px | G77 Smoke     |
| Disable  | Barlow Regular 16px | G12-Disabled  |

### Spacing

The spacing between each tab is 32pt. The line that runs below the tab is 8 pt.

### States

In active state a bold 2px BL57-Azule line will appear under the tab.

In hover state a bold 1px BL57-Azule line will appear under the tab.
