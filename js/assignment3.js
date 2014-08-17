function getCountryData(country){
	var out_data = data.filter(function(d) {
		return d.iso3 == country
	})
	out_data.sort(function(a, b){
		return a.year - b.year
	})
	return out_data
}

function getYScale(data){
	var data_min = 0.0
	var data_max = d3.max(data, function(d){
		return d.amt_all})

	var y_scale = d3.scale.linear()
		.domain([data_min, data_max+data_max*0.1])
		.range([settings.chart_h-settings.point_r, settings.point_r+settings.total_pad])
	return y_scale
}

// Separated drawing function and position function to avoid redundancy in draw_chart()
function draw_points (circle) {
	circle.attr('r', settings.point_r)
		.attr('class', 'point')
}
function update_points (circle) {
	circle.attr('cx', function(d){return x_scale(d.year)})
		.attr('cy', function(d){return y_scale(d.amt_all)})
}

var settings = {
	chart_h: 400,
	chart_w: 600,
	point_r: 5,
	x_padding: 100,
	y_padding: 30,
	title_padding: 10,
	title_to_subtitle:20,
	subtitle_to_chart:10,
	axis_title_pad: 40
}
settings['subtitle_pad'] = settings['title_padding'] + settings['title_to_subtitle']
settings['total_pad'] = settings['subtitle_pad'] + settings['subtitle_to_chart']

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
	.ticks(6)
	.tickFormat(d3.format('d'))
var x_g = d3.select('#chart-g').append('g')
	.attr('transform', 'translate(0,'+(settings.chart_h)+')')
	.attr('class', 'axis')
x_g.call(x_axis_fun)

function draw_chart(iso3){
	current_data = getCountryData(iso3), y_scale = getYScale(current_data)

	var points = chart_g.selectAll('.point')
		.data(current_data, function(d){return d.year})
	points.exit().remove()
	points.enter()
		.append('circle')
		.call(draw_points)

	points.transition()
		.duration(500).call(update_points)

	d3.select('#chart-g').select('#y-axis')
		.remove()

	var y_axis_fun = d3.svg.axis()
		.scale(y_scale)
		.ticks(6)
		.orient('left')

	var y_g = d3.select('#chart-g').append('g')
		.attr('transform', 'translate(0,0)')
		.attr('class', 'axis')
		.attr('id', 'y-axis')
		.call(y_axis_fun)

	chart_g.selectAll('.title').remove()
	var title = chart_g.append('text')
		.text('Food Aid Received by '+current_data[0].location_name)
		.attr('transform', 'translate(0,0)')
		.attr('class', 'title')

	var x_title = chart_g.append('text')
		.text('Year')
		.attr('transform', 'translate('+(settings.chart_w/2-10)+','+(settings.chart_h+settings.axis_title_pad)+')')
		.attr('class', 'axis-title')
	var subtitle = chart_g.append('text')
		.text('Metric Tons, All Commodities')
		.attr('transform', 'translate(0,'+settings.subtitle_pad+')')
		.attr('class', 'subtitle')
}

draw_chart('ETH')

