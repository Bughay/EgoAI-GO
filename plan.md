1. Structure: Delete the `<button type="button" id="google-btn">Sign in with Google</button>` element from the form in index.html
2. Styling: Remove all CSS rules targeting `#google-btn` from styles.css
3. Styling: Modify the `#company-name` rule in styles.css to set `height: 40px`, `box-sizing: border-box`, `line-height: 40px`, `padding: 0 1rem` to achieve a 40px visual height while preserving centered text

###Here is the step by step plan

# Implementation Plan

## High-Level Objectives
1. Structure: Delete the `<button type="button" id="google-btn">Sign in with Google</button>` element from the form in `index.html`
2. Styling: Remove all CSS rules targeting `#google-btn` from `styles.css`
3. Styling: Modify the `#company-name` rule in `styles.css` to set `height: 40px`, `box-sizing: border-box`, `line-height: 40px`, `padding: 0 1rem` to achieve a 40px visual height while preserving centered text

---

## Detailed Implementation Steps

1. Open `index.html` and delete the line that contains the Google sign-in button element: `<button type="button" id="google-btn">Sign in with Google</button>`. Ensure the element is completely removed from the `<form id="login-form">` structure and that the remaining buttons are not disrupted.

2. Open `styles.css` and remove all CSS rules that target `#google-btn`. Locate and delete the complete declaration blocks for the following selectors:
   - `#google-btn` (the main button styling)
   - `#google-btn:hover`
   - `#google-btn:active`
   - `#google-btn::after`
   - `#google-btn:hover::after`
   The total removal ensures no unused rules remain in the stylesheet.

3. Open `styles.css` and replace the existing `#company-name` rule block with the following updated rule, which adds a fixed height, proper box-sizing, vertical centering, and adjusted padding while preserving all other existing styles:

```css
#company-name {
  background: #000;
  color: #fff;
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
  text-align: center;
  height: 40px;
  box-sizing: border-box;
  line-height: 40px;
  padding: 0 1rem;
  border-radius: 10px;
  margin: 0 0 2rem 0;
  box-shadow: 0 0 15px #00d9ff, inset 0 0 10px rgba(0, 217, 255, 0.3);
  text-shadow: 0 0 5px #00d9ff;
  letter-spacing: 2px;
}
```

Make sure the new block is formatted exactly as shown and that no other styles or rules are accidentally altered.