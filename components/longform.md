# Long-form components

Added when a page uses one of these classes.

### pull-quote
One line lifted from the text and set large in Outfit 600 between two hairlines. Use at most one per section, and only for a line that is in the text or sums it up.

```html
<p class="pullquote">Good typography goes unnoticed until it is missing.</p>
```

### sidenotes
Asides set beside the line that mentions them: in the right margin from 1200px, and as indented asides in the text below that. They are italic, 0.82rem and muted. Put the reference and the note straight after the words they belong to. Use sidenotes for asides people read and footnotes for citations people look up.

```html
<p>Long reads can keep their asides beside the text.<span class="sn-ref" aria-hidden="true">1</span><span class="sidenote" role="note"><span class="sn-num">1</span>On wide screens this sits in the right margin.</span> The text carries on.</p>
```

### timeline
A dated sequence of events on a hairline spine, with a mono date column and a dot per entry; the newest dot is filled. Each entry has an Outfit title, an optional chip and a muted body. Put the newest entry first. It stacks on phones.

```html
<ol class="timeline">
  <li><time datetime="2026-11-22">22/11/2026</time><div><p class="tl-title">Launched <span class="chip sm is-live">Live</span></p><p class="tl-body">What happened.</p></div></li>
  <li><time datetime="2026-10-01">01/10/2026</time><div><p class="tl-title">Started</p><p class="tl-body">What happened.</p></div></li>
</ol>
```
