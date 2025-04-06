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
import androidx.navigation.fragment.findNavController
import com.github.mikephil.charting.charts.HorizontalBarChart
import com.github.mikephil.charting.charts.LineChart
import com.github.mikephil.charting.charts.PieChart
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
import com.github.mikephil.charting.utils.ColorTemplate
import com.sks225.chillkar.databinding.FragmentOverallAnalyticsBinding
import com.sks225.chillkar.model.EventCategory
import com.sks225.chillkar.model.OverallAnalytics

class OverallAnalyticsFragment : Fragment() {

    private lateinit var binding: FragmentOverallAnalyticsBinding

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentOverallAnalyticsBinding.inflate(inflater, container, false)

        val navController = findNavController()
        val overallAnalytics = arguments?.let {
            OverallAnalyticsFragmentArgs.fromBundle(it).OverallAnalytics
        } ?: run {
            navController.navigateUp()
            return binding.root
        }

        binding.toolbar.setNavigationOnClickListener {
            navController.navigateUp()
        }

        // Show CircularProgressIndicator values
        val sold = overallAnalytics.ticketsSold
        val max = overallAnalytics.maxTickets
        val percentage = if (max == 0) 0 else (sold * 100 / max)

        //val progressIndicator = binding.root.findViewById<CircularProgressIndicator>(R.id.frame_layout).getChildAt(1) as CircularProgressIndicator
        binding.progressCircular.progress = percentage

        //val textView = binding.root.findViewById<FrameLayout>(R.id.frame_layout).getChildAt(0) as TextView
        binding.tvTickets.text = "$sold / $max\n Sold"
        binding.tvSales.text = "Average Sales: ${overallAnalytics.dailySales.values.average().toInt()}}"
        binding.tvRevenue.text = "Total Revenue: ${overallAnalytics.totalRevenue}"

        // Example values
        //binding.root.findViewById<TextView>(R.id.frame_layout).rootView.findViewById<TextView>(R.id.frame_layout)
        //binding.root.findViewById<TextView>(R.id.frame_layout).rootView.findViewById<TextView>(R.id.frame_layout)

        // Setup Charts
        setupDailySalesChart(overallAnalytics.dailySales)
        setupSpinner(overallAnalytics)
        setupPieChart(overallAnalytics.salesByCategory)

        return binding.root
    }

    private fun setupDailySalesChart(dailySales: Map<String, Int>) {
        val chart = binding.root.findViewById<LineChart>(R.id.daily_sales_chart)

        val sortedSales = dailySales.toList().sortedBy { it.first }.takeLast(7)

        val entries = sortedSales.mapIndexed { index, entry ->
            Entry(index.toFloat(), entry.second.toFloat())
        }

        val dataSet = LineDataSet(entries, "Daily Sales").apply {
            color = Color.BLUE
            valueTextSize = 12f
            setDrawFilled(true)
            fillColor = Color.CYAN
        }

        chart.data = LineData(dataSet)
        chart.description.isEnabled = false
        chart.xAxis.apply {
            position = XAxis.XAxisPosition.BOTTOM
            valueFormatter = IndexAxisValueFormatter(sortedSales.map { it.first })
            granularity = 1f
        }
        chart.axisRight.isEnabled = false
        chart.invalidate()
    }

    private fun setupSpinner(overallAnalytics: OverallAnalytics) {
        val spinner = binding.root.findViewById<Spinner>(R.id.sales_spinner)
        val options = listOf("Age", "Gender")
        val adapter =
            ArrayAdapter(requireContext(), android.R.layout.simple_spinner_dropdown_item, options)
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
            granularity = 1f
        }
        chart.axisRight.isEnabled = false
        chart.invalidate()
    }

    private fun setupPieChart(data: Map<EventCategory, Int>) {
        val chart = binding.root.findViewById<PieChart>(R.id.pie_chart)

        val entries = data.map { PieEntry(it.value.toFloat(), it.key.name) }

        val dataSet = PieDataSet(entries, "Category Sales").apply {
            colors = ColorTemplate.COLORFUL_COLORS.toList()
        }

        chart.data = PieData(dataSet)
        chart.isDrawHoleEnabled = true
        chart.setUsePercentValues(true)
        chart.description.isEnabled = false
        chart.invalidate()
    }
}
