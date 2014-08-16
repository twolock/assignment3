function getCountryData(country){
	var out_data = data.filter(function(d) {
		return d.recipient == country
	})
	out_data.sort(function(a, b){
		return a.year - b.year
	})
	return out_data
}

function getYScale(data){
	var data_min = d3.min(data, function(d){return d.amt_cereals})
	var data_min = 0
	var data_max = d3.max(data, function(d){return d.amt_cereals})

	var y_scale = d3.scale.linear()
		.domain([data_min-data_min*0.1, data_max+data_max*0.1])
		.range([settings.chart_h-settings.point_r, settings.point_r])
	return y_scale
}

function draw_points (circle) {
	circle.attr('r', settings.point_r)
		.attr('cx', function(d){return x_scale(d.year)})
		.attr('cy', function(d){return y_scale(d.amt_cereals)})
		.attr('fill','none')
		.attr('stroke', 'indianred')
		.attr('stroke-width', 3)
		.attr('class', 'point')
}

var settings = {
	chart_h: 350,
	chart_w: 600,
	point_r: 5,
	x_padding: 100,
	y_padding: 30,
	title_padding: 10
}

var x_min = d3.min(data, function(d){return d.year}), x_max = d3.max(data, function(d){return d.year})
var x_scale = d3.scale.linear()
	.domain([x_min - 2, x_max+2])
	.range([settings.point_r, settings.chart_w-settings.point_r])
var chart_g = d3.select('#chart-svg')
	.append('g').attr('id', 'chart-g')
	.attr('transform', 'translate('+settings.x_padding+','+(settings.y_padding+settings.title_padding)+')')

	
var x_axis_fun = d3.svg.axis()
	.scale(x_scale)
	.orient('bottom')
	.tickFormat(d3.format('d'))
var x_g = d3.select('#chart-g').append('g')
	.attr('transform', 'translate(0,'+(settings.chart_h)+')')
	.attr('class', 'axis')
x_g.call(x_axis_fun)

function draw_chart(country){
	current_data = getCountryData(country), y_scale = getYScale(current_data)

	var points = chart_g.selectAll('.point').data(current_data, function(d){return d.year})
	points.exit().remove()
	points.enter()
		.append('circle')
		.call(draw_points)

	chart_g.selectAll('.point').transition()
		.duration(500).call(draw_points)
	var y_axis_fun = d3.svg.axis()
		.scale(y_scale)
		.orient('left')
/*
	var y_g = d3.select('#chart-g').append('g')
		.attr('transform', 'translate(0,0)')
		.attr('class', 'axis')
		.call(y_axis_fun)
*/
	chart_g.selectAll('.title').remove()
	var title = chart_g.append('text')
		.text('Cereal Food Aid Received by '+country+' (Metric Tons)')
		.attr('transform', 'translate(120,0)')
		.attr('class', 'title')
	
}

draw_chart('Iran, Islamic Republic of')

