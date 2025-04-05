package com.sks225.chillkar

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.sks225.chillkar.databinding.FragmentTicketDetailsBinding


class TicketDetailsFragment : Fragment() {
    private lateinit var binding: FragmentTicketDetailsBinding

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentTicketDetailsBinding.inflate(layoutInflater, container, false)
        return binding.root
    }
}