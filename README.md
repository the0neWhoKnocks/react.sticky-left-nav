# Sticky Left Nav (WIP)

View the [demo here](https://the0newhoknocks.github.io/react.sticky-left-nav/).

---

Tried to utilize `IntersectionObserver`, but it would miss certain detections
if the user scrolled very quickly moving a point from the bottom (out of view)
to the top (out of view); leading to false positives/negatives.
