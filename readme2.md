Animations and Transitions
We talk about the different ways we can animate changes in our charts, and rule out SVG <animate>.

LESSON
DISCUSSION 0

When we update our charts, we can animate elements from their old to their new positions. These animations can be visually exciting, but more importantly, they have functional benefits. When a bar animates from one height to another, the viewer has a better idea of whether it's getting larger or smaller. If we're animating several bars at once, we're drawing the viewer's eye to the bar making the biggest change because of its fast speed.

By analogy, imagine if track runners teleported from the start to the finish line. For one, it would be terribly boring to watch, but it would also be hard to tell who was fastest.

There are multiple ways we can animate changes in our graphs:

using SVG <animate>
using CSS transition
using d3.transition()
Let's introduce each of these options.

SVG <animate>#
<animate> is a native SVG element that can be defined inside of the animated element.

1
<svg width="120" height="120">
2
<rect x="10" y="10" width="100" height="100" fill="cornflowerblue">
3
<animate
4
attributeName="x"
5
values="0;20;0"
6
dur="2s"
7
repeatCount="indefinite"
8
/>
9
<animate
10
attributeName="fill"
11
values="cornflowerBlue;maroon;cornflowerBlue"
12
dur="6s"
13
repeatCount="indefinite"
14
/>
15
</rect>
16
</svg>
SVG animate
Unfortunately this won't work for our charts. For one, <animate> is unsupported in Internet Explorer, and its future is uncertain. But the bigger issue is that we would have to set a static start and end value. We don't want to define static animations, instead we want our elements to animate changes between two dynamic values. Luckily, we have other options.

CSS transitions
We learn about CSS transitions and the different CSS transition properties, then run through a concrete example and look at how to debug them.

LESSON
DISCUSSION 1

Many of our chart changes can be transitioned with the CSS transition property. When we update a <rect> to have a fill of red instead of blue, we can specify that the color change take 10 seconds instead of being instantaneous. During those 10 seconds, the <rect> will continuously re-draw with intermediate colors on the way to red.

Let's try out an example! In our example, you'll see a blue box that moves and turns green on hover.

box transition
Let's open up the

styles.css file to take a look at what's going on. We can see our basic styles for the box.

1
.box {
2
background: cornflowerblue;
3
height: 100px;
4
width: 100px;
5
}
And our styles that apply to our box when it is hovered (change the background color and move it 30 pixels to the right).

1
.box:hover {
2
background: yellowgreen;
3
transform: translateX(30px);
4
}
To create CSS a transition, we need to specify how long we want the animation to take with the transition-duration property. The property value accepts time CSS data types — a number followed by either s (seconds) or ms (milliseconds).

Let's make our box changes animate over one second.

1
.box {
2
background: cornflowerblue;
3
height: 100px;
4
width: 100px;
5
transition-duration: 1s;
6
}
Now when we hover over the box, we can see it slowly move to the right and turn green. Smooth!

box transition all
Now let's say that we only want to animate our box's movement, but we want the color change to happen instantaneously. This is possible by specifying the transition-property CSS property. By default, transition-property is set to all, which animates all transitions. Instead, let's override the default and specify a specific CSS property name (transform).

1
.box {
2
background: cornflowerblue;
3
height: 100px;
4
width: 100px;
5
transition-duration: 1s;
6
transition-property: transform;
7
}
Now our box instantly turns green, but still animates to the right.

box transition transform
Instead of setting transition-duration and transition-property separately, we can use the shorthand property: transition. Shorthand CSS properties let you set multiple properties in one line. When we give transition a CSS property name and duration (separated by a space), we are setting both transition-duration and transition-property. Let's try it out.

1
.box {
2
background: cornflowerblue;
3
height: 100px;
4
width: 100px;
5
transition: transform 1s;
6
}
transition will accept a third property (transition-timing-function) that sets the acceleration curve for the animation. The animation could be linear (the default), slow then fast (ease-in), in steps (steps(6)), or even a custom function (cubic-bezier(0.1, 0.7, 1.0, 0.1)), among other options. Let's see what steps(6) looks like — it should break the animation into 6 discrete steps.

1
.box {
2
background: cornflowerblue;
3
height: 100px;
4
width: 100px;
5
transition: transform 1s steps(6);
6
}
What if we wanted to animate the color change, but finish turning green while our box is shifting to the right? transition will accept multiple transition statements, we just need to separate them by a comma. Let's add a transition for the background color.

1
.box {
2
background: cornflowerblue;
3
height: 100px;
4
width: 100px;
5
transition: transform 1s steps(6),
6
background 2s ease-out;
7
}
Nice! Now our box transitions by stepping to the right, while turning green over two seconds. Chrome's dev tools have a great way to visualize this transition. Press esc when looking at the Elements panel to bring up the bottom panel. In the bottom panel, we can open up the Animations tab.

If you don't see the Animations tab, click on the kebab menu on the left and select it from the dropdown options.
animations panel
Once we've triggered our box transition by hovering, we can inspect the animation.

animations panel zoomed
We can see the transform transition on top, with six discrete changes, and the background animation on the bottom, easing gradually from one color to the next. The background transition diagram is twice as wide as the transform transition diagram, indicating that it takes twice as long.

This view can be very handy when inspecting, tweaking, and debugging transitions.

Now that we're comfortable with CSS transition, let's see how we might use it to animate our charts.

Not all properties can be animated. For example, how would you animate changing a label from Humidity to Dew point? However most properties can be animated, so feel free to operate under the assumption that a property can be animated until proven otherwise.
Final code for this lesson

```
.box {
    background: cornflowerblue;
    height: 100px;
    width: 100px;
    transition: transform 1s steps(6),
                background 2s ease-out;
}

.box:hover {
    background: yellowgreen;
    transform: translateX(30px);
}


<!DOCTYPE html>
<html lang="en">
    <head>
        <link rel="stylesheet" href="./styles.css"></link>
        <title>CSS transition box</title>
    </head>
    <body>
        <div class="box"></div>
    </body>
</html>
```

CSS transitions with a chart
We add CSS transitions to our histogram, animating changes as the bars change.

LESSON
DISCUSSION 2

CSS transition with a chart#

In this example, the index.html is importing a CSS stylesheet (styles.css) and the chart.js file, which is an updated version of our histogram drawing code from Module 3.

The code should look mostly familiar, but you might notice a few changes. Don't worry about those changes at the moment — they're not important to our main mission.

Let's look inside that styles.css file. We can see that we have already set the basic styles for our bars (.bin rect), bar labels (.bin text), mean line (.mean), and x axis label (.x-axis-label).

Great! Now that we know the lay of the land, let's look at our example — we should see our histogram and a Change metric button.

bars
When we click the button, our chart re-draws with the next metric, but the change is instantaneous.

instant change
Does this next metric have fewer bars than the previous one? Does our mean line move to the left or the right? These questions can be answered more easily if we transition gradually from one view to the other.

Let's add an animation whenever our bars update (.bin rect).

1
.bin rect {
2
fill: cornflowerblue;
3
transition: all 1s ease-out;
4
}
Note that this CSS transition will currently only work in the Chrome browser. This is because Chrome is the only browser that has implemented the part of the SVG 2 spec which allows height as a CSS property, letting us animate the transition.
Now when we update our metric, our bars shift slowly to one side while changing height — we can see that their width, height, x, and y values are animating. This may be fun to watch, but it doesn't really represent our mental model of bar charts. It would make more sense for the bars to change position instantaneously and animate any height differences. Let's only transition the height and y values.

1
.bin rect {
2
fill: cornflowerblue;
3
transition: height 1s ease-out,
4
y 1s ease-out;
5
}
ease-out is a good starting point for CSS transitions — it starts quickly and slows down near the end of the animation to ease into the final value. It won't be ideal in every case, but it's generally a good choice.
That's better! Now we can see whether each bar is increasing or decreasing.

bars - slow change
Our transitions are still looking a bit disjointed with our text changing position instantaneously. Let's try to animate our text position, too.

1
.bin text {
2
transition: y 1s ease-out;
3
}
Hmm, our text position is still not animating — it seems as if y isn't a transition-able property. Thankfully there is a workaround here — we can position the text using a CSS property instead of changing its y attribute.

Switching over to our chart.js file, let's position our bar labels using translateY().

1
const barText = binGroups.select("text")
2
.attr("x", d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
3
.attr("y", 0)
4
.style("transform", d => `translateY(${ 5 yScale(yAccessor(d)) - 5 6 }px)`)
7
.text(d => yAccessor(d) || "")
Note that we're filling our <text> elements with empty strings instead of 0 (with .text(d => yAccessor(d) || "")) to prevent labeling empty bars.
We'll also need to change the transition property to target transform.

1
.bin text {
2
transition: transform 1s ease-out;
3
}
Now our bar labels are animating with our bars. Perfect!

Let's make one last change - we want our dashed mean line to animate when it moves left or right. We could try to transition changes to x1 and x2, but those aren't CSS properties, they're SVG attributes. Let's position the line's horizontal position with the transform property.

1
const meanLine = bounds.selectAll(".mean")
2
.attr("y1", -20)
3
.attr("y2", dimensions.boundedHeight)
4
.style("transform", `translateX(${xScale(mean)}px)`)
We'll also add the transition CSS property in our styles.css file:

1
.mean {
2
stroke: maroon;
3
stroke-dasharray: 2px 4px;
4
transition: transform 1s ease-out;
5
}
These updates are looking great!

There are some animations that aren't possible with CSS transitions. For example, transitioning the x axis changes would help us see if the values for our new metric have increased or decreased. Using a CSS transition won't help here — CSS has no way of knowing whether a tick mark with the text 10 is larger than a tick mark with the text 100. Let's bring out the heavier cavalry.

Final code for this lesson

```
import * as d3 from "d3";

async function drawBars() {

  // 1. Access data
  const dataset = await d3.json("./data/my_weather_data.json")

  // 2. Create chart dimensions

  const width = 500
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
  dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

  // 3. Draw canvas

  const wrapper = d3.select("#wrapper")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

  const bounds = wrapper.append("g")
      .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)

  // init static elements
  bounds.append("g")
      .attr("class", "bins")
  bounds.append("line")
      .attr("class", "mean")
  bounds.append("g")
      .attr("class", "x-axis")
      .style("transform", `translateY(${dimensions.boundedHeight}px)`)
    .append("text")
      .attr("class", "x-axis-label")

  const drawHistogram = metric => {
    const metricAccessor = d => d[metric]
    const yAccessor = d => d.length

    // 4. Create scales

    const xScale = d3.scaleLinear()
      .domain(d3.extent(dataset, metricAccessor))
      .range([0, dimensions.boundedWidth])
      .nice()

    const binsGenerator = d3.histogram()
      .domain(xScale.domain())
      .value(metricAccessor)
      .thresholds(12)

    const bins = binsGenerator(dataset)

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(bins, yAccessor)])
      .range([dimensions.boundedHeight, 0])
      .nice()

    // 5. Draw data

    const barPadding = 1

    let binGroups = bounds.select(".bins")
      .selectAll(".bin")
      .data(bins)

    binGroups.exit().remove()

    const newBinGroups = binGroups.enter().append("g")
        .attr("class", "bin")

    newBinGroups.append("rect")
    newBinGroups.append("text")

    // update binGroups to include new points
    binGroups = newBinGroups.merge(binGroups)

    const barRects = binGroups.select("rect")
        .attr("x", d => xScale(d.x0) + barPadding)
        .attr("y", d => yScale(yAccessor(d)))
        .attr("width", d => d3.max([
          0,
          xScale(d.x1) - xScale(d.x0) - barPadding
        ]))
        .attr("height", d => dimensions.boundedHeight - yScale(yAccessor(d)))

    const barText = binGroups.select("text")
        .attr("x", d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
        .text(yAccessor)
        .style("transform", d => `translateY(${
           yScale(yAccessor(d)) - 5
        }px)`)

    const mean = d3.mean(dataset, metricAccessor)

    const meanLine = bounds.selectAll(".mean")
        .attr("y1", -20)
        .attr("y2", dimensions.boundedHeight)
        .style("transform", `translateX(${
          xScale(mean)
        }px)`)

    // 6. Draw peripherals

    const xAxisGenerator = d3.axisBottom()
      .scale(xScale)

    const xAxis = bounds.select(".x-axis")
      .call(xAxisGenerator)

    const xAxisLabel = xAxis.select(".x-axis-label")
        .attr("x", dimensions.boundedWidth / 2)
        .attr("y", dimensions.margin.bottom - 10)
        .text(metric)
  }

  const metrics = [
    "windSpeed",
    "moonPhase",
    "dewPoint",
    "humidity",
    "uvIndex",
    "windBearing",
    "temperatureMin",
    "temperatureMax",
  ]
  let selectedMetricIndex = 0
  drawHistogram(metrics[selectedMetricIndex])

  const button = d3.select("body")
    .append("button")
      .text("Change metric")

  button.node().addEventListener("click", onClick)
  function onClick() {
    selectedMetricIndex = (selectedMetricIndex + 1) % metrics.length
    drawHistogram(metrics[selectedMetricIndex])
  }
}
drawBars()
```

d3.transition
We learn about d3.transition, and talk about when we would use it instead of CSS transitions. We then update our histogram to animate using d3.transition.

LESSON
DISCUSSION 0

CSS transitions have our back for simple property changes, but for more complex animations we'll need to use d3.transition() from the d3-transition module. When would we want to use d3.transition() instead of CSS transitions?

When we want to ensure that multiple animations line up
When we want to do something when the animation ends (for example starting another animation)
When the property we want to animate isn't a CSS property (remember when we tried to animate our bars' heights but had to use transform instead? d3.translate can animate non-CSS property changes.)
When we want to synchronize adding and removing elements with animations
When we might interrupt halfway through a transition
When we want a custom animation (for example, we could write a custom interpolator for changing text that adds new letters one-by-one)
Let's get our hands dirty by re-implementing the CSS transitions for our histogram.

Let's again start by animating any changes to our bars. Instead of adding a transition property to our styles.css file, we'll start in the chart.js file where we set our barRects attributes.

As a reminder, when we run:

1
const barRects = binGroups.select("rect")
we're creating a d3 selection object that contains all <rect> elements. Let's log that to the console as a refresher of what a selection object looks like.

1
const barRects = binGroups.select("rect")
2
.attr("x", d => xScale(d.x0) + barPadding)
3
.attr("y", d => yScale(yAccessor(d)))
4
.attr("height", d => dimensions.boundedHeight
5 - yScale(yAccessor(d))
6
)
7
.attr("width", d => d3.max([
8
0,
9
xScale(d.x1) - xScale(d.x0) - barPadding
10
]))
11
​
12
console.log(barRects)
bars selection
We can use the .transition() method on our d3 selection object to transform our selection object into a d3 transition object.

1
const barRects = binGroups.select("rect")
2
.transition()
3
.attr("x", d => xScale(d.x0) + barPadding)
4
.attr("y", d => yScale(yAccessor(d)))
5
.attr("height", d => dimensions.boundedHeight
6 - yScale(yAccessor(d))
7
)
8
.attr("width", d => d3.max([
9
0,
10
xScale(d.x1) - xScale(d.x0) - barPadding
11
]))
12
​
13
console.log(barRects)
bars transition
d3 transition objects look a lot like selection objects, with a \_groups list of relevant DOM elements and a \_parents list of ancestor elements. They have two additional keys: \_id and \_name, but that's not all that has changed.

Let's expand the **proto** of our transition object.

**proto** is a native property of JavaScript objects that exposes methods and values that this specific object has inherited. If you're unfamiliar with JavaScript Prototypal Inheritance and want to read up, the MDN docs are a good place to start.
In this case, we can see that the **proto** property contains d3-specific methods, and the nested **proto** object contains native object methods, such as toString().
Transition object, expanded
We can see that some methods are inherited from d3 selection objects (eg. .call() and .each()), but most are overwritten by new transition methods. When we click the Change metric button now, we can see that our bar changes are animated. This makes sense — any .attr() updates chained after a .transition() call will use transition's .attr() method, which attempts to interpolate between old and new values.

Something looks strange though - our new bars are flying in from the top left corner.

Bars flying in
Note that d3 transitions animate over 0.25 seconds — we'll learn how to change that in a minute!
Knowing that <rect>s are drawn in the top left corner by default, this makes sense. But how do we prevent this?

Remember how we can isolate new data points with .enter()? Let's find the line where we're adding new <rect>s and set their initial values. We want them to start in the right horizontal location, but be 0 pixels tall so we can animate them "growing" from the x axis.

Let's also have them be green to start to make it clear which bars we're targeting. We'll need to set the fill using an inline style using .style() instead of setting the attribute in order to override the CSS styles in styles.css.

1
newBinGroups.append("rect")
2
.attr("height", 0)
3
.attr("x", d => xScale(d.x0) + barPadding)
4
.attr("y", dimensions.boundedHeight)
5
.attr("width", d => d3.max([
6
0,
7
xScale(d.x1) - xScale(d.x0) - barPadding
8
]))
9
.style("fill", "yellowgreen")
Why are we using .style() instead of .attr() to set the fill? We need the fill value to be an inline style instead of an SVG attribute in order to override the CSS styles in styles.css. The way CSS specificity works means that inline styles override class selector styles, which override SVG attribute styles.
Once our bars are animated in, they won't be new anymore. Let's transition their fill to blue. Luckily, chaining d3 transitions is really simple — to add a new transition that starts after the first one ends, add another .transition() call.

1
const barRects = binGroups.select("rect")
2
.transition()
3
.attr("x", d => xScale(d.x0) + barPadding)
4
.attr("y", d => yScale(yAccessor(d)))
5
.attr("height", d => dimensions.boundedHeight
6 - yScale(yAccessor(d))
7
)
8
.attr("width", d => d3.max([
9
0,
10
xScale(d.x1) - xScale(d.x0) - barPadding
11
]))
12
.transition()
13
.style("fill", "cornflowerblue")
green bars on load
Let's slow things down a bit so we can bask in these fun animations. d3 transitions default to 0.25 seconds, but we can specify how long an animation takes by chaining .duration() with a number of milliseconds.

1
const barRects = binGroups.select("rect")
2
.transition().duration(600)
3
.attr("x", d => xScale(d.x0) + barPadding)
4
// ...
green bars on load, 1 second
Smooth! Now that our bars are nicely animated, it's jarring when our text moves to its new position instantly. Let's add another transition to make our text transition with our bars.

1
const barText = binGroups.select("text")
2
.transition().duration(600)
3
.attr("x", d => xScale(d.x0)
4 + (xScale(d.x1) - xScale(d.x0)) / 2
5
)
6
.attr("y", d => yScale(yAccessor(d)) - 5)
7
.text(d => yAccessor(d) || "")
We'll also need to set our labels' initial position (higher up in our code) to prevent them from flying in from the left.

1
newBinGroups.append("text")
2
.attr("x", d => xScale(d.x0)
3 + (xScale(d.x1) - xScale(d.x0)) / 2
4
)
5
.attr("y", dimensions.boundedHeight)
Here's a fun tip: we can specify a timing function (similar to CSS's transition-timing-function) to give our animations some life. They can look super fancy, but we only need to chain .ease() with a d3 easing function. Check out the full list at the d3-ease repo.

1
const barRects = binGroups.select("rect")
2
.transition().duration(600).ease(d3.easeBounceOut)
3
.attr("x", d => xScale(d.x0) + barPadding)
4
// ...
That's looking groovy, but our animation is out of sync with our labels again. We could ease our other transition, but there's an easier (no pun intended) way to sync multiple transitions.

By calling d3.transition(), we can make a transition on the root document that can be used in multiple places. Let's create a root transition — we'll need to place this definition above our existing transitions, for example after we define barPadding. Let's also log it to the console to take a closer look.

1
const barPadding = 1
2
​
3
const updateTransition = d3.transition()
4
.duration(600)
5
.ease(d3.easeBackIn)
6
​
7
console.log(updateTransition)
If we expand the \_groups array, we can see that this transition is indeed targeting our root <html> element.

Root transition object
You'll notice errors in the dev tools console that say Error: <rect> attribute height: A negative value is not valid.. This happens with the d3.easeBackIn easing we're using, which causes the bars to bounce below the x axis when they animate.
Let's update our bar transition to use updateTransition instead of creating a new transition. We can do this by passing the existing transition in our .transition() call.

1
const barRects = binGroups.select("rect")
2
.transition(updateTransition)
3
.attr("x", d => xScale(d.x0) + barPadding)
4
// ...
Let's use updateTransition for our text, too.

1
const barText = binGroups.select("text")
2
.transition(updateTransition)
3
.attr("x", d => xScale(d.x0)
4 + (xScale(d.x1) - xScale(d.x0)) / 2
5
)
6
// ...
We can use this transition as many times as we want — let's also animate our mean line when it updates.

1
const meanLine = bounds.selectAll(".mean")
2
.transition(updateTransition)
3
.attr("x1", xScale(mean))
4
// ...
And our x axis:

1
const xAxis = bounds.select(".x-axis")
2
.transition(updateTransition)
3
.call(xAxisGenerator)
Remember that we couldn't animate our x axis with CSS transition? Our transition objects are built to handle axis updates — we can see our tick marks move to fit the new domain before the new tick marks are drawn.

Bars - transition all elements
But what about animating our bars when they leave? Good question - exit animations are often difficult to implement because they involve delaying element removal. Thankfully, d3 transition makes this pretty simple.

Let's start by creating a transition right before we create updateTransition. Let's also take out the easing we added to updateTransition since it's a little distracting.

1
const exitTransition = d3.transition().duration(600)
2
const updateTransition = d3.transition().duration(600)
We can target only the bars that are exiting using our .exit() method. Let's turn them red before they animate to make it clear which bars are leaving. Then we can use our exitTransition and animate the y and height values so the bars shrink into the x axis.

Don't look at the browser just yet, we'll need to finish our exit transition first.

1
const oldBinGroups = binGroups.exit()
2
oldBinGroups.selectAll("rect")
3
.style("fill", "red")
4
.transition(exitTransition)
5
.attr("y", dimensions.boundedHeight)
6
.attr("height", 0)
And we'll remember to also transition our text this time:

1
oldBinGroups.selectAll("text")
2
.transition(exitTransition)
3
.attr("y", dimensions.boundedHeight)
Last, we need to actually remove our bars from the DOM. We'll use a new transition here — not because we can animate removing the elements, but to delay their removal until the transition is over.

1
oldBinGroups
2
.transition(exitTransition)
3
.remove()
Now we can look at the browser, and we can see our bars animating in and out!

Bars - transition in and out
There is one issue, though: our bars are moving to their new positions while the bars are still exiting and we end up with intermediate states like this one:

Transition - intermediate
To fix this, we'll delay the update transition until the exit transition is finished. Instead of creating a our updateTransition as a root transition, we can chain it on our existing exitTransition.

1
const exitTransition = d3.transition().duration(600)
2
const updateTransition = exitTransition.transition().duration(600)
We're chaining transitions here to run them one after the other — d3 transitions also have a .delay() method if you need to delay a transition for a certain amount of time. Check out the docs for more information.
Wonderful! Now that we've gone through the three different ways we can animate changes, let's recap when each method is appropriate.

SVG <animate> is never really appropriate.

CSS transition is useful for animating CSS properties. A good rule of thumb is to use these mainly for stylistic polish — that way we can keep simpler transitions in our stylesheets, with the main goal of making our visualizations feel smoother.

d3.transition() is what we want to use for more complex animations: whenever we need to chain or synchronize with another transition or with DOM changes.

Final code for this lesson

```
.bin rect {
  fill: cornflowerblue;
}
.bin text {
  text-anchor: middle;
  fill: darkgrey;
  font-size: 12px;
  font-family: sans-serif;
}

.mean {
  stroke: maroon;
  stroke-dasharray: 2px 4px;
}

.x-axis-label {
  fill: black;
  font-size: 1.4em;
  text-transform: capitalize;
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2em;
}

button {
  font-size: 1.2em;
  margin-left: 1em;
  padding: 0.5em 1em;
  appearance: none;
  -webkit-appearance: none;
  background:darkseagreen;
  color: white;
  border: none;
  box-shadow: 0 5px 0 0 seagreen;
  border-radius: 6px;
  font-weight: 600;
  outline: none;
  cursor: pointer;
  transition: all 0.1s ease-out;
}

button:hover,
button:focus {
  background: #73b173;
  box-shadow: 0 4px 0 0 seagreen;
  transform: translateY(1px);
}

button:hover:active,
button:focus:active,
button:active {
  box-shadow: 0 1px 0 0 seagreen;
  transform: translateY(4px);
}
```

```
import * as d3 from "d3"

async function drawBars() {

  // 1. Access data
  const dataset = await d3.json("./data/my_weather_data.json")

  // 2. Create chart dimensions

  const width = 500
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
  dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

  // 3. Draw canvas

  const wrapper = d3.select("#wrapper")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

  const bounds = wrapper.append("g")
      .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)

  // init static elements
  bounds.append("g")
      .attr("class", "bins")
  bounds.append("line")
      .attr("class", "mean")
  bounds.append("g")
      .attr("class", "x-axis")
      .style("transform", `translateY(${dimensions.boundedHeight}px)`)
    .append("text")
      .attr("class", "x-axis-label")

  const drawHistogram = metric => {
    const metricAccessor = d => d[metric]
    const yAccessor = d => d.length

    // 4. Create scales

    const xScale = d3.scaleLinear()
      .domain(d3.extent(dataset, metricAccessor))
      .range([0, dimensions.boundedWidth])
      .nice()

    const binsGenerator = d3.histogram()
      .domain(xScale.domain())
      .value(metricAccessor)
      .thresholds(12)

    const bins = binsGenerator(dataset)

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(bins, yAccessor)])
      .range([dimensions.boundedHeight, 0])
      .nice()

    // 5. Draw data

    const barPadding = 1

    const updateTransition = d3.transition()
      .duration(1000)
      .delay(1000)
      .ease(d3.easeCubicInOut)
    const exitTransition = d3.transition()
      .duration(1000)
      .ease(d3.easeCubicInOut)

    let binGroups = bounds.select(".bins")
      .selectAll(".bin")
      .data(bins)

    const oldBinGroups = binGroups.exit()
    oldBinGroups.selectAll("rect")
      .style("fill", "red")
      .transition(exitTransition)
      .attr("height", 0)
      .attr("y", d => dimensions.boundedHeight)
    oldBinGroups.selectAll("text")
      .transition(exitTransition)
      .attr("y", dimensions.boundedHeight)
    oldBinGroups.transition(exitTransition)
      .remove()

    const newBinGroups = binGroups.enter().append("g")
        .attr("class", "bin")

    newBinGroups.append("rect")
        .attr("x", d => xScale(d.x0) + barPadding)
        .attr("y", d => dimensions.boundedHeight)
        .attr("width", d => d3.max([
          0,
          xScale(d.x1) - xScale(d.x0) - barPadding
        ]))
        .attr("height", 0)
        .style("fill", "yellowgreen")

    newBinGroups.append("text")
      .attr("x", d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
      .attr("y", dimensions.boundedHeight)

    // update binGroups to include new points
    binGroups = newBinGroups.merge(binGroups)

    const barRects = binGroups.select("rect")
      .transition(updateTransition)
        .attr("x", d => xScale(d.x0) + barPadding)
        .attr("y", d => yScale(yAccessor(d)))
        .attr("width", d => d3.max([
          0,
          xScale(d.x1) - xScale(d.x0) - barPadding
        ]))
        .attr("height", d => dimensions.boundedHeight - yScale(yAccessor(d)))
        .transition()
          .style("fill", "cornflowerblue")

    console.log(barRects)

    const barText = binGroups.select("text")
      .transition(updateTransition)
        .attr("x", d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
        .attr("y", d => yScale(yAccessor(d)) - 5)
        .text(yAccessor)

    const mean = d3.mean(dataset, metricAccessor)

    const meanLine = bounds.selectAll(".mean")
      .transition(updateTransition)
        .attr("x1", xScale(mean))
        .attr("x2", xScale(mean))
        .attr("y1", -20)
        .attr("y2", dimensions.boundedHeight)

    // 6. Draw peripherals

    const xAxisGenerator = d3.axisBottom()
      .scale(xScale)

    const xAxis = bounds.select(".x-axis")
      .transition(updateTransition)
      .call(xAxisGenerator)

    const xAxisLabel = xAxis.select(".x-axis-label")
        .attr("x", dimensions.boundedWidth / 2)
        .attr("y", dimensions.margin.bottom - 10)
        .text(metric)
  }

  const metrics = [
    "windSpeed",
    "moonPhase",
    "dewPoint",
    "humidity",
    "uvIndex",
    "windBearing",
    "temperatureMin",
    "temperatureMax",
  ]
  let selectedMetricIndex = 0
  drawHistogram(metrics[selectedMetricIndex])

  const button = d3.select("body")
    .append("button")
      .text("Change metric")

  button.node().addEventListener("click", onClick)
  function onClick() {
    selectedMetricIndex = (selectedMetricIndex + 1) % metrics.length
    drawHistogram(metrics[selectedMetricIndex])
  }
}
drawBars()
```

Lines
We talk through a more complex example: animating our line chart when it gets new data. This is trickier than it might seem at first!

LESSON
DISCUSSION 1

After animating bars, animating line transitions should be easy, right? Let's find out!

Does this example look familiar? This is our timeline drawing code from Module 1 with some small updates.

Timeline
One of the main changes is an addNewDay() function at the bottom of the script. This exact code isn't important — what is good to know is that addNewDay() shifts our dataset one day in the future. To simulate a live timeline, addNewDay() runs every 1.5 seconds.

If you read through the addNewDay() code and were confused by the ...dataset.slice(1), syntax, the ... is using ES6 spread syntax to expand the dataset (minus the first point) in place. Read more about it in the MDN docs.
We can see our timeline updating when we load our webpage, but it looks jerky. We know how to smooth the axis transitions, let's make them nice and slow.

1
const xAxis = bounds.select(".x-axis")
2
.transition().duration(1000)
3
.call(xAxisGenerator)
Great! Now let's transition the line.

1
const line = bounds.select(".line")
2
.transition().duration(1000)
3
.attr("d", lineGenerator(dataset))
What's going on here? Why is our line wriggling around instead of adding a new point at the end?

Timeline wriggling?
Remember when we talked about how path d attributes are a string of draw-to values, like a learn-coding turtle? d3 is transitioning each point to the next point at the same index. Our transition's .attr() function has no idea that we've just shifted our points down one index. It's guessing how to transition to the new d value, animating each point to the next day's y value.

Pretend you're the .attr() function - how would you transition between these two d values?

1
<path d="M 0 50 L 1 60 L 2 70 L 3 80 Z" />
2
<path d="M 0 60 L 1 70 L 2 80 L 3 90 Z" />
It would make the most sense to transition each point individually, interpolating from 0 50 to 0 60 instead of moving each point to the left.

Great, we understand why our line is wriggling, but how do we shift it to the left instead?

Let's start by figuring out how far we need to shift our line to the left. Before we update our line, let's grab the last two points in our dataset and find the difference between their x values.

1
const lastTwoPoints = dataset.slice(-2)
2
const pixelsBetweenLastPoints = xScale(xAccessor(lastTwoPoints[1]))
3

- xScale(xAccessor(lastTwoPoints[0]))
  Now when we update our line, we can instantly shift it to the right to match the old line.

1
const line = bounds.select(".line")
2
.attr("d", lineGenerator(dataset))
3
.style("transform", `translateX(${pixelsBetweenLastPoints}px)`)
Timeline shifting to right
This shift should be invisible because we're shifting our x scale to the left by the same amount at the same time.

Timeline shifting to right then the left
Then we can animate un-shifting the line to the left, to its normal position on the x axis.

1
const line = bounds.select(".line")
2
.attr("d", lineGenerator(dataset))
3
.style("transform", `translateX(${pixelsBetweenLastPoints}px)`)
4
.transition().duration(1000)
5
.style("transform", `none`)
Timeline updating
Okay great! We can see the line updating before it animates to the left, but we don't want to see the new point until it's within our bounds. The easiest way to hide out-of-bounds data is to add a <clipPath>.

A <clipPath> is an SVG element that:

is sized by its children. If a <clipPath> contains a circle, it will only paint content within that circle's bounds.
can be referenced by another SVG element, using the <clipPath>'s id.
Before we test it out, we need to learn one important SVG convention: using <defs>. The SVG <defs> element is used to store any re-usable definitions that are used later in the <svg>. By placing any <clipPath>s or gradients in our <defs> element, we'll make our code more accessible. We'll also know where to look when we're debugging, similar to defining constants in one place before we use them.

Now that we know this convention, let's create our <defs> element and add our <clipPath> inside. We'll want to put this definition right after we define our bounds. Let's also give it an id that we can reference later.

1
const bounds = wrapper.append("g")
2
.style("transform", `translate(${ 3 dimensions.margin.left 4 }px, ${ 5 dimensions.margin.top 6 }px)`)
7
​
8
bounds.append("defs")
9
.append("clipPath")
10
.attr("id", "bounds-clip-path")
If we inspect our <clipPath> in the Elements panel, we can see that it's not rendering at all.

clipPath
Remember, the <clipPath> element's shape depends on its children, and it has no children yet. Let's add a <rect> that covers our bounds.

1
bounds.append("defs")
2
.append("clipPath")
3
.attr("id", "bounds-clip-path")
4
.append("rect")
5
.attr("width", dimensions.boundedWidth)
6
.attr("height", dimensions.boundedHeight)
To use our <clipPath> we'll create a group with the attribute clip-path pointing to our <clipPath>'s id. The order in which we draw SVG elements determines their "z-index". Keeping that in mind, let's add our new group after we draw the freezing <rect>.

1
bounds.append("rect")
2
.attr("class", "freezing")
3
const clip = bounds.append("g")
4
.attr("clip-path", "url(#bounds-clip-path)")
Now we can update our path to sit inside of our new group, instead of the bounds.

1
clip.append("path")
2
.attr("class", "line")
Voila! We can see that our line's new point isn't fully visible until it has finished un-shifting.

Timeline transition
We can see that the first point of our dataset is being removed before our line un-shifts. I bet you could think of a few ways around this — feel free to implement one or two! We could save the old dataset and preserve that extra point until our line is unshifted, or we could slice off the first data point when we define our x scale. In a production graph, the solution would depend on how our data is updating and what's appropriate to show.
Now that we have the tools needed to make our chart transitions lively, we'll learn how to let our users interact with our charts!

Final code for this lesson

```
import * as d3 from "d3";

async function drawLineChart() {

  // 1. Access data
  let dataset = await d3.json("./data/my_weather_data.json")

  // 2. Create chart dimensions

  const yAccessor = d => d.temperatureMax
  const dateParser = d3.timeParse("%Y-%m-%d")
  const xAccessor = d => dateParser(d.date)
  dataset = dataset.sort((a,b) => xAccessor(a) - xAccessor(b)).slice(0, 100)

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
  dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

  // 3. Draw canvas

  const wrapper = d3.select("#wrapper")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

  const bounds = wrapper.append("g")
      .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)

  const clipPath = bounds.append("defs").append("clipPath")
      .attr("id", "bounds-clip-path")
    .append("rect")
      .attr("width", dimensions.boundedWidth)
      .attr("height", dimensions.boundedHeight)

  // init static elements
  bounds.append("rect")
      .attr("class", "freezing")
  const clip = bounds.append("g")
    .attr("clip-path", "url(#bounds-clip-path)")
  clip.append("path")
      .attr("class", "line")
  bounds.append("g")
      .attr("class", "x-axis")
      .style("transform", `translateY(${dimensions.boundedHeight}px)`)
  bounds.append("g")
      .attr("class", "y-axis")

  const drawLine = (dataset) => {

    // 4. Create scales

    const yScale = d3.scaleLinear()
      .domain(d3.extent(dataset, yAccessor))
      .range([dimensions.boundedHeight, 0])

    const freezingTemperaturePlacement = yScale(32)
    const freezingTemperatures = bounds.select(".freezing")
        .attr("x", 0)
        .attr("width", dimensions.boundedWidth)
        .attr("y", freezingTemperaturePlacement)
        .attr("height", dimensions.boundedHeight - freezingTemperaturePlacement)

    const xScale = d3.scaleTime()
      .domain(d3.extent(dataset, xAccessor))
      .range([0, dimensions.boundedWidth])

    // 5. Draw data

    const lineGenerator = d3.line()
      .x(d => xScale(xAccessor(d)))
      .y(d => yScale(yAccessor(d)))

    const lastTwoPoints = dataset.slice(-2)
    const pixelsBetweenLastPoints = xScale(xAccessor(lastTwoPoints[1])) - xScale(xAccessor(lastTwoPoints[0]))
    const line = bounds.select(".line")
        .attr("d", lineGenerator(dataset))
        .style("transform", `translateX(${pixelsBetweenLastPoints}px)`)
      .transition().duration(1000)
        .style("transform", `none`)

    // 6. Draw peripherals

    const yAxisGenerator = d3.axisLeft()
      .scale(yScale)

    const yAxis = bounds.select(".y-axis")
      .call(yAxisGenerator)

    const xAxisGenerator = d3.axisBottom()
      .scale(xScale)

    const xAxis = bounds.select(".x-axis")
      .transition().duration(1000)
      .call(xAxisGenerator)
  }
  drawLine(dataset)

  // update the line every 1.5 seconds
  setInterval(addNewDay, 1500)
  function addNewDay() {
    dataset = [...dataset.slice(1), generateNewDataPoint(dataset)]
    drawLine(dataset)
  }

  function generateNewDataPoint(dataset) {
    const lastDataPoint = dataset[dataset.length - 1]
    const nextDay = d3.timeDay.offset(xAccessor(lastDataPoint), 1)

    return {
      date: d3.timeFormat("%Y-%m-%d")(nextDay),
      temperatureMax: yAccessor(lastDataPoint) + (Math.random() * 6 - 3),
    }
  }
}
drawLineChart()

```

Week 4: Exercise
Let's consolidate what we just learned with an exercise to play with this week.

LESSON
DISCUSSION 0

This week's exercise#
Awesome work getting through all of those animations! During this week, add animated transitions to one of the custom charts you created in our previous exercises!

Choose whichever chart you are most excited about animating. Here are a few suggestions:

animate the initialization of your scatter plot, making the dots fly in from the bottom, left on page load
animate your line chart so that it floats up from the bottom on page load
animate your histogram so the bars "bounce" every 10 seconds
Now, go over the same steps we went through this week to add transitions to one of your custom charts.

If you get stuck, watch this week's videos again or post a question inline or on the Discord channel. Good luck! We're rooting for you!

And once you're finished, show off your wonderful custom visualization on Twitter or on the Discord! We'd love to see it!
