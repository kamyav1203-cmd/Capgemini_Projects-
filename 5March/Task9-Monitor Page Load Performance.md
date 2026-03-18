Question
9
Monitor Page Load Performance
Description
Monitor Page Load Performance
Scenario:
Developers track how long a page takes to load.

Requirement

Use performance.now()

Send duration to remote logger

const start = performance.now();

window.onload = function(){

const end = performance.now();

const loadTime = end - start;

logger.log("INFO","Page Load Time:", loadTime + " ms");

}
