import { __rest } from "tslib";
import React from 'react';
import './button.css';
/** Primary UI component for user interaction */
export var Index = function (_a) {
    var _b = _a.primary, primary = _b === void 0 ? false : _b, _c = _a.size, size = _c === void 0 ? 'medium' : _c, backgroundColor = _a.backgroundColor, label = _a.label, props = __rest(_a, ["primary", "size", "backgroundColor", "label"]);
    var mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';
    return (<button type="button" className={['storybook-button', "storybook-button--".concat(size), mode].join(' ')} style={{ backgroundColor: backgroundColor }} {...props}>
      {label}
    </button>);
};
//# sourceMappingURL=index.jsx.map