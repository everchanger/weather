<template>
  <div class="container">
    <slot></slot>
  </div>
</template>

<style>
*,
:before,
:after {
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: #e5e7eb;
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0;
}

html,
body {
  --bittersweet: #ed6a5a;
  --lemon-chiffon: #f4f1bb;
  --ash-gray: #9bc1bc;
  --wenge: #5d576b;
  --alabaster: #e6ebe0;

  font-family: monospace;
  height: 100%;
  min-height: 100%;
  margin: 0;
  font-size: 16px;
}

body {
  background: radial-gradient(
    circle at 100% 100%,
    var(--lemon-chiffon) 0%,
    var(--ash-gray) 100%
  );
  color: var(--wenge);
}

body:has(.night) {
  background: radial-gradient(
    circle at 100% 100%,
    var(--wenge) 0%,
    var(--bittersweet) 100%
  );
  color: var(--lemon-chiffon);
}

.container {
  margin-right: auto;
  margin-left: auto;
  width: 100%;
  padding: 1rem;
}

@media (min-width: 640px) {
  .container {
    max-width: 640px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}
</style>
