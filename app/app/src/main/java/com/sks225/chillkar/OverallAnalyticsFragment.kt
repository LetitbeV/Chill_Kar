package com.sks225.chillkar

import android.graphics.Color
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.Spinner
import androidx.fragment.app.Fragment
import androidx.navigation.NavController
import androidx.navigation.fragment.findNavController
import com.github.mikephil.charting.charts.HorizontalBarChart
import com.github.mikephil.charting.charts.PieChart
import com.github.mikephil.charting.components.Legend
import com.github.mikephil.charting.components.XAxis
import com.github.mikephil.charting.data.BarData
import com.github.mikephil.charting.data.BarDataSet
import com.github.mikephil.charting.data.BarEntry
import com.github.mikephil.charting.data.Entry
import com.github.mikephil.charting.data.LineData
import com.github.mikephil.charting.data.LineDataSet
import com.github.mikephil.charting.data.PieData
import com.github.mikephil.charting.data.PieDataSet
import com.github.mikephil.charting.data.PieEntry
import com.github.mikephil.charting.formatter.IndexAxisValueFormatter
import com.github.mikephil.charting.formatter.ValueFormatter
import com.github.mikephil.charting.utils.ColorTemplate
import com.sks225.chillkar.databinding.FragmentOverallAnalyticsBinding
import com.sks225.chillkar.model.EventCategory
import com.sks225.chillkar.model.OverallAnalytics
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale
import kotlin.math.roundToInt

class OverallAnalyticsFragment : Fragment() {
    private lateinit var binding: FragmentOverallAnalyticsBinding
    private lateinit var navController: NavController

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentOverallAnalyticsBinding.inflate(inflater, container, false)
        navController = findNavController()

        val overallAnalytics =
            OverallAnalyticsFragmentArgs.fromBundle(requireArguments()).OverallAnalytics

        binding.toolbar.setNavigationOnClickListener {
            navController.navigateUp()
        }

        binding.progressCircular.progress =
            overallAnalytics.ticketsSold * 100 / overallAnalytics.maxTickets
        //binding.progressCircular.max=overallAnalytics.maxTickets

        binding.tvTickets.text =
            "${overallAnalytics.ticketsSold} / ${overallAnalytics.maxTickets}\n Sold"
        binding.tvSales.text = "${overallAnalytics.dailySales.values.average().toInt()}"
        binding.tvRevenue.text = "$ ${overallAnalytics.totalRevenue}"

        setupDailySalesChart(overallAnalytics.dailySales)
        setupSpinner(overallAnalytics)
        setupPieChart(overallAnalytics.salesByCategory)

        return binding.root
    }

    private fun setupDailySalesChart(dailySales: Map<String, Int>) {
        val sortedSales = dailySales.toList().sortedBy { it.first }

        val entries = sortedSales.mapIndexed { index, pair ->
            Entry(index.toFloat(), pair.second.toFloat())
        }

        val minY = (sortedSales.minOfOrNull { it.second } ?: 0) - 200
        val maxY = (sortedSales.maxOfOrNull { it.second } ?: 0) + 200

        val dataSet = LineDataSet(entries, "Overall Daily Sales").apply {
            color = Color.BLUE
            valueTextSize = 12f
            setDrawCircles(true)
            setDrawFilled(false)
            lineWidth = 3f
        }

        val calendar = Calendar.getInstance()
        val dateFormat = SimpleDateFormat("MMMM, d", Locale.getDefault())
        val weekDates = (0..6).map {
            calendar.apply { add(Calendar.DAY_OF_YEAR, it) }
            dateFormat.format(calendar.time)
        }

        binding.dailySalesChart.apply {
            data = LineData(dataSet)

            xAxis.apply {
                valueFormatter = object : ValueFormatter() {
                    override fun getFormattedValue(value: Float): String {
                        val index = value.toInt()
                        return if (index in weekDates.indices) {
                            weekDates[index]
                        } else {
                            ""
                        }
                    }
                }
                granularity = 1f
                position = XAxis.XAxisPosition.BOTTOM
                setDrawGridLines(false)
            }

            axisLeft.apply {
                axisMinimum = minY.toFloat()
                axisMaximum = maxY.toFloat()
                granularity = 50f
            }
            axisRight.isEnabled = false

            setTouchEnabled(false)
            setPinchZoom(false)
            description.isEnabled = false
            animateX(100)
            invalidate()
        }
    }

    private fun setupSpinner(overallAnalytics: OverallAnalytics) {
        val spinner = binding.root.findViewById<Spinner>(R.id.sales_spinner)
        val options = listOf("Age", "Gender")
        val adapter = ArrayAdapter(requireContext(), android.R.layout.simple_spinner_dropdown_item, options)
        spinner.adapter = adapter

        spinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(
                parent: AdapterView<*>,
                view: View?,
                position: Int,
                id: Long
            ) {
                val selected = options[position]
                when (selected) {
                    "Age" -> {
                        val ageData = overallAnalytics.salesByAge.mapKeys { it.key.toString() }
                        setupHorizontalBarChart(ageData)
                    }

                    "Gender" -> {
                        val genderData = overallAnalytics.salesByGender.mapKeys { it.key.name }
                        setupHorizontalBarChart(genderData)
                    }
                }
            }

            override fun onNothingSelected(parent: AdapterView<*>) {}
        }
    }

    private fun setupHorizontalBarChart(data: Map<String, Int>) {
        val chart = binding.root.findViewById<HorizontalBarChart>(R.id.horizontal_bar_chart)

        val entries = data.entries.mapIndexed { index, entry ->
            BarEntry(index.toFloat(), entry.value.toFloat())
        }

        val dataSet = BarDataSet(entries, "Sales").apply {
            colors = ColorTemplate.MATERIAL_COLORS.toList()
        }

        chart.data = BarData(dataSet)
        chart.xAxis.apply {
            valueFormatter = IndexAxisValueFormatter(data.keys.toList())
            position = XAxis.XAxisPosition.BOTTOM
            granularity = 10f
        }
        chart.axisRight.isEnabled = false
        chart.invalidate()
    }


    private fun setupPieChart(data: Map<EventCategory, Int>) {
        val chart = binding.root.findViewById<PieChart>(R.id.pie_chart)

        val entries = data.map { PieEntry(it.value.toFloat(), it.key.name) }

        val dataSet = PieDataSet(entries, "").apply {
            colors = ColorTemplate.COLORFUL_COLORS.toList()
            setDrawValues(true) // ✅ Show values (percentages) on the pie chart
            valueTextSize = 12f
            valueFormatter = object : ValueFormatter() {
                override fun getFormattedValue(value: Float): String {
                    return "${(value).roundToInt()}%" // Display percentage
                }
            }
        }

        chart.data = PieData(dataSet)

        // Chart Configuration
        chart.isDrawHoleEnabled = true
        chart.setUsePercentValues(true)
        chart.description.isEnabled = false

        // Remove category labels from the slices
        chart.setDrawEntryLabels(false)

        // Legend Configuration (shown below the chart)
        chart.legend.apply {
            isEnabled = true
            verticalAlignment = Legend.LegendVerticalAlignment.BOTTOM
            horizontalAlignment = Legend.LegendHorizontalAlignment.CENTER
            orientation = Legend.LegendOrientation.HORIZONTAL
            setDrawInside(false)
            xEntrySpace = 10f
        }

        chart.invalidate() // Refresh the chart
    }



}
