package com.sks225.chillkar

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.navigation.NavController
import androidx.navigation.fragment.findNavController
import com.sks225.chillkar.databinding.FragmentDashboardBinding

class DashboardFragment : Fragment() {
    private lateinit var binding: FragmentDashboardBinding
    private lateinit var navController: NavController
    private val userName: String = "User Name"
//    private lateinit var cardUIState: DashboardCard
//    private lateinit var eventsList: List<Event>
    //private lateinit var navContorller:NavController

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentDashboardBinding.inflate(layoutInflater, container, false)
        navController = findNavController()

        //cardUIState= intialize

        binding.tvGreeting.text = "Welcome, $userName"
//        binding.tvTicektsSold.text = "Tickets Sold: ${cardUIState.ticketsSold}"
//        binding.tvRevenue.text = "Total Revenue: $${cardUIState.revenue}"
        //binding.lineChart.data = cardUIState.dailySale

        binding.cvOverall.setOnClickListener {
            navController.navigate(R.id.action_dashboardFragment_to_overallAnalyticsFragment)
        }

        binding.tvGreeting.setOnClickListener {
            navController.navigate(R.id.action_dashboardFragment_to_profileFragment)
        }

//        binding.rvYourEvents.adapter = YourEventsAdapter(eventsList)
//        binding.rvYourEvents.setHasFixedSize(true)
//        binding.rvYourEvents.layoutManager = LinearLayoutManager(requireContext())

        binding.fab.setOnClickListener {
            navController.navigate(R.id.action_dashboardFragment_to_createEventFragment)
        }


        return binding.root
    }
}