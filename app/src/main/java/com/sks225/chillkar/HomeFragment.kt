package com.sks225.chillkar

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.navigation.NavController
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.sks225.chillkar.adapter.TicketsHorizontalAdapter
import com.sks225.chillkar.databinding.FragmentHomeBinding
import com.sks225.chillkar.samples.sampleEvents


class HomeFragment : Fragment() {
    private lateinit var binding: FragmentHomeBinding
    private lateinit var navController: NavController
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?,
    ): View {
        binding = FragmentHomeBinding.inflate(layoutInflater, container, false)
        navController = findNavController()

//        binding.appBarLayout.setOnClickListener {
//            navController.navigate(R.id.action_homeFragment_to_userProfileFragment)
//        }

        val adapter = TicketsHorizontalAdapter(sampleEvents.toTypedArray(), requireContext())
        binding.rvRecommended.layoutManager =
            LinearLayoutManager(context, LinearLayoutManager.HORIZONTAL, false)
        binding.rvTrending.layoutManager =
            LinearLayoutManager(context, LinearLayoutManager.HORIZONTAL, false)
        binding.rvRecommended.adapter = adapter
        binding.rvTrending.adapter = adapter

        binding.cvSearch.setOnClickListener {
            navController.navigate(R.id.action_homeFragment_to_searchFragment)
        }

        binding.toolbar.setOnMenuItemClickListener {
            when (it.itemId) {
                R.id.profile -> {
                    navController.navigate(R.id.action_homeFragment_to_userProfileFragment)
                    true
                }

                else -> false
            }
        }
        return binding.root
    }
}