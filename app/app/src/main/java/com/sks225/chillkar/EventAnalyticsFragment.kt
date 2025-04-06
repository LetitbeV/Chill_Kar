package com.sks225.chillkar

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.ArrayAdapter
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.bumptech.glide.Glide
import com.github.mikephil.charting.charts.HorizontalBarChart
import com.github.mikephil.charting.charts.LineChart
import com.github.mikephil.charting.components.XAxis
import com.github.mikephil.charting.data.BarData
import com.github.mikephil.charting.data.BarDataSet
import com.github.mikephil.charting.data.BarEntry
import com.github.mikephil.charting.data.Entry
import com.github.mikephil.charting.data.LineData
import com.github.mikephil.charting.data.LineDataSet
import com.github.mikephil.charting.formatter.IndexAxisValueFormatter
import com.sks225.chillkar.databinding.FragmentEventAnalyticsBinding
import com.sks225.chillkar.model.EventAnalytics
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class EventAnalyticsFragment : Fragment() {
    private lateinit var binding: FragmentEventAnalyticsBinding
    private lateinit var lineChart: LineChart
    private lateinit var barChart: HorizontalBarChart
    private lateinit var spinnerAdapter: ArrayAdapter<String>

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentEventAnalyticsBinding.inflate(inflater, container, false)

        val eventAnalytics = arguments?.let {
            EventAnalyticsFragmentArgs.fromBundle(it).EventAnalytics
        } ?: run {
            findNavController().navigateUp()
            return binding.root
        }
        val event = arguments?.let {
            EventAnalyticsFragmentArgs.fromBundle(it).Event
        } ?: run {
            findNavController().navigateUp()
            return binding.root
        }

        binding.tvEventName.text = event.name
        binding.tvEventDate.text = timestampToDate(event.timeStamp)
        binding.tvEventTime.text = timestampToTime(event.timeStamp)

        Glide.with(requireContext()).load(event.poster).into(binding.ivUser)

        setupToolbar()
        initializeViews(eventAnalytics)

        return binding.root
    }

    private fun setupToolbar() {
        binding.toolbar.setNavigationOnClickListener {
            findNavController().navigateUp()
        }
    }

    private fun initializeViews(eventAnalytics: EventAnalytics) {
        val ticketsSold = eventAnalytics.ticketsSold
        val maxTickets = eventAnalytics.maxTickets
        val revenue = ticketsSold * 100  // Assuming each ticket = $100

        // Set summary texts
        binding.tvSummary.text = "$ticketsSold of $maxTickets tickets sold"
        binding.tvRevenue.text = "Revenue: $$revenue"
        binding.progressCircular.progress = ticketsSold
        binding.progressCircular.max = maxTickets

        // Line chart setup for daily sales
        lineChart = binding.lineChart
        setupLineChart(eventAnalytics)

        // Spinner setup
        val items = listOf("Age", "Gender")
        spinnerAdapter = ArrayAdapter(requireContext(), android.R.layout.simple_spinner_item, items)
        spinnerAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        binding.spinner.adapter = spinnerAdapter

        // Bar chart setup
        barChart = binding.barChart
        setupBarChart(eventAnalytics, "Age")  // Default view

        // Spinner selection listener
        binding.spinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>, view: View?, pos: Int, id: Long) {
                val selected = parent.getItemAtPosition(pos).toString()
                setupBarChart(eventAnalytics, selected)
            }

            override fun onNothingSelected(parent: AdapterView<*>?) {}
        }
    }

    private fun setupLineChart(eventAnalytics: EventAnalytics) {
        val entries = mutableListOf<Entry>()
        val labels = mutableListOf<String>()

        val sortedSales = eventAnalytics.dailySales.entries.sortedBy { it.key }

        sortedSales.forEachIndexed { index, entry ->
            entries.add(Entry(index.toFloat(), entry.value.toFloat()))
            labels.add(entry.key)
        }

        val dataSet = LineDataSet(entries, "Tickets Sold")
        dataSet.color = resources.getColor(R.color.black, null)
        dataSet.valueTextSize = 12f
        dataSet.lineWidth = 2f
        dataSet.circleRadius = 4f
        dataSet.setDrawValues(false)

        val data = LineData(dataSet)
        lineChart.data = data
        lineChart.description.isEnabled = false
        lineChart.axisRight.isEnabled = false
        lineChart.setTouchEnabled(false)

        // Y axis auto scaling
        lineChart.axisLeft.axisMinimum = 0f
        lineChart.axisLeft.granularity = 1f
        lineChart.axisLeft.setDrawGridLines(false)

        // X axis formatting
        lineChart.xAxis.valueFormatter = IndexAxisValueFormatter(labels)
        lineChart.xAxis.position = XAxis.XAxisPosition.BOTTOM
        lineChart.xAxis.setDrawGridLines(false)
        lineChart.xAxis.granularity = 1f
        lineChart.xAxis.labelRotationAngle = -45f

        lineChart.invalidate()
    }

    private fun setupBarChart(eventAnalytics: EventAnalytics, type: String) {
        val entries = mutableListOf<BarEntry>()
        val labels = mutableListOf<String>()

        when (type) {
            "Age" -> {
                val sorted = eventAnalytics.salesByAge.entries.sortedBy { it.key }
                sorted.forEachIndexed { index, entry ->
                    entries.add(BarEntry(index.toFloat(), entry.value.toFloat()))
                    labels.add(entry.key.toString())
                }
            }

            "Gender" -> {
                val genderMap = eventAnalytics.salesByGender
                val genderList = genderMap.entries.toList()
                genderList.forEachIndexed { index, entry ->
                    entries.add(BarEntry(index.toFloat(), entry.value.toFloat()))
                    labels.add(entry.key.name)
                }
            }
        }

        val dataSet = BarDataSet(entries, "$type-wise Sales")
        dataSet.color = resources.getColor(R.color.black, null)
        dataSet.valueTextSize = 12f

        val barData = BarData(dataSet)
        barData.barWidth = 0.9f

        barChart.data = barData
        barChart.description.isEnabled = false
        barChart.setFitBars(true)
        barChart.setTouchEnabled(false)
        barChart.axisRight.isEnabled = false

        barChart.axisLeft.axisMinimum = 0f
        barChart.axisLeft.granularity = 1f
        barChart.axisLeft.setDrawGridLines(false)

        barChart.xAxis.valueFormatter = IndexAxisValueFormatter(labels)
        barChart.xAxis.position = XAxis.XAxisPosition.BOTTOM
        barChart.xAxis.setDrawGridLines(false)
        barChart.xAxis.granularity = 1f

        barChart.invalidate()
    }

    private fun timestampToTime(timestamp: Long): String {
        val dateFormat = SimpleDateFormat("HH:mm:ss", Locale.getDefault())
        return dateFormat.format(Date(timestamp))
    }

    // Function to convert timestamp to date string (e.g., "April 5, 2025")
    private fun timestampToDate(timestamp: Long): String {
        val dateFormat = SimpleDateFormat("MMMM d, yyyy", Locale.getDefault())
        return dateFormat.format(Date(timestamp))
    }
}
