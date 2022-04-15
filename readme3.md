nteractions
Let's start talking about adding interactions to our charts!

LESSON
DISCUSSION 0

The biggest advantage of creating charts with JavaScript is the ability to respond to user input. In this module, we'll learn what ways users can interact with our graphs and how to implement them.

d3 events
We learn how to add interaction event listeners using our d3 selection objects, then run through a concrete example.

LESSON
DISCUSSION 1

Browsers have native event listeners — using addEventListener(), we can listen for events from a user's:

mouse
keyboard
scroll wheel
touch
resize
... and more.
For example:

1
function onClick(event) {
2
// do something here...
3
}
4
addEventListener("click", onClick)
After running this code, the browser will trigger onClick() when a user clicks anywhere on the page.

These event listeners have tons of functionality and are simple to use. We can get even more functionality using d3's event listener wrappers!

Our d3 selection objects have an .on() method that will create event listeners on our selected DOM elements. Let's take a look at how to implement d3 event listeners.

If we open the events.js file, we can see a few things happening:

We define rectColors as an array of colors.
We grab all .rect elements inside of the #svg element (created in index.html) and bind our selection to the rectColors array.
We use .join() to isolate all new data points (every row in rectColors) and append a <rect> for each color.
Lastly, we set each <rect>'s size to 100 pixels by 100 pixels and shift each item 110 pixels to the right (multiplied by its index). We also make all of our boxes light grey.
In our browser, we can see our four boxes.

grey boxes
They don't do much right now, let's make it so they change to their designated color on hover.

To add a d3 event listener, we pass the type of event we want to listen for as the first parameter of .on(). Any DOM event type will work — see the full list of event types on the MDN docs. To mimic a hover start, we'll want to target mouseenter.

1
rect.on("mouseenter")
The second parameter .on() receives is a callback function that will be executed when the specified event happens. This function will receive two parameters:

the event
the bound datum
Let's log these parameters to the console to get a better look.

1
rects.on("mouseenter", (event, d) => {
2
console.log({event, d})
3
})
It can often be helpful to use ES6 object property shorthand for logging multiple variables. This way, we can see the name and value of each variable!
When we hover over a box, we can see that our mouseenter event is triggered! The parameters passed to our function(in order) are:

an event object
the matching data point bound from the rectColors array (in this case, the color)
In order to change the color of the current box, we'll need to create a d3 selection targeting only that box. Let's take a look at what our event object looks like.

Perfect! It looks like our event object has a currentTarget key. We can use event.currentTarget to create a d3 selection and set the box's fill using the datum.

1
rects.on("mouseenter", (event, d) => {
2
const selection = d3.select(event.currentTarget)
3
selection.attr("fill", d)
4
})
Now when we refresh our webpage, we can change our boxes to their related color on hover!

hovered boxes
Hmm, we're missing something. We want our boxes to turn back to grey when our mouse leaves them. Let's chain another event listener that triggers on mouseleave and make our box grey again.

1
rects.on("mouseenter", (event, d) => {
2
const selection = d3.select(event.currentTarget)
3
selection.attr("fill", d)
4
})
5
.on("mouseleave", (event) => {
6
const selection = d3.select(event.currentTarget)
7
selection.attr("fill", "lightgrey")
8
})
mouseenter is often seen as interchangeable with mouseover. The two events are very similar, but mouseenter is usually closer to the wanted behavior. They are both triggered when the mouse enters the targeted container, but mouseover is also triggered when the mouse moves between nested elements.

This same distinction applies to mouseleave (preferred) and mouseout.
Final code for this lesso

```
import * as d3 from "d3";

async function createEvent() {
  const rectColors = [
    "yellowgreen",
    "cornflowerblue",
    "seagreen",
    "slateblue",
  ]

  // create and bind data to our rects
  const rects = d3.select("#svg")
    .selectAll(".rect")
    .data(rectColors)
    .join("rect")
      .attr("height", 100)
      .attr("width", 100)
      .attr("x", (d,i) => i * 110)
      .attr("fill", "lightgrey")

  // your code here

  rects.on("mouseenter", (event, d) => {
    const selection = d3.select(event.currentTarget)
    selection.attr("fill", d)
  })
  .on("mouseleave", (event) => {
    const selection = d3.select(event.currentTarget)
    selection.attr("fill", "lightgrey")
  })

}
createEvent()
```

Destroying d3 event listeners
We can't let our event listeners hang around forever - we learn how to clean up after ourselves and cancel old ones.

LESSON
DISCUSSION 1

Before we look at adding events to our charts, let's learn how to destroy our event handlers. Removing old event listeners is important for updating charts and preventing memory leaks, among other things.

Let's add a 3 second timeout at the end of our code so we can test that our mouse events are working before we destroy them.

1
setTimeout(() => {
2
}, 3000)
Removing a d3 event listener is easy — all we need to do is call .on() with null as the triggered function.

1
setTimeout(() => {
2
rects
3
.on("mouseenter", null)
4
.on("mouseleave", null)
5
}, 3000)
Perfect! Now our hover events will stop working after 3 seconds.

You might notice that a box might be stuck with its hovered color if it was hovered over when the mouse events were deleted.

hovered boxes - stuck!
Luckily, there's an easy fix!

D3 selections have a .dispatch() method that will programatically trigger an event — no actual mouseleave needed. We can trigger a mouseleave event right before we remove it to ensure that our boxes finish in their "neutral" state.

1
setTimeout(() => {
2
rects
3
.dispatch("mouseleave")
4
.on("mouseenter", null)
5
.on("mouseleave", null)
6
}, 3000)
Perfect! Now that we have a good handle on using d3 event listeners, let's use them to make our charts interactive.

Final code for this lesson

```
import * as d3 from "d3";

async function createEvent() {
  const rectColors = [
    "yellowgreen",
    "cornflowerblue",
    "seagreen",
    "slateblue",
  ]

  // create and bind data to our rects
  const rects = d3.select("#svg")
    .selectAll(".rect")
    .data(rectColors)
    .join("rect")
      .attr("height", 100)
      .attr("width", 100)
      .attr("x", (d,i) => i * 110)
      .attr("fill", "lightgrey")

  // your code here

  rects.on("mouseenter", (event, d) => {
    const selection = d3.select(event.currentTarget)
    selection.attr("fill", d)
  })
  .on("mouseleave", (event) => {
    const selection = d3.select(event.currentTarget)
    selection.attr("fill", "lightgrey")
  })

  setTimeout(() => {
    rects
      .dispatch("mouseleave")
      .on("mouseenter", null)
      .on("mouseleave", null)
  }, 3000)

}
createEvent()
```

Bar chart
We add a tooltip to our histogram. This involves creating a tooltip, updating its contents to show information about the hovered bar, and moving above the hovered bar.

LESSON
DISCUSSION 2

Let's add interactions to the histogram that we created in Module 3.

Histogram
Our goal in the section is to add an informative tooltip that shows the humidity range and day count when a user hovers over a bar.

histogram finished
We could use d3 event listeners to change the bar's color on hover, but there's an alternative: CSS hover states. To add CSS properties that only apply when an element is hovered over, add :hover after the selector name. It's good practice to place this selector immediately after the non-hover styles to keep all bar styles in one place.

Let's add a new selector to the styles.css file.

1
.bin rect:hover {
2
}
Let's have our bars change their fill to purple when we hover over them.

1
.bin rect:hover {
2
fill: purple;
3
}
Great, now our bars should turn purple when we hover over them and back to blue when we move our mouse out.

histogram with hover state
Now we know how to implement hover states in two ways: CSS hover states and event listeners. Why would we use one over the other?

CSS hover states are good to use for more stylistic updates that don't require DOM changes. For example, changing colors or opacity. If we're using a CSS preprocessor like SASS, we can use any color variables instead of duplicating them in our JavaScript file.

JavaScript event listeners are what we need to turn to when we need a more complicated hover state. For example, if we want to update the text of a tooltip or move an element, we'll want to do that in JavaScript.

Since we need to update our tooltip text and position when we hover over a bar, let's add our mouseenter and mouseleave event listeners at the bottom of our bars.js file. We can set ourselves up with named functions to keep our chained code clean and concise.

1
binGroups.select("rect")
2
.on("mouseenter", onMouseEnter)
3
.on("mouseleave", onMouseLeave)
4
​
5
const onMouseEnter = (event, d) => {
6
}
7
​
8
const onMouseLeave = (event, d) => {
9
}
Starting with our onMouseEnter() function, we'll start by grabbing our tooltip element. If you look in our index.html file, you can see that our template starts with a tooltip with two children: a div to display the range and a div to display the value. We'll follow the common convention of using ids as hooks for JavaScript and classes as hooks for CSS. There are two main reasons for this distinction:

We can use classes in multiple places (if we wanted to style multiple elements at once) but we'll only use an id in one place. This ensures that we're selecting the correct element in our chart code
We want to separate our chart manipulation code and our styling code — we should be able to move our chart hook without affecting the styles.
We could create our tooltip in JavaScript, the same way we have been creating and manipulating SVG elements with d3. We have it defined in our HTML file here, which is generally easier to read and maintain since the tooltip layout is static.
If we open up our styles.css, we can see our basic tooltip styles, including using a pseudo-selector .tooltip:before to add an arrow pointing down (at the hovered bar). Also note that the tooltip is hidden (opacity: 0) and will transition any property changes (transition: all 0.2s ease-out). It also will not receive any mouse events (pointer-events: none) to prevent from stealing the mouse events we'll be implementing.

Let's comment out the opacity: 0 property so we can get a look at our tooltip.

1
.tooltip {
2
/_ opacity: 0; _/
We can see that our tooltip is positioned in the top left of our page.

histogram with visible tooltip - far away!
If we position it instead at the top left of our chart, we'll be able to shift it based on the hovered bar's position in the chart.

We can see that our tooltip is absolutely positioned all the way to the left and 12px above the top (to offset the bottom triangle). So why isn't it positioned at the top left of our chart?

Absolutely positioned elements are placed relative to their containing block. The default containing block is the <html> element, but will be overridden by certain ancestor elements. The main scenario that will create a new containing block is if the element has a position other than the default (static). There are other scenarios, but they are much more rare (for example, if a transform is specified).

This means that our tooltip will be positioned at the top left of the nearest ancestor element that has a set position. Let's give our .wrapper element a position of relative.

1
.wrapper {
2
position: relative;
3
}
Perfect! Now our tooltip is located at the top left of our chart and ready to be shifted into place when a bar is hovered over.

histogram with visible tooltip
Let's start adding our mouse events in bars.js by grabbing the existing tooltip using its id (#tooltip). Our tooltip won't change once we load the page, so let's define it outside of our onMouseEnter() function.

1
const tooltip = d3.select("#tooltip")
2
function onMouseEnter(event, d) {
3
}
Now let's start fleshing out our onMouseEnter() function by updating our tooltip text to tell us about the hovered bar. Let's select the nested #count element and update it to display the y value of the bar. Remember, in our histogram the y value is the number of days in our dataset that fall in that humidity level range.

1
const tooltip = d3.select("#tooltip")
2
function onMouseEnter(event, d) {
3
tooltip.select("#count")
4
.text(yAccessor(d))
5
}
Looking good! Now our tooltip updates when we hover over a bar to show that bar's count.

histogram tooltip with count
Next, we can update our range value to match the hovered bar. The bar is covering a range of humidity values, so let's make an array of the values and join them with a - (which can be easier to read than a template literal).

1
tooltip.select("#range")
2
.text([
3
d.x0,
4
d.x1
5
].join(" - "))
Our tooltip now updates to display both the count and the range, but it might be a bit too precise.

histogram tooltip with count and range
We could convert our range values to strings and slice them to a certain precision, but there's a better way. It's time to meet d3.format().

The d3-format module helps turn numbers into nicely formatted strings. Usually when we display a number, we'll want to parse it from its raw format. For example, we'd rather display 32,000 than 32000 — the former is easier to read and will help with scanning a list of numbers.

If we pass d3.format() a format specifier string, it will create a formatter function. That formatter function will take one parameter (a number) and return a formatted string. There are many possible format specifier strings — let's go over the format for the options we'll use the most often.

[,][.precision][type]

Each of these specifiers is optional — if we use an empty string, our formatter will just return our number as a string. Let's talk about what each specifier tells our formatter.

,: add commas every 3 digits to the left of the decimal place

.precision: give me this many numbers after the decimal place.

type: each specific type is declared by using a single letter or symbol. The most handy types are:

f: fixed point notation — give me precision many decimal points
r: decimal notation — give me precision many significant digits and pad the rest until the decimal point
%: percentage — multiply my number by 100 and return precision many decimal points
Run through a few examples in your terminal to get the hang of it.

1
d3.format( ".2f")(11111.111) // "11111.11"
2
d3.format(",.2f")(11111.111) // "11,111.11"
3
d3.format(",.0f")(11111.111) // "11,111"
4
d3.format(",.4r")(11111.111) // "11,110"
5
d3.format( ".2%")(0.111) // "11.10%"
Let's create a formatter for our humidity levels. Two decimal points should be enough to differentiate between ranges without overwhelming our user with too many 0s.

1
const formatHumidity = d3.format(".2f")
Now we can use our formatter to clean up our humidity level numbers.

1
const formatHumidity = d3.format(".2f")
2
tooltip.select("#range")
3
.text([
4
formatHumidity(d.x0),
5
formatHumidity(d.x1)
6
].join(" - "))
Nice! An added benefit to our number formatting is that our range numbers are the same width for every value, preventing our tooltip from jumping around.

histogram tooltip with count and formatted range
Next, we want to position our tooltip horizontally centered above a bar when we hover over it. To calculate our tooltip's x position, we'll need to take three things into account:

the bar's x position in the chart (xScale(d.x0)),
half of the bar's width ((xScale(d.x1) - xScale(d.x0)) / 2`), and
the margin by which our bounds are shifted right (dimensions.margin.left).
Remember that our tooltip is located at the top left of our wrapper - the outer container of our chart. But since our bars are within our bounds, they are shifted by the margins we specified.

Chart terminology
Let's add these numbers together to get the x position of our tooltip.

1
const x = xScale(d.x0)
2

- (xScale(d.x1) - xScale(d.x0)) / 2
  3
- dimensions.margin.left
  When we calculate our tooltip's y position, we don't need to take into account the bar's dimensions because we want it placed above the bar. That means we'll only need to add two numbers:

the bar's y position (yScale(yAccessor(d))), and
the margin by which our bounds are shifted down (dimensions.margin.top)

1
const y = yScale(yAccessor(d))
2

- dimensions.margin.top
  Let's use our x and y positions to shift our tooltip. Because we're working with a normal xHTML div, we'll use the CSS translate property.

1
tooltip.style("transform", `translate(`
2

- `${x}px,`
  3
- `${y}px`
  4
- `)`)
  Why are we setting the transform CSS property and not left and top? A good rule of thumb is to avoid changing (and especially animating) CSS values other than transform and opacity. When the browser styles elements on the page, it runs through several steps:

calculate style
layout
paint, and
layers
Most CSS properties affect steps 2 or 3, which means that the browser has to perform that step and the subsequent steps every time that property is changed. Transform and opacity only affect step 4, which cuts down on the amount of work the browser has to do. Read more about each step and this distinction at https://www.html5rocks.com/en/tutorials/speed/high-performance-animations/.
Hmm, why is our tooltip in the wrong position? It looks like we're positioning the top left of the tooltip in the right location (above the hovered bar).

histogram tooltip, unshifted
We want to position the bottom, center of our tooltip (the tip of the arrow) above the bar, instead. We could find the tooltip size by calling the .getBoundingClientRect() method, but there's a computationally cheaper way.

There are a few ways to shift absolutely positioned elements using CSS properties:

top, left, right, and bottom
margins
transform: translate()
All of these properties can receive percentage values, but some of them are based on different dimensions.

top and bottom: percentage of the parent's height
left and right: percentage of the parent's width
margins: percentage of the parent's width
transform: translate(): percentage of the specified element
We're interested in shifting the tooltip based on its own height and width, so we'll need to use transform: translate(). But we're already applying a translate value — how can we set the translate value using a pixel amount and a width?

CSS calc() comes to the rescue here! We can tell CSS to calculate an offset based on values with different units. For example, the following CSS rule would cause an element to be 20 pixels wider than its container.

1
width: calc(100% + 20px);
Let's use calc() to offset our tooltip up half of its own width (-50%) and left -100% of its own height. This is in addition to our calculated x and y values.

1
tooltip.style("transform", `translate(`
2

- `calc( -50% + ${x}px),`
  3
- `calc(-100% + ${y}px)`
  4
- `)`)
  Perfect! Now our tooltip moves to the exact location we want.

histogram finished
We have one last task to do — hide the tooltip when we're not hovering over a bar. Let's un-comment the opacity: 0 rule in styles.css so its hidden to start.

1
.tooltip {
2
opacity: 0;
Jumping back to our bars.js file, we need to make our tooltip visible at the end of our onMouseEnter() function.

1
tooltip.style("opacity", 1)
Lastly, we want to make our tooltip invisible again whenever our mouse leaves a bar. Let's add that to our onMouseLeave() function.

1
function onMouseLeave() {
2
tooltip.style("opacity", 0)
3
}
Look at that! You just made an interactive chart that gives users more information when they need it. Positioning tooltips is not a simple feat, so give yourself a pat on the back! Next up, we'll learn an even fancier method for making it easy for users to get tooltips even for small, close-together elements.

Final code for this lesson

```
import * as d3 from "d3";

async function drawBars() {

  // 1. Access data
  const dataset = await d3.json("./data/my_weather_data.json")

  const metricAccessor = d => d.humidity
  const yAccessor = d => d.length

  // 2. Create chart dimensions

  const width = 600
  let dimensions = {
    width: width,
    height: width * 0.6,
    margin: {
      top: 30,
      right: 10,
      bottom: 50,
      left: 50,
    },
  }
  dimensions.boundedWidth = dimensions.width
    - dimensions.margin.left
    - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height
    - dimensions.margin.top
    - dimensions.margin.bottom

  // 3. Draw canvas

  const wrapper = d3.select("#wrapper")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

  const bounds = wrapper.append("g")
      .style("transform", `translate(${
        dimensions.margin.left
      }px, ${
        dimensions.margin.top
      }px)`)

  // 4. Create scales

  const xScale = d3.scaleLinear()
    .domain(d3.extent(dataset, metricAccessor))
    .range([0, dimensions.boundedWidth])
    .nice()

  const binsGenerator = d3.bin()
    .domain(xScale.domain())
    .value(metricAccessor)
    .thresholds(12)

  const bins = binsGenerator(dataset)

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(bins, yAccessor)])
    .range([dimensions.boundedHeight, 0])
    .nice()

  // 5. Draw data

  const binsGroup = bounds.append("g")

  const binGroups = binsGroup.selectAll("g")
    .data(bins)
    .join("g")
      .attr("class", "bin")

  const barPadding = 1
  const barRects = binGroups.append("rect")
      .attr("x", d => xScale(d.x0) + barPadding / 2)
      .attr("y", d => yScale(yAccessor(d)))
      .attr("width", d => d3.max([
        0,
        xScale(d.x1) - xScale(d.x0) - barPadding
      ]))
      .attr("height", d => dimensions.boundedHeight
        - yScale(yAccessor(d))
      )
      .attr("fill", "cornflowerblue")

  const barText = binGroups.filter(yAccessor)
    .append("text")
      .attr("x", d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
      .attr("y", d => yScale(yAccessor(d)) - 5)
      .text(yAccessor)
      .style("text-anchor", "middle")
      .attr("fill", "darkgrey")
      .style("font-size", "12px")
      .style("font-family", "sans-serif")

  const mean = d3.mean(dataset, metricAccessor)
  const meanLine = bounds.append("line")
      .attr("x1", xScale(mean))
      .attr("x2", xScale(mean))
      .attr("y1", -15)
      .attr("y2", dimensions.boundedHeight)
      .attr("stroke", "maroon")
      .attr("stroke-dasharray", "2px 4px")

  const meanLabel = bounds.append("text")
      .attr("x", xScale(mean))
      .attr("y", -20)
      .text("mean")
      .attr("fill", "maroon")
      .style("font-size", "12px")
      .style("text-anchor", "middle")

  // 6. Draw peripherals

  const xAxisGenerator = d3.axisBottom()
    .scale(xScale)

  const xAxis = bounds.append("g")
    .call(xAxisGenerator)
      .style("transform", `translateY(${dimensions.boundedHeight}px)`)

  const xAxisLabel = xAxis.append("text")
      .attr("x", dimensions.boundedWidth / 2)
      .attr("y", dimensions.margin.bottom - 10)
      .attr("fill", "black")
      .style("font-size", "1.4em")
      .text("Humidity")
      .style("text-transform", "capitalize")

  // 7. Create interactions

  binGroups.select("rect")
      .on("mouseenter", onMouseEnter)
      .on("mouseleave", onMouseLeave)

  const tooltip = d3.select("#tooltip")
  function onMouseEnter(event, d) {
    tooltip.select("#count")
        .text(yAccessor(d))

    const formatHumidity = d3.format(".2f")
    tooltip.select("#range")
        .text([
          formatHumidity(d.x0),
          formatHumidity(d.x1)
        ].join(" - "))

    const x = xScale(d.x0)
      + (xScale(d.x1) - xScale(d.x0)) / 2
      + dimensions.margin.left
    const y = yScale(yAccessor(d))
      + dimensions.margin.top

    tooltip.style("transform", `translate(`
      + `calc( -50% + ${x}px),`
      + `calc(-100% + ${y}px)`
      + `)`)

    tooltip.style("opacity", 1)
  }

  function onMouseLeave() {
    tooltip.style("opacity", 0)
  }
}
drawBars()
```

Scatter plot
We add a tooltip to our scatter plot. Along the way, we learn about d3.timeFormat and learn a great trick for making our tooltips feel smoother, using voronoi.

LESSON
DISCUSSION 5

Let's level up and add tooltips to a scatter plot.

Scatter plot
We want a tooltip to give us more information when we hover over a point in our chart.

At the bottom of the file, we'll select all of our <circle/> elements and add a mousenter and a mouseleave event.

1
bounds.selectAll("circle")
2
.on("mouseenter", onMouseEnter)
3
.on("mouseleave", onMouseLeave)
We know that we'll need to modify our #tooltip element, so let's assign that to a variable. Let's also define our onMouseEnter() and onMouseLeave() functions.

1
const tooltip = d3.select("#tooltip")
2
function onMouseEnter(event, d) {
3
}
4
​
5
function onMouseLeave() {
6
}
Let's first fill out our onMouseEnter() function. We want to display two values:

the metric on our x axis (dew point), and
the metric on our y axis (humidity).
For both metrics, we'll want to define a string formatter using d3.format(). Then we'll use that formatter to set the text value of the relevant <span/> in our tooltip.

1
function onMouseEnter(event, d) {
2
const formatHumidity = d3.format(".2f")
3
tooltip.select("#humidity")
4
.text(formatHumidity(yAccessor(d)))
5
​
6
const formatDewPoint = d3.format(".2f")
7
tooltip.select("#dew-point")
8
.text(formatDewPoint(xAccessor(d)))
9
​
10
}
Let's add an extra bit of information at the bottom of this function — users will probably want to know the date of the hovered point. Our data point's date is formatted as a string, but not in a very human-readable format (for example, "2019-01-01"). Let's use d3.timeParse to turn that string into a date that we can re-format.

1
const dateParser = d3.timeParse("%Y-%m-%d")
2
console.log(dateParser(d.date))
Now we need to turn our date object into a friendlier string. The d3-time-format module can help us out here! d3.timeFormat() will take a date formatter string and return a formatter function.

The date formatter string uses the same syntax as d3.timeParse — it follows four rules:

it will return the string verbatim, other than specific directives,
these directives contain a percent sign and a letter,
usually the letter in a directive has two formats: lowercase (abbreviated) and uppercase (full), and
a dash (-) between the percent sign and the letter prevents padding of numbers.
For example, d3.timeFormat("%Y")(new Date()) will return the current year.

Let's learn a few handy directives:

%Y: the full year
%y: the last two digits of the year
%m: the padded month (eg. "01")
%-m: the non-padded month (eg. "1")
%B: the full month name
%b: the abbreviated month name
%A: the full weekday name
%a: the abbreviated weekday name
%d: the day of the month
See the full list of directives at https://github.com/d3/d3-time-format.

Now, let's create a formatter string that prints out a friendly date.

1
const dateParser = d3.timeParse("%Y-%m-%d")
2
const formatDate = d3.timeFormat("%B %A %-d, %Y")
3
console.log(formatDate(dateParser(d.date)))
Much better! Let's plug that in to our tooltip.

1
const dateParser = d3.timeParse("%Y-%m-%d")
2
const formatDate = d3.timeFormat("%B %A %-d, %Y")
3
tooltip.select("#date")
4
.text(formatDate(dateParser(d.date)))
Next, we'll grab the x and y value of our dot , offset by the top and left margins.

1
const x = xScale(xAccessor(d))
2

- dimensions.margin.left
  3
  const y = yScale(yAccessor(d))
  4
- dimensions.margin.top
  Just like with our bars, we'll use calc() to add these values to the percentage offsets needed to shift the tooltip. Remember, this is necessary so that we're positioning its arrow, not the top left corner.

1
tooltip.style("transform", `translate(`
2

- `calc( -50% + ${x}px),`
  3
- `calc(-100% + ${y}px)`
  4
- `)`)
  Lastly, we'll make our tooltip visible and hide it when we mouse out of our dot.

1
tooltip.style("opacity", 1)
2
}
3
​
4
function onMouseLeave() {
5
tooltip.style("opacity", 0)
6
}
Nice! Adding a tooltip was much faster the second time around, wasn't it?

scatter plot tooltip
Those tiny dots are hard to hover over, though. The small hover target makes us focus really hard to move our mouse exactly over a point. To make things worse, our tooltip disappears when moving between points, making the whole interaction a little jerky.

Don't worry! We have a very clever solution to this problem.

Voronoi#

Let's talk briefly about voronoi diagrams. For every location on our scatter plot, there is a dot that is the closest. A voronoi diagram partitions a plane into regions based on the closest point. Any location within each of these parts agrees on the closest point.

Voronoi are useful in many fields — from creating art to detecting neuromuscular diseases to developing predictive models for forest fires.

Let's look at what our scatter plot would look like when split up with a voronoi diagram.

scatter plot with voronoi
See how each point in our scatter plot is inside of a cell? If you chose any location in that cell, that point would be the closest.

There is a voronoi generator built into the main d3 bundle: d3-delaunay.

Let's create our own diagram! Let's add some code at the end of the Draw data step, right before the Draw peripherals step. Instead of creating a voronoi generator, we'll create a new Delaunay triangulation. A delaunay triangulation is a way to join a set of points to create a triangular mesh. To create this, we can pass d3.Delaunay.from() three parameters:

our dataset,
an x accessor function, and
a y accessor function.

1
const delaunay = d3.Delaunay.from(
2
dataset,
3
d => xScale(xAccessor(d)),
4
d => yScale(yAccessor(d)),
5
)
Now we want to turn our delaunay triangulation into a voronoi diagram -- thankfully our triangulation has a .voronoi() method.

1
const voronoi = delaunay.voronoi()
Let's bind our data and add a <path> for each of our data points with a class of "voronoi" (for styling with our styles.css file).

1
bounds.selectAll(".voronoi")
2
.data(dataset)
3
.join("path")
4
.attr("class", "voronoi")
We can create each path's d attribute string by passing voronoi.renderCell() the index of our data point.

1
bounds.selectAll(".voronoi")
2
// ...
3
.attr("d", (d,i) => voronoi.renderCell(i))
Lastly, let's give our paths a stroke value of salmon so that we can look at them.

1
bounds.selectAll(".voronoi")
2
// ...
3
.attr("stroke", "salmon")
Now when we refresh our webpage, our scatter plot will be split into voronoi cells!

voronoi paths
Hmm, our voronoi diagram is wider and shorter than our chart. This is because it has no concept of the size of our bounds, and is using the default size of 960 pixels wide and 500 pixels tall, which we can see if we log out our voronoi object.

voronoi paths
Let's specify the size of our diagram by setting our voronoi's .xmax and .ymax values (before we draw our <path>s).

1
const voronoi = delaunay.voronoi()
2
voronoi.xmax = dimensions.boundedWidth
3
voronoi.ymax = dimensions.boundedHeight
Voila! Now our diagram is the correct size.

scatter plot with voronoi
What we want is to capture hover events for our paths instead of an individual dot. This will be much easier to interact with because of the contiguous, large hover targets.

Let's remove that last line where we set the stroke (.attr("stroke", "salmon")) so our voronoi cells are invisible. Next, we'll update our interactions, starting by moving our mouseenter and mouseleave events from the dots to our voronoi paths.

Note that the mouse events on our dots won't be triggered anymore, since they're covered by our voronoi paths.

1
bounds.selectAll(".voronoi")
2
// ...
3
.on("mouseenter", onMouseEnter)
4
.on("mouseleave", onMouseLeave)
When we refresh our webpage, notice how much easier it is to target a specific dot!

Changing the hovered dot's color#

Now that we don't need to directly hover over a dot, it can be a bit unclear which dot we're getting data about. Let's make our dot change color and grow on hover.

The naive approach would involve selecting the corresponding circle and changing its fill. Note that d3 selection objects have a .filter() method that mimics a native Array's.

1
function onMouseEnter(event, d) {
2
bounds.selectAll("circle")
3
.filter(datum => datum == d)
4
.style("fill", "maroon")
However, we'll run into an issue here. Remember that SVG elements' z-index is determined by their position in the DOM. We can't change our dots' order easily on hover, so any dot drawn after our hovered dot will obscure it.

scatter plot overlap
Instead, we'll draw a completely new dot which will appear on top.

1
function onMouseEnter(event, d) {
2
const dayDot = bounds.append("circle")
3
.attr("class", "tooltipDot")
4
.attr("cx", xScale(xAccessor(d)))
5
.attr("cy", yScale(yAccessor(d)))
6
.attr("r", 7)
7
.style("fill", "maroon")
8
.style("pointer-events", "none")
Let's remember to remove this new dot on mouse leave.

1
function onMouseLeave() {
2
d3.selectAll(".tooltipDot")
3
.remove()
Now when we trigger a tooltip, we can see our hovered dot clearly!

scatter plot
Making a tooltip for our scatter plot was tricker than expected, but we saw how important encouraging interaction can be. When our hover targets were small, it felt like work to get more information about a specific point. But now that we're using voronoi cells, interacting with our chart is almost fun!

Final code for this lesson

```
import * as d3 from "d3";

async function drawScatter() {

  // 1. Access data
  let dataset = await d3.json("./data/my_weather_data.json")

  const xAccessor = d => d.dewPoint
  const yAccessor = d => d.humidity

  // 2. Create chart dimensions

  const width = d3.min([
    window.innerWidth * 0.9,
    window.innerHeight * 0.9,
  ])
  let dimensions = {
    width: width,
    height: width,
    margin: {
      top: 10,
      right: 10,
      bottom: 50,
      left: 50,
    },
  }
  dimensions.boundedWidth = dimensions.width
    - dimensions.margin.left
    - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height
    - dimensions.margin.top
    - dimensions.margin.bottom

  // 3. Draw canvas

  const wrapper = d3.select("#wrapper")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

  const bounds = wrapper.append("g")
      .style("transform", `translate(${
        dimensions.margin.left
      }px, ${
        dimensions.margin.top
      }px)`)

  // 4. Create scales

  const xScale = d3.scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice()

  const yScale = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice()

  // 5. Draw data

  const dots = bounds.selectAll("circle")
    .data(dataset)
    .join("circle")
      .attr("cx", d => xScale(xAccessor(d)))
      .attr("cy", d => yScale(yAccessor(d)))
      .attr("r", 4)
      .attr("tabindex", "0")

  // 6. Draw peripherals

  const xAxisGenerator = d3.axisBottom()
    .scale(xScale)

  const xAxis = bounds.append("g")
    .call(xAxisGenerator)
      .style("transform", `translateY(${dimensions.boundedHeight}px)`)

  const xAxisLabel = xAxis.append("text")
      .attr("class", "x-axis-label")
      .attr("x", dimensions.boundedWidth / 2)
      .attr("y", dimensions.margin.bottom - 10)
      .html("Dew point (&deg;F)")

  const yAxisGenerator = d3.axisLeft()
    .scale(yScale)
    .ticks(4)

  const yAxis = bounds.append("g")
      .call(yAxisGenerator)

  const yAxisLabel = yAxis.append("text")
      .attr("class", "y-axis-label")
      .attr("x", -dimensions.boundedHeight / 2)
      .attr("y", -dimensions.margin.left + 10)
      .text("Relative humidity")

  // 7. Set up interactions

  const delaunay = d3.Delaunay.from(
    dataset,
    d => xScale(xAccessor(d)),
    d => yScale(yAccessor(d)),
  )
  const voronoi = delaunay.voronoi()
  voronoi.xmax = dimensions.boundedWidth
  voronoi.ymax = dimensions.boundedHeight

  bounds.selectAll(".voronoi")
    .data(dataset)
    .join("path")
      .attr("class", "voronoi")
      .attr("d", (d,i) => voronoi.renderCell(i))
      .on("mouseenter", onMouseEnter)
      .on("mouseleave", onMouseLeave)

  const tooltip = d3.select("#tooltip")
  function onMouseEnter(event, d) {
    const dayDot = bounds.append("circle")
        .attr("class", "tooltipDot")
        .attr("cx", xScale(xAccessor(d)))
        .attr("cy", yScale(yAccessor(d)))
        .attr("r", 7)
        .style("fill", "maroon")
        .style("pointer-events", "none")

    const formatHumidity = d3.format(".2f")
    tooltip.select("#humidity")
        .text(formatHumidity(yAccessor(d)))

    const formatDewPoint = d3.format(".2f")
    tooltip.select("#dew-point")
        .text(formatDewPoint(xAccessor(d)))

    const dateParser = d3.timeParse("%Y-%m-%d")
    const formatDate = d3.timeFormat("%B %A %-d, %Y")
    tooltip.select("#date")
        .text(formatDate(dateParser(d.date)))

    const x = xScale(xAccessor(d))
      + dimensions.margin.left
    const y = yScale(yAccessor(d))
      + dimensions.margin.top

    tooltip.style("transform", `translate(`
      + `calc( -50% + ${x}px),`
      + `calc(-100% + ${y}px)`
      + `)`)

    tooltip.style("opacity", 1)
  }

  function onMouseLeave() {
    d3.selectAll(".tooltipDot")
      .remove()

    tooltip.style("opacity", 0)
  }

}
drawScatter()
```

Line chart
Lastly, we add a tooltip to our timeline. We talk about how to add a listener rectangle, d3.leastIndex(), and how to add a dot to mark our place.

LESSON
DISCUSSION 1

Let's go through one last example for adding tooltips. So far, we've added tooltips to individual elements (bars, circles, and paths). Adding a tooltip to a timeline is a bit different.

In this section, we're aiming to add a tooltip to our line chart like this:

timeline
Instead of catching hover events for individual elements, we want to display a tooltip whenever a user is hovering anywhere on the chart. Therefore, we'll want an element that spans our entire bounds.

To start coding up our Set up interactions step, let's create a <rect> that covers our bounds and add our mouse event listeners to it. This time we'll want to listen for mousemove events instead of mouseenter events because we'll want to update the tooltip's position when a reader moves their mouse around the chart.

Note that we don't need to define our <rect>'s x or y attributes because they both default to 0.

1
const listeningRect = bounds.append("rect")
2
.attr("class", "listening-rect")
3
.attr("width", dimensions.boundedWidth)
4
.attr("height", dimensions.boundedHeight)
5
.on("mousemove", onMouseMove)
6
.on("mouseleave", onMouseLeave)
Perfect! We can see that our listeningRect, defaulted to a black fill, covers our entire bounds.

timeline listening rect
Let's add a rule to styles.css so we can see our chart again.

1
.listening-rect {
2
fill: transparent;
3
}
Great! Now we can set up our tooltip variable and onMouseMove and onMouseLeave() functions (back in our line.js file).

1
const tooltip = d3.select("#tooltip")
2
function onMouseMove(event) {
3
}
4
​
5
function onMouseLeave() {
6
}
Let's start fleshing out onMouseMove — how will we know the location on our line that we are hovering over? The passed parameters we used previously (datum, index, and nodes) won't be helpful here, and this will just point us at the listener rect element.

When an event listener is invoked, the d3-selection library sets a global d3.event. d3.event will refer to the currently triggered event and will be reset when the event listener is done. During the event listener handler, we also get access to a d3.mouse() function which will return the x, y coordinates of the mouse event, relative to a specified container.

Let's see what that would look like in action and pass our listener container to d3.mouse().

1
function onMouseMove(event) {
2
const mousePosition = d3.pointer(event)
3
console.log(mousePosition)
Now we can see our mouse position as an [x,y] array when we move our mouse around the chart.

mouse coordinates
Test it out — what do the numbers look like when you hover over the top left of the chart? What about the bottom right?

Great, but in order to show the tooltip next to an actual data point, we need to know which point we're closest to. First, we'll need to figure out what date we're hovering over — how do we convert an x position into a date? So far, we've only used our scales to convert from the data space (in this case, JavaScript date objects) to the pixel space.

Thankfully, d3 scales make this very simple! We can use the same xScale() we've used previously, which has an .invert() method. .invert() will convert our units backwards, from the range to the domain.

Let's pass the x position of our mouse (mousePosition[0]) to the .invert() method of our xScale().

1
const mousePosition = d3.mouse(this)
2
const hoveredDate = xScale.invert(mousePosition[0])
Okay great, now know what date we're hovering over — let's figure out how to find the closest data point.

d3.leastIndex()#

If you ever need to know where a variable will fit in a sorted list, d3.leastIndex() can help you out. d3.leastIndex() requires two parameters:

an array (in this case, our dataset), and
an optional comparator function.
The comparator function will take two adjacent items in the passed array and return a numerical value. d3.leastIndex() will take those returned values and return the index of the smallest value.

Let's look at a few examples to get that description to click:

d3.leastIndex([100, 0, 10], (a,b) => a - b) would create an array of values that looks like [100, -10].

d3.leastIndex example
This expression would then return 1 because the second item in the array of values is the smallest (remember, the second item is referred to as 1 when we're looking at zero-indexed indices).

d3.leastIndex([100, 0, 10], (a,b) => b - a) would create the array [-100, 10]

d3.leastIndex example
This expression would then return 0, because the first item of the array of values is the smallest.

Let's try it out — we'll first create a function to find the distance between the hovered point and a datapoint. We don't care if the point is before or after the hovered date, so we'll use Math.abs() to convert that distance to an absolute distance.

1
const getDistanceFromHoveredDate = d => Math.abs(
2
xAccessor(d) - hoveredDate
3
)
Then we can use that function to compare the two data points in our d3.leastIndex() comparator function. This will create an array of distances from the hovered point, and we'll get the index of the closest data point to our hovered date.

1
const closestIndex = d3.leastIndex(dataset, (a, b) => (
2
getDistanceFromHoveredDate(a) - getDistanceFromHoveredDate(b)
3
))
Next, we need to grab the data point at that index.

1
const closestDataPoint = dataset[closestIndex]
Let's console.table(closestDataPoint) to make sure we're grabbing the right value.

console table example
When we move our mouse to the left of our chart, we should see dates close to the beginning of our dataset, which increase as we move right.

Perfect! Now let's grab the closest x and y values using our accessor functions — these will come in handy when we're updating our tooltip.

1
const closestXValue = xAccessor(closestDataPoint)
2
const closestYValue = yAccessor(closestDataPoint)
We can use our closestXValue to set the date in our tooltip. Let's also format it nicely using d3.timeFormat() with the same specifier string we used for our scatter plot.

1
const formatDate = d3.timeFormat("%B %A %-d, %Y")
2
tooltip.select("#date")
3
.text(formatDate(closestXValue))
Next up, we can set the temperature value in our tooltip — this time our formatter string will also add a °F suffix to clarify.

1
const formatTemperature = d => `${d3.format(".1f")(d)}°F`
2
tooltip.select("#temperature")
3
.text(formatTemperature(closestYValue))
Lastly, we'll want to grab the x and y position of our closest point, shift our tooltip, and hide/show our tooltip appropriately. This should look like what we've done in the past two sections.

1
const x = xScale(closestXValue)
2 + dimensions.margin.left
3
const y = yScale(closestYValue)
4 + dimensions.margin.top
5
​
6
tooltip.style("transform", `translate(`
7 + `calc( -50% + ${x}px),`
8 + `calc(-100% + ${y}px)`
9 + `)`)
10
​
11
tooltip.style("opacity", 1)
12
}
13
​
14
function onMouseLeave() {
15
tooltip.style("opacity", 0)
16
}
Wonderful! When we refresh our webpage, we can see a tooltip that will match the horizontal position of our cursor, while sitting just above our line.

timeline with tooltip
Extra credit#

You may notice an issue that we had before with our scatter plot — it's not immediately clear what point we're hovering over. Let's solve this by positioning a <circle> over the spot we're hovering — this should make the interaction clearer and the dataset more tangible.

First, we need to create our circle element — let's draw it right after we create our tooltip variable.

1
const tooltip = d3.select("#tooltip")
2
const tooltipCircle = bounds.append("circle")
3
.attr("r", 4)
In our styles.css file, let's add some styles and hide it with an opacity of 0 to start.

1
.tooltip-circle {
2
stroke: #af9358;
3
fill: white;
4
stroke-width: 2;
5
opacity: 0;
6
pointer-events: none;
7
}
Now, right after we position our tooltip in onMouseEnter(), we can also position our tooltipCircle and give it an opacity of 1.

1
tooltipCircle
2
.attr("cx", xScale(closestXValue))
3
.attr("cy", yScale(closestYValue))
4
.style("opacity", 1)
5
}
Lastly, we'll hide it in onMouseLeave() after we hide our tooltip.

1
function onMouseLeave() {
2
tooltip.style("opacity", 0)
3
tooltipCircle.style("opacity", 0)
4
}
Voila! Now we should see a circle under our tooltip, right over the "hovered" point.

finished timeline
Give it a spin and feel out the difference. Putting yourself in the user's shoes, you can see how highlighting the hovered data point makes the data feel more tangible.

Final code for this lesson

```
import * as d3 from "d3";

async function drawLineChart() {

  // 1. Access data
  const dataset = await d3.json("./data/my_weather_data.json")

  const yAccessor = d => d.temperatureMax
  const dateParser = d3.timeParse("%Y-%m-%d")
  const xAccessor = d => dateParser(d.date)

  // 2. Create chart dimensions

  let dimensions = {
    width: window.innerWidth * 0.9,
    height: 400,
    margin: {
      top: 15,
      right: 15,
      bottom: 40,
      left: 60,
    },
  }
  dimensions.boundedWidth = dimensions.width
    - dimensions.margin.left
    - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height
    - dimensions.margin.top
    - dimensions.margin.bottom

  // 3. Draw canvas

  const wrapper = d3.select("#wrapper")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

  const bounds = wrapper.append("g")
      .style("transform", `translate(${
        dimensions.margin.left
      }px, ${
        dimensions.margin.top
      }px)`)

  // 4. Create scales

  const yScale = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0])

  const freezingTemperaturePlacement = yScale(32)
  const freezingTemperatures = bounds.append("rect")
      .attr("x", 0)
      .attr("width", dimensions.boundedWidth)
      .attr("y", freezingTemperaturePlacement)
      .attr("height", dimensions.boundedHeight
        - freezingTemperaturePlacement)
      .attr("fill", "#e0f3f3")

  const xScale = d3.scaleTime()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])

  // 5. Draw data

  const lineGenerator = d3.line()
    .x(d => xScale(xAccessor(d)))
    .y(d => yScale(yAccessor(d)))

  const line = bounds.append("path")
      .attr("d", lineGenerator(dataset))
      .attr("fill", "none")
      .attr("stroke", "#af9358")
      .attr("stroke-width", 2)

  // 6. Draw peripherals

  const yAxisGenerator = d3.axisLeft()
    .scale(yScale)

  const yAxis = bounds.append("g")
    .call(yAxisGenerator)

  const xAxisGenerator = d3.axisBottom()
    .scale(xScale)

  const xAxis = bounds.append("g")
    .call(xAxisGenerator)
      .style("transform", `translateY(${
        dimensions.boundedHeight
      }px)`)

  // 7. Set up interactions

  const listeningRect = bounds.append("rect")
    .attr("class", "listening-rect")
    .attr("width", dimensions.boundedWidth)
    .attr("height", dimensions.boundedHeight)
    .on("mousemove", onMouseMove)
    .on("mouseleave", onMouseLeave)

  const tooltip = d3.select("#tooltip")
  const tooltipCircle = bounds.append("circle")
      .attr("class", "tooltip-circle")
      .attr("r", 4)

  function onMouseMove(event) {
    const mousePosition = d3.pointer(event)
    const hoveredDate = xScale.invert(mousePosition[0])

    const getDistanceFromHoveredDate = d => Math.abs(xAccessor(d) - hoveredDate)
    const closestIndex = d3.leastIndex(dataset, (a, b) => (
      getDistanceFromHoveredDate(a) - getDistanceFromHoveredDate(b)
    ))
    const closestDataPoint = dataset[closestIndex]

    const closestXValue = xAccessor(closestDataPoint)
    const closestYValue = yAccessor(closestDataPoint)

    const formatDate = d3.timeFormat("%B %A %-d, %Y")
    tooltip.select("#date")
        .text(formatDate(closestXValue))

    const formatTemperature = d => `${d3.format(".1f")(d)}°F`
    tooltip.select("#temperature")
        .html(formatTemperature(closestYValue))

    const x = xScale(closestXValue)
      + dimensions.margin.left
    const y = yScale(closestYValue)
      + dimensions.margin.top

    tooltip.style("transform", `translate(`
      + `calc( -50% + ${x}px),`
      + `calc(-100% + ${y}px)`
      + `)`)

    tooltip.style("opacity", 1)

    tooltipCircle
        .attr("cx", xScale(closestXValue))
        .attr("cy", yScale(closestYValue))
        .style("opacity", 1)
  }

  function onMouseLeave() {
    tooltip.style("opacity", 0)

    tooltipCircle.style("opacity", 0)
  }

}
drawLineChart()
```

This week's exercise#
Awesome work getting through all of that tricky interaction code! During this week, add interactions to one of the custom charts you created in our previous exercises!

Choose whichever chart you are most excited about making interactive. Here are a few suggestions:

tweak your line chart so that it draws a line to the y axis when you hover near a point
tweak your scatter plot so that a circle turns into a square when you click on it
add an info section next to your histogram that shows information about the last bar you clicked
Now, go over the same steps we went through this week to add interactions to one of your custom charts.

If you get stuck, watch this week's videos again or post a question inline or on the Discord channel. Good luck! We're rooting for you!

And once you're finished, show off your wonderful custom visualization on Twitter or on the Discord! We'd love to see it!
