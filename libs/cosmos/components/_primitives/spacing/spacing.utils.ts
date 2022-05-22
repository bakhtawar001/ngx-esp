import spacing from '../../../tokens/spacing.json';

const wrapGrid = (input) => {
  return `<div class="documentation-grid--large">${input}</div>`;
};
const insetItem = (input) => `
<div class="documentation-spacing--internal documentation-block">
    <div class="spacing-block" style="padding: ${input}px;">
    <div class="content"></div>
    </div>
    <footer>
    <p><strong>Inset ${input}</strong></p>
    <p><code>@include spacing-inset-${input}</code></p>
    </footer>
</div>`;
const squishItem = (input) => `
<div class="documentation-spacing--internal documentation-block">
    <div class="spacing-block" style="padding: ${input.y}px ${input.x}px;">
    <div class="content"></div>
    </div>
    <footer>
    <p><strong>Squish ${input.y}</strong></p>
    <p><code>@include spacing-squish-${input.y}</code></p>
    </footer>
</div>`;
const stackItem = (input) => `
<div class="documentation-spacing--external documentation-block">
    <div class="spacing-block--stack">
        <div class="content" style="margin-bottom: ${input}px;"></div>
        <div class="content"></div>
    </div>
    <footer>
        <p><strong>Stack ${input}</strong></p>
        <p><code>$spacing-stack-${input}</code></p>
    </footer>
</div>`;
const inlineItem = (input) => `
<div class="documentation-spacing--external documentation-block">
    <div class="spacing-block--inline">
        <div class="content" style="margin-right: ${input}px;"></div>
        <div class="content"></div>
    </div>
    <footer>
        <p><strong>Inline ${input}</strong></p>
        <p><code>$spacing-inline-${input}</code></p>
    </footer>
</div>`;

export const _inset = wrapGrid(
  spacing.inset.map((item) => insetItem(item)).join('')
);

export const _squish = wrapGrid(
  spacing.squish.map((item) => squishItem(item)).join('')
);

export const _stack = wrapGrid(
  spacing.stack.map((item) => stackItem(item)).join('')
);

export const _inline = wrapGrid(
  spacing.inline.map((item) => inlineItem(item)).join('')
);
