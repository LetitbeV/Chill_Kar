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
import com.sks225.chillkar.model.*
import com.sks225.chillkar.samples.sampleEvents
import java.text.SimpleDateFormat
import java.util.*

class DashboardFragment : Fragment() {
    private lateinit var binding: FragmentDashboardBinding
    private lateinit var navController: NavController
    private lateinit var chart: LineChart

    private var cvOverallVisibility: Boolean = true
    private val userName: String = "User Name"

    private lateinit var eventsList: List<Event>
    private lateinit var ticketsList: List<Ticket>

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentDashboardBinding.inflate(inflater, container, false)
        navController = findNavController()

        // Sample events and dummy tickets
        eventsList = sampleEvents
        ticketsList = generateDummyTickets()

        binding.tvGreeting.text = "Welcome, $userName"

        binding.cvOverall.setOnClickListener {
            navController.navigate(R.id.action_dashboardFragment_to_overallAnalyticsFragment)
        }

        binding.tvGreeting.setOnClickListener {
            navController.navigate(R.id.action_dashboardFragment_to_profileFragment)
        }

        binding.tvYourEvents.setOnClickListener {
            if (cvOverallVisibility) {
                binding.cvOverall.visibility = View.GONE
                binding.tvGreeting.visibility = View.GONE
                cvOverallVisibility = false
            } else {
                binding.cvOverall.visibility = View.VISIBLE
                binding.tvGreeting.visibility = View.VISIBLE
                cvOverallVisibility = true
            }
        }

        binding.rvYourEvents.adapter = YourEventsAdapter(eventsList, requireContext()) { event ->
            navController.navigate(R.id.action_dashboardFragment_to_eventAnalyticsFragment)
        }
        binding.rvYourEvents.layoutManager = LinearLayoutManager(requireContext())
        binding.rvYourEvents.setHasFixedSize(true)

        binding.fab.setOnClickListener {
            navController.navigate(R.id.action_dashboardFragment_to_createEventFragment)
        }

        chart = binding.lineChart
        setupLineChart(ticketsList)

        return binding.root
    }

    private fun setupLineChart(tickets: List<Ticket>) {
        val weeklySales = getWeeklyTicketSales(tickets)
        val (entries, labels) = convertWeeklySalesToEntries(weeklySales)

        val dataSet = LineDataSet(entries, "Tickets Sold This Week").apply {
            color = Color.BLUE
            valueTextSize = 12f
            setDrawCircles(true)
            setDrawFilled(true)
            fillColor = Color.CYAN
        }

        chart.apply {
            data = LineData(dataSet)

            // X-axis formatting
            xAxis.apply {
                valueFormatter = IndexAxisValueFormatter(labels)
                granularity = 1f
                position = XAxis.XAxisPosition.BOTTOM
                labelRotationAngle = -45f
                setDrawGridLines(false)
            }

            // Y-axis auto scale
            axisLeft.axisMinimum = 0f
            axisLeft.axisMaximum = (entries.maxOfOrNull { it.y } ?: 10f) + 20f
            axisRight.isEnabled = false

            description.text = "Daily Ticket Sales (This Week)"
            animateX(1000)
            invalidate()
        }
    }

    private fun getCurrentWeekDates(): List<String> {
        val calendar = Calendar.getInstance()
        calendar.set(Calendar.DAY_OF_WEEK, calendar.firstDayOfWeek)

        val sdf = SimpleDateFormat("dd MMM", Locale.getDefault())
        return (0..6).map {
            val date = sdf.format(calendar.time)
            calendar.add(Calendar.DAY_OF_MONTH, 1)
            date
        }
    }

    private fun getWeeklyTicketSales(tickets: List<Ticket>): Map<String, Int> {
        val sdf = SimpleDateFormat("dd MMM", Locale.getDefault())
        val weekDates = getCurrentWeekDates()
        val weeklySales = weekDates.associateWith { 0 }.toMutableMap()

        for (ticket in tickets) {
            val date = sdf.format(Date(ticket.timestamp))
            if (weeklySales.containsKey(date)) {
                weeklySales[date] = weeklySales[date]!! + 1
            }
        }

        return weeklySales
    }

    private fun convertWeeklySalesToEntries(salesMap: Map<String, Int>): Pair<List<Entry>, List<String>> {
        val entries = mutableListOf<Entry>()
        val labels = mutableListOf<String>()
        var index = 0f

        for ((date, count) in salesMap) {
            entries.add(Entry(index, count.toFloat()))
            labels.add(date)
            index++
        }

        return Pair(entries, labels)
    }

    private fun generateDummyTickets(): List<Ticket> {
        val calendar = Calendar.getInstance()
        calendar.set(Calendar.DAY_OF_WEEK, calendar.firstDayOfWeek)

        val dummyTickets = mutableListOf<Ticket>()

        // Dummy counts: Mon=100, Tue=200, Wed=0, Thu=500, Fri=150, Sat=300, Sun=0
        val dailySales = listOf(100, 200, 0, 500, 150, 300, 0)

        for (i in dailySales.indices) {
            val date = calendar.timeInMillis
            repeat(dailySales[i]) {
                dummyTickets.add(
                    Ticket(
                        age = 25,
                        gender = Gender.MALE,
                        timestamp = date,
                        region = "Delhi",
                        category = EventCategory.CONCERTS
                    )
                )
            }
            calendar.add(Calendar.DAY_OF_MONTH, 1)
        }

        return dummyTickets
    }
}
