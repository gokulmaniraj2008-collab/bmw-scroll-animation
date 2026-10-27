# Scroll animation frames

Add 120 matching, consistently cropped WebP frames named frame-001.webp through frame-120.webp in this directory. They should show successive moments of the same car animation, not 120 duplicates. The website uses sequence.js to load frame 1 first and then load the rest in small batches. Scroll progress selects the corresponding frame; unloaded frames use the nearest available frame. Canvas scales each image to fit the sticky viewport. If frame-001.webp is absent or reduced motion is requested, the existing single BMW image animation is retained.

This repository does not yet contain the 120 frame assets. The current single external BMW image cannot by itself provide 120 distinct viewpoints. Check usage rights before adding any third-party image sequence. Static hosting serves these files at ./frames/frame-001.webp etc. No build command required.
