const fs = require('fs');

// Import token json files here
const colors = require('../../tokens/colors.json');
const spacing = require('../../tokens/spacing.json');
const zIndex = require('../../tokens/z-index.json');
const type = require('../../tokens/typography.json');
const bordersShadows = require('../../tokens/borders-shadows.json');

const baseDir = './libs/cosmos/scss/base';
const variablesDir = './libs/cosmos/scss/settings/variables';

const intro = `// This is a generated file, do not edit directly. Use the 'npm run tokens' command to rebuild. \n\n`;

const genColorTokens = (input) => {
  let output = intro;

  input.map((item) => {
    const normalizedName = item.name.toLowerCase().replace(/\s/g, '');
    const normalizedAlias =
      item.alias && item.alias.toLowerCase().replace(/\s/g, '');

    if (item.variants) {
      item.variants.map((variant) => {
        output += `$color-${normalizedName}-${variant.name}: ${variant.color}; \n`;
        if (item.alias) {
          output += `$color-${normalizedAlias}-${variant.name}: $color-${normalizedName}-${variant.name}; \n`;

          if (variant.alias) {
            output += `$color-${normalizedAlias}-${variant.alias}: $color-${normalizedName}-${variant.name}; \n`;
          }
        }

        if (variant.alias) {
          output += `$color-${normalizedName}-${variant.alias}: $color-${normalizedName}-${variant.name}; \n`;
        }
      });
    } else {
      if (item.createToken || item.createToken === undefined) {
        output += `$color-${normalizedName}: ${item.color}; \n`;
        if (item.alias) {
          output += `$color-${normalizedAlias}:-${normalizedName}; \n`;
        }
      }
    }
  });

  return output;
};

const genSpacingTokens = (input) => {
  let output = intro;

  Object.keys(input).map((item) => {
    input[item].map((subitem) => {
      switch (item) {
        case 'inset':
          output += `@mixin spacing-${item}-${subitem}() {\n  padding: ${subitem}px;\n} \n\n`;
          break;
        case 'squish':
          output += `@mixin spacing-${item}-${subitem.y}() {\n  padding: ${subitem.y}px ${subitem.x}px;\n} \n\n`;
          break;
        case 'stack':
        case 'inline':
          output += `$spacing-${item}-${subitem}: ${subitem}px; \n`;
          break;
        default:
          break;
      }
    });
  });

  return output;
};

const genSpacingUtilityClasses = (input) => {
  let output = intro;

  Object.keys(input).map((item) => {
    input[item].map((subitem) => {
      switch (item) {
        case 'stack':
          // Positive Values
          output += `.mt-${subitem} {\n  margin-top: ${subitem}px !important;\n} \n\n`;
          output += `.pt-${subitem} {\n  padding-top: ${subitem}px !important;\n} \n\n`;
          output += `.mb-${subitem} {\n  margin-bottom: ${subitem}px !important;\n} \n\n`;
          output += `.pb-${subitem} {\n  padding-bottom: ${subitem}px !important;\n} \n\n`;

          // Top and Bottom
          output += `.my-${subitem} {\n  margin-top: ${subitem}px !important;\n  margin-bottom: ${subitem}px !important;\n} \n\n`;
          output += `.py-${subitem} {\n  padding-top: ${subitem}px !important;\n  padding-bottom: ${subitem}px !important;\n} \n\n`;

          // Negative Values

          if (subitem > 0) {
            output += `.mt-n${subitem} {\n  margin-top: -${subitem}px !important;\n} \n\n`;
            output += `.pt-n${subitem} {\n  padding-top: -${subitem}px !important;\n} \n\n`;
            output += `.mb-n${subitem} {\n  margin-bottom: -${subitem}px !important;\n} \n\n`;
            output += `.pb-n${subitem} {\n  padding-bottom: -${subitem}px !important;\n} \n\n`;
          }

          break;
        case 'inline':
          output += `.ml-${subitem} {\n  margin-left: ${subitem}px !important;\n} \n\n`;
          output += `.pl-${subitem} {\n  padding-left: ${subitem}px !important;\n} \n\n`;
          output += `.mr-${subitem} {\n  margin-right: ${subitem}px !important;\n} \n\n`;
          output += `.pr-${subitem} {\n  padding-right: ${subitem}px !important;\n} \n\n`;

          // Left and Right
          output += `.mx-${subitem} {\n  margin-left: ${subitem}px !important;\n  margin-right: ${subitem}px !important;\n} \n\n`;
          output += `.px-${subitem} {\n  padding-left: ${subitem}px !important;\n  padding-right: ${subitem}px !important;\n} \n\n`;

          // Negative Values
          if (subitem > 0) {
            output += `.ml-n${subitem} {\n  margin-left: -${subitem}px !important;\n} \n\n`;
            output += `.pl-n${subitem} {\n  padding-left: -${subitem}px !important;\n} \n\n`;
            output += `.mr-n${subitem} {\n  margin-right: -${subitem}px !important;\n} \n\n`;
            output += `.pr-n${subitem} {\n  padding-right: -${subitem}px !important;\n} \n\n`;
          }

          break;
        default:
          break;
      }
    });
  });

  return output;
};

const genTypeTokens = (input) => {
  let output = intro;

  Object.keys(input).map((item, index) => {
    if (Array.isArray(input[item])) {
      input[item].map((subitem) => {
        switch (item) {
          case 'size':
            output += `$font-size-${subitem}: rem(${subitem}); \n`;
            break;
          case 'weight':
            output += `$font-weight-${subitem}: ${subitem}; \n`;
            break;
          default:
            break;
        }
      });
    } else if (item === 'stack') {
      Object.keys(input[item]).map((subitem) => {
        output += `$font-stack-${subitem}: ${input[item][subitem]}; \n`;
      });
    }
    if (index !== Object.keys(input).length - 1) {
      output += `\n`;
    }
  });

  return output;
};

const genZIndexTokens = (input) => {
  let output = intro;

  Object.keys(input).map((item) => {
    output += `$z-index-${item}: ${zIndex[item]}; \n`;
  });

  return output;
};

const genBordersShadows = (input) => {
  let output = intro;

  Object.keys(input).map((item, index) => {
    Object.keys(input[item]).map((subitem) => {
      switch (item) {
        case 'radius':
          output += `$border-radius-${subitem}: ${input[item][subitem]}; \n`;
          break;
        case 'shadow':
          output += `$box-shadow-${subitem}: ${input[item][subitem]}; \n`;
          break;
        case 'border':
          output += `$border-${subitem}: ${input[item][subitem]}; \n`;
          break;
        default:
          break;
      }
    });
    if (index !== Object.keys(input).length - 1) {
      output += `\n`;
    }
  });

  return output;
};

fs.writeFile(`${variablesDir}/_colors.scss`, genColorTokens(colors), (err) => {
  if (err) throw err;
});

fs.writeFile(
  `${variablesDir}/_spacing.scss`,
  genSpacingTokens(spacing),
  (err) => {
    if (err) throw err;
  }
);

fs.writeFile(
  `${baseDir}/_margin-padding.scss`,
  genSpacingUtilityClasses(spacing),
  (err) => {
    if (err) throw err;
  }
);

fs.writeFile(`${variablesDir}/_typography.scss`, genTypeTokens(type), (err) => {
  if (err) throw err;
});

fs.writeFile(
  `${variablesDir}/_z-index.scss`,
  genZIndexTokens(zIndex),
  (err) => {
    if (err) throw err;
  }
);

fs.writeFile(
  `${variablesDir}/_borders-shadows.scss`,
  genBordersShadows(bordersShadows),
  (err) => {
    if (err) throw err;
  }
);
