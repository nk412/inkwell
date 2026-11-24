# Diagram components

Added when a page uses `.mermaid-box`.

### mermaid
A flowchart or other Mermaid diagram drawn in the house font and greys, which redraws when the theme changes. Write the Mermaid source in a `pre` inside `.mermaid-box`. The source stays on show until Mermaid 10.9.1 loads, from jsDelivr, as the diagram comes near the viewport. Put it in a wide figure with an italic caption that says what the diagram shows. Keep labels short: one idea per node, and Yes or No on decision edges.

```html
<figure class="wide">
  <div class="mermaid-box"><pre>flowchart LR
  A[Copy the skeleton] --> B[Write the content]
  B --> C{Four or more sections?}
  C -- Yes --> D[Contents rail]
  C -- No --> E[No rail]
  D --> F([Build])
  E --> F</pre></div>
  <figcaption>How a page gets built.</figcaption>
</figure>
```
