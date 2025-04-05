package com.sks225.chillkar

import android.graphics.Color
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.navigation.NavController
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.github.mikephil.charting.charts.LineChart
import com.github.mikephil.charting.components.XAxis
import com.github.mikephil.charting.data.Entry
import com.github.mikephil.charting.data.LineData
import com.github.mikephil.charting.data.LineDataSet
import com.github.mikephil.charting.formatter.IndexAxisValueFormatter
import com.sks225.chillkar.adapter.YourEventsAdapter
import com.sks225.chillkar.databinding.FragmentDashboardBinding
import com.sks225.chillkar.model.Event
import com.sks225.chillkar.model.EventAnalytics
import com.sks225.chillkar.model.EventCategory
import com.sks225.chillkar.model.Gender
import com.sks225.chillkar.model.OverallAnalytics
import com.sks225.chillkar.samples.eventAnalyticsList
import com.sks225.chillkar.samples.sampleEvents

class DashboardFragment : Fragment() {
    private lateinit var binding: FragmentDashboardBinding
    private lateinit var navController: NavController
    private lateinit var chart: LineChart
    private var cvOverallVisibility: Boolean = true
    private val userName: String = "User Name"

    private lateinit var eventAnalytics: Map<Int, EventAnalytics>
    private lateinit var overallAnalytics: OverallAnalytics
    private lateinit var eventsList: List<Event>

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentDashboardBinding.inflate(inflater, container, false)
        navController = findNavController()

        // Sample data
        eventAnalytics = eventAnalyticsList
        eventsList = sampleEvents
        overallAnalytics = generateOverallAnalytics(eventAnalytics)

        binding.tvGreeting.text = "Welcome, $userName"

        val totalRevenue = overallAnalytics.totalRevenue
        val totalSales = overallAnalytics.ticketsSold
        binding.tvRevenue.text = "Revenue: $$totalRevenue"
        binding.tvTicektsSold.text = "Tickets Sold: $totalSales"

        binding.cvOverall.setOnClickListener {
            val action =
                DashboardFragmentDirections.actionDashboardFragmentToOverallAnalyticsFragment(
                    overallAnalytics
                )
            navController.navigate(action)
        }

        binding.tvGreeting.setOnClickListener {
            navController.navigate(R.id.action_dashboardFragment_to_profileFragment)
        }

        binding.tvYourEvents.setOnClickListener {
            if (cvOverallVisibility) {
                binding.cvOverall.visibility = View.GONE
                binding.tvGreeting.visibility = View.GONE
            } else {
                binding.cvOverall.visibility = View.VISIBLE
                binding.tvGreeting.visibility = View.VISIBLE
            }
            cvOverallVisibility = !cvOverallVisibility
        }

        binding.rvYourEvents.adapter = YourEventsAdapter(eventsList, requireContext()) { event ->
            val action =
                DashboardFragmentDirections.actionDashboardFragmentToEventAnalyticsFragment(
                    eventAnalytics[event.eventId]!!, event
                )
            navController.navigate(action)
        }

        binding.rvYourEvents.layoutManager = LinearLayoutManager(requireContext())
        binding.rvYourEvents.setHasFixedSize(true)

        binding.fab.setOnClickListener {
            navController.navigate(R.id.action_dashboardFragment_to_createEventFragment)
        }

        chart = binding.lineChart
        setupOverallLineChart(overallAnalytics.dailySales)

        return binding.root
    }

    private fun setupOverallLineChart(dailySales: Map<String, Int>) {
        val sortedSales = dailySales.toList().sortedBy { it.first }

        val entries = sortedSales.mapIndexed { index, pair ->
            Entry(index.toFloat(), pair.second.toFloat())
        }

        val labels = sortedSales.map { it.first }

        val dataSet = LineDataSet(entries, "Overall Daily Sales").apply {
            color = Color.MAGENTA
            valueTextSize = 12f
            setDrawCircles(true)
            setDrawFilled(true)
            fillColor = Color.LTGRAY
        }

        chart.apply {
            data = LineData(dataSet)
            xAxis.apply {
                valueFormatter = IndexAxisValueFormatter(labels)
                granularity = 1f
                position = XAxis.XAxisPosition.BOTTOM
                labelRotationAngle = -45f
                setDrawGridLines(false)
            }
            axisLeft.axisMinimum = 0f
            axisRight.isEnabled = false
            description.text = "Total Tickets Sold Per Day"
            animateX(1000)
            invalidate()
        }
    }

    private fun generateOverallAnalytics(eventAnalyticsMap: Map<Int, EventAnalytics>): OverallAnalytics {
        var totalTicketsSold = 0
        var totalMaxTickets = 0
        val ageMap = mutableMapOf<Int, Int>()
        var totalRevenue = 0.0
        val genderMap = mutableMapOf<Gender, Int>()
        val categoryMap = mutableMapOf<EventCategory, Int>()
        val dailySalesMap = mutableMapOf<String, Int>()

        for (analytics in eventAnalyticsMap.values) {
            totalTicketsSold += analytics.ticketsSold
            totalMaxTickets += analytics.maxTickets
            totalRevenue += analytics.totalRevenue

            analytics.salesByAge.forEach { (age, count) ->
                ageMap[age] = ageMap.getOrDefault(age, 0) + count
            }

            analytics.salesByGender.forEach { (gender, count) ->
                genderMap[gender] = genderMap.getOrDefault(gender, 0) + count
            }

            categoryMap[analytics.category] =
                categoryMap.getOrDefault(analytics.category, 0) + analytics.ticketsSold

            analytics.dailySales.forEach { (date, count) ->
                dailySalesMap[date] = dailySalesMap.getOrDefault(date, 0) + count
            }
        }

        return OverallAnalytics(
            ticketsSold = totalTicketsSold,
            maxTickets = totalMaxTickets,
            totalRevenue = totalRevenue,
            salesByAge = ageMap,
            salesByGender = genderMap,
            salesByCategory = categoryMap,
            dailySales = dailySalesMap
        )
    }
}
