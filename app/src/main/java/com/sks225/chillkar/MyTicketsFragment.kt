package com.sks225.chillkar

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import com.sks225.chillkar.adapter.TicketsVerticalAdapter
import com.sks225.chillkar.databinding.FragmentMyTicketsBinding
import com.sks225.chillkar.samples.sampleEvents

class MyTicketsFragment : Fragment() {
    private lateinit var binding: FragmentMyTicketsBinding

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?,
    ): View {
        binding = FragmentMyTicketsBinding.inflate(layoutInflater, container, false)

        val adapter = TicketsVerticalAdapter(sampleEvents.toTypedArray(), requireContext())
        binding.rvTickets.layoutManager = LinearLayoutManager(context)
        binding.rvTickets.adapter = adapter

        return binding.root
    }


}