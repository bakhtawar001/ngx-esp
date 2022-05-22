# Dropdown Menus

The Dropdown Menu component is used to select an item from a list of options. These are triggered by a user clicking on a select component.

### When to use this

Use a Dropdown selections when:

- Allow users to select one or more option from a list.

### When not to use this

Don’t use Dropdown selections when:

- There are less than 5 options for a user to select from
- Consider radio buttons or checkboxes


## How it works

### Single Select

Lets users choose one option from a list of options in a popover menu. Selecting an option from the list will collapse the popover and display the option within the selection field.

### Multi Select

Lets users select one or more items from a list of options in a popover menu. Selected options will automatically populate the selection field as comma separated values. The popover collapses when the selection box or anywhere outside of the component is clicked.

### Nested Lists

Lets users navigate a tree-structure of nested lists. These can be single or multi-select.

### Search

All dropdowns have the option of adding search to the top of the menu. Add search if the list of options exceeds 10.

### Sections

All dropdowns have the option of organizing it's data into sections. Use this if the data logicially makes sense to be segmented into multiple sections. An example of this is the filter menu.

#### Dropdown Best Practices

- Be used for selecting between 4 or more predefined options
- Have a default option selected whenever possible
- Use “Select” as a placeholder option only if there’s no logical default option
- Longer selected values should be truncated with an ellipsis



## Menu States

- Resting - default display
- Hover - when an option is hovered with the cursor or within focus
- Selected - an option selected by a user
- Focus- a user has highlighted an element, using an input method such as a keyboard or voice.


## Research

- [Nielsen Norman Group article on Drop Down Menus](https://www.nngroup.com/articles/drop-down-menus/)
- [Dropdown Usability](https://baymard.com/blog/drop-down-usability)

