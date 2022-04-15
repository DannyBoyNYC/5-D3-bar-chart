# Making a Bar Chart

Next, we embark on a mission to create a slightly more complex chart: a bar chart. We talk about what we can learn from a bar chart, and what a histogram is.

We'll walk through one last "basic" chart — once finished, you'll feel very comfortable with each step and we'll move on to animations and interactions.

## Deciding the chart type

Another type of question that we can ask our dataset is: what does the distribution of a metric look like?

For example:

- What kinds of humidity values do we have?
- Does the humidity level generally stay around one value, with a few very humid days and a few very dry days?
- Does it vary consistently, with no standard value?
- Or are there really humid days and really dry days, with none in-between?

Looking at the scatter plot we just made, we can see the daily humidity values from the dots' vertical placement.

<!-- Finished scatter plot -->

But it's hard to answer our questions - do most of our dots fall close the middle of the chart? We're not entirely sure.

Instead, let's make a histogram.

## Histogram

A histogram is a bar chart that shows the distribution of one metric, with the metric values on the x axis and the frequency of values on the y axis.

Histogram graphic

In order to show the frequency, values are placed in equally-sized bins (visualized as individual bars). For example, we could make bins for dew point temperatures that span 10 degrees - these would look something like [0-10, 10-20, 20-30, ...]. A dew point of 15 degrees would be counted in the second bin: 10-20.

The number of and size of bins is up to the implementor - you could have a histogram with only 3 bins or one with 100 bins. There are standards that can be followed (feel free to check out d3's built-in formulas), but we can generally decide the number based on what suits the data and what's easy to read.

Our goal is to make a histogram of humidity values. This will show us the distribution of humidity values and help answer our questions.

- Do most days stay around the same level of humidity?
- Or are there two types of days: humid and dry? Are there crazy humid days?

Finished humidity histogram

To interpret the above histogram, it shows that we have 48 days in our dataset with a humidity value between 0.55 and 0.6

For extra credit, we'll generalize our histogram function and loop through eight metrics in our dataset - creating many histograms to compare.

Many histograms

Access data

Next, we grab our data and create our accessor function (only one this time!)

Chart checklist
To start, let's look over our chart-making checklist to remind ourselves of the necessary steps.

- Access data
- Create dimensions
- Draw canvas
- Create scales
- Draw data
- Draw peripherals
- Set up interactions

We'll breeze through most of these steps, reinforcing what we've already learned.

## Access data

In our javascript file, let's grab the data from our JSON file, waiting until it's loaded to continue.

code/03-making-a-bar-chart/completed/draw-bars.js

```js
const dataset = await d3.json("./data/my_weather_data.json");
```

This time, we're only interested in one metric for the whole chart. Remember, the y axis is plotting the frequency (i.e. the number of occurrences) of the metric whose values are on the x axis. So instead of an xAccessor() and yAccessor(), we define a single metricAccessor().

```js
const metricAccessor = (d) => d.humidity;
```

Final code:

```js
async function drawBars() {
  // your code goes here

  // 1. Access data
  const dataset = await d3.json("./data/my_weather_data.json");

  const xAccessor = (d) => d.humidity;
}

drawBars();
```

## Create dimensions

A hopefully familiar step by now: creating our chart dimensions.

Histograms are easiest to read when they are wider than they are tall. Let's set the width before defining the rest of our dimensions so we can use it to calculate the height. We'll also be able to quickly change the width later and keep the same aspect ratio for our chart.

Instead of filling the whole window, let's prepare for multiple histograms and keep our chart small. That way, the charts can stack horizontally and vertically, depending on the screen size.

```js
const width = 600;
```

Let's use the width to set the width and height of our chart. We'll leave a larger margin on the top to account for the bar labels, which we'll position above each bar.

```js
let dimensions = {
  width: width,
  height: width \* 0.6,
  margin: {
    top: 30,
    right: 10,
    bottom: 50,
    left: 50,
  },
}
```

Remember, our wrapper encompasses the whole chart. If we subtract our margins, we'll get the size of our bounds which contain any data elements.

### Chart terminology

Now that we know the size of our wrapper and margins, we can calculate the size of our bounds.

```js
dimensions.boundedWidth =
  dimensions.width - dimensions.margin.left - dimensions.margin.right;
dimensions.boundedHeight =
  dimensions.height - dimensions.margin.top - dimensions.margin.bottom;
```

Final code:

```js
async function drawBars() {
  // 1. Access data
  const dataset = await d3.json("./data/my_weather_data.json");

  const xAccessor = (d) => d.humidity;

  // 2. Create chart dimensions

  const width = 600;
  let dimensions = {
    width: width,
    height: width * 0.6,
    margin: {
      top: 30,
      right: 10,
      bottom: 50,
      left: 50,
    },
  };
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;
}
drawBars();
```

## Create scales

We create our scales, but first, we learn how to split our data into equally-sized bins.

Our x scale should look familiar to the ones we've made in the past. We need a scale that will convert humidity levels into pixels-to-the-right. Since both the domain and the range are continuous numbers, we'll use `d3.scaleLinear()`.

Let's also use `.nice()` to make sure our axis starts and ends on round numbers.

```js
const xScale = d3
  .scaleLinear()
  .domain(d3.extent(dataset, xAccessor))
  .range([0, dimensions.boundedWidth])
  .nice();
```

Now we need to create our yScale.

But wait a minute! We can't make a y scale without knowing the range of frequencies we need to cover. Let's create our data bins first.

## Creating Bins

How can we split our data into bins, and what size should those bins be? We could do this manually by looking at the domain and organizing our days into groups, but that sounds tedious.

Thankfully, we can use d3-array's `d3.bin()` method to create a bin generator. This generator will convert our dataset into an array of bins - we can even choose how many bins we want!

Let's create a new generator:

```js
const binsGenerator = d3.bin();
```

Similar to making a scale, we'll pass a domain to the generator to tell it the range of numbers we want to cover.

```js
const binsGenerator = d3.bin().domain(xScale.domain());
```

Next, we'll need to tell our generator how to get the the humidity value, since our dataset contains objects instead of values. We can do this by passing our metricAccessor() function to the .value() method.

```js
const binsGenerator = d3.bin().domain(xScale.domain()).value(xAccessor);
```

We can also tell our generator that we want it to aim for a specific number of bins. When we create our bins, we won't necessarily get this exact amount, but it should be close.

Let's aim for 13 bins — this should make sure we have enough granularity to see the shape of our distribution without too much noise. Keep in mind that the number of bins is the number of thresholds + 1.

code/03-making-a-bar-chart/completed/draw-bars.js

52
const binsGenerator = d3.bin()
53
.domain(xScale.domain())
54
.value(xAccessor)
55
.thresholds(12)
Great! Our bin generator is ready to go. Let's create our bins by feeding it our data.

code/03-making-a-bar-chart/completed/draw-bars.js

57
const bins = binsGenerator(dataset)
Let's take a look at these bins by logging them to the console: console.log(bins).

logged bins
Each bin is an array with the following structure:

each item is a matching data point. For example, the first bin has no matching days — this is likely because we used .nice() to round out our x scale.
there is an x0 key that shows the lower bound of included humidity values (inclusive)
there is an x1 key that shows the upper bound of included humidity values (exclusive). For example, a bin with a x1 value of 1 will include values up to 1, but not 1 itself
Note how there are 15 bins in my example — our bin generator was aiming for 13 bins but decided that 15 bins were more appropriate. This was a good decision, creating bins with a sensible size of 0.05. If our bin generator had been more strict about the number of bins, our bins would have ended up with a size of 0.06666667, which is harder to reason about. To extract insights from a chart, readers will mentally convert awkward numbers into rounder numbers to make sense of them. Let's do that work for them.
If we want, we can specify an exact number of bins by instead passing an array of thresholds. For example, we could specify 5 bins with .thresholds([0, 0.2, 0.4, 0.6, 0.8, 1]).

Creating the y scale#

Okay great, now we can use these bins to create our y scale. First, let's create a y accessor function and throw it at the top of our file. Now that we know the shape of the data that we'll use to create our data elements, we can specify how to access the y value in one place.

code/03-making-a-bar-chart/completed/draw-bars.js

9
const yAccessor = d => d.length
Let's use our new accessor function and our bins to create that y scale. As usual, we'll want to make a linear scale. This time, however, we'll want to start our y axis at zero.

Previously, we wanted to represent the extent of our data since we were plotting metrics that had no logical bounds (temperature and humidity level). But the number of days that fall in a bin is bounded at 0 — you can't have negative days in a bin!

Instead of using d3.extent(), we can use another method from d3-array: d3.max(). This might sound familiar — we've used its counterpart, d3.min() in Module 2. d3.max() takes the same arguments: an array and an accessor function.

Note that we're passing d3.max() our bins instead of our original dataset — we want to find the maximum number of days in a bin, which is only available in our computed bins array.

code/03-making-a-bar-chart/completed/draw-bars.js

59
const yScale = d3.scaleLinear()
60
.domain([0, d3.max(bins, yAccessor)])
61
.range([dimensions.boundedHeight, 0])
Let's use .nice() here as well to give our bars a round top number.

code/03-making-a-bar-chart/completed/draw-bars.js

59
const yScale = d3.scaleLinear()
60
.domain([0, d3.max(bins, yAccessor)])
61
.range([dimensions.boundedHeight, 0])
62
.nice()
Final code for this lesson#

```

async function drawBars() {

  // 1. Access data
  const dataset = await d3.json("./data/my_weather_data.json")

  const xAccessor = d => d.humidity
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
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice()

  const binsGenerator = d3.bin()
    .domain(xScale.domain())
    .value(xAccessor)
    .thresholds(12)

  const bins = binsGenerator(dataset)

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(bins, yAccessor)])
    .range([dimensions.boundedHeight, 0])
    .nice()

}
drawBars()
```

Draw data
We finally get to draw our bars! We draw them in groups, so we can position them as well as labels.

LESSON
DISCUSSION 1

Here comes the fun part! Our plan is to create one bar for each bin, with a label on top of each bar.

We'll need one bar for each item in our bins array — this is a sign that we'll want to use the data bind concept we learned in Module 2.

Let's first create a <g> element to contain our bins. This will help keep our code organized and isolate our bars in the DOM.

code/03-making-a-bar-chart/completed/draw-bars.js

33
const binsGroup = bounds.append("g")
Because we have more than one element, we'll bind each data point to a <g> SVG element. This will let us group each bin's bar and label.

To start, we'll select all existing <g> elements within our binsGroup (there aren't any yet, but we're creating a selection object that points to the right place). Then we'll use .data() to bind our bins to the selection.

code/03-making-a-bar-chart/completed/draw-bars.js

68
const binGroups = binsGroup.selectAll("g")
69
.data(bins)
Next, we'll create our <g> elements, using .join() to target all of our bins.

code/03-making-a-bar-chart/completed/draw-bars.js

68
const binGroups = binsGroup.selectAll("g")
69
.data(bins)
70
.join("g")
The above code will create one new <g> element for each bin. We're going to place our bars within this group.

Next up we'll draw our bars, but first we should calculate any constants that we'll need. Like a warrior going into battle, we want to prepare our weapons before things heat up.

In this case, the only constant that we can set ahead of time is the padding between bars. Giving them some space helps distinguish individual bars, but we don't want them too far apart - that will make them hard to compare and take away from the overall shape of the distribution.

Chart design tip: putting a space between bars helps distinguish individual bars
code/03-making-a-bar-chart/completed/draw-bars.js

72
const barPadding = 1
Now we are armed warriors and are ready to charge into battle! Each bar is a rectangle, so we'll append a <rect> to each of our <g> elements.

code/03-making-a-bar-chart/completed/draw-bars.js

73
const barRects = binGroups.append("rect")
74
.attr("x", d => xScale(d.x0) + barPadding / 2)
75
.attr("y", d => yScale(yAccessor(d)))
Remember, <rect>s need four attributes: x, y, width, and height.

Let's start with the x value, which will corresponds to the left side of the bar. The bar will start at the lower bound of the bin, which we can find at the x0 key.

But x0 is a humidity level, not a pixel. So let's use xScale() to convert it to pixel space.

Lastly, we need to offset it by the barPadding we set earlier.

code/03-making-a-bar-chart/completed/draw-bars.js

74
.attr("x", d => xScale(d.x0) + barPadding / 2)
75
.attr("y", d => yScale(yAccessor(d)))
76
.attr("width", d => d3.max([
We could create accessor functions for the x0 and x1 properties of each bin if we were concerned about the structure of our bins changing. In this case, it would be overkill since:

we didn't specify the structure of each bin, d3.bin() did
we're not going to change the way we access either of these values since they're built in to d3.bin()
the way we access these properties is very straightforward. If the values were more nested or required computation, we could definitely benefit from accessor functions.
Next, we'll specify the <rect>'s y attribute which corresponds to the top of the bar. We'll use our yAccessor() to grab the frequency and use our scale to convert it into pixel space.

code/03-making-a-bar-chart/completed/draw-bars.js

75
.attr("y", d => yScale(yAccessor(d)))
76
.attr("width", d => d3.max([
77
0,
To find the width of a bar, we need to subtract the x0 position of the left side of the bar from the x1 position of the right side of the bar.

We'll need to subtract the bar padding from the total width to account for spaces between bars. Sometimes we'll get a bar with a width of 0, and subtracting the barPadding will bring us to -1. To prevent passing our <rect>s a negative width, we'll wrap our value with d3.max([0, width]).

code/03-making-a-bar-chart/completed/draw-bars.js

76
.attr("width", d => d3.max([
77
0,
78
xScale(d.x1) - xScale(d.x0) - barPadding
79
]))
80
.attr("height", d => dimensions.boundedHeight
81

- yScale(yAccessor(d))
  Lastly, we'll calculate the bar's height by subtracting the y value from the bottom of the y axis. Since our y axis starts from 0, we can use our boundedHeight.

code/03-making-a-bar-chart/completed/draw-bars.js

80
.attr("height", d => dimensions.boundedHeight
81

- yScale(yAccessor(d))
  82
  )
  Let's put that all together and change the bar fill to blue.

code/03-making-a-bar-chart/completed/draw-bars.js

73
const barRects = binGroups.append("rect")
74
.attr("x", d => xScale(d.x0) + barPadding / 2)
75
.attr("y", d => yScale(yAccessor(d)))
76
.attr("width", d => d3.max([
77
0,
78
xScale(d.x1) - xScale(d.x0) - barPadding
79
]))
80
.attr("height", d => dimensions.boundedHeight
81 - yScale(yAccessor(d))
82
)
83
.attr("fill", "cornflowerblue")
Alright! Now we're starting to see the beginnings of our histogram!

Our bars
Final code for this lesson

```

async function drawBars() {

  // 1. Access data
  const dataset = await d3.json("./data/my_weather_data.json")

  const xAccessor = d => d.humidity
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
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice()

  const binsGenerator = d3.bin()
    .domain(xScale.domain())
    .value(xAccessor)
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

}
drawBars()
```

Adding Labels
We draw a label over each bar, showing the number of points within that bin.

LESSON
DISCUSSION 0

Let's add labels to show the count for each of these bars.

We can keep our chart clean by only adding labels to bins with any relevant days — having 0s in empty spaces is unhelpful visual clutter. We can identify which bins have no data by their lack of a bar, no need to call it out with a label.

d3 selections have a .filter() method that acts the same way the native Array method does. .filter() accepts one parameter: a function that accepts one data point and returns a value. Any items in our dataset who return a falsey value will be removed.

By "falsey", we're referring to any value that evaluates to false. Maybe surprisingly, this includes values other than false, such as 0, null, undefined, "", and NaN. Keep in mind that empty arrays [] and object {} evaluate to truthy. If you're curious, read more here.
We can use yAccessor() as shorthand for d => yAccessor(d) != 0 because 0 is falsey.

code/03-making-a-bar-chart/completed/draw-bars.js

33
const barText = binGroups.filter(yAccessor)
Since these labels are just text, we'll want to use the SVG <text> element we've been using for our axis labels.

code/03-making-a-bar-chart/completed/draw-bars.js

85
const barText = binGroups.filter(yAccessor)
86
.append("text")
Remember, <text> elements are positioned with x and y attributes. The label will be centered horizontally above the bar — we can find the center of the bar by adding half of the bar's width (the right side minus the left side) to the left side of the bar.

code/03-making-a-bar-chart/completed/draw-bars.js

85
const barText = binGroups.filter(yAccessor)
86
.append("text")
87
.attr("x", d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
Our <text>'s y position will be similar to the <rect>'s y position, but let's shift it up by 5 pixels to add a little gap.

code/03-making-a-bar-chart/completed/draw-bars.js

85
const barText = binGroups.filter(yAccessor)
86
.append("text")
87
.attr("x", d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
88
.attr("y", d => yScale(yAccessor(d)) - 5)
Next, we'll display the count of days in the bin using our yAccessor() function. Note: again, we can use yAccessor() as shorthand for d => yAccessor(d).

code/03-making-a-bar-chart/completed/draw-bars.js

85
const barText = binGroups.filter(yAccessor)
86
.append("text")
87
.attr("x", d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
88
.attr("y", d => yScale(yAccessor(d)) - 5)
89
.text(yAccessor)
We can use the CSS text-anchor property to horizontally align our text — this is a much simpler solution than compensating for text width when we set the x attribute.

code/03-making-a-bar-chart/completed/draw-bars.js

85
const barText = binGroups.filter(yAccessor)
86
.append("text")
87
.attr("x", d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
88
.attr("y", d => yScale(yAccessor(d)) - 5)
89
.text(yAccessor)
90
.style("text-anchor", "middle")
After adding a few styles to decrease the visual importance of our labels...

code/03-making-a-bar-chart/completed/draw-bars.js

85
const barText = binGroups.filter(yAccessor)
86
.append("text")
87
.attr("x", d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
88
.attr("y", d => yScale(yAccessor(d)) - 5)
89
.text(yAccessor)
90
.style("text-anchor", "middle")
91
.attr("fill", "darkgrey")
92
.style("font-size", "12px")
93
.style("font-family", "sans-serif")
...we should see the count of days for each of our bars!

Our bars with labels
Final code for this lesson#

```

async function drawBars() {

  // 1. Access data
  const dataset = await d3.json("./data/my_weather_data.json")

  const xAccessor = d => d.humidity
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
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice()

  const binsGenerator = d3.bin()
    .domain(xScale.domain())
    .value(xAccessor)
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

}
drawBars()
```

Draw peripherals
We draw a line depicting the mean of our distribution, as well as our axes.

LESSON
DISCUSSION 2

When looking at the shape of a distribution, it can be helpful to know where the mean is.

The mean is just the average — the center of a set of numbers. To calculate the mean, you would divide the sum by the number of values. For example, the mean of [1, 2, 3, 4, 5] would be (1 + 2 + 3 + 4 + 5) / 5 = 3.

Instead of calculating the mean by hand, we can use d3.mean() to grab that value. Like many d3 methods we've used, we pass the dataset as the first parameter and an optional accessor function as the second.

code/03-making-a-bar-chart/completed/draw-bars.js

95
const mean = d3.mean(dataset, metricAccessor)
Great! Let's see how comfortable we are with drawing an unfamiliar SVG element: <line>. A <line> element will draw a line between two points: [x1, y1] and [x2, y2]. Using this knowledge, let's add a line to our bounds that is:

at the mean humidity level,
starting 15px above our chart, and
ending at our x axis.
How close can you get before looking at the following code?

code/03-making-a-bar-chart/completed/draw-bars.js

96
const meanLine = bounds.append("line")
97
.attr("x1", xScale(mean))
98
.attr("x2", xScale(mean))
99
.attr("y1", -15)
100
.attr("y2", dimensions.boundedHeight)
Let's add some styles to the line so we can see it (by default, <line>s have no stroke color) and to distinguish it from an axis. SVG element strokes can be split into dashes with the stroke-dasharray attribute. The lines alternate between the stroke color and transparent, starting with transparent. We define the line lengths with a space-separated list of values (which will be repeated until the line is drawn).

Let's make our lines dashed with a 2px long maroon dash and a 4px long gap.

code/03-making-a-bar-chart/completed/draw-bars.js

96
const meanLine = bounds.append("line")
97
.attr("x1", xScale(mean))
98
.attr("x2", xScale(mean))
99
.attr("y1", -15)
100
.attr("y2", dimensions.boundedHeight)
101
.attr("stroke", "maroon")
102
.attr("stroke-dasharray", "2px 4px")
Give yourself a pat on the back for drawing your first <line> element!

Our bars with labels and the mean
Let's label our line to clarify to readers what it represents. We'll want to add a <text> element in the same position as our line, but 5 pixels higher to give a little gap.

code/03-making-a-bar-chart/completed/draw-bars.js

104
const meanLabel = bounds.append("text")
105
.attr("x", xScale(mean))
106
.attr("y", -20)
107
.text("mean")
108
.attr("fill", "maroon")
109
.style("font-size", "12px")
Hmm, we can see the text but it isn't horizontally centered with our line.

Our bars with a mean label
Let's center our text by adding the CSS property text-anchor: middle. This is a property specifically for setting the horizontal alignment of text in SVG.

code/03-making-a-bar-chart/completed/draw-bars.js

104
const meanLabel = bounds.append("text")
105
.attr("x", xScale(mean))
106
.attr("y", -20)
107
.text("mean")
108
.attr("fill", "maroon")
109
.style("font-size", "12px")
110
.style("text-anchor", "middle")
Perfect! Now our mean line is clear to our readers.

Our bars with a mean label, centered horizontally
Draw axes#
As usual, our last task here is to draw our axes. But we're in for a treat! Since we're labeling the y value of each of our bars, we won't need a y axis. We just need an x axis and we're set!

We'll start by making our axis generator — our axis will be along the bottom of the chart so we'll be using d3.axisBottom().

code/03-making-a-bar-chart/completed/draw-bars.js

114
const xAxisGenerator = d3.axisBottom()
115
.scale(xScale)
Then we'll use our new axis generator to create an axis, then shift it below our bounds.

code/03-making-a-bar-chart/completed/draw-bars.js

117
const xAxis = bounds.append("g")
118
.call(xAxisGenerator)
119
.style("transform", `translateY(${dimensions.boundedHeight}px)`)
And lastly, let's throw a label on there to make it clear what the tick labels represent.

1
const xAxisLabel = xAxis.append("text")
2
.attr("x", dimensions.boundedWidth / 2)
3
.attr("y", dimensions.margin.bottom - 10)
4
.attr("fill", "black")
5
.style("font-size", "1.4em")
6
.text("Humidity")
And voila, we're done drawing our peripherals!

Set up interactions#
Next, we would set up any chart interactions. We don't have any interactions for this chart, but stay tuned — we'll cover this in the next chapter.

Looking at our chart#
Chart finished! Let's take a look at our distribution.

Finished humidity histogram
Our histogram looks somewhere in-between a normal and bimodal distribution. Don't worry if those terms make no sense right now — we cover distribution shapes in detail in Chapter 8 of the book.

Final code for this lesson#

```

async function drawBars() {
  // 1. Access data
  const dataset = await d3.json("./data/my_weather_data.json");

  const xAccessor = (d) => d.humidity;
  const yAccessor = (d) => d.length;

  // 2. Create chart dimensions

  const width = 600;
  let dimensions = {
    width: width,
    height: width * 0.6,
    margin: {
      top: 30,
      right: 10,
      bottom: 50,
      left: 50,
    },
  };
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  // 3. Draw canvas

  const wrapper = d3
    .select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  const bounds = wrapper
    .append("g")
    .style(
      "transform",
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    );

  // 4. Create scales

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice();

  const binsGenerator = d3
    .bin()
    .domain(xScale.domain())
    .value(xAccessor)
    .thresholds(12);

  const bins = binsGenerator(dataset);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(bins, yAccessor)])
    .range([dimensions.boundedHeight, 0])
    .nice();

  // 5. Draw data

  const binsGroup = bounds.append("g");

  const binGroups = binsGroup.selectAll("g").data(bins).join("g");

  const barPadding = 1;
  const barRects = binGroups
    .append("rect")
    .attr("x", (d) => xScale(d.x0) + barPadding / 2)
    .attr("y", (d) => yScale(yAccessor(d)))
    .attr("width", (d) => d3.max([0, xScale(d.x1) - xScale(d.x0) - barPadding]))
    .attr("height", (d) => dimensions.boundedHeight - yScale(yAccessor(d)))
    .attr("fill", "cornflowerblue");

  const barText = binGroups
    .filter(yAccessor)
    .append("text")
    .attr("x", (d) => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
    .attr("y", (d) => yScale(yAccessor(d)) - 5)
    .text(yAccessor)
    .style("text-anchor", "middle")
    .attr("fill", "darkgrey")
    .style("font-size", "12px")
    .style("font-family", "sans-serif");

  // 6. Draw peripherals

  const mean = d3.mean(dataset, xAccessor)
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
      .style("font-family", "sans-serif");

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
}
drawBars();
```

Extra credit
We talk about how to generalize our code, and change it so that we draw multiple histograms for different metrics.

LESSON
DISCUSSION 0

Let's generalize our histogram drawing function and create a chart for each weather metric we have access to! This will make sure that we understand what every line of code is doing.

Generalizing our code will also help us to start thinking about handling dynamic data — a core concept when building a dashboard. Drawing a graph with a specific dataset can be difficult, but you get to rely on values being the same every time your code runs. When handling data from an API, your charting functions need to be more robust and able to handle very different datasets.

Finished histogram
Here's the good news: we won't need to rewrite the majority of our code! The main difference is that we'll wrap most of the chart drawing into a new function called drawHistogram().

Which steps do we need to repeat for every chart? Let's look at our checklist again.

Access data
Create dimensions
Draw canvas
Create scales
Draw data
Draw peripherals
Set up interactions
All of the histograms will use the same dataset, so we can skip step 1. And every chart will be the same size, so we don't need to repeat step 2 either. However, we want each chart to have its own svg element, so we'll need to wrap everything after step 2 .

In the next section, we'll cover ways to make our chart more accessible. We'll be working on the current version of our histogram - make a copy of your current finished histogram in order to come back to it later.
Let's do that — we'll create a new function called drawHistogram() that contains all of our code, starting at the point we create our svg. Note that the finished code for this step is in the /code/03-making-a-bar-chart/completed-multiple/draw-bars.js file if you're unsure about any of these steps.

1
const drawHistogram = () => {
2
const wrapper = d3.select("#wrapper")
3
// ... the rest of our chart code
What parameters does our function need? The only difference between these charts is the metric we're plotting, so let's add that as an argument.

1
const drawHistogram = metric => {
2
// ...
But wait, we need to use the metric to update our metricAccessor(). Let's grab our accessor functions from our Access data step and throw them at the top of our new function. We'll also need our metricAccessor() to return the provided metric, instead of hard-coding d.humidity.

1
const drawHistogram = metric => {
2
const metricAccessor = d => d[metric]
3
const yAccessor = d => d.length
4
​
5
const wrapper = d3.select("#wrapper")
6
// ...
Great, let's give it a go! At the bottom of our drawBars() function, let's run through some of the available metrics (see code example for a list) and pass each of them to our new generalized function.

1
const metrics = [
2
"windSpeed",
3
"moonPhase",
4
"dewPoint",
5
"humidity",
6
"uvIndex",
7
"windBearing",
8
"temperatureMin",
9
"temperatureMax",
10
]
11
​
12
metrics.forEach(drawHistogram)
Alright! Let's see what happens when we refresh our webpage.

Finished histograms, wrong labels
We see multiple histograms, but something is off. Not all of these charts are showing Humidity! Let's find the line where we set our x axis label and update that to show our metric instead. Here it is:

1
const xAxisLabel = xAxis.append("text")
2
// ...
3
.text("Humidity")
We'll set the text to our metric instead, and we can also add a CSS text-transform value to help format our metric names. For a production dashboard, we might want to look up a proper label in a metric-to-label map, but this will work in a pinch.

1
const xAxisLabel = xAxis.append("text")
2
// ...
3
.text(metric)
4
.style("text-transform", "capitalize")
When we refresh our webpage, we should see our finished histograms.

Finished histogram
Wonderful!

Take a second and observe the variety of shapes of these histograms. What are some insights we can discover when looking at our data in this format?

the moon phase distribution is flat - this makes sense because it's cyclical, consistently going through the same steps all year.
our wind speed is usually around 3 mph, with a long tail to the right that represents a few very windy days. Some days have no wind at all, with an average wind speed of 0.
our max temperatures seem almost bimodal, with the mean falling in between two humps. Looks like New York City spends more days with relatively extreme temperatures (30°F - 50°F or 70°F - 90°F) than with more temperate weather (60°F).
Final code for this lesson

```

async function drawBars() {

  // 1. Access data
  const dataset = await d3.json("./data/my_weather_data.json")
  console.table(dataset[0])

  // 2. Create chart dimensions

  const width = 500
  let dimensions = {
    width: width,
    height: width * 0.6,
    margin: {
      top: 80,
      right: 50,
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

  const drawHistogram = metric => {
    const metricAccessor = d => d[metric]
    const yAccessor = d => d.length

  // 3. Draw canvas

    const wrapper = d3.select("#wrapper")
      .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)

    const bounds = wrapper.append("g")
        .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)

  // 4. Create scales

    const xScale = d3.scaleLinear()
      .domain(d3.extent(dataset, metricAccessor))
      .range([0, dimensions.boundedWidth])
      .nice()

    const binsGenerator = d3.bin()
      .domain(xScale.domain())
      .value(metricAccessor)
      .thresholds(8)

    const bins = binsGenerator(dataset)

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(bins, yAccessor)])
      .range([dimensions.boundedHeight, 0])
      .nice()

    // 5. Draw data

    const binGroups = bounds.selectAll("g")
      .data(bins)
      .enter().append("g")

    const barPadding = 1
    const barRects = binGroups.append("rect")
        .attr("x", d => xScale(d.x0) + barPadding / 2)
        .attr("y", d => yScale(yAccessor(d)))
        .attr("width", d => d3.max([
          0,
          xScale(d.x1) - xScale(d.x0) - barPadding
        ]))
        .attr("height", d => dimensions.boundedHeight - yScale(yAccessor(d)))
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
    "visibility",
    "cloudCover",
  ]

  metrics.forEach(drawHistogram)
}
drawBars()
```

Accessibility
This is a great lesson, and one that's hard to find good content on. We talk about the ways to make our charts accessible to screen readers, and walk through changing our histogram.

LESSON
DISCUSSION 1

The main goal of any data visualization is for it to be readable. This generally means that we want our elements to be easy to see, text is large enough to read, colors have enough contrast, etc. But what about users who access web pages through screen readers?

We can actually make our charts accessible at a basic level, without putting a lot of effort in. Let's update our histogram so that it's accessible with a screen reader.

If you want to test this out, download the ChromeVox extension for chrome (or use any other screen reader application). If we test it out on our histogram, you'll notice that it doesn't give much information, other than reading all of the text in our chart. That's not an ideal experience.

The main standard for making websites accessible is from WAI-ARIA, the Accessible Rich Internet Applications Suite. WAI-ARIA roles, set using a role attribute, tell the screen reader what type of content an element is.

We'll be updating our completed single histogram in this section, without the extra credit code.
The first thing we can do is to give our <svg> element a role of figure, to alert it that this element is a chart. (This code can go at the bottom of the Draw canvas step).

1
wrapper.attr("role", "figure")
Next, we can make our chart tabbable, by adding a tabindex of 0. This will make it so that a user can hit tab to highlight our chart.

There are only two tabindex values that you should use:

0, which puts an element in the tab flow, in DOM order
-1, which takes an element out of the tab flow.

1
wrapper.attr("role", "figure")
2
.attr("tabindex", "0")
When a user tabs to our chart, we want the screen reader to announce the basic layout so the user knows what they're "looking" at. To do this, we can add a <title> SVG component with a short description.

1
wrapper.append("title")
2
.text("Histogram looking at the distribution of humidity in 2016")
If you have a screen reader set up, you'll notice that it will read our <title> when we tab to our chart. The "highlighted" state will look something like this:

Accessibility highlight
Next, we'll want to make our binsGroup selectable by also giving it a tabindex of 0. If the user presses tab after the wrapper is focused, the browser will focus on the binsGroup because it's the next element (in DOM order) that is focusable.

1
const binsGroup = bounds.append("g")
2
.attr("tabindex", "0")
We can also give our binsGroup a role of "list", which will make the screen reader announce the number of items within the list. And we'll let the user know what the list contains by adding an aria-label.

1
const binsGroup = bounds.append("g")
2
.attr("tabindex", "0")
3
.attr("role", "list")
4
.attr("aria-label", "histogram bars")
Now when our binsGroup is highlighted, the screen reader will announce: "histogram bars. List with 15 items". Perfect!

Let's annotate each of our "list items". After we create our binGroups, we'll add a few attributes to each group:

make it focusable with a tabindex of 0
give it a role of "listitem"
give it an area-label that the screen reader will announce when the item is focused.

1
const binGroups = binsGroup.selectAll("g")
2
.data(bins)
3
.enter().append("g")
4
.attr("tabindex", "0")
5
.attr("role", "listitem")
6
.attr("aria-label", d => `There were ${ 7 yAccessor(d) 8 } days between ${ 9 d.x0.toString().slice(0, 4) 10 } and ${ 11 d.x1.toString().slice(0, 4) 12 } humidity levels.`)
Now when we tab out of our binsGroup, it will focus the first bar group (and subsequent ones when we tab) and announce our aria label.

We'll tackle one last issue — you might have noticed that the screen reader reads each of our x-axis tick labels once it's done reading our <title>. This is pretty annoying, and not giving the user much information. Let's prevent that.

At the bottom of our drawBars() function, let's select all of the text within our chart and give it an aria-hidden attribute of "true".

1
wrapper.selectAll("text")
2
.attr("role", "presentation")
3
.attr("aria-hidden", "true")
Great! Now our screen reader will read only our labels and ignore any <text> elements within our chart.

With just a little effort, we've made our chart accessible to any users who access the web through a screen reader. That's wonderful, and more than most online charts can say!

Next up, we'll get fancy with animations and transitions.

Final code for this lesson#

```

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

  wrapper.attr("role", "figure")
      .attr("tabindex", "0")
    .append("title")
      .text("Histogram looking at the distribution of humidity over 2016")

  const bounds = wrapper.append("g")
      .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)

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
      .attr("tabindex", "0")
      .attr("role", "list")
      .attr("aria-label", "histogram bars")

  const binGroups = binsGroup.selectAll("g")
    .data(bins)
    .enter().append("g")
    .attr("tabindex", "0")
    .attr("role", "listitem")
    .attr("aria-label", d => `There were ${
      yAccessor(d)
    } days between ${
      d.x0.toString().slice(0, 4)
    } and ${
      d.x1.toString().slice(0, 4)
    } humidity levels.`)

  const barPadding = 1
  const barRects = binGroups.append("rect")
      .attr("x", d => xScale(d.x0) + barPadding / 2)
      .attr("y", d => yScale(yAccessor(d)))
      .attr("width", d => d3.max([
        0,
        xScale(d.x1) - xScale(d.x0) - barPadding
      ]))
      .attr("height", d => dimensions.boundedHeight - yScale(yAccessor(d)))
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
      .attr("role", "presentation")
      .attr("aria-hidden", true)

  // 6. Draw peripherals

  const xAxisGenerator = d3.axisBottom()
    .scale(xScale)

  const xAxis = bounds.append("g")
    .call(xAxisGenerator)
      .style("transform", `translateY(${dimensions.boundedHeight}px)`)
      .attr("role", "presentation")
      .attr("aria-hidden", true)

  const xAxisLabel = xAxis.append("text")
      .attr("x", dimensions.boundedWidth / 2)
      .attr("y", dimensions.margin.bottom - 10)
      .attr("fill", "black")
      .style("font-size", "1.4em")
      .text("Humidity")
      .style("text-transform", "capitalize")
      .attr("role", "presentation")
      .attr("aria-hidden", true)

}
drawBars()
```

Week 3: Exercise
Let's consolidate what we just learned with an exercise to play with this week.

LESSON
DISCUSSION 1

This week's exercise#
Awesome work getting through our third week! During this week, make a totally new histogram! Here's our list of fun datasets, if you wanted to switch from last week.

Choose a dataset to play with -- you'll want to pick one with one metric whose distribution you're especially interested in. Here are a few suggestions:

look at the distribution of number of unique colors in Bob Ross paintings
look at the distribution of deaths in witch trials. Extra credit: make multiple histograms to see how this changed across centuries
look at the distribution of penguin weight. Extra credit: make multiple histograms to compare weight distributions for different species
Fork our histogram CodeSandbox, download the data, and import it into your new forked sandbox.

If the data is a csv file, you'll need to use d3.csv() instead of d3.json().
Now, go over the same steps we went through this week to make a histogram with this new data.

If you get stuck, watch this week's videos again or post a question inline or on the Discord channel. Good luck! We're rooting for you!

And once you're finished, show off your wonderful custom visualization on Twitter or on the Discord! We'd love to see it!
