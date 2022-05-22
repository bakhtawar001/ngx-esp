export const config = [
  {
    name: 'Grid Layout 1',
    class: 'grid-layout-1',
    columns: 12,
  },
];

export const wrapGrid = (input) =>
  `<div class="documentation-grid--list">${input}</div>`;
export const nameBlock = (input) =>
  input.name ? `<p><strong>${input.name}</strong></p>` : '';
export const classBlock = (input) =>
  input.class ? `<p><code>.${input.class}</code></p>` : '';
export const columnBlock = (input) => {
  let output = '';
  for (let i = 0; i < input.columns; i++) {
    output += `<div class="grid-content">content</div>`;
  }

  return output;
};
export const gridItem = (input) => `
<div class="documentation-block documentation-grid">
    <div class="grid-block">
        <div class="${input.class}">
            ${columnBlock(input)}
        </div>
    </div>
    <footer>
        ${nameBlock(input)}
        ${classBlock(input)}
    </footer>
</div>
`;

export const GRID_MARKUP = wrapGrid(
  config.map((item) => gridItem(item)).join('')
);
