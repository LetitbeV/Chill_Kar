package com.sks225.chillkar

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.lifecycle.lifecycleScope
import androidx.navigation.NavController
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.LinearLayoutManager
import com.sks225.chillkar.adapter.TicketsHorizontalAdapter
import com.sks225.chillkar.databinding.FragmentHomeBinding
import com.sks225.chillkar.model.Event
import com.sks225.chillkar.model.EventCategory
import com.sks225.chillkar.viewModels.HomeFragmentViewModel
import kotlinx.coroutines.launch


class HomeFragment : Fragment() {
    private lateinit var binding: FragmentHomeBinding
    private lateinit var navController: NavController
    private lateinit var recommendedAdapter: TicketsHorizontalAdapter
    private lateinit var trendingAdapter: TicketsHorizontalAdapter
    private lateinit var exploreAdapter: TicketsHorizontalAdapter
    private val viewModel: HomeFragmentViewModel by viewModels()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?,
    ): View {
        binding = FragmentHomeBinding.inflate(layoutInflater, container, false)
        navController = findNavController()

        initializeAdapters()

        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.state.collect { value ->
                binding.tvAllEvents.background = null
                binding.tvSports.background = null
                binding.tvMovies.background = null
                binding.tvConcerts.background = null

                val grey = ContextCompat.getColor(requireContext(), R.color.content_grey_light)

                when (value.filterMethod) {
                    EventCategory.SPORTS -> binding.tvSports.setBackgroundColor(grey)
                    EventCategory.MOVIES -> binding.tvMovies.setBackgroundColor(grey)
                    EventCategory.CONCERTS -> binding.tvConcerts.setBackgroundColor(grey)
                    EventCategory.OTHERS -> binding.tvAllEvents.setBackgroundColor(grey)
                }
            }
        }

        binding.tvAllEvents.setOnClickListener {
            viewModel.changeFilterMethod(EventCategory.OTHERS)
            reloadAdapters()
        }

        binding.tvMovies.setOnClickListener {
            viewModel.changeFilterMethod(EventCategory.MOVIES)
            reloadAdapters()
        }

        binding.tvSports.setOnClickListener {
            viewModel.changeFilterMethod(EventCategory.SPORTS)
            reloadAdapters()
        }

        binding.tvConcerts.setOnClickListener {
            viewModel.changeFilterMethod(EventCategory.CONCERTS)
            reloadAdapters()
        }

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

    @SuppressLint("NotifyDataSetChanged")
    private fun reloadAdapters() {
        recommendedAdapter.notifyDataSetChanged()
        trendingAdapter.notifyDataSetChanged()
        exploreAdapter.notifyDataSetChanged()
    }

    private fun initializeAdapters() {
        val onClick: (Event) -> Unit = {
            val action = HomeFragmentDirections.actionHomeFragmentToTicketDetailsFragment(it)
            findNavController().navigate(action)
        }

        recommendedAdapter = TicketsHorizontalAdapter(
            viewModel.filteredRecommendedEvents,
            requireContext(),
            onClick = onClick
        )

        trendingAdapter = TicketsHorizontalAdapter(
            viewModel.filteredTrendingEvents,
            requireContext(),
            onClick = onClick
        )

        exploreAdapter = TicketsHorizontalAdapter(
            viewModel.filteredExploreEvents,
            requireContext(),
            isGrid = true,
            onClick = onClick
        )

        binding.rvRecommended.adapter = recommendedAdapter
        binding.rvTrending.adapter = trendingAdapter
        binding.rvExplore.adapter = exploreAdapter

        binding.rvRecommended.layoutManager = LinearLayoutManager(
            requireContext(),
            LinearLayoutManager.HORIZONTAL,
            false
        )

        binding.rvTrending.layoutManager = LinearLayoutManager(
            requireContext(),
            LinearLayoutManager.HORIZONTAL,
            false
        )

        binding.rvExplore.layoutManager = GridLayoutManager(
            requireContext(),
            2,
            GridLayoutManager.VERTICAL,
            false
        )
    }
}