import colors from '../../../tokens/colors.json';

const LEVEL_AA = 4.5;
const LEVEL_AA_LARGE = 3;
const LEVEL_AAA = 7;
const hex = (color) => {
  let temp = color.charAt(0) === '#' ? color.substring(1, 7) : color;

  if (temp.length === 3) {
    const c0 = temp.charAt(0);
    const c1 = temp.charAt(1);
    const c2 = temp.charAt(2);

    temp = [c0, c0, c1, c1, c2, c2].join('');
  }

  return temp;
};
const hex2rgb = (color) => {
  return {
    r: parseInt(color.substring(0, 2), 16),
    g: parseInt(color.substring(2, 4), 16),
    b: parseInt(color.substring(4, 6), 16),
  };
};
const luminance = (color) => {
  const rgb = hex2rgb(hex(color));
  /* eslint-disable */
  const a = [rgb.r, rgb.g, rgb.b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  /* eslint-enable */

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};
const contrast = (color1, color2) => {
  const l1 = luminance(color1) + 0.05;
  const l2 = luminance(color2) + 0.05;
  return Math.max(l1, l2) / Math.min(l1, l2);
};
const variableName = (str, variant = false) =>
  variant
    ? `$color-${str.toLowerCase().replace(/\s/g, '')}-${variant}`
    : `$color-${str.toLowerCase().replace(/\s/g, '')}`;
const getColorList = (data) => {
  const list = [];

  data.map((item) => {
    if (item.variants) {
      item.variants.map((variant) => {
        list.push({
          name: `${item.name} - ${variant.name}`,
          color: variant.color,
          var: variableName(item.name, variant.name),
        });
      });
    } else {
      list.push({
        name: item.name,
        color: item.color,
        var: variableName(item.name),
      });
    }
  });

  return list;
};
export const allColors = getColorList(colors);
export const tintColors = getColorList(
  colors.filter((item) => {
    return item.section === 'Tints';
  })
);
export const backgroundColors = getColorList(
  colors.filter((item) => {
    return item.section === 'Background Colors';
  })
);
export const foregroundColors = getColorList(
  colors.filter((item) => {
    return item.section === 'Foreground Colors';
  })
);
const nameBlock = (input) =>
  input.name ? `<p><strong>${input.name}</strong></p>` : '';
const varBlock = (input) =>
  input.var ? `<p><code>${input.var}</code></p>` : '';
const hexBlock = (input) =>
  input.color ? `<p><code>${input.color}</code></p>` : '';
const a11yBlock = (ratio) => {
  let a11y = [];

  if (ratio >= LEVEL_AA_LARGE) {
    a11y = ['AA Large'];
  }
  if (ratio >= LEVEL_AA) {
    a11y = ['AA', 'AAA Large'];
  }
  if (ratio >= LEVEL_AAA) {
    a11y = ['AAA'];
  }

  return a11y.map((item) => `<span class="a11y-tag">${item}</span> `).join('');
};

const swatch = (item, over) => {
  const ratio = over && contrast(item.color, over.color);

  if (over && ratio <= LEVEL_AA_LARGE) {
    return '';
  }

  let response = `<div class="documentation-block documentation-color" style="background: ${item.color};">`;

  if (over) {
    response += `
    <div class="text" style="color: ${over.color}"><span>Aa</span></div>
    <footer>
      ${nameBlock(over)}
      ${varBlock(over)}
      ${hexBlock(over)}
      <div class="a11y-tag-container">
        ${a11yBlock(ratio)}
      </div>
    </footer>
    `;
  } else {
    response += `
    <div class="color-block"></div>
      <footer>
      ${nameBlock(item)}
      ${varBlock(item)}
      ${hexBlock(item)}
    </footer>`;
  }
  response += `</div>`;

  return response;
};
const swatchGrid = (item, list) => {
  let response = '<div class="documentation-grid--feature">';

  response += swatch(item, false);
  response += '<div class="documentation-grid">';

  list.map((color) => {
    response += swatch(item, color);
  });

  response += '</div>';
  response += '</div>';

  return response;
};
export const genAllColors = (list) => {
  let response = '<div class="documentation-grid">';

  list.map((item) => {
    response += swatch(item, false);
  });

  response += '</div>';

  return response;
};
export const genColorType = (list) => {
  let response = '<div class="documentation-grid--list">';

  list.map((item) => {
    response += swatchGrid(item, allColors);
  });

  response += '</div>';

  return response;
};

export const all = () => ({ template: genAllColors(allColors) });
export const tints = () => ({ template: genColorType(tintColors) });
export const background = () => ({ template: genColorType(backgroundColors) });
export const foreground = () => ({ template: genColorType(foregroundColors) });
export default {
  title: 'Primitives/Colors',
};
