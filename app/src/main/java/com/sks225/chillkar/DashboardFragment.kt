package com.sks225.chillkar

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import com.sks225.chillkar.adapter.YourEventsAdapter
import com.sks225.chillkar.databinding.FragmentDashboardBinding
import com.sks225.chillkar.model.DashboardCard
import com.sks225.chillkar.model.Event

class DashboardFragment : Fragment() {
    private lateinit var binding: FragmentDashboardBinding
    private val userName: String = ""
    private lateinit var cardUIState: DashboardCard
    private lateinit var eventsList: List<Event>
    //private lateinit var navContorller:NavController

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentDashboardBinding.inflate(layoutInflater, container, false)

        //cardUIState= intialize

        binding.tvGreeting.text = "Welcome, $userName"
        binding.tvTicektsSold.text = "Tickets Sold: ${cardUIState.ticketsSold}"
        binding.tvRevenue.text = "Total Revenue: $${cardUIState.revenue}"
        //binding.lineChart.data = cardUIState.dailySale

        binding.cvOverall.setOnClickListener {

        }

        binding.tvGreeting.setOnClickListener {

        }

        binding.rvYourEvents.adapter = YourEventsAdapter(eventsList)
        binding.rvYourEvents.setHasFixedSize(true)
        binding.rvYourEvents.layoutManager = LinearLayoutManager(requireContext())

        binding.fab.setOnClickListener {
            //navContorller.navigate(R.id.action_dashboardFragment_to_createEventFragment)
        }


        return binding.root
    }
}