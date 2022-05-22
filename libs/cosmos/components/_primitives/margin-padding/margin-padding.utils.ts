import spacing from '../../../tokens/spacing.json';
// import markdown from './margin-padding.md';

const wrapGrid = (input) => {
  return `<div class="documentation-grid--large">${input}</div>`;
};
const topbottom = (input) => `
<div class="documentation-spacing--external documentation-block">
    <div class="spacing-block--stack">
        <div class="content" style="margin-top: ${input}px;"></div>
        <div class="content"></div>
    </div>
    <footer>
        <p><strong>Margin Top ${input}</strong></p>
        <p><code>.mt-${input}</code></p>
    </footer>
</div>
<div class="documentation-spacing--external documentation-block">
    <div class="spacing-block--stack">
        <div class="content" style="margin-bottom: ${input}px;"></div>
        <div class="content"></div>
    </div>
    <footer>
        <p><strong>Margin Bottom ${input}</strong></p>
        <p><code>.mb-${input}</code></p>
    </footer>
</div>

<div class="documentation-spacing--external documentation-block">
    <div class="spacing-block--stack">
        <div class="content" style="margin-top: ${input}px; margin-bottom: ${input}px;"></div>
        <div class="content"></div>
    </div>
    <footer>
        <p><strong>Margin Top and Bottom ${input}</strong></p>
        <p><code>.my-${input}</code></p>
    </footer>
</div>`;

const leftright = (input) => `
<div class="documentation-spacing--external documentation-block">
    <div class="spacing-block--inline">
        <div class="content" style="margin-left: ${input}px;"></div>
        <div class="content"></div>
    </div>
    <footer>
        <p><strong>Margin Left ${input}</strong></p>
        <p><code>.ml-${input}</code></p>
    </footer>
</div>
<div class="documentation-spacing--external documentation-block">
    <div class="spacing-block--inline">
        <div class="content" style="margin-right: ${input}px;"></div>
        <div class="content"></div>
    </div>
    <footer>
        <p><strong>Margin Right ${input}</strong></p>
        <p><code>.mr-${input}</code></p>
    </footer>
</div>
<div class="documentation-spacing--external documentation-block">
    <div class="spacing-block--inline">
        <div class="content" style="margin-left: ${input}px;margin-right: ${input}px;"></div>
        <div class="content"></div>
    </div>
    <footer>
        <p><strong>Margin Left and Right ${input}</strong></p>
        <p><code>.mx-${input}</code></p>
    </footer>
</div>`;

export const margin_top_bottom = wrapGrid(
  spacing.stack.map((item) => topbottom(item)).join('')
);

// export const margin_top_bottom = () => ({
//   template: wrapGrid(spacing.stack.map((item) => topbottom(item)).join('')),
// });

export const margin_left_right = wrapGrid(
  spacing.stack.map((item) => leftright(item)).join('')
);
// export const margin_left_right = () => ({
//   template: wrapGrid(spacing.stack.map((item) => leftright(item)).join('')),
// });

// export default {
//   title: 'Primitives/Margin',
//   parameters: {
//     notes: markdown,
//   },
// };

// // Friendly Name for Stories
// marginleftright.story = {
//   name: 'Left and Right',
// };

// margintopbottom.story = {
//   name: 'Top and Bottom',
// };
