package com.sks225.chillkar

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.navigation.NavController
import androidx.navigation.fragment.findNavController
import com.sks225.chillkar.databinding.FragmentTicketDetailsBinding


class TicketDetailsFragment : Fragment() {
    private lateinit var binding: FragmentTicketDetailsBinding
    private lateinit var navController: NavController

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?,
    ): View {
        binding = FragmentTicketDetailsBinding.inflate(layoutInflater, container, false)
        navController = findNavController()

        val event = arguments?.let {
            val args = TicketDetailsFragmentArgs.fromBundle(it)
            args.Event
        }

        Log.d("Event Data", event.toString())

        binding.toolbar.setNavigationOnClickListener {
            navController.navigateUp()
        }
        return binding.root
    }
}