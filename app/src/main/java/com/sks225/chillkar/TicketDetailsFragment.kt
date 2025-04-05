package com.sks225.chillkar

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.navigation.NavController
import androidx.navigation.fragment.findNavController
import com.bumptech.glide.Glide
import com.google.android.material.snackbar.Snackbar
import com.sks225.chillkar.databinding.FragmentTicketDetailsBinding
import com.sks225.chillkar.model.Event


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

        if (event == null) {
            Snackbar.make(
                requireContext(),
                binding.root,
                "Invalid Ticket",
                Snackbar.LENGTH_SHORT
            ).show()
            navController.navigateUp()
        } else {
            initializeViews(event)
        }

        binding.toolbar.setNavigationOnClickListener {
            navController.navigateUp()
        }
        return binding.root
    }

    private fun initializeViews(event: Event) {
        binding.tvTicketTitle.text = event.name
        binding.tvLocation.text = event.location
        binding.tvEventDate.text = formatEpochTime(event.timeStamp)
        binding.tvDescription.text = event.description
        binding.btnVip.text =
            requireContext().resources.getString(R.string.vip_price, event.vipTicket.price)
        binding.btnGeneral.text =
            requireContext().resources.getString(R.string.general_price, event.generalTicket.price)
        Glide.with(requireContext()).load(event.poster).into(binding.ticketThumbnail)

        binding.btnGeneral.isChecked = true
        binding.btnVip.isChecked = false
        binding.btnGeneral.setOnClickListener {
            binding.btnGeneral.isChecked = true
            binding.btnVip.isChecked = false
        }
        binding.btnVip.setOnClickListener {
            binding.btnGeneral.isChecked = false
            binding.btnVip.isChecked = true
        }
    }
}